-- Restrict tasks reads to admins
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON public.tasks;

-- Restrict team_members reads to admins
DROP POLICY IF EXISTS "Authenticated users can view team members" ON public.team_members;

-- Remove forgeable public campaign event inserts (admins + service_role remain)
DROP POLICY IF EXISTS "Allow tracking events for active campaigns" ON public.campaign_events;
REVOKE INSERT ON public.campaign_events FROM anon;
GRANT ALL ON public.campaign_events TO service_role;

-- Lock down SECURITY DEFINER functions not meant to be API-callable
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_admin_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.calculate_campaign_score(numeric, numeric, numeric, numeric) FROM PUBLIC, anon, authenticated;

-- has_role must stay executable: RLS policies call it as the querying role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;