import { useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

/**
 * The owner funnel, as four events (docs/seo/01_IMPLEMENTATION.md, Paket E):
 *
 *   pm_page_view → evaluator_submitted → evaluator_result_viewed
 *                                      → owner_enquiry_submitted
 *
 * plus the older `page_view` on `/`. Nothing else — every event added is one
 * more thing the cookie text in /aviso-legal has to cover.
 */
export type TrackedEvent =
  | "page_view"
  | "pm_page_view"
  | "evaluator_submitted"
  | "evaluator_result_viewed"
  | "owner_enquiry_submitted";

const SESSION_KEY = "session_id";

/**
 * One id per browser tab, kept in sessionStorage so every event of a visit
 * shares it — that is what lets the four events be read as one funnel. The
 * old page_view code read this key but never wrote it, so every event got a
 * fresh random id: 204 page views on 25.09.2026, 204 "sessions".
 */
const sessionId = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Storage blocked (private mode, embedded frame): still count the event,
    // just without tying it to the rest of the visit.
    return crypto.randomUUID();
  }
};

/**
 * Returns `track(event, metadata?)`.
 *
 * Does nothing until the visitor has accepted the analytics cookie in the
 * banner (CookieConsentContext) — an event from before that choice is dropped,
 * not queued.
 *
 * The insert is awaited. supabase-js builds a lazy thenable: without an
 * `await`, the request is put together and never sent, which is exactly how
 * `page_view` on `/` recorded nothing until 24.08.2026 (DECISIONS §50).
 * Callers do not need to wait for it — `void track(...)` is fine — and a
 * failure is logged, never thrown: a lost event must not break a form.
 *
 * Never put personal data in `metadata`: no names, emails or addresses. The
 * lead itself is in `contacts`; this table only counts steps.
 */
export const useTrackEvent = () => {
  const { consent } = useCookieConsent();

  return useCallback(
    async (event: TrackedEvent, metadata?: Record<string, string | number | boolean>) => {
      if (consent !== "accepted") return;
      try {
        const { error } = await supabase.from("analytics_events").insert({
          event_type: event,
          page_path: window.location.pathname,
          session_id: sessionId(),
          metadata: metadata ?? null,
        });
        if (error) console.warn(`Analytics event "${event}" not stored:`, error.message);
      } catch (err) {
        console.warn(`Analytics event "${event}" not stored:`, err);
      }
    },
    [consent]
  );
};
