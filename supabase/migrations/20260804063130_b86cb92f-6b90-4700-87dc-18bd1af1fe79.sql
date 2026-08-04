ALTER TABLE public.properties
ALTER COLUMN bathrooms TYPE numeric(4,1)
USING bathrooms::numeric(4,1);