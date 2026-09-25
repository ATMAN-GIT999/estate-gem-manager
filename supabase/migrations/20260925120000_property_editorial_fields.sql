-- Editorial fields on `properties` that the Guesty import does not touch.
--
-- Why this exists: `supabase/functions/import-guesty-properties/index.ts`
-- rewrites `name`, `slug`, `location`, `description`, `images` and
-- `price_per_night` on EVERY run. Only `available` and `featured` survive,
-- because they are set in the insert branch and left out of the update
-- branch. So today there is nowhere for Frontier to put a correction that
-- lasts: edit a property's description in the admin area and the next import
-- silently reverts it (docs/seo/01_IMPLEMENTATION.md, Paket B).
--
-- These four columns are that place. The import must never list them — see
-- the comment above `baseProperty` in the edge function, which says so at
-- the point where someone would be tempted to add them.
--
-- Nothing here is filled by this migration. The values are in the next one,
-- `20260925120100_property_city_groups_and_seo_slugs.sql`.

ALTER TABLE public.properties
  -- Which location page a property belongs on. It deliberately does NOT
  -- match `location`: three Marbella-area homes are filed under `Málaga`
  -- (the province, not the city) and one under `Río Real`, and Calahonda
  -- belongs with Fuengirola for a guest even though it is its own town.
  -- Guessing the grouping from `location` at query time is what the code
  -- does now, and it is why Marbella is advertised as a place with no homes
  -- while four Marbella homes sit under other labels
  -- (docs/seo/inventar.md, finding 1).
  ADD COLUMN IF NOT EXISTS city_group text,

  -- The URL Frontier gives a property, replacing the Guesty-derived
  -- `slug` (`casa-heredia-rural-andalusian-retreat-830366`): no place name
  -- and a six-character hash nobody types or links to.
  -- `slug` stays as it is — the import owns it, the router will accept both
  -- forms during the changeover, and the old URLs are in the live sitemap.
  ADD COLUMN IF NOT EXISTS seo_slug text,

  -- Frontier's own words about a property. `description` keeps holding
  -- Guesty's `publicDescription.summary`; where this is set, it wins.
  ADD COLUMN IF NOT EXISTS editorial_description text,

  -- Floor area, which the schema has never had. `VacationRental` structured
  -- data asks for it and no Guesty field supplies it, so it is typed in by
  -- hand. Numeric rather than text so a range filter stays possible later.
  ADD COLUMN IF NOT EXISTS size_sqm numeric;

-- A CHECK rather than an enum type: the five groups are a decision about
-- this site's page structure, not a fact about the world, and a CHECK can be
-- changed with one statement. NULL stays legal — a newly imported property
-- has no group until someone assigns one, and it must not block the import.
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_city_group_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_city_group_check
  CHECK (city_group IS NULL OR city_group IN (
    'malaga', 'marbella', 'fuengirola', 'vienna', 'carinthia'
  ));

-- Two properties must never share an SEO URL; NULLs are exempt, which is
-- what a partial unique index gives us and a UNIQUE constraint would not.
CREATE UNIQUE INDEX IF NOT EXISTS properties_seo_slug_key
  ON public.properties (seo_slug)
  WHERE seo_slug IS NOT NULL;

-- The location pages load their homes by group, so this is the one lookup
-- the new structure adds to every page view.
CREATE INDEX IF NOT EXISTS properties_city_group_idx
  ON public.properties (city_group)
  WHERE city_group IS NOT NULL;

COMMENT ON COLUMN public.properties.city_group IS
  'Location page this property belongs to. Set by Frontier, never by the Guesty import.';
COMMENT ON COLUMN public.properties.seo_slug IS
  'Frontier-assigned URL. Set by Frontier, never by the Guesty import.';
COMMENT ON COLUMN public.properties.editorial_description IS
  'Frontier-written description; overrides `description` where present. Never written by the Guesty import.';
COMMENT ON COLUMN public.properties.size_sqm IS
  'Floor area in m². Entered by hand — Guesty supplies no equivalent field.';
