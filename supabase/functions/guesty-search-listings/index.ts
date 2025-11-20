const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  city?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { checkIn, checkOut, adults, children, city }: SearchParams = await req.json();
    
    console.log('Searching listings with params:', { checkIn, checkOut, adults, children, city });

    // Get authentication token
    const authUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/guesty-booking-auth`;
    const authResponse = await fetch(authUrl, {
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
      },
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.error('Auth function error:', errorData);
      throw new Error(errorData.error || 'Failed to get authentication token');
    }

    const { access_token } = await authResponse.json();

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (checkIn) queryParams.set('checkIn', checkIn);
    if (checkOut) queryParams.set('checkOut', checkOut);
    if (adults) queryParams.set('adults', adults.toString());
    if (children) queryParams.set('children', children.toString());
    if (city) queryParams.set('city', city);

    // Call Guesty Booking Engine API - Get available listings if dates provided
    const endpoint = (checkIn && checkOut) 
      ? 'available-listings' 
      : 'listings';
    
    const listingsUrl = `https://booking-api.guesty.com/v1/${endpoint}?${queryParams.toString()}`;
    
    console.log('Fetching from:', listingsUrl);

    const listingsResponse = await fetch(listingsUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
      },
    });

    if (!listingsResponse.ok) {
      const errorText = await listingsResponse.text();
      console.error('Failed to fetch listings:', errorText);
      throw new Error(`Failed to fetch listings: ${errorText}`);
    }

    const listings = await listingsResponse.json();
    console.log(`Found ${listings.length || 0} listings`);

    return new Response(
      JSON.stringify({ listings }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in guesty-search-listings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
