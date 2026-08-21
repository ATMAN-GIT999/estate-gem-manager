-- Automates what 20260813180000_sync_live_prices.sql did by hand: keep
-- `properties.price_per_night` matched against a real Guesty quote instead of
-- letting it go stale again immediately after the one-off sync.
--
-- ⚠️ APPLIED 21.08.2026 (docs/DECISIONS.md §38/§39), BUT THE CRON JOB IS
-- CURRENTLY UNSCHEDULED — `sync_guesty_prices()` exists and can be run by
-- hand, but nothing calls it automatically. Do not re-schedule the cron
-- job at the bottom of this file until the architectural problem below is
-- actually fixed; right now every row fails with "request matching
-- request_id not found", every night, for no benefit.
--
-- What's fixed and confirmed working:
--   - The 63/70-night retry branch posted to `xjvtuderbirlwudatgxg.supabase.co`
--     (the old, dead Supabase project) with an unset auth header — now
--     matches the primary request.
--   - `price_last_synced_at` didn't exist on this project (the one-off
--     migration that added it ran against the dead pre-19.08 project and
--     was never replayed here) — added at the top of this file instead of
--     resurrecting that file, since its price UPDATEs target ids that
--     don't exist in this project.
--   - The FOR loop's `SELECT id, slug, guesty_listing_id FROM properties`
--     failed with "column reference slug is ambiguous" — the function's
--     own `RETURNS TABLE(slug text, ...)` OUT parameter shadows the
--     column. Fixed with a `p.` table alias.
--
-- What's still broken, and isn't a quick fix: `net.http_post()` and
-- `net._http_collect_response()` were called back-to-back inside the same
-- PL/pgSQL function invocation — i.e. the same database transaction. Under
-- Postgres MVCC, pg_net's background worker cannot see the queued request
-- until the transaction that inserted it commits, and a PL/pgSQL function
-- body doesn't commit until it returns. So the collect call was racing a
-- worker that could not possibly have started yet — confirmed by testing
-- outside the function: even `pg_sleep(3)` between post and collect inside
-- one statement still returned "request matching request_id not found",
-- while the exact same post-then-collect pattern split across two
-- separate statements in the SQL editor (implicit autocommit between
-- them, per the file's original point 3 below) is presumably what "worked
-- live" before the connection dropped. No amount of retrying or sleeping
-- *inside this function* fixes it — the fix is architectural: split
-- posting and collecting into genuinely separate transactions, most
-- likely by moving this whole sync out of a single SQL function and into
-- a scheduled Edge Function (plain async fetch, no pg_net, no MVCC
-- visibility problem) that pg_cron triggers via one `net.http_post` per
-- run instead of 23.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_last_synced_at timestamptz;

COMMENT ON COLUMN public.properties.price_last_synced_at IS
  'When price_per_night was last matched against a live Guesty quote. NULL means the value is still the frozen import price and has never been verified live.';
--
-- Verified live in the SQL editor before the connection dropped:
--   1. pg_net's public wrapper `net.http_collect_response` is broken in the
--      version bundled here — its body is `select net._http_collect_response(...)`
--      with no INTO/RETURN, so it always returns NULL. This function calls the
--      internal `net._http_collect_response` directly instead.
--   2. A request_id can only be collected ONCE — collecting it again hangs
--      until the caller's own timeout, because there is nothing new to
--      deliver. The loop below posts and immediately collects, per listing,
--      never revisiting a request_id.
--   3. `guesty-get-quote` (already deployed, already used by the booking
--      dialog) is called directly — no new Edge Function had to be deployed,
--      because this environment has no Supabase CLI link and no MCP path that
--      can deploy to this specific project.
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.sync_guesty_prices()
RETURNS TABLE(slug text, ok boolean, detail text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prop RECORD;
  req_id bigint;
  resp net.http_response_result;
  -- to_jsonb() rather than direct field access: it turns whatever the
  -- response row's actual column names are (this pg_net build's "body" may
  -- be named differently across versions) into a plain jsonb object we can
  -- read by key without the migration breaking on a future extension bump.
  resp_json jsonb;
  quote_json jsonb;
  money jsonb;
  accommodation numeric;
  nightly numeric;
  check_in date;
  check_out date;
  nights int;
BEGIN
  -- `p.` is required, not decorative: the function's own OUT parameters
  -- (`slug`, from RETURNS TABLE) are in scope inside this query, so a bare
  -- `slug` is ambiguous against `properties.slug` and fails at runtime
  -- (caught 21.08.2026 applying this for the first time — the file's own
  -- header already said the function had never run end-to-end).
  FOR prop IN
    SELECT p.id, p.slug, p.guesty_listing_id
    FROM public.properties p
    WHERE p.guesty_listing_id IS NOT NULL
  LOOP
    -- A near-term 6-night window. This is a starting point, not a search for
    -- the lowest rate across the calendar — see the comment in PropertyCard.tsx
    -- on why "from €X" is still the honest framing even once this runs nightly.
    check_in := (now() + interval '30 days')::date;
    check_out := check_in + 6;
    nights := 6;

    req_id := net.http_post(
      url := 'https://womaoywuhjchtubacbvn.supabase.co/functions/v1/guesty-get-quote',
      body := jsonb_build_object(
        'listingId', prop.guesty_listing_id,
        'checkIn', check_in,
        'checkOut', check_out,
        'guests', jsonb_build_object('adults', 2)
      ),
      -- The publishable key, not a secret: it already ships in every
      -- visitor's browser bundle (src/integrations/supabase/client.ts), so
      -- hardcoding it here carries no more exposure than the site itself.
      headers := jsonb_build_object(
        'apikey', 'sb_publishable_9TilJfNdUqgg77pZyJINzg_FUhFh6WY',
        'content-type', 'application/json'
      ),
      timeout_milliseconds := 15000
    );

    resp := net._http_collect_response(req_id, true);
    resp_json := to_jsonb(resp);
    quote_json := (resp_json->>'body')::jsonb -> 'quote';

    IF quote_json IS NULL THEN
      -- Retry once with a long stay for the listing(s) known to enforce a high
      -- minimum-nights rule (matches the manual sync's fallback on 2026-08-13).
      check_in := (now() + interval '90 days')::date;
      check_out := check_in + 70;
      nights := 70;

      req_id := net.http_post(
        url := 'https://womaoywuhjchtubacbvn.supabase.co/functions/v1/guesty-get-quote',
        body := jsonb_build_object(
          'listingId', prop.guesty_listing_id,
          'checkIn', check_in,
          'checkOut', check_out,
          'guests', jsonb_build_object('adults', 2)
        ),
        headers := jsonb_build_object(
          'apikey', 'sb_publishable_9TilJfNdUqgg77pZyJINzg_FUhFh6WY',
          'content-type', 'application/json'
        ),
        timeout_milliseconds := 15000
      );
      resp := net._http_collect_response(req_id, true);
      resp_json := to_jsonb(resp);
      quote_json := (resp_json->>'body')::jsonb -> 'quote';
    END IF;

    IF quote_json IS NULL THEN
      slug := prop.slug;
      ok := false;
      detail := coalesce(resp_json->>'body', resp_json->>'message', 'no quote');
      RETURN NEXT;
      CONTINUE;
    END IF;

    money := coalesce(
      quote_json #> '{rates,ratePlans,0,ratePlan,money}',
      quote_json #> '{ratePlans,0,ratePlan,money}'
    );
    accommodation := (money->>'fareAccommodation')::numeric;

    IF accommodation IS NULL OR accommodation <= 0 THEN
      slug := prop.slug;
      ok := false;
      detail := 'quote had no fareAccommodation';
      RETURN NEXT;
      CONTINUE;
    END IF;

    nightly := round(accommodation / nights, 2);

    UPDATE public.properties
    SET price_per_night = nightly, price_last_synced_at = now()
    WHERE id = prop.id;

    slug := prop.slug;
    ok := true;
    detail := nightly::text;
    RETURN NEXT;
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.sync_guesty_prices() IS
  'Matches every Guesty-connected property''s price_per_night against a real quote. NOT currently scheduled — see the file header on why. Manual run: SELECT * FROM public.sync_guesty_prices(), but every row will fail until the pg_net architecture problem is fixed.';

-- Deliberately NOT scheduled (unscheduled live on womaoywuhjchtubacbvn on
-- 21.08.2026, docs/DECISIONS.md §39) — see the file header. Re-enable only
-- after `sync_guesty_prices()` has been redesigned around the MVCC
-- problem and a manual run returns `ok = true` for real listings, not
-- "request matching request_id not found" for all 23.
--
-- SELECT cron.schedule(
--   'guesty-price-sync-nightly',
--   '17 3 * * *', -- 03:17 daily — off the hour, avoids piling onto whatever else runs at :00
--   $$ SELECT public.sync_guesty_prices(); $$
-- );
