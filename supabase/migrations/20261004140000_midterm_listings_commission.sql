-- Agency commission owed by the tenant once Frontier confirms a winter/
-- midterm let, EUR. Policy (Almedin, 04.10.2026): always one month's rent,
-- same amount as the deposit.
--
-- Unlike deposit and min_stay_months, this is NOT shown to guests. RLS here
-- is row-level, not column-level, so hiding it depends on the public-facing
-- queries never selecting it: useWinterListings.ts and WinterRentalDetail.tsx
-- use an explicit column list instead of `select("*")` for exactly this
-- reason. Do not switch those back without re-checking this column.
ALTER TABLE public.midterm_listings
  ADD COLUMN commission NUMERIC(10, 2);

COMMENT ON COLUMN public.midterm_listings.commission IS
  'Agency commission (EUR) owed on confirmation, policy = 1 month''s rent. Internal — never selected by the public-facing guest queries.';
