import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Guesty delivers webhooks through Svix, not a Guesty-specific header — the
 * request carries `svix-id` / `svix-timestamp` / `svix-signature`, and the
 * secret Guesty's `GET /v1/webhooks-v2/secret` endpoint returns is a Svix
 * secret (`whsec_<base64>`), not a plain shared token. A raw string compare
 * against a custom header (what this function did before) would reject every
 * real webhook regardless of whether the secret was configured correctly.
 *
 * Verification per the Standard Webhooks / Svix scheme: HMAC-SHA256 of
 * `{svix-id}.{svix-timestamp}.{raw body}` using the secret's decoded key
 * bytes, base64-encoded, checked against each `v1,<sig>` entry in
 * `svix-signature` (space-separated — Svix sends more than one during secret
 * rotation). The timestamp tolerance guards against a captured request being
 * replayed later.
 */
const SVIX_TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function verifySvixSignature(
  secret: string,
  svixId: string,
  svixTimestamp: string,
  rawBody: string,
  svixSignatureHeader: string,
): Promise<boolean> {
  const timestampSeconds = Number(svixTimestamp);
  if (!Number.isFinite(timestampSeconds)) return false;
  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > SVIX_TIMESTAMP_TOLERANCE_SECONDS) return false;

  const keyBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = new TextEncoder().encode(`${svixId}.${svixTimestamp}.${rawBody}`);
  const digest = await crypto.subtle.sign("HMAC", key, signed);
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));

  return svixSignatureHeader
    .split(" ")
    .some((entry) => timingSafeEqual(entry.replace(/^v1,/, ""), expected));
}

/**
 * Map a Guesty event/payload to a normalized booking status + payment status.
 * Guesty sends a wide range of events; we normalize the common ones related to
 * reservation lifecycle and Stripe payment outcomes.
 */
function deriveStatus(eventType: string, payload: any): {
  bookingStatus?: string;
  paymentStatus?: string;
} {
  const reservation = payload?.reservation || payload?.data?.reservation || payload;
  const resStatus: string | undefined = reservation?.status;
  const money = reservation?.money || {};
  const balanceDue = typeof money.balanceDue === "number" ? money.balanceDue : undefined;
  const invoicePaid = money?.invoiceItems?.every?.((i: any) => i?.isPaid);

  const e = (eventType || "").toLowerCase();

  // Payment events
  if (e.includes("payment.succeeded") || e.includes("payment_succeeded") || e.includes("paid")) {
    return { paymentStatus: "paid", bookingStatus: "confirmed" };
  }
  if (e.includes("payment.failed") || e.includes("payment_failed") || e.includes("failed")) {
    return { paymentStatus: "failed", bookingStatus: "payment_failed" };
  }
  if (e.includes("refund")) {
    return { paymentStatus: "refunded", bookingStatus: "cancelled" };
  }

  // Reservation lifecycle events
  if (e.includes("reservation.canceled") || e.includes("reservation.cancelled") || resStatus === "canceled") {
    return { bookingStatus: "cancelled" };
  }
  if (e.includes("reservation.confirmed") || resStatus === "confirmed") {
    return {
      bookingStatus: "confirmed",
      paymentStatus: balanceDue === 0 || invoicePaid ? "paid" : undefined,
    };
  }
  if (e.includes("reservation.inquiry") || resStatus === "inquiry") {
    return { bookingStatus: "pending" };
  }
  if (e.includes("reservation.declined") || resStatus === "declined") {
    return { bookingStatus: "declined" };
  }

  // Fallback: infer from balance
  if (balanceDue === 0) return { paymentStatus: "paid" };
  return {};
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let payload: any;
  let rawBody: string;
  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("Invalid JSON body", err);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Svix signature check — fail closed. Guesty's `GET /v1/webhooks-v2/secret`
  // issues the secret once the webhook subscription exists, so it can only be
  // mirrored into GUESTY_WEBHOOK_SECRET afterwards. Until it is, we reject:
  // this endpoint writes with the service-role key, and its URL is public
  // knowledge.
  const expectedSecret = Deno.env.get("GUESTY_WEBHOOK_SECRET");
  if (!expectedSecret) {
    console.error("GUESTY_WEBHOOK_SECRET is not configured — rejecting webhook");
    return new Response(JSON.stringify({ error: "Webhook not configured" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn("Missing Svix headers on webhook request");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const verified = await verifySvixSignature(expectedSecret, svixId, svixTimestamp, rawBody, svixSignature);
  if (!verified) {
    console.warn("Webhook signature mismatch");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const eventType: string =
    payload?.event ||
    payload?.eventType ||
    payload?.type ||
    payload?.data?.event ||
    "unknown";

  const reservation = payload?.reservation || payload?.data?.reservation || payload?.data || payload;
  const reservationId: string | undefined =
    reservation?._id ||
    reservation?.id ||
    reservation?.reservationId ||
    payload?.reservationId;

  // Cache invalidation — any calendar or reservation event should wipe the
  // affected listing's cached availability so the next page load pulls fresh data.
  const listingId: string | undefined =
    reservation?.listingId ||
    reservation?.listing?._id ||
    payload?.listingId ||
    payload?.data?.listingId;
  if (listingId) {
    const { error: cacheErr } = await supabase
      .from('guesty_calendar_cache')
      .delete()
      .eq('listing_id', listingId);
    if (cacheErr) console.warn('Cache invalidation failed:', cacheErr.message);
    else console.log('Invalidated calendar cache for listing', listingId);
  }

  // Always log the event for audit/replay
  const { data: eventRow } = await supabase
    .from("guesty_webhook_events")
    .insert({
      event_type: eventType,
      reservation_id: reservationId ?? null,
      payload,
    })
    .select("id")
    .single();

  console.log("Guesty webhook:", eventType, "reservation:", reservationId);

  if (!reservationId) {
    return new Response(JSON.stringify({ ok: true, note: "No reservation id" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { bookingStatus, paymentStatus } = deriveStatus(eventType, payload);

  if (!bookingStatus && !paymentStatus) {
    if (eventRow?.id) {
      await supabase
        .from("guesty_webhook_events")
        .update({ processed: true })
        .eq("id", eventRow.id);
    }
    return new Response(
      JSON.stringify({ ok: true, note: "No status change derived", eventType }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const update: Record<string, any> = { updated_at: new Date().toISOString() };
  if (bookingStatus) update.status = bookingStatus;
  if (paymentStatus) update.payment_status = paymentStatus;

  const { error: updateError, data: updated } = await supabase
    .from("bookings")
    .update(update)
    .eq("guesty_reservation_id", reservationId)
    .select("id");

  if (updateError) {
    console.error("Failed to update booking:", updateError);
    if (eventRow?.id) {
      await supabase
        .from("guesty_webhook_events")
        .update({ processed: false, error: updateError.message })
        .eq("id", eventRow.id);
    }
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (eventRow?.id) {
    await supabase
      .from("guesty_webhook_events")
      .update({ processed: true })
      .eq("id", eventRow.id);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      eventType,
      reservationId,
      matched: updated?.length ?? 0,
      applied: { bookingStatus, paymentStatus },
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});