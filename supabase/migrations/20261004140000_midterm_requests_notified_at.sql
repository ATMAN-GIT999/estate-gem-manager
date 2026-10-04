-- Marks an enquiry as "Frontier has been emailed", so the notify-winter-enquiry
-- function sends at most one mail per enquiry even if it is called twice.
ALTER TABLE public.midterm_requests ADD COLUMN notified_at TIMESTAMPTZ;

-- A visitor may only insert a fresh, un-notified row: the column is the
-- function's to set (service role), not the form's.
DROP POLICY "Anyone can submit a winter rental enquiry" ON public.midterm_requests;
CREATE POLICY "Anyone can submit a winter rental enquiry"
  ON public.midterm_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new' AND notified_at IS NULL);
