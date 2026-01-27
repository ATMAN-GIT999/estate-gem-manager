-- Update the handle_admin_signup function to also grant admin role to frontier@frontierresidences.com
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Automatically assign admin role to admin emails
  IF NEW.email IN ('frontierresidences@example.com', 'frontier@frontierresidences.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role);
  END IF;
  RETURN NEW;
END;
$function$;