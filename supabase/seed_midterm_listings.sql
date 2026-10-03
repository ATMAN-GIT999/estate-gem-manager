-- Seed for the seven Idealista winter rentals (as listed 2026-10-03).
-- NOT a migration — run by hand once, after 20261004120000_midterm_listings.sql.
-- Rows are inserted unpublished, without photos or descriptions: those come from
-- Frontier, and nothing here is invented. Flip `published` in the admin area.
--
-- property_id links (to the same house in `properties`) are NOT set here; they
-- are confirmed with Frontier first (objects 3, 4, 5, 7 are likely duplicates).

INSERT INTO public.midterm_listings
  (slug, name, city_group, location, property_type, bedrooms, size_sqm, monthly_price, idealista_id, sort_order)
VALUES
  ('apartment-las-gaviotas',    'Apartment in Las Gaviotas',        'fuengirola', 'Las Gaviotas, Fuengirola',  'apartment',     2,  85, 2800, '111245660', 10),
  ('apartment-casasola',        'Apartment in Casasola',            'estepona',   'Casasola, Estepona',        'apartment',     3, 198, 2800, '112672845', 10),
  ('apartment-soho',            'Apartment in Soho',                'malaga',     'Soho, Málaga',              'apartment',     2,  80, 1800, '109856698', 10),
  ('townhouse-higueron',        'Townhouse in Higuerón',            'fuengirola', 'Higuerón, Fuengirola',      'townhouse',     3, 250, 6500, '111419897', 20),
  ('semi-detached-la-quinta',   'Semi-detached house in La Quinta', 'marbella',   'La Quinta, Benahavís',      'semi-detached', 2, 106, 2500, '112412129', 10),
  ('penthouse-los-alamos',      'Penthouse in Los Álamos',          'malaga',     'Los Álamos, Torremolinos',  'penthouse',     2, 141, 3500, '112548257', 20),
  ('semi-detached-capellania',  'Semi-detached house in Capellanía','fuengirola', 'Capellanía, Benalmádena',   'semi-detached', 4, 284, 7500, '109872865', 30)
ON CONFLICT (slug) DO NOTHING;
