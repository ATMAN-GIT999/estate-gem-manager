-- Supports docs/PROJECT.md C9: the property evaluator no longer requires a
-- login (no owner has an account, and self-registration is being switched
-- off per C8 anyway — the sign-in wall turned the hero form on
-- /property-management into a dead end for almost every visitor). Opening
-- it up to anyone means the one real cost — a Gemini API call per
-- submission — needs a limit that isn't "have an account", hence this
-- table: one row per accepted request, keyed by the caller's IP, so
-- analyze-property can count how many a given address has made recently
-- instead of trusting a login that no longer gates anything.
--
-- No RLS policies on purpose, RLS is still enabled: only the edge function,
-- using the service-role key, ever touches this table. anon/authenticated
-- get nothing (not even INSERT) — a client that could write its own rows
-- here could also erase its own rate-limit history.
CREATE TABLE public.evaluator_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX evaluator_rate_limits_identifier_requested_at_idx
  ON public.evaluator_rate_limits (identifier, requested_at);

ALTER TABLE public.evaluator_rate_limits ENABLE ROW LEVEL SECURITY;

-- Old rows are only ever read as "how many in the last 24h" — nothing
-- reads further back than that, so there is no reason to keep them once
-- they age out. Run by pg_cron once a day (pg_cron is already enabled on
-- this project — it ran the nightly price sync in
-- 20260813200000_nightly_price_sync.sql, now unscheduled for an unrelated
-- reason, a pg_net/MVCC problem this DELETE-only job does not share). A
-- different time from that job's old 03:17 slot on purpose, so the two
-- are never confused for one another in the cron job list.
SELECT cron.schedule(
  'evaluator-rate-limits-cleanup',
  '43 2 * * *',
  $$DELETE FROM public.evaluator_rate_limits WHERE requested_at < now() - interval '2 days'$$
);
