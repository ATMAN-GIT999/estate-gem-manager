const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationRequest {
  quoteId: string;
  ratePlanId?: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  policy: {
    terms: boolean;
    cancellation: boolean;
  };
  paymentToken?: string; // For instant booking
  type: 'instant' | 'inquiry';
  couponCode?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      quoteId,
      ratePlanId,
      guest,
      policy,
      paymentToken,
      type,
      couponCode,
    }: ReservationRequest = await req.json();
    
    if (!quoteId || !guest || !policy || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating', type, 'reservation for:', guest.email);

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

    // Use Guesty Booking Engine API v1 Reservation Quote Flow
    // According to docs, create reservation from quote
    const reservationUrl = 'https://booking.guesty.com/api/v1/reservations';
    
    const reservationPayload: any = {
      quoteId,
      guest: {
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
      },
      policy: {
        termsAccepted: policy.terms,
        cancellationPolicyAccepted: policy.cancellation,
      },
    };

    // Add rate plan if provided
    if (ratePlanId) {
      reservationPayload.ratePlanId = ratePlanId;
    }

    // Add payment token for instant bookings
    if (type === 'instant' && paymentToken) {
      reservationPayload.paymentToken = paymentToken;
    }

    // Pass coupon code through if provided
    if (couponCode && couponCode.trim()) {
      reservationPayload.coupon = couponCode.trim();
      reservationPayload.couponCode = couponCode.trim();
    }

    // Set reservation type
    reservationPayload.type = type === 'instant' ? 'confirmed' : 'inquiry';

    console.log('Creating reservation at:', reservationUrl);
    console.log('Payload:', JSON.stringify(reservationPayload));

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
      throw new Error(`Failed to create reservation: ${errorText}`);
    }

    const reservation = await reservationResponse.json();
    console.log('Reservation created:', JSON.stringify(reservation).substring(0, 500));

    return new Response(
      JSON.stringify({ reservation }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in guesty-create-reservation:', error);
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
