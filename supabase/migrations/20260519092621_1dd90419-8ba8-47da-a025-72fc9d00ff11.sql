
CREATE TABLE IF NOT EXISTS public.guesty_calendar_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id TEXT NOT NULL,
  range_from DATE NOT NULL,
  range_to DATE NOT NULL,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, range_from, range_to)
);

CREATE INDEX IF NOT EXISTS idx_guesty_calendar_cache_listing ON public.guesty_calendar_cache (listing_id);
CREATE INDEX IF NOT EXISTS idx_guesty_calendar_cache_expires ON public.guesty_calendar_cache (expires_at);

ALTER TABLE public.guesty_calendar_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages calendar cache"
  ON public.guesty_calendar_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
