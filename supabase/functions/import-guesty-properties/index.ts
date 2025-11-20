import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('GUESTY_CLIENT_ID');
    const clientSecret = Deno.env.get('GUESTY_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Guesty credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Guesty API credentials not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticating with Guesty API...');
    
    // Step 1: Get access token from Guesty
    const tokenResponse = await fetch('https://booking.guesty.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Guesty auth failed:', tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Guesty API', details: errorText }),
        { status: tokenResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { access_token } = await tokenResponse.json();
    console.log('Successfully authenticated with Guesty');

    // Step 2: Fetch properties from Guesty
    const propertiesResponse = await fetch('https://booking.guesty.com/v1/listings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!propertiesResponse.ok) {
      const errorText = await propertiesResponse.text();
      console.error('Failed to fetch properties:', propertiesResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch properties from Guesty', details: errorText }),
        { status: propertiesResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const guestyData = await propertiesResponse.json();
    const guestyProperties = guestyData.results || [];
    console.log(`Fetched ${guestyProperties.length} properties from Guesty`);

    // Step 3: Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 4: Transform and insert properties
    const importedProperties = [];
    const errors = [];

    for (const guestyProperty of guestyProperties) {
      try {
        // Create slug from property title
        const slug = (guestyProperty.title || guestyProperty.nickname || 'property')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Map Guesty property to our schema
        const property = {
          name: guestyProperty.title || guestyProperty.nickname || 'Untitled Property',
          slug: `${slug}-${guestyProperty._id.slice(-6)}`,
          location: guestyProperty.address?.city || 'Unknown',
          address: [
            guestyProperty.address?.street,
            guestyProperty.address?.city,
            guestyProperty.address?.state,
            guestyProperty.address?.country
          ].filter(Boolean).join(', ') || null,
          type: guestyProperty.propertyType || 'apartment',
          description: guestyProperty.publicDescription?.summary || guestyProperty.nickname || null,
          bedrooms: guestyProperty.bedrooms || 0,
          bathrooms: guestyProperty.bathrooms || 0,
          guests: guestyProperty.accommodates || 0,
          price_per_night: guestyProperty.prices?.basePrice || 0,
          amenities: guestyProperty.amenities || [],
          images: (guestyProperty.pictures || []).map((pic: any) => ({
            url: pic.original || pic.thumbnail,
            caption: pic.caption || ''
          })),
          latitude: guestyProperty.address?.lat || null,
          longitude: guestyProperty.address?.lng || null,
          registration_number: guestyProperty.publicDescription?.space || null,
          available: guestyProperty.active || false,
          featured: false,
        };

        // Insert into database
        const { data, error } = await supabase
          .from('properties')
          .insert(property)
          .select()
          .single();

        if (error) {
          console.error(`Failed to insert property ${property.name}:`, error);
          errors.push({ property: property.name, error: error.message });
        } else {
          console.log(`Successfully imported: ${property.name}`);
          importedProperties.push(data);
        }
      } catch (err) {
        console.error(`Error processing property:`, err);
        errors.push({ 
          property: guestyProperty.title || guestyProperty._id, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: importedProperties.length,
        total: guestyProperties.length,
        errors: errors.length > 0 ? errors : undefined,
        properties: importedProperties,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to import properties', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
