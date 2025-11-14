-- Create app role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  guests INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  registration_number TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  amenities TEXT[],
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Anyone can view available properties" 
  ON public.properties FOR SELECT 
  USING (available = true);

CREATE POLICY "Admins can manage all properties" 
  ON public.properties FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all bookings" 
  ON public.bookings FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" 
  ON public.blog_posts FOR SELECT 
  USING (published = true);

CREATE POLICY "Admins can manage all posts" 
  ON public.blog_posts FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  page_path TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Anyone can create analytics events" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics" 
  ON public.analytics_events FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial properties based on provided data
INSERT INTO public.properties (name, slug, location, type, description, bedrooms, bathrooms, guests, price_per_night, registration_number, featured, amenities)
VALUES
('Los Flamingos Golf Resort', 'los-flamingos-golf-resort', 'Marbella, Costa del Sol', 'Apartment', 'Experience luxury in our 2-bedroom apartment at Los Flamingos Golf Resort, Marbella. Enjoy stunning views of the golf course, sea, and mountains from a stylish, sun-drenched space.', 2, 2, 4, 180, 'VUT/MA/88693', true, ARRAY['Golf Course View', 'Sea View', 'Mountain View', 'Terrace', 'Full Kitchen', 'Modern Amenities']),
('Peninsula Corner Villa Higueron', 'peninsula-corner-villa-higueron', 'Fuengirola, Costa del Sol', 'Villa', 'Escape to Peninsula Corner Villa Higueron, a stunning villa above Fuengirola, Spain, offering unparalleled luxury and breathtaking sea views. This exquisite property features a private pool, 4 spacious bedrooms, and modern amenities.', 4, 3, 8, 380, 'VUT/MA/96343', true, ARRAY['Private Pool', 'Sea View', 'Terrace', '4 Bedrooms', 'Modern Design', 'Luxury Amenities']),
('Los Monteros Retreat', 'los-monteros-retreat', 'Marbella, Los Monteros', 'Apartment', 'Bright and stylish 2-bedroom apartment in the coveted Los Monteros area, Marbella. This recently renovated home combines modern comfort with a prime location, just minutes from Marbella''s best beaches and services.', 2, 2, 4, 220, 'VUT/MA/94742', false, ARRAY['Recently Renovated', 'Marble Kitchen', 'Private Terrace', 'Near Beach', 'Modern Bathroom']),
('Puente Romano Hideaway', 'puente-romano-hideaway', 'Marbella, Puente Romano', 'Apartment', 'Stylish 2-bedroom ground floor apartment in Puente Romano, Marbella. Located steps from the sea, second line beach, right next to the famous Sea Grill restaurant. Enjoy 2 bedrooms, 2 bathrooms, cozy living room, and fully equipped kitchen.', 2, 2, 4, 450, 'VUT/MA/38008', true, ARRAY['Beachfront', 'Resort Access', 'Tropical Gardens', 'Fine Dining', 'Luxury Living', 'Private Terrace']);