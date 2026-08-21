-- Fills a gap that only surfaced while rebuilding the schema on a fresh
-- Supabase project (docs/DECISIONS.md §20): the `consultation-uploads`
-- bucket and the `contacts` anonymous-insert policy were never captured in
-- any migration. `20260810223000_consultation_uploads_limits.sql` already
-- documented this ("the bucket and its insert/select policies already
-- existed") but only recorded the two gaps left on top of them — on the
-- original project someone provisioned the bucket itself and these policies
-- by hand and never wrote it down. Reconstructed here from what
-- `ConsultationBooking.tsx` and `OwnerContactForm.tsx` actually require
-- (`LEAD_SOURCE = "consultation-booking"`, `PHOTO_BUCKET =
-- "consultation-uploads"`, private bucket, up to 10MB per file).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'consultation-uploads',
  'consultation-uploads',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload consultation photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'consultation-uploads');

CREATE POLICY "Admins can view consultation photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'consultation-uploads' AND has_role(auth.uid(), 'admin'::app_role));

-- The `contacts` table so far only had "Admins can manage all contacts"
-- (ALL, admin-only) — nothing let an anonymous visitor's form submission in.
-- Scoped to the exact source value both consultation forms send, per
-- CLAUDE.md's "LEAD_SOURCE ist keine freie Wahl" warning.
CREATE POLICY "Anyone can submit a consultation request"
ON public.contacts FOR INSERT
TO anon, authenticated
WITH CHECK (source = 'consultation-booking');
