
-- Restrict profiles SELECT to own profile + admins
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Remove public read of campaigns; admins already have full access
DROP POLICY IF EXISTS "Anyone can view active campaigns" ON public.campaigns;
