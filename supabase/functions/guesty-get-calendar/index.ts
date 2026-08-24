import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
  bypassCache?: boolean;
}

// Cache TTL — calendar data is refreshed via webhooks; this is the safety net.
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithBackoff(url: string, init: RequestInit, attempts = 4): Promise<Response> {
  let lastRes: Response | null = null;
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    lastRes = res;
    const retryAfter = Number(res.headers.get('retry-after'));
    const wait = (Number.isFinite(retryAfter) && retryAfter > 0)
      ? retryAfter * 1000
      : Math.min(8000, 500 * Math.pow(2, i)) + Math.random() * 250;
    console.warn(`429 from Guesty, retrying in ${Math.round(wait)}ms (attempt ${i + 1}/${attempts})`);
    await res.text().catch(() => {});
    await sleep(wait);
  }
  return lastRes as Response;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const degradedResponse = (extra: Record<string, unknown> = {}) =>
      new Response(
        JSON.stringify({
          calendar: [],
          isAvailable: true,
          degraded: true,
          error: 'Live availability is temporarily unavailable',
          ...extra,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    const { listingId, checkIn, checkOut, bypassCache }: CalendarRequest = await req.json();

    if (!listingId || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'listingId, checkIn, and checkOut are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Try cache first
    if (!bypassCache) {
      const { data: cached } = await supabase
        .from('guesty_calendar_cache')
        .select('payload, expires_at')
        .eq('listing_id', listingId)
        .eq('range_from', checkIn)
        .eq('range_to', checkOut)
        .maybeSingle();

      if (cached && new Date(cached.expires_at) > new Date()) {
        console.log('Calendar cache HIT', listingId, checkIn, checkOut);
        return new Response(
          JSON.stringify({ ...(cached.payload as any), cached: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Calendar cache MISS, fetching from Guesty', listingId, checkIn, checkOut);

    // 2. Get auth token
    const authUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/guesty-booking-auth`;
    let authResponse: Response;
    try {
      authResponse = await fetch(authUrl, {
        headers: { 'apikey': Deno.env.get('SUPABASE_ANON_KEY')! },
      });
    } catch (authRequestError) {
      console.error('Auth function request failed:', authRequestError);
      return degradedResponse();
    }

    if (!authResponse.ok) {
      const authErrorText = await authResponse.text();
      console.error('Failed to get authentication token:', authErrorText);

      try {
        const { data: staleCoveringCache } = await supabase
          .from('guesty_calendar_cache')
          .select('payload')
          .eq('listing_id', listingId)
          .lte('range_from', checkIn)
          .gte('range_to', checkOut)
          .order('fetched_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (staleCoveringCache?.payload) {
          return new Response(
            JSON.stringify({ ...(staleCoveringCache.payload as any), cached: true, stale: true, degraded: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (staleCacheError) {
        console.error('Stale cache fallback failed:', staleCacheError);
      }

      return degradedResponse();
    }

    const { access_token } = await authResponse.json();

    // 3. Fetch calendar with backoff
    const calendarUrl = `https://booking.guesty.com/api/listings/${listingId}/calendar?from=${checkIn}&to=${checkOut}`;
    const calendarResponse = await fetchWithBackoff(calendarUrl, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${access_token}`, 'accept': 'application/json' },
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error('Failed to fetch calendar:', calendarResponse.status, errorText);

      // If rate-limited, serve stale cache rather than failing the page
      if (calendarResponse.status === 429) {
        const { data: stale } = await supabase
          .from('guesty_calendar_cache')
          .select('payload')
          .eq('listing_id', listingId)
          .eq('range_from', checkIn)
          .eq('range_to', checkOut)
          .maybeSingle();
        if (stale) {
          console.warn('Serving STALE cache due to 429');
          return new Response(
            JSON.stringify({ ...(stale.payload as any), cached: true, stale: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      throw new Error(`Failed to fetch calendar: ${errorText}`);
    }

    const calendar = await calendarResponse.json();
    const calendarData = calendar.calendar || calendar.data || calendar;

    // 4. Enrich with nightly rates (contiguous available ranges)
    const nightlyRates: Record<string, number> = {};
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

    // Guesty's Booking Engine `/listings` search has no listing-ID filter (confirmed
    // against their API docs) — the only way to get nightlyRates for OUR listing is to
    // page through its generic, portfolio-wide results until we find it. Page 1 alone
    // is not enough: a listing with few bookings so far (little search "relevance") can
    // simply not be among the first 100 results for a given date window. Capped at 3
    // pages (300 listings) so one calendar load can't run away with API calls.
    const MAX_RATE_PAGES = 3;

    const fetchRates = async (from: string, toExclusive: string) => {
      const baseUrl =
        `https://booking.guesty.com/api/listings` +
        `?fields=${encodeURIComponent('_id nightlyRates prices.currency')}` +
        `&checkIn=${from}&checkOut=${toExclusive}&limit=100`;
      let url = baseUrl;
      for (let page = 0; page < MAX_RATE_PAGES; page++) {
        try {
          const r = await fetchWithBackoff(url, {
            headers: { Authorization: `Bearer ${access_token}`, accept: 'application/json' },
          });
          if (!r.ok) {
            console.warn('Rates fetch failed', r.status, from, toExclusive);
            await r.text().catch(() => {});
            return;
          }
          const json = await r.json();
          const list: any[] = json?.results || json?.data || [];
          // No `|| list[0]` fallback here on purpose: if our listing isn't in this page,
          // falling back to some other listing would silently attribute a stranger
          // property's price to this one, which is worse than showing no live price at all.
          const item = list.find((l: any) => l._id === listingId);
          if (item?.nightlyRates) {
            for (const [k, v] of Object.entries(item.nightlyRates)) {
              nightlyRates[k] = v as number;
            }
            currency = currency || item?.prices?.currency || item?.currency;
            return;
          }
          const nextCursor = json?.pagination?.cursor?.next;
          if (!nextCursor) return;
          url = `${baseUrl}&cursor=${encodeURIComponent(nextCursor)}`;
        } catch (e) {
          console.warn('Rates fetch error:', e);
          return;
        }
      }
    };

    if (Array.isArray(calendarData) && calendarData.length) {
      const ranges: Array<[string, string]> = [];
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

      // A listing with few bookings yet (little to interrupt its availability) can have
      // ONE contiguous open range spanning many months. Querying Guesty with that whole
      // span as checkIn/checkOut returns zero results — the endpoint reads those params
      // as an intended stay, and nobody books a stay that long. So each range is chunked
      // into realistic-length windows before it's queried, capped in total so one
      // calendar load can't run away with API calls. This trades full-year live pricing
      // for guaranteed near-term live pricing, which is what a guest actually browsing
      // dates needs — the rest still has the frozen price_per_night as a fallback.
      const WINDOW_DAYS = 10;
      const MAX_WINDOWS = 20;
      const windows: Array<[string, string]> = [];
      for (const [start, endExclusive] of ranges) {
        let cursor = start;
        while (cursor < endExclusive) {
          const chunkEnd = addDay(cursor, WINDOW_DAYS);
          const windowEnd = chunkEnd < endExclusive ? chunkEnd : endExclusive;
          windows.push([cursor, windowEnd]);
          if (windows.length >= MAX_WINDOWS) break;
          cursor = windowEnd;
        }
        if (windows.length >= MAX_WINDOWS) break;
      }

      await Promise.all(windows.map(([a, b]) => fetchRates(a, b)));
    }

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

    const responsePayload = { calendar: enriched, isAvailable, currency };

    // 5. Persist to cache (fire-and-forget)
    supabase
      .from('guesty_calendar_cache')
      .upsert({
        listing_id: listingId,
        range_from: checkIn,
        range_to: checkOut,
        payload: responsePayload,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
      }, { onConflict: 'listing_id,range_from,range_to' })
      .then(({ error }) => {
        if (error) console.warn('Cache upsert failed:', error.message);
      });

    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in guesty-get-calendar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
