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
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, checkIn, checkOut, guests }: QuoteRequest = await req.json();
    
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

    // Get reservation quote from Guesty Booking Engine API
    const quoteUrl = 'https://booking-api.guesty.com/api/v2/reservation-quote';
    
    const quotePayload = {
      listingId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: guests.adults + (guests.children || 0),
      ...guests,
    };

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
      console.error('Failed to get quote:', errorText);
      throw new Error(`Failed to get quote: ${errorText}`);
    }

    const quote = await quoteResponse.json();
    console.log('Quote received:', quote);

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
