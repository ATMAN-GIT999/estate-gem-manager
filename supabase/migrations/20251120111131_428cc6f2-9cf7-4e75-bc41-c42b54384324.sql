-- Create table to cache Guesty authentication tokens
CREATE TABLE IF NOT EXISTS public.guesty_token_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only keep one token at a time
CREATE UNIQUE INDEX IF NOT EXISTS guesty_token_cache_singleton ON public.guesty_token_cache ((true));

-- Enable RLS but allow the service role to manage it
ALTER TABLE public.guesty_token_cache ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (edge functions use service role)
CREATE POLICY "Service role can manage token cache"
ON public.guesty_token_cache
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);