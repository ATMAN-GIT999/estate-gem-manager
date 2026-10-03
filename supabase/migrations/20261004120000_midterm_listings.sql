-- Winter- and midterm rentals: homes let for weeks or months, not nights.
--
-- Why a table of their own and not more rows in `properties`:
-- `properties` is the Guesty mirror — nightly price, instant booking, Stripe at
-- checkout. A monthly let has none of that (monthly rent, deposit, a stay that
-- Frontier confirms by hand), and forcing it in would show a nightly figure for
-- a home that is never booked by the night. The website is the source of truth
-- for these homes; Idealista is only an enquiry channel, and nothing here
-- depends on it (`idealista_id` is a reference for the team, not a sync key).
--
-- `property_id` links a winter listing to the same house in `properties` where
-- one exists. It is what lets Frontier see which houses are let twice (short
-- stays in summer, winter let in the off-season) and block the Guesty days when
-- a winter let is confirmed. It is optional: some of these homes are not in
-- Guesty at all.

CREATE TABLE public.midterm_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,

  -- Which place page the home appears on. Estepona exists on the winter side
  -- only; the short-stay `city_group` list deliberately does not carry it.
  city_group TEXT NOT NULL
    CHECK (city_group IN ('malaga', 'marbella', 'fuengirola', 'estepona')),
  -- Neighbourhood / area only. The exact address is never stored here: the
  -- table is publicly readable and the address is given out on confirmation.
  location TEXT NOT NULL,

  property_type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER,
  guests INTEGER,
  size_sqm INTEGER,

  -- Rent is per calendar month, EUR. Deposit, utilities and stay limits are
  -- nullable on purpose: they are agreed per home and must not be guessed.
  monthly_price NUMERIC(10, 2) NOT NULL,
  deposit NUMERIC(10, 2),
  utilities_included BOOLEAN,
  min_stay_months INTEGER,
  max_stay_months INTEGER,
  available_from DATE,
  available_until DATE,

  -- The live reservation state, switched by Frontier in the admin area.
  --   available — can be enquired about
  --   reserved  — an enquiry is confirmed, contract pending
  --   let       — rented out
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'reserved', 'let')),
  -- Unpublished rows are invisible to the public; a home goes live only once
  -- photos and texts are in.
  published BOOLEAN NOT NULL DEFAULT false,

  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  amenities TEXT[],

  idealista_id TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  guesty_listing_id TEXT,
  -- Spanish tourist/seasonal-let registration number. Must be filled before a
  -- home goes public; kept nullable so the rows can exist while that is open.
  registration_number TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX midterm_listings_city_group_idx
  ON public.midterm_listings (city_group)
  WHERE published;

-- One Idealista advert maps to one row; a null id (home not on Idealista) may repeat.
CREATE UNIQUE INDEX midterm_listings_idealista_id_key
  ON public.midterm_listings (idealista_id)
  WHERE idealista_id IS NOT NULL;

CREATE TRIGGER update_midterm_listings_updated_at
  BEFORE UPDATE ON public.midterm_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.midterm_listings ENABLE ROW LEVEL SECURITY;

-- Guests read published homes only (including reserved/let ones, so the page
-- can say "let" instead of silently vanishing and losing its search ranking).
CREATE POLICY "Published midterm listings are viewable by everyone"
  ON public.midterm_listings FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can read all midterm listings"
  ON public.midterm_listings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert midterm listings"
  ON public.midterm_listings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update midterm listings"
  ON public.midterm_listings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete midterm listings"
  ON public.midterm_listings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
