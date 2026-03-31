
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  content_html text DEFAULT '',
  content_css text DEFAULT '',
  content_components text DEFAULT '',
  content_styles text DEFAULT '',
  is_published boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all pages" ON public.pages
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published pages" ON public.pages
  FOR SELECT TO public
  USING (is_published = true);
