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

    // Initialize Supabase client first (used for token cache and DB sync)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Authenticating with Guesty API...');

    let access_token: string | null = null;

    // Try cached token first to avoid Guesty token rate limits
    const { data: cachedToken } = await supabase
      .from('guesty_token_cache')
      .select('access_token, expires_at')
      .single();

    if (cachedToken?.access_token && cachedToken?.expires_at) {
      const expiresAt = new Date(cachedToken.expires_at);
      const now = new Date();
      // Keep a 5-minute safety buffer
      if (expiresAt > new Date(now.getTime() + 5 * 60 * 1000)) {
        access_token = cachedToken.access_token;
        console.log('Using cached Guesty token');
      }
    }

    if (!access_token) {
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

      const tokenData = await tokenResponse.json();
      access_token = tokenData.access_token;

      // Cache token when possible
      if (access_token && tokenData.expires_in) {
        const expiresAt = new Date(Date.now() + Number(tokenData.expires_in) * 1000);
        await supabase
          .from('guesty_token_cache')
          .upsert({
            access_token,
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });
      }

      console.log('Successfully authenticated with Guesty');
    }

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'Failed to obtain Guesty access token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Fetch properties from Guesty Booking API
    const propertiesResponse = await fetch('https://booking.guesty.com/api/listings?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json; charset=utf-8',
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

    // Step 3: Transform and sync properties
    const importedProperties = [];
    const updatedProperties = [];
    const errors = [];

    for (const guestyProperty of guestyProperties) {
      try {
        const listingId = guestyProperty._id || guestyProperty.id || guestyProperty.listingId;
        if (!listingId) {
          errors.push({
            property: guestyProperty.title || guestyProperty.nickname || 'Unknown property',
            error: 'Missing listing ID in Guesty response',
          });
          continue;
        }

        // Create slug from property title
        const slug = (guestyProperty.title || guestyProperty.nickname || 'property')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const propertySlug = `${slug}-${listingId.slice(-6)}`;

        // Map Guesty property to our schema
        const baseProperty = {
          name: guestyProperty.title || guestyProperty.nickname || 'Untitled Property',
          slug: propertySlug,
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
          guesty_listing_id: listingId,
        };

        const insertProperty = {
          ...baseProperty,
          available: true,
          featured: false,
        };

        // Find existing property by listing ID first, then slug, then name
        let existingId: string | null = null;

        const { data: existingByListingId } = await supabase
          .from('properties')
          .select('id')
          .eq('guesty_listing_id', listingId)
          .maybeSingle();

        if (existingByListingId?.id) {
          existingId = existingByListingId.id;
        } else {
          const { data: existingBySlug } = await supabase
            .from('properties')
            .select('id')
            .eq('slug', propertySlug)
            .maybeSingle();

          if (existingBySlug?.id) {
            existingId = existingBySlug.id;
          } else {
            const { data: existingByName } = await supabase
              .from('properties')
              .select('id')
              .eq('name', baseProperty.name)
              .maybeSingle();

            if (existingByName?.id) {
              existingId = existingByName.id;
            }
          }
        }

        let data;
        let error;

        if (existingId) {
          // Update existing property with latest Guesty data while preserving existing featured/available flags
          const updateResponse = await supabase
            .from('properties')
            .update(baseProperty)
            .eq('id', existingId)
            .select()
            .single();

          data = updateResponse.data;
          error = updateResponse.error;
        } else {
          // Insert new property
          const insertResponse = await supabase
            .from('properties')
            .insert(insertProperty)
            .select()
            .single();

          data = insertResponse.data;
          error = insertResponse.error;
        }

        if (error) {
          console.error(`Failed to sync property ${baseProperty.name}:`, error);
          errors.push({ property: baseProperty.name, error: error.message });
        } else {
          if (existingId) {
            console.log(`Successfully updated: ${baseProperty.name}`);
            updatedProperties.push(data);
          } else {
            console.log(`Successfully imported: ${baseProperty.name}`);
            importedProperties.push(data);
          }
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
        imported: importedProperties.length + updatedProperties.length,
        created: importedProperties.length,
        updated: updatedProperties.length,
        total: guestyProperties.length,
        errors: errors.length > 0 ? errors : undefined,
        properties: [...importedProperties, ...updatedProperties],
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
