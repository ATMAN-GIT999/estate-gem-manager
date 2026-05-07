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

    // Enrich with real nightly rates. The /listings search endpoint only
    // returns nightlyRates if the FULL checkIn→checkOut window is available,
    // so we walk the calendar, find each contiguous run of available days,
    // and request rates per range. Then merge them all together.
    let nightlyRates: Record<string, number> = {};
    let currency: string | undefined;

    const isAvail = (d: any) => {
      if (!d) return false;
      if (d.status && d.status !== 'available') return false;
      const b = d.blocks || {};
      return !(b.b || b.r || b.o || b.m || b.bd);
    };

    const addDay = (iso: string, n: number) => {
      const dt = new Date(iso + 'T00:00:00Z');
      dt.setUTCDate(dt.getUTCDate() + n);
      return dt.toISOString().slice(0, 10);
    };

    const fetchRates = async (from: string, toExclusive: string) => {
      const url =
        `https://booking.guesty.com/api/listings` +
        `?fields=${encodeURIComponent('_id nightlyRates prices.currency')}` +
        `&checkIn=${from}&checkOut=${toExclusive}&limit=100`;
      try {
        const r = await fetch(url, {
          headers: { Authorization: `Bearer ${access_token}`, accept: 'application/json' },
        });
        if (!r.ok) {
          console.warn('Rates fetch failed', r.status, from, toExclusive);
          return;
        }
        const json = await r.json();
        const list = json?.results || json?.data || [];
        const item = Array.isArray(list)
          ? list.find((l: any) => l._id === listingId) || list[0]
          : list;
        if (item?.nightlyRates) {
          for (const [k, v] of Object.entries(item.nightlyRates)) {
            nightlyRates[k] = v as number;
          }
        }
        currency = currency || item?.prices?.currency || item?.currency;
      } catch (e) {
        console.warn('Rates fetch error:', e);
      }
    };

    if (Array.isArray(calendarData) && calendarData.length) {
      // Build contiguous available ranges (min 1 night)
      const ranges: Array<[string, string]> = []; // [checkIn, checkOutExclusive]
      let runStart: string | null = null;
      let lastDate: string | null = null;
      for (const d of calendarData) {
        if (isAvail(d)) {
          if (runStart === null) runStart = d.date;
          lastDate = d.date;
        } else if (runStart !== null && lastDate) {
          ranges.push([runStart, addDay(lastDate, 1)]);
          runStart = null;
          lastDate = null;
        }
      }
      if (runStart !== null && lastDate) ranges.push([runStart, addDay(lastDate, 1)]);

      console.log('Available rate ranges:', ranges.length);
      // Fetch in parallel, but cap to avoid rate-limit explosion
      const capped = ranges.slice(0, 12);
      await Promise.all(capped.map(([a, b]) => fetchRates(a, b)));
      console.log('Total nightly rates merged:', Object.keys(nightlyRates).length, 'currency:', currency);
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
