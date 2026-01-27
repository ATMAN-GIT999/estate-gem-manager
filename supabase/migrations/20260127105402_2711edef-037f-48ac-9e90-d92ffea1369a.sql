-- Create campaigns table to store ad campaigns
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- google, meta, tiktok, etc.
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, completed
  budget NUMERIC NOT NULL DEFAULT 0,
  spent NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  target_audience TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign events table for tracking impressions, clicks, conversions
CREATE TABLE public.campaign_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- impression, click, lead, booking, revenue
  event_value NUMERIC DEFAULT 0,
  session_id TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign metrics table for daily aggregated metrics
CREATE TABLE public.campaign_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  ctr NUMERIC GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN (clicks::NUMERIC / impressions::NUMERIC) * 100 ELSE 0 END) STORED,
  cpc NUMERIC GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN spend / clicks ELSE 0 END) STORED,
  cpa NUMERIC GENERATED ALWAYS AS (CASE WHEN bookings > 0 THEN spend / bookings ELSE 0 END) STORED,
  roas NUMERIC GENERATED ALWAYS AS (CASE WHEN spend > 0 THEN revenue / spend ELSE 0 END) STORED,
  conversion_rate NUMERIC GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN (bookings::NUMERIC / clicks::NUMERIC) * 100 ELSE 0 END) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Admins can manage all campaigns"
  ON public.campaigns FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active campaigns"
  ON public.campaigns FOR SELECT
  USING (status = 'active');

-- Create RLS policies for campaign_events
CREATE POLICY "Admins can manage all campaign events"
  ON public.campaign_events FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert campaign events"
  ON public.campaign_events FOR INSERT
  WITH CHECK (true);

-- Create RLS policies for campaign_metrics
CREATE POLICY "Admins can manage all campaign metrics"
  ON public.campaign_metrics FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_campaign_events_campaign_id ON public.campaign_events(campaign_id);
CREATE INDEX idx_campaign_events_type ON public.campaign_events(event_type);
CREATE INDEX idx_campaign_events_created_at ON public.campaign_events(created_at);
CREATE INDEX idx_campaign_metrics_campaign_date ON public.campaign_metrics(campaign_id, date);

-- Create trigger to update timestamps
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_metrics_updated_at
  BEFORE UPDATE ON public.campaign_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate campaign profitability score (0-100)
CREATE OR REPLACE FUNCTION public.calculate_campaign_score(
  p_roas NUMERIC,
  p_conversion_rate NUMERIC,
  p_cpa NUMERIC,
  p_target_cpa NUMERIC DEFAULT 100
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  roas_score NUMERIC;
  conv_score NUMERIC;
  cpa_score NUMERIC;
  final_score NUMERIC;
BEGIN
  -- ROAS score (0-40 points): >3x = 40, >2x = 30, >1.5x = 20, >1x = 10, <1x = 0
  roas_score := CASE
    WHEN p_roas >= 3 THEN 40
    WHEN p_roas >= 2 THEN 30
    WHEN p_roas >= 1.5 THEN 20
    WHEN p_roas >= 1 THEN 10
    ELSE 0
  END;
  
  -- Conversion rate score (0-30 points): >5% = 30, >3% = 20, >1% = 10, <1% = 0
  conv_score := CASE
    WHEN p_conversion_rate >= 5 THEN 30
    WHEN p_conversion_rate >= 3 THEN 20
    WHEN p_conversion_rate >= 1 THEN 10
    ELSE 0
  END;
  
  -- CPA score (0-30 points): <50% target = 30, <75% = 20, <100% = 10, >100% = 0
  cpa_score := CASE
    WHEN p_cpa <= p_target_cpa * 0.5 THEN 30
    WHEN p_cpa <= p_target_cpa * 0.75 THEN 20
    WHEN p_cpa <= p_target_cpa THEN 10
    ELSE 0
  END;
  
  final_score := roas_score + conv_score + cpa_score;
  RETURN final_score;
END;
$$;