-- Let the owner contact form on the property management page write a lead.
--
-- `contacts` carried exactly one policy: "Admins can manage all contacts".
-- Correct for a CRM table nobody outside the admin area touched, but it means
-- an insert from a logged-out visitor is rejected by RLS — so a public form
-- writing here would have failed silently on every submission.
--
-- INSERT only, and deliberately no SELECT: a visitor may drop a lead in, and
-- may never read the table back. Leads stay admin-only to read, which matters
-- because this table holds other people's names, emails and phone numbers.
-- Guarded so this replays cleanly if it is ever run outside the migration
-- history — for example pasted into the SQL editor first and pushed later.
DROP POLICY IF EXISTS "Anyone can submit a contact enquiry" ON public.contacts;

CREATE POLICY "Anyone can submit a contact enquiry"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Pin the provenance so form submissions can be told apart from rows the
  -- admin area creates by hand. Without this, `source` is free text from the
  -- browser and the CRM loses the distinction.
  source = 'website_owner_form'
  -- 'lead' is the table's own default and first stage; the status vocabulary is
  -- lead -> prospect -> customer -> inactive. A public form may only ever
  -- create the first stage, never promote a row.
  AND status = 'lead'
  AND first_name <> ''
  AND email IS NOT NULL
  -- Bound the free-text fields. Without a ceiling, the one writable public
  -- endpoint on this database accepts arbitrarily large payloads.
  AND length(first_name) <= 100
  AND length(coalesce(last_name, '')) <= 100
  AND length(email) <= 255
  AND length(coalesce(phone, '')) <= 40
  AND length(coalesce(notes, '')) <= 4000
);
