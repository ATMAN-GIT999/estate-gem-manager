import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Tells Frontier on Telegram when a winter rental enquiry comes in.
 *
 * Telegram instead of email because email needs a sender domain verified in DNS,
 * and the DNS of frontier-residences.com is not in our hands. A bot message needs
 * no domain and reaches the phone at once.
 *
 * The browser calls this right after inserting the enquiry, with the id it
 * generated for the row. The function is public (the visitor is anonymous), so
 * it trusts nothing in the request: it reads the row itself with the service
 * role and sends only if the row exists, is still 'new', is under ten minutes
 * old and has not been notified yet (`notified_at`). A forged or repeated call
 * therefore cannot make it send more than one message per real enquiry, or send
 * anything the visitor did not already enter.
 *
 * Secrets (Supabase function secrets, never the repo):
 *   TELEGRAM_BOT_TOKEN — token from @BotFather
 *   TELEGRAM_CHAT_ID   — the chat or group that should get the message
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const ADMIN_URL = 'https://frontier-residences.com/admin/winter-rentals';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { id } = await req.json();
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'invalid id' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: r, error } = await supabase
      .from('midterm_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!r || r.status !== 'new' || r.notified_at) return json({ sent: false });
    if (Date.now() - new Date(r.created_at).getTime() > 10 * 60 * 1000) return json({ sent: false });

    // Claim the row first so two parallel calls cannot both send.
    const { data: claimed } = await supabase
      .from('midterm_requests')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', id)
      .is('notified_at', null)
      .select('id');
    if (!claimed?.length) return json({ sent: false });

    const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!token || !chatId) {
      console.error('Telegram secrets missing — enquiry stored, no message sent');
      await supabase.from('midterm_requests').update({ notified_at: null }).eq('id', id);
      return json({ sent: false, error: 'notifications not configured' }, 500);
    }

    const name = `${r.first_name} ${r.last_name ?? ''}`.trim();
    const lines = [
      ['Home', r.listing_name],
      ['Name', name],
      ['Email', r.email],
      ['Phone', r.phone],
      ['Move-in', r.desired_from],
      ['Months', r.desired_months],
      ['Guests', r.guests],
    ].filter(([, v]) => v !== null && v !== undefined && v !== '');

    const text = `<b>New winter rental enquiry</b>\n` +
      lines.map(([k, v]) => `${esc(k)}: ${esc(v)}`).join('\n') +
      (r.message ? `\n\n${esc(r.message)}` : '') +
      `\n\n<a href="${ADMIN_URL}">Open in the admin area</a>`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      // Log the status only — the response can echo the bot URL, which holds the token.
      console.error('Telegram failed:', res.status);
      // Release the claim so a retry (or a manual look in the admin list) is possible.
      await supabase.from('midterm_requests').update({ notified_at: null }).eq('id', id);
      return json({ sent: false, error: 'message failed' }, 502);
    }
    return json({ sent: true });
  } catch (err) {
    console.error('notify-winter-enquiry error:', err);
    return json({ error: 'internal error' }, 500);
  }
});
