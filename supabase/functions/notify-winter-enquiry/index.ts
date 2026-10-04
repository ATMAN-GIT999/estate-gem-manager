import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Emails Frontier when a winter rental enquiry comes in.
 *
 * The browser calls this right after inserting the enquiry, with the id it
 * generated for the row. The function is public (the visitor is anonymous), so
 * it trusts nothing in the request: it reads the row itself with the service
 * role and sends only if the row exists, is still 'new', is under ten minutes
 * old and has not been notified yet (`notified_at`). A forged or repeated call
 * therefore cannot make it send more than one mail per real enquiry, or mail
 * anything the visitor did not already enter.
 *
 * Secrets (Supabase function secrets, never the repo):
 *   RESEND_API_KEY  — Resend API key
 *   NOTIFY_TO       — recipient, default hello@frontier-residences.com
 *   NOTIFY_FROM     — verified sender, default onboarding@resend.dev (Resend's
 *                     test sender, which only delivers to the account owner —
 *                     set a sender on the verified domain before go-live)
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

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      console.error('RESEND_API_KEY missing — enquiry stored, no mail sent');
      await supabase.from('midterm_requests').update({ notified_at: null }).eq('id', id);
      return json({ sent: false, error: 'mail not configured' }, 500);
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

    const html = `<p>New winter rental enquiry.</p>
<table cellpadding="4">${lines.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>
${r.message ? `<p><b>Message</b><br>${esc(r.message).replace(/\n/g, '<br>')}</p>` : ''}
<p><a href="${ADMIN_URL}">Open in the admin area</a></p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: Deno.env.get('NOTIFY_FROM') ?? 'Frontier Residences <onboarding@resend.dev>',
        to: [Deno.env.get('NOTIFY_TO') ?? 'hello@frontier-residences.com'],
        // Reply goes straight to the guest.
        reply_to: r.email,
        subject: `Winter rental enquiry: ${r.listing_name} (${name})`,
        html,
      }),
    });
    if (!res.ok) {
      console.error('Resend failed:', res.status, await res.text());
      // Release the claim so a retry (or a manual look in the admin list) is possible.
      await supabase.from('midterm_requests').update({ notified_at: null }).eq('id', id);
      return json({ sent: false, error: 'mail failed' }, 502);
    }
    return json({ sent: true });
  } catch (err) {
    console.error('notify-winter-enquiry error:', err);
    return json({ error: 'internal error' }, 500);
  }
});
