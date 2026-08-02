const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationRequest {
  quoteId: string;
  ratePlanId?: string;
  ccToken?: string; // Stripe SCA PaymentMethod id (pm_...) — instant only
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  policy?: {
    terms?: boolean;
    cancellation?: boolean;
  };
  bookingType?: 'instant' | 'inquiry';
  /** @deprecated legacy field: 'instant' | 'confirmed' | 'inquiry' */
  type?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** Translate a Guesty error payload into a friendly message + stable machine code. */
function translateGuestyError(status: number, raw: string): { error: string; code: string } {
  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // not JSON — fall back to raw text
  }
  const guestyCode = String(
    parsed?.code ?? parsed?.errorCode ?? parsed?.error?.code ?? '',
  ).toUpperCase();
  const message = String(
    parsed?.message ?? parsed?.error?.message ?? parsed?.error ?? raw ?? '',
  );
  const haystack = `${guestyCode} ${message}`.toLowerCase();
  if (haystack.includes('wrong_payment_config') || haystack.includes('payment provider')) {
    return {
      code: 'WRONG_PAYMENT_CONFIG',
      error:
        "Instant booking isn't available for this property because its payment configuration is incomplete. Please send a booking request instead.",
    };
  }
  if (
    haystack.includes('instant book') ||
    haystack.includes('instantbook') ||
    haystack.includes('instant_book') ||
    haystack.includes('not bookable')
  ) {
    return {
      code: 'INSTANT_BOOK_DISABLED',
      error: 'Instant booking is not enabled for this property. Please send a booking request instead.',
    };
  }
  if (haystack.includes('rate plan') || haystack.includes('rateplan')) {
    return {
      code: 'INVALID_RATE_PLAN',
      error: 'The selected rate plan is no longer valid. Please refresh your dates and try again.',
    };
  }
  if (haystack.includes('cctoken') || haystack.includes('card') || haystack.includes('declin')) {
    return {
      code: 'PAYMENT_FAILED',
      error: 'Your card could not be charged. Please check your card details or try another card.',
    };
  }
  if (
    haystack.includes('not available') ||
    haystack.includes('unavailable') ||
    haystack.includes('blocked')
  ) {
    return {
      code: 'DATES_UNAVAILABLE',
      error: 'These dates are no longer available. Please choose different dates.',
    };
  }
  if (haystack.includes('quote') && (haystack.includes('expired') || haystack.includes('not found'))) {
    return {
      code: 'QUOTE_EXPIRED',
      error: 'Your price quote has expired. Please refresh the page to get an updated price.',
    };
  }
  if (status === 401 || status === 403) {
    return {
      code: 'UNAUTHORIZED',
      error: 'We could not authorise the booking request. Please try again shortly.',
    };
  }
  return {
    code: 'RESERVATION_FAILED',
    error: message || 'We could not complete your reservation. Please try again or contact us.',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ReservationRequest = await req.json();
    const { quoteId, ratePlanId, ccToken, guest, policy } = body;

    // Resolve booking type (backward compatible with the legacy `type` field)
    const legacy = String(body.type ?? '').toLowerCase();
    const bookingType: 'instant' | 'inquiry' =
      body.bookingType === 'inquiry'
        ? 'inquiry'
        : body.bookingType === 'instant'
          ? 'instant'
          : legacy === 'inquiry'
            ? 'inquiry'
            : legacy === 'instant' || legacy === 'confirmed'
              ? 'instant'
              : 'inquiry';

    if (!quoteId || !guest?.email) {
      return json(
        { error: 'Missing required fields: quoteId and guest are required.', code: 'BAD_REQUEST' },
        400,
      );
    }
    if (bookingType === 'instant' && !ratePlanId) {
      return json(
        {
          error:
            'Instant booking requires a rate plan from the quote. Please send a booking request instead.',
          code: 'MISSING_RATE_PLAN',
        },
        400,
      );
    }
    if (bookingType === 'instant' && !ccToken) {
      return json(
        {
          error: 'Instant booking requires a payment method. Please re-enter your card details.',
          code: 'MISSING_CC_TOKEN',
        },
        400,
      );
    }

    console.log('Creating', bookingType, 'reservation for quote:', quoteId);

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

    // Booking Engine reservation-from-quote flow: booking type is the URL path suffix
    const reservationUrl = `https://booking.guesty.com/api/reservations/quotes/${quoteId}/${bookingType}`;

    const reservationPayload: Record<string, unknown> = {
      ratePlanId,
      guest: {
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
      },
      policy: {
        termsAccepted: policy?.terms ?? true,
        cancellationPolicyAccepted: policy?.cancellation ?? true,
      },
    };

    if (bookingType === 'instant') {
      reservationPayload.ccToken = ccToken;
    }

    console.log('Creating reservation at:', reservationUrl);
    // Never log the raw ccToken
    console.log(
      'Payload:',
      JSON.stringify({ ...reservationPayload, ccToken: ccToken ? '[redacted]' : undefined }),
    );

    const reservationResponse = await fetch(reservationUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(reservationPayload),
    });

    if (!reservationResponse.ok) {
      const errorText = await reservationResponse.text();
      console.error('Failed to create reservation:', reservationResponse.status, errorText);
      const { error, code } = translateGuestyError(reservationResponse.status, errorText);
      return json({ error, code, bookingType }, 400);
    }

    const reservation = await reservationResponse.json();
    console.log('Reservation created:', JSON.stringify(reservation).substring(0, 500));

    return json({ reservation, bookingType });
  } catch (error) {
    console.error('Error in guesty-create-reservation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return json({ error: errorMessage, code: 'INTERNAL_ERROR' }, 500);
  }
});