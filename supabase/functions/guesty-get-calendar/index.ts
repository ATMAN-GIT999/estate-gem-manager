const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, checkIn, checkOut }: CalendarRequest = await req.json();
    
    if (!listingId || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'listingId, checkIn, and checkOut are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Getting calendar for listing:', listingId, 'from', checkIn, 'to', checkOut);

    // Get authentication token
    const authUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/guesty-booking-auth`;
    const authResponse = await fetch(authUrl, {
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
      },
    });

    if (!authResponse.ok) {
      throw new Error('Failed to get authentication token');
    }

    const { access_token } = await authResponse.json();

    // Get listing calendar from Guesty Booking Engine API
    const calendarUrl = `https://booking-api.guesty.com/api/v2/availability-pricing/api/calendar/listings?listingId=${listingId}&checkIn=${checkIn}&checkOut=${checkOut}`;
    
    console.log('Fetching calendar from:', calendarUrl);

    const calendarResponse = await fetch(calendarUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
      },
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error('Failed to fetch calendar:', errorText);
      throw new Error(`Failed to fetch calendar: ${errorText}`);
    }

    const calendar = await calendarResponse.json();
    
    // Check if all days are available
    const isAvailable = calendar.data?.every((day: any) => 
      day.status === 'available' && day.isAvailable === true
    ) ?? false;

    console.log(`Listing ${listingId}: ${isAvailable ? 'available' : 'not available'}`);

    return new Response(
      JSON.stringify({ calendar: calendar.data, isAvailable }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in guesty-get-calendar:', error);
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
