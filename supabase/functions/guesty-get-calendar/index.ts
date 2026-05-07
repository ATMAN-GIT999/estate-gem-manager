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

    // Guesty Booking Engine calendar endpoint
    const calendarUrl = `https://booking.guesty.com/api/listings/${listingId}/calendar?from=${checkIn}&to=${checkOut}`;
    
    console.log('Fetching calendar from:', calendarUrl);

    const calendarResponse = await fetch(calendarUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
      },
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error('Failed to fetch calendar:', calendarResponse.status, errorText);
      throw new Error(`Failed to fetch calendar: ${errorText}`);
    }

    const calendar = await calendarResponse.json();
    console.log('Calendar response:', JSON.stringify(calendar).substring(0, 500));
    
    // Check if all days are available
    const calendarData = calendar.calendar || calendar.data || calendar;

    // Enrich with real nightly rates from the search/listings endpoint
    // (the calendar endpoint does not return prices)
    let nightlyRates: Record<string, number> = {};
    let currency: string | undefined;
    try {
      const ratesUrl =
        `https://booking.guesty.com/api/listings/${listingId}` +
        `?fields=${encodeURIComponent('_id nightlyRates prices.currency')}` +
        `&checkIn=${checkIn}&checkOut=${checkOut}`;
      console.log('Fetching nightly rates from:', ratesUrl);
      const ratesRes = await fetch(ratesUrl, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'accept': 'application/json',
        },
      });
      if (ratesRes.ok) {
        const ratesJson = await ratesRes.json();
        const first = ratesJson?.results?.[0] || ratesJson?.data || ratesJson;
        if (first?.nightlyRates) nightlyRates = first.nightlyRates;
        currency = first?.prices?.currency || first?.currency;
        console.log('Got nightly rates count:', Object.keys(nightlyRates).length, 'currency:', currency);
      } else {
        console.warn('Rates fetch failed:', ratesRes.status, await ratesRes.text());
      }
    } catch (e) {
      console.warn('Rates enrichment failed:', e);
    }

    // Merge nightly rates into calendar days
    const enriched = Array.isArray(calendarData)
      ? calendarData.map((d: any) => ({
          ...d,
          price: d.price ?? nightlyRates[d.date],
          currency: d.currency ?? currency,
        }))
      : calendarData;

    const isAvailable = Array.isArray(calendarData) 
      ? calendarData.every((day: any) => day.status === 'available' || day.available === true)
      : true;

    console.log(`Listing ${listingId}: ${isAvailable ? 'available' : 'not available'}`);

    return new Response(
      JSON.stringify({ calendar: enriched, isAvailable, currency }),
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
