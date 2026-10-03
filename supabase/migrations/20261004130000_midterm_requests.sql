-- Enquiries for winter / midterm rentals.
--
-- Own table rather than rows in `contacts`: the `contacts` insert policy is
-- scoped to the single source value the owner forms send (CLAUDE.md, "LEAD_SOURCE
-- ist keine freie Wahl"), and these enquiries need fields a contact row has no
-- place for (home, desired dates, guests). Keeping them apart also leaves the
-- owner lead flow untouched.
--
-- Visitors can only INSERT, and only a row that starts as 'new'. There is
-- deliberately no SELECT policy for them — the form must not ask for the row
-- back, same as the owner form. Admins read and update (status follows the
-- confirmation process: new → contacted → confirmed / declined).

CREATE TABLE public.midterm_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.midterm_listings(id) ON DELETE SET NULL,
  -- Kept as text too: if the listing is deleted the enquiry still says what it was about.
  listing_name TEXT NOT NULL,
  first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 100),
  last_name TEXT CHECK (length(last_name) <= 100),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 255),
  phone TEXT CHECK (length(phone) <= 40),
  desired_from DATE,
  desired_months INTEGER CHECK (desired_months BETWEEN 1 AND 24),
  guests INTEGER CHECK (guests BETWEEN 1 AND 20),
  message TEXT CHECK (length(message) <= 2000),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'confirmed', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX midterm_requests_created_idx ON public.midterm_requests (created_at DESC);

CREATE TRIGGER update_midterm_requests_updated_at
  BEFORE UPDATE ON public.midterm_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.midterm_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a winter rental enquiry"
  ON public.midterm_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new');

CREATE POLICY "Admins can read winter rental enquiries"
  ON public.midterm_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update winter rental enquiries"
  ON public.midterm_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete winter rental enquiries"
  ON public.midterm_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
