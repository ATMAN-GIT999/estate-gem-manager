const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  guests?: number;
  location?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { checkIn, checkOut, adults, children, guests, location }: SearchParams = await req.json();
    
    console.log('Searching listings with params:', { checkIn, checkOut, adults, children, guests, location });

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

    // Build query parameters according to Guesty Booking Engine API v1 docs
    const queryParams = new URLSearchParams();
    if (checkIn) queryParams.set('checkIn', checkIn);
    if (checkOut) queryParams.set('checkOut', checkOut);
    if (adults) queryParams.set('adults', adults.toString());
    if (children) queryParams.set('children', children.toString());
    if (guests) queryParams.set('guests', guests.toString());
    if (location) queryParams.set('location', location);

    // Use the correct search endpoint as per Guesty docs
    const searchUrl = `https://booking-api.guesty.com/v1/search?${queryParams.toString()}`;
    
    console.log('Fetching from:', searchUrl);

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Failed to search listings:', searchResponse.status, errorText);
      throw new Error(`Failed to search listings: ${errorText}`);
    }

    const results = await searchResponse.json();
    console.log(`Search returned results:`, JSON.stringify(results).substring(0, 500));

    return new Response(
      JSON.stringify({ listings: results.results || results }),
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
