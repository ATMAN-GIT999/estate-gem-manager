-- Create contacts table for CRM/ad targeting
CREATE TABLE public.contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    source TEXT, -- e.g., 'website', 'referral', 'ad_campaign', 'booking'
    status TEXT NOT NULL DEFAULT 'lead', -- 'lead', 'prospect', 'customer', 'inactive'
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    campaign_id UUID REFERENCES public.campaigns(id),
    property_interest UUID REFERENCES public.properties(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table for tracking promotional offers
CREATE TABLE public.offers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT, -- 'percentage', 'fixed', 'free_nights'
    discount_value NUMERIC,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'expired', 'completed'
    target_audience TEXT,
    properties UUID[] DEFAULT '{}', -- Array of property IDs this applies to
    redemption_count INTEGER DEFAULT 0,
    max_redemptions INTEGER,
    completion_percentage INTEGER DEFAULT 0,
    tasks JSONB DEFAULT '[]', -- Array of subtasks for offer setup
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS policies for contacts
CREATE POLICY "Admins can manage all contacts" 
ON public.contacts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for offers
CREATE POLICY "Admins can manage all offers" 
ON public.offers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active offers" 
ON public.offers 
FOR SELECT 
USING (status = 'active');

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();