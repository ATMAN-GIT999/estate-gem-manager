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

    // Check for cached token first
    const { data: cachedToken, error: cacheError } = await supabase
      .from('guesty_token_cache')
      .select('*')
      .single();

    if (!cacheError && cachedToken) {
      const expiresAt = new Date(cachedToken.expires_at);
      const now = new Date();
      
      // If token is still valid (with 1 hour buffer), return it
      if (expiresAt > new Date(now.getTime() + 3600000)) {
        console.log('Using cached token (expires:', expiresAt.toISOString(), ')');
        return new Response(
          JSON.stringify({
            access_token: cachedToken.access_token,
            expires_in: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
            token_type: 'Bearer',
            cached: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        console.log('Cached token expired, requesting new one');
      }
    }

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
      
      // If rate limited, check if we have ANY cached token (even slightly expired)
      if (errorText.includes('TOO_MANY_REQUESTS') && cachedToken) {
        console.log('Rate limited, using slightly expired cached token as fallback');
        return new Response(
          JSON.stringify({
            access_token: cachedToken.access_token,
            expires_in: 3600,
            token_type: 'Bearer',
            cached: true,
            warning: 'Using cached token due to rate limit',
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Failed to authenticate with Guesty Booking Engine: ${errorText}`);
    }

    const authData: GuestyAuthResponse = await authResponse.json();
    console.log('Successfully obtained Guesty Booking Engine token');

    // Cache the new token
    const expiresAt = new Date(Date.now() + (authData.expires_in * 1000));
    
    await supabase
      .from('guesty_token_cache')
      .upsert({
        access_token: authData.access_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    console.log('Token cached until:', expiresAt.toISOString());

    return new Response(
      JSON.stringify({
        access_token: authData.access_token,
        expires_in: authData.expires_in,
        token_type: authData.token_type,
        cached: false,
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
