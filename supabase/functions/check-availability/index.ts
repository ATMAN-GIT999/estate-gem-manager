import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GuestyAuthResponse {
  access_token: string;
}

interface AvailabilityRequest {
  checkIn: string;
  checkOut: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { checkIn, checkOut }: AvailabilityRequest = await req.json();
    
    console.log('Checking availability from', checkIn, 'to', checkOut);

    if (!checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Check-in and check-out dates are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Guesty credentials
    const clientId = Deno.env.get('GUESTY_CLIENT_ID');
    const clientSecret = Deno.env.get('GUESTY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Guesty credentials not configured');
    }

    // Authenticate with Guesty
    console.log('Authenticating with Guesty...');
    const authResponse = await fetch('https://booking.guesty.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'open-api',
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Guesty authentication failed:', errorText);
      throw new Error('Failed to authenticate with Guesty');
    }

    const authData: GuestyAuthResponse = await authResponse.json();
    console.log('Guesty authentication successful');

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all properties from database
    const { data: properties, error: dbError } = await supabase
      .from('properties')
      .select('id, slug, name')
      .eq('available', true);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log(`Checking availability for ${properties?.length || 0} properties`);

    // Check availability for each property
    const availabilityChecks = properties?.map(async (property) => {
      try {
        // Query Guesty calendar API for this listing
        const calendarResponse = await fetch(
          `https://booking.guesty.com/api/v2/availability-pricing/api/calendar/listings?listingId=${property.slug.split('-').pop()}&checkIn=${checkIn}&checkOut=${checkOut}`,
          {
            headers: {
              'Authorization': `Bearer ${authData.access_token}`,
              'accept': 'application/json',
            },
          }
        );

        if (!calendarResponse.ok) {
          console.log(`Could not check availability for ${property.name}`);
          return { ...property, available: false };
        }

        const calendarData = await calendarResponse.json();
        
        // Check if all days in the range are available
        const isAvailable = calendarData.data?.every((day: any) => 
          day.status === 'available' && day.isAvailable === true
        ) ?? false;

        console.log(`Property ${property.name}: ${isAvailable ? 'available' : 'not available'}`);
        
        return {
          id: property.id,
          slug: property.slug,
          name: property.name,
          available: isAvailable,
        };
      } catch (error) {
        console.error(`Error checking ${property.name}:`, error);
        return { ...property, available: false };
      }
    }) || [];

    const results = await Promise.all(availabilityChecks);
    const availablePropertyIds = results
      .filter(r => r.available)
      .map(r => r.id);

    console.log(`Found ${availablePropertyIds.length} available properties`);

    return new Response(
      JSON.stringify({ 
        availablePropertyIds,
        totalChecked: results.length,
        checkIn,
        checkOut,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in check-availability:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
