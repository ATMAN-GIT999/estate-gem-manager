-- Fills `city_group` and `seo_slug` for the 23 properties that exist today.
--
-- Keyed on `guesty_listing_id`, not on `name` or `slug`: those two are
-- rewritten by every import run, so a migration matching on them would go
-- silently no-op the moment a title changes in Guesty. The listing id is the
-- one identifier that is stable across imports.
--
-- Grouping per docs/seo/01_IMPLEMENTATION.md §B3. It is not `location`:
--
--   * The Hideaway Los Flamingos, Luxury Escape Los Flamingos and Los
--     Monteros Retreat are filed under `Málaga` / `Río Real` but are
--     Marbella-area homes (docs/seo/inventar.md, finding 1).
--   * Casa Heredia (Benahavís) joins them — same stretch, same search.
--   * Oaks&Thistle sits in Calahonda, grouped with Fuengirola: its own town
--     would be a page with one home on it.
--   * The three Torremolinos apartments group under Málaga for the same
--     reason.
--
-- `seo_slug` is `<city_group>-<short name>`: the prefix is always the
-- umbrella destination the property is listed under (malaga, marbella,
-- fuengirola, vienna, carinthia), never the municipality. Decided with
-- Almedin on 25.09.2026 — the handover's own example
-- (`benahavis-casa-heredia`) was dropped for it. One prefix per location
-- page means a URL always names the page that links to it, and a guest
-- never meets a place name (Benahavís, Sauerwald) that appears nowhere in
-- the navigation. Where the local name is part of what the property IS —
-- Torremolinos beach, Los Flamingos golf, Calahonda — it stays in the short
-- name instead.
--
-- Deliberately not set here: `editorial_description` and `size_sqm`. Both
-- need Frontier to write or measure something; inventing either would put a
-- made-up fact in front of a guest.

-- Málaga city — the six Soho / Centro Histórico apartments, which are the
-- largest real cluster in the portfolio and currently invisible in the
-- site's own positioning.
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-soho-sixth-floor'         WHERE guesty_listing_id = '69c0291069caed0011ebe170';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-centro-historico-soho'    WHERE guesty_listing_id = '66e02e6302391300126070fb';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-native-quarter-centro'    WHERE guesty_listing_id = '67e6e5d71de68f00137065f6';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-soho-alameda-art-district' WHERE guesty_listing_id = '66e02e295d9c470011d8fa5e';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-soho-art-experience'      WHERE guesty_listing_id = '66e02f4c26bcae00f7b80616';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-centro-studio'            WHERE guesty_listing_id = '695281ad6aa393001cb1e498';

-- …plus the three Torremolinos beach apartments.
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-torremolinos-playa-mar-ground-floor'     WHERE guesty_listing_id = '68656d903c68fd0044ec56df';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-torremolinos-first-line-beach-apartment' WHERE guesty_listing_id = '686566fb17529a0042dd61ec';
UPDATE public.properties SET city_group = 'malaga', seo_slug = 'malaga-torremolinos-sol-arena-y-mar-studio'     WHERE guesty_listing_id = '6815e6bc371164001282a230';

-- Marbella — the four homes the site currently cannot show under that name.
UPDATE public.properties SET city_group = 'marbella', seo_slug = 'marbella-los-monteros-retreat'       WHERE guesty_listing_id = '68dbfc11b9f82600285a9d3a';
UPDATE public.properties SET city_group = 'marbella', seo_slug = 'marbella-los-flamingos-hideaway'    WHERE guesty_listing_id = '67e1a8c47911da0069dbf202';
UPDATE public.properties SET city_group = 'marbella', seo_slug = 'marbella-los-flamingos-golf-retreat' WHERE guesty_listing_id = '6770430d82a0820012abdc97';
UPDATE public.properties SET city_group = 'marbella', seo_slug = 'marbella-casa-heredia'              WHERE guesty_listing_id = '6a6862aeb61e740012830366';

-- Fuengirola — the two Higuerón villas the brand is photographed around,
-- plus Calahonda.
UPDATE public.properties SET city_group = 'fuengirola', seo_slug = 'fuengirola-the-one-higueron'        WHERE guesty_listing_id = '6861942f486b17001a84aba9';
UPDATE public.properties SET city_group = 'fuengirola', seo_slug = 'fuengirola-higueron-infinity-villa' WHERE guesty_listing_id = '6a283f3360aef60015d37c59';
UPDATE public.properties SET city_group = 'fuengirola', seo_slug = 'fuengirola-calahonda-oaks-and-thistle' WHERE guesty_listing_id = '69d69a0bed50f700155b154d';

-- Vienna.
UPDATE public.properties SET city_group = 'vienna', seo_slug = 'vienna-prater-two-bedroom' WHERE guesty_listing_id = '6a4bb1176d7ffb00138eb09a';
UPDATE public.properties SET city_group = 'vienna', seo_slug = 'vienna-ottakring-duplex'   WHERE guesty_listing_id = '6a33b2567b418e001377caff';

-- Carinthia — five units of one property, Lima Alpine Lodges in Sauerwald.
-- Per §C3 the location page for this group is really that property's own
-- page; the slugs keep the units under one visible prefix so the URLs say so
-- as well.
UPDATE public.properties SET city_group = 'carinthia', seo_slug = 'carinthia-lima-almhaus-gertraud'     WHERE guesty_listing_id = '66f3065b9fd86600128a4682';
UPDATE public.properties SET city_group = 'carinthia', seo_slug = 'carinthia-lima-almhaus-petra'        WHERE guesty_listing_id = '66f30638881cf90013488f63';
UPDATE public.properties SET city_group = 'carinthia', seo_slug = 'carinthia-lima-almhaus-theresia'     WHERE guesty_listing_id = '66f3064bf6f2b100126aacf1';
UPDATE public.properties SET city_group = 'carinthia', seo_slug = 'carinthia-lima-troadkasten-lisa'     WHERE guesty_listing_id = '66f30604881cf90013488c47';
UPDATE public.properties SET city_group = 'carinthia', seo_slug = 'carinthia-lima-troadkasten-matthias' WHERE guesty_listing_id = '66f3061bf6f2b100126aaa11';

-- Refuse to finish quietly if the portfolio has moved since this was
-- written. A property imported after 25.09.2026 has no group, and the
-- location pages would simply not list it — a silent omission is exactly
-- what this check is here to prevent.
DO $$
DECLARE
  ungrouped integer;
BEGIN
  SELECT count(*) INTO ungrouped
  FROM public.properties
  WHERE available AND city_group IS NULL;

  IF ungrouped > 0 THEN
    RAISE EXCEPTION
      'Migration incomplete: % available propert(ies) have no city_group. Assign one before the location pages go live.',
      ungrouped;
  END IF;
END $$;
