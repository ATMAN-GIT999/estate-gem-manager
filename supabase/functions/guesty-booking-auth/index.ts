import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GuestyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  token: string;
  expires_at: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for cached token in Supabase storage or use a simple in-memory cache
    const clientId = Deno.env.get('GUESTY_CLIENT_ID');
    const clientSecret = Deno.env.get('GUESTY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Guesty Booking Engine API credentials not configured');
    }

    console.log('Requesting new Guesty Booking Engine API token...');

    // Request token from Guesty Booking Engine API
    const authResponse = await fetch('https://booking.guesty.com/oauth2/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'booking_engine:api',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Guesty Booking Engine auth failed:', errorText);
      throw new Error(`Failed to authenticate with Guesty Booking Engine: ${errorText}`);
    }

    const authData: GuestyAuthResponse = await authResponse.json();
    console.log('Successfully obtained Guesty Booking Engine token');

    return new Response(
      JSON.stringify({
        access_token: authData.access_token,
        expires_in: authData.expires_in,
        token_type: authData.token_type,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in guesty-booking-auth:', error);
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
