
-- 1) team_members: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view team members" ON public.team_members;
CREATE POLICY "Authenticated users can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

-- 2) tasks: restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Team can view tasks" ON public.tasks;
CREATE POLICY "Authenticated users can view tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (true);

-- 3) user_roles: explicit deny for INSERT/UPDATE/DELETE for non-service roles
CREATE POLICY "No client inserts on user_roles"
ON public.user_roles
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "No client updates on user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "No client deletes on user_roles"
ON public.user_roles
FOR DELETE
TO authenticated, anon
USING (false);

-- 4) analytics_events: tighten INSERT WITH CHECK to prevent injecting metadata fields
DROP POLICY IF EXISTS "Anyone can create analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can create analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IS NOT NULL
  AND length(event_type) <= 100
  AND (page_path IS NULL OR length(page_path) <= 500)
  AND (session_id IS NULL OR length(session_id) <= 100)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);
