-- Applied directly to the live database on 2026-08-10 and recorded here so the
-- repo reflects the deployed state. Written to be safe to replay.
--
-- The `consultation-uploads` bucket and its insert/select policies already
-- existed; only these two gaps were left.

-- The upload field promises "PNG, JPG up to 10MB each" and the database
-- enforced neither. It is the one endpoint an anonymous visitor may write to,
-- so an unbounded size and any mime type made it an open file drop.
UPDATE storage.buckets
SET file_size_limit = 10485760, -- 10 MB, matching what the form claims
    allowed_mime_types = ARRAY[
      'image/jpeg', 'image/png', 'image/webp',
      -- iPhones hand over HEIC/HEIF unless Safari transcodes first, and AVIF is
      -- turning up from newer Android cameras. Leaving them out would reject
      -- photos straight from the phone of the owner we are trying to win.
      'image/heic', 'image/heif', 'image/avif'
    ]
WHERE id = 'consultation-uploads';

-- Admins could read enquiry photos but never remove them, so a deleted lead
-- left its pictures behind indefinitely.
DROP POLICY IF EXISTS "Admins can delete consultation photos" ON storage.objects;
CREATE POLICY "Admins can delete consultation photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'consultation-uploads' AND has_role(auth.uid(), 'admin'::app_role));
