-- One-off correction, applied live on 2026-08-13 and recorded here so the repo
-- reflects the deployed state. `price_per_night` was the value Guesty held at
-- import time — never updated since — and had drifted wrong in both
-- directions (Vienna Ottakring showed 340, live was ~231; Oaks&Thistle
-- Calahonda showed 65, live was ~107).
--
-- `price_last_synced_at` makes that drift visible instead of silent: NULL
-- means "never verified against a live quote", not "current".
--
-- ⚠️ Superseded 21.08.2026 (docs/DECISIONS.md §38): this applied to the
-- Supabase project that existed on 13.08.2026 — dead since the project
-- switch on 19.08.2026 (`womaoywuhjchtubacbvn` was created that day, per
-- its own `created_at`). The `properties` rows below never existed there;
-- their ids don't match the re-imported rows in the current project, and
-- `price_last_synced_at` was confirmed missing from the live schema on
-- 21.08.2026. Re-running this file's UPDATEs against the current project
-- would silently touch zero rows. The column add and the price correction
-- both happen again, freshly, in `20260813200000_nightly_price_sync.sql` —
-- this file stays only as the record of what was done on the old project.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_last_synced_at timestamptz;

COMMENT ON COLUMN public.properties.price_last_synced_at IS
  'When price_per_night was last matched against a live Guesty quote. NULL means the value is still the frozen import price and has never been verified live.';

-- 20 of 23 Guesty-connected listings got a live quote (2 adults, a stay 45+
-- days out, retried with longer windows and a longer stay where a listing
-- enforces a high minimum-nights rule). The three left untouched — Los
-- Monteros Retreat, Luxury Escape Los Flamingos Golf Retreat, THE ONE Higuerón
-- — returned "not available" across every window tried out to +400 days, which
-- reads as blocked or inactive in Guesty rather than a query problem. Their
-- price_last_synced_at stays NULL on purpose: nobody should read their number
-- as current.
UPDATE public.properties SET price_per_night = 228,    price_last_synced_at = now() WHERE id = '011a2244-5480-454a-b478-6a9a75a62dd2';
UPDATE public.properties SET price_per_night = 111,    price_last_synced_at = now() WHERE id = '7707522d-c8f4-432d-8210-be1a8b3a9239';
UPDATE public.properties SET price_per_night = 228.2,  price_last_synced_at = now() WHERE id = '516b7ed4-14f6-4c48-9969-f0fcb377add5';
UPDATE public.properties SET price_per_night = 1365,   price_last_synced_at = now() WHERE id = 'cc7e0b32-9586-420c-b4cc-cc74f2239cfa';
UPDATE public.properties SET price_per_night = 134.83, price_last_synced_at = now() WHERE id = '1a8c89f9-e57c-4d85-a959-e3484bf6d572';
UPDATE public.properties SET price_per_night = 159.33, price_last_synced_at = now() WHERE id = '7f0cd2ad-2729-4395-9526-8b8cd7ef7cbd';
UPDATE public.properties SET price_per_night = 159.33, price_last_synced_at = now() WHERE id = 'ac499b2d-f6ce-4132-a56e-94fd12f81b2a';
UPDATE public.properties SET price_per_night = 243.8,  price_last_synced_at = now() WHERE id = '7761173e-eccd-4aeb-a67d-d21baafd71af';
UPDATE public.properties SET price_per_night = 159.33, price_last_synced_at = now() WHERE id = 'c8203be0-d0d2-49a5-9e0b-c8a8a24f0988';
UPDATE public.properties SET price_per_night = 159.33, price_last_synced_at = now() WHERE id = '3123764d-af63-4ab0-980c-7b2f4205771b';
UPDATE public.properties SET price_per_night = 617.64, price_last_synced_at = now() WHERE id = 'a0a147f6-08fc-42a6-911d-6c25c2ebf6e1';
UPDATE public.properties SET price_per_night = 109.8,  price_last_synced_at = now() WHERE id = '77c07be6-d92c-444a-b8f5-ae31be8009af';
UPDATE public.properties SET price_per_night = 107.33, price_last_synced_at = now() WHERE id = '34cfe1e1-2bca-4221-86c8-9d7376159cde';
UPDATE public.properties SET price_per_night = 159.4,  price_last_synced_at = now() WHERE id = '7e76458e-499b-4afe-91cb-43ad776b1b0d';
UPDATE public.properties SET price_per_night = 160.8,  price_last_synced_at = now() WHERE id = '5bf504f9-c81f-4858-8254-f20b4524c173';
UPDATE public.properties SET price_per_night = 119.67, price_last_synced_at = now() WHERE id = '34c1aa09-bdf7-4f02-aef9-e299a7c671d8';
UPDATE public.properties SET price_per_night = 122.5,  price_last_synced_at = now() WHERE id = '5b6e197b-f0da-4749-a050-cdbe8c625d9b';
UPDATE public.properties SET price_per_night = 173.83, price_last_synced_at = now() WHERE id = '7196638a-da70-4182-abdd-04a63e124cdb';
UPDATE public.properties SET price_per_night = 169.83, price_last_synced_at = now() WHERE id = '8b5eafc4-ed59-4155-85f3-4198fb47624f';
UPDATE public.properties SET price_per_night = 231.5,  price_last_synced_at = now() WHERE id = 'b5d65551-74a4-457f-ac4e-78c4baed1e26';
