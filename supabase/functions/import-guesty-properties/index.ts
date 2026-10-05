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
    // Admin-only (docs/PROJECT.md C8, second finding): this endpoint used to
    // accept any request carrying a valid Supabase key — including the
    // public anon key every visitor's browser already sends with every
    // request — and would spend one of Guesty's 3-tokens-per-24h quota for
    // it. `verify_jwt` (the project default, no per-function override in
    // config.toml) only checks that SOME key was presented, not who it
    // belongs to, so the actual role check has to live here. Built on the
    // caller's own JWT (not the service-role client below, which has no
    // caller identity to check) so `has_role` resolves against the real
    // signed-in user.
    const authHeader = req.headers.get('Authorization') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authUrl = Deno.env.get('SUPABASE_URL')!;
    const callerClient = createClient(authUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin, error: roleError } = await callerClient.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    });
    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden — admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

        // Map Guesty property to our schema.
        //
        // ⚠️ Everything listed here is overwritten on EVERY import run, for
        // every property, because `baseProperty` is handed whole to the
        // update branch below. That is intended for Guesty-owned facts.
        //
        // It is also why four columns must NEVER appear in this object:
        //
        //     city_group   seo_slug   editorial_description   size_sqm
        //
        // Those exist precisely because Frontier needs fields an import
        // cannot flatten (migration 20260925120000_property_editorial_fields,
        // docs/seo/01_IMPLEMENTATION.md, Paket B). Adding any of them here — even to "keep
        // the mapping complete", even as `null` — hands them back to Guesty
        // and deletes Frontier's own text and URLs on the next run, with no
        // error and nothing in the log to notice.
        //
        // `available` and `featured` are kept out for the same reason; they
        // are set once in `insertProperty` and never updated.
        //
        // A new property therefore arrives with no city_group and no
        // seo_slug, and will not appear on a location page until someone
        // assigns them. That is deliberate: a silent wrong grouping is worse
        // than a visible gap.
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
          bathrooms: Number.parseFloat(String(guestyProperty.bathrooms ?? 0)) || 0,
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
          // Update with the latest Guesty data. `baseProperty` is passed as
          // it is, and a Supabase update only writes the keys it is given —
          // so `available`, `featured` and the four editorial columns are
          // left untouched by virtue of being absent. Keep it that way: the
          // protection is the shape of this object, not a rule enforced
          // anywhere else.
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
