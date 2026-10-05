-- One-off update, NOT a migration: applied by hand against the live DB on
-- 04.10.2026. Links the four winter rentals that are the same house as an
-- existing Guesty/vacation-rental listing, copies that listing's real photos
-- and description over, and publishes them — these are genuinely the same
-- physical property, not Idealista content, so this is not the "nothing
-- invented" text Frontier still owes for the other three homes.
--
-- Pairs confirmed by Almedin, 04.10.2026 (the first guess at the Higuerón/
-- Capellanía pair was wrong and corrected in the same conversation — do not
-- re-derive this mapping from location/bedroom count, it doesn't hold up):
--   apartment-soho            -> 6th floor Malaga Soho Apartment
--                                 (e820c019-bec1-4b4e-a66b-c962eb9a8ede)
--   townhouse-higueron        -> Luxury Villa with Infinity Pool & Sea Views
--                                 | Higuerón
--                                 (4a261217-32da-48ed-a4ad-6283224eb2d8)
--   semi-detached-la-quinta   -> Casa Heredia - Rural Andalusian Retreat
--                                 (bd1175cb-0c16-440d-893a-b8a1757e9d78)
--   semi-detached-capellania  -> THE ONE – Sea View Luxury Villa in Higuerón
--                                 (dd9bee89-3d50-4db5-b88a-c51dd86839dd)
--
-- The remaining three (apartment-las-gaviotas, apartment-casasola,
-- penthouse-los-alamos) are not in Guesty at all and stay unpublished until
-- Frontier supplies their own photos and text.
--
-- property_id is what lets Frontier see a house is let twice (short stays in
-- summer, winter let in the off-season) and, per DECISIONS.md §56, block the
-- Guesty days by hand once a winter let is confirmed.

UPDATE public.midterm_listings AS m
SET property_id = p.id,
    images = p.images,
    description = p.description,
    published = true
FROM public.properties AS p
WHERE (m.slug, p.id) IN (
  ('apartment-soho', 'e820c019-bec1-4b4e-a66b-c962eb9a8ede'),
  ('townhouse-higueron', '4a261217-32da-48ed-a4ad-6283224eb2d8'),
  ('semi-detached-la-quinta', 'bd1175cb-0c16-440d-893a-b8a1757e9d78'),
  ('semi-detached-capellania', 'dd9bee89-3d50-4db5-b88a-c51dd86839dd')
);

-- Follow-up, same day: bathrooms, guests and amenities copied over too, for
-- the same reason as images/description above — same house, real data, not
-- Idealista content. Latitude/longitude/address are deliberately NOT copied
-- here: `midterm_listings` has no columns for them at all (see the comment
-- on `location` in 20261004120000_midterm_listings.sql — the exact address
-- is never stored on this table). The detail page fetches the linked
-- property's coordinates live instead (`property:property_id(...)` in
-- WinterRentalDetail.tsx) purely for the map, nothing persisted here.
UPDATE public.midterm_listings AS m
SET bathrooms = ROUND(p.bathrooms)::integer,
    guests = p.guests,
    amenities = p.amenities
FROM public.properties AS p
WHERE m.property_id = p.id
  AND m.slug IN ('apartment-soho', 'townhouse-higueron', 'semi-detached-la-quinta', 'semi-detached-capellania');
