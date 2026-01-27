-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert campaign events" ON public.campaign_events;

-- Create a more restrictive policy - only allow inserts where campaign_id exists and is active
CREATE POLICY "Allow tracking events for active campaigns"
  ON public.campaign_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE id = campaign_id 
      AND status = 'active'
    )
  );