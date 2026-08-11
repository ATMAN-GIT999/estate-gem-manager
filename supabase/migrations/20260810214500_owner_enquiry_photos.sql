-- Storage for the photos an owner attaches to a consultation request, plus room
-- in the contacts insert policy for that second form.

-- A private bucket, not `property-images`. That one is `public = true` so the
-- listing photos can be served straight from a URL — the right call there and
-- the wrong one here. These are photos of a stranger's home, sent to us in
-- confidence before they are a client, and a public bucket would put them on
-- guessable URLs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'owner-enquiries',
  'owner-enquiries',
  false,
  10485760, -- 10 MB, matching what the upload field promises
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Visitors may add files and nothing else: no reading, no overwriting, no
-- deleting. Without the size and type limits above, this would be an open
-- upload endpoint.
CREATE POLICY "Anyone can attach photos to an enquiry"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'owner-enquiries');

CREATE POLICY "Admins can view enquiry photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'owner-enquiries' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enquiry photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'owner-enquiries' AND public.has_role(auth.uid(), 'admin'));

-- The insert policy from the previous migration pinned `source` to the single
-- value the property management form sends. The consultation form on /evaluate
-- writes to the same table and needs its own value, so the CRM can still tell
-- the two apart. Dropped and recreated rather than altered, so this migration
-- lands the same way whether or not the previous one has run yet.
DROP POLICY IF EXISTS "Anyone can submit a contact enquiry" ON public.contacts;

CREATE POLICY "Anyone can submit a contact enquiry"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  source IN ('website_owner_form', 'website_consultation_form')
  AND status = 'lead'
  AND first_name <> ''
  AND email IS NOT NULL
  AND length(first_name) <= 100
  AND length(coalesce(last_name, '')) <= 100
  AND length(email) <= 255
  AND length(coalesce(phone, '')) <= 40
  AND length(coalesce(notes, '')) <= 4000
);
