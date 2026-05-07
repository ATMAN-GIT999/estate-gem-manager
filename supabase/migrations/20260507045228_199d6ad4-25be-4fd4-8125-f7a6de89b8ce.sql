
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guesty_reservation_id text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_bookings_guesty_reservation_id
  ON public.bookings (guesty_reservation_id);

CREATE TABLE IF NOT EXISTS public.guesty_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  reservation_id text,
  payload jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guesty_webhook_events_reservation_id
  ON public.guesty_webhook_events (reservation_id);

ALTER TABLE public.guesty_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook events"
  ON public.guesty_webhook_events
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));
