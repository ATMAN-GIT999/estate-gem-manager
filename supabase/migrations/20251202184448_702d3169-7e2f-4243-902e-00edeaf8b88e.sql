-- Add guesty_listing_id column to properties table for API integration
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS guesty_listing_id TEXT;