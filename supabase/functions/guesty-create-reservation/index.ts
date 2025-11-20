const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationRequest {
  quoteId: string;
  ratePlanId: string;
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
    }: ReservationRequest = await req.json();
    
    if (!quoteId || !ratePlanId || !guest || !policy || !type) {
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

    // Choose endpoint based on booking type
    const endpoint = type === 'instant' 
      ? 'instant-reservation-from-quote'
      : 'inquiry-reservation-from-quote';
    
    const reservationUrl = `https://booking-api.guesty.com/api/v2/${endpoint}`;
    
    const reservationPayload: any = {
      quoteId,
      ratePlanId,
      guest: {
        ...guest,
        policies: policy,
      },
    };

    // Add payment token for instant bookings
    if (type === 'instant' && paymentToken) {
      reservationPayload.ccToken = paymentToken;
    }

    console.log('Creating reservation at:', reservationUrl);

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
      console.error('Failed to create reservation:', errorText);
      throw new Error(`Failed to create reservation: ${errorText}`);
    }

    const reservation = await reservationResponse.json();
    console.log('Reservation created:', reservation);

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
