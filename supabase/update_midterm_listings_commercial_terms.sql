-- One-off update, NOT a migration: applied by hand against the live DB on
-- 04.10.2026, same way as supabase/seed_midterm_listings.sql. Sets the
-- commercial terms Almedin confirmed for the seven winter rentals seeded
-- there.
--
-- Policy (Almedin, 04.10.2026):
--   - deposit    = 1 month's rent (matches each Idealista ad: "fianza 1 mes")
--   - commission = 1 month's rent (Frontier's standard agency fee; see the
--                  commission column added in
--                  20261004140000_midterm_listings_commission.sql — kept
--                  internal, not shown to guests)
--   - min_stay_months = 1 (matches the page's "let by the month" framing)
--
-- utilities_included is deliberately left untouched (still NULL): Almedin
-- was not sure there are any running costs to disclose and wants to confirm
-- before setting it either way. Do not guess it here.

UPDATE public.midterm_listings
SET deposit = monthly_price,
    commission = monthly_price,
    min_stay_months = 1
WHERE slug IN (
  'apartment-las-gaviotas',
  'apartment-casasola',
  'apartment-soho',
  'townhouse-higueron',
  'semi-detached-la-quinta',
  'penthouse-los-alamos',
  'semi-detached-capellania'
);
