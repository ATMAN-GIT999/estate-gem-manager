-- Automates what 20260813180000_sync_live_prices.sql did by hand: keep
-- `properties.price_per_night` matched against a real Guesty quote instead of
-- letting it go stale again immediately after the one-off sync.
--
-- ⚠️ NOT YET APPLIED. The database connection died mid-session (even `SELECT
-- 1` stopped responding) right as this was being tested, so the CREATE
-- FUNCTION body below is built from the pieces that WERE verified live
-- (points 1-3 immediately below), but the function as a whole has not run
-- end-to-end. Before trusting it: paste this file into the Supabase SQL
-- editor, then run `SELECT * FROM public.sync_guesty_prices();` by hand and
-- read every row — specifically check that `ok = true` for most of the 23
-- listings and that `detail` on a success row is a plausible price, not an
-- error string.
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
  FOR prop IN
    SELECT id, slug, guesty_listing_id
    FROM public.properties
    WHERE guesty_listing_id IS NOT NULL
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
        url := 'https://xjvtuderbirlwudatgxg.supabase.co/functions/v1/guesty-get-quote',
        body := jsonb_build_object(
          'listingId', prop.guesty_listing_id,
          'checkIn', check_in,
          'checkOut', check_out,
          'guests', jsonb_build_object('adults', 2)
        ),
        headers := jsonb_build_object(
          'apikey', current_setting('app.settings.supabase_anon_key', true),
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
  'Matches every Guesty-connected property''s price_per_night against a real quote. Scheduled nightly via pg_cron below. Manual run: SELECT * FROM public.sync_guesty_prices();';

SELECT cron.schedule(
  'guesty-price-sync-nightly',
  '17 3 * * *', -- 03:17 daily — off the hour, avoids piling onto whatever else runs at :00
  $$ SELECT public.sync_guesty_prices(); $$
);
