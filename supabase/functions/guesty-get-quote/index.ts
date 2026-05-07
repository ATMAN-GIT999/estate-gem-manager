const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children?: number;
    pets?: number;
  };
  couponCode?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, checkIn, checkOut, guests, couponCode }: QuoteRequest = await req.json();
    
    if (!listingId || !checkIn || !checkOut || !guests) {
      return new Response(
        JSON.stringify({ error: 'listingId, checkIn, checkOut, and guests are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Getting quote for:', { listingId, checkIn, checkOut, guests });

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

    // Get reservation quote from Guesty Booking Engine API v1
    // Using the Reservation Quote Flow as recommended in the docs
    // Correct Booking Engine endpoint: /api/reservations/quotes (no /v1)
    const quoteUrl = 'https://booking.guesty.com/api/reservations/quotes';

    const quotePayload: Record<string, unknown> = {
      listingId,
      checkInDateLocalized: checkIn,
      checkOutDateLocalized: checkOut,
      guestsCount: guests.adults + (guests.children || 0),
      numberOfGuests: {
        numberOfAdults: guests.adults,
        numberOfChildren: guests.children || 0,
      },
    };

    if (couponCode && couponCode.trim()) {
      // Guesty expects a comma-joined string under `coupons`
      quotePayload.coupons = couponCode.trim();
    }

    console.log('Requesting quote with payload:', quotePayload);

    const quoteResponse = await fetch(quoteUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(quotePayload),
    });

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text();
      console.error('Failed to get quote:', quoteResponse.status, errorText);

      // Try to parse Guesty's structured error and translate to a friendly message
      let parsed: any = null;
      try { parsed = JSON.parse(errorText); } catch { /* not JSON */ }
      const guestyErr = parsed?.error || parsed;
      const code = guestyErr?.code || '';
      const notApplicable =
        guestyErr?.data?.moreDetails?.notApplicableRatePlans?.[0]?.notApplicable || {};

      if (code === 'LISTING_IS_NOT_AVAILABLE' || Object.values(notApplicable).some(Boolean)) {
        const reasons: string[] = [];
        if (notApplicable.minNights) reasons.push('your stay is shorter than the minimum nights allowed');
        if (notApplicable.maxNights) reasons.push('your stay exceeds the maximum nights allowed');
        if (notApplicable.advanceNotice) reasons.push('the check-in is too soon (advance notice required)');
        if (notApplicable.bookingWindow) reasons.push('the dates fall outside the booking window');
        if (notApplicable.closed || notApplicable.hardBlocked || notApplicable.manual)
          reasons.push('the dates are not available');
        if (notApplicable.cta) reasons.push('check-in is not allowed on the selected day');
        if (notApplicable.ctd) reasons.push('check-out is not allowed on the selected day');
        if (notApplicable.preparationTime) reasons.push('preparation time between bookings is required');
        const reason = reasons[0] || 'these dates are not available for this property';
        return new Response(
          JSON.stringify({
            error: `These dates can't be booked — ${reason}. Please choose different dates.`,
            code: 'DATES_NOT_AVAILABLE',
            details: notApplicable,
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Surface coupon-specific errors clearly
      if (couponCode && /coupon|promo|invalid/i.test(errorText)) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired coupon code', details: errorText }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Failed to get quote: ${errorText}`);
    }

    const quote = await quoteResponse.json();
    console.log('Quote received:', JSON.stringify(quote).substring(0, 500));

    return new Response(
      JSON.stringify({ quote }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in guesty-get-quote:', error);
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
