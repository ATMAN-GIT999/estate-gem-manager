-- Create site settings table for homepage configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  homepage_properties_count integer NOT NULL DEFAULT 3,
  homepage_grid_layout integer NOT NULL DEFAULT 3,
  CONSTRAINT valid_layout CHECK (homepage_grid_layout >= 1 AND homepage_grid_layout <= 6),
  CONSTRAINT valid_count CHECK (homepage_properties_count >= 0 AND homepage_properties_count <= 10)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.site_settings (homepage_properties_count, homepage_grid_layout)
VALUES (3, 3);

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();