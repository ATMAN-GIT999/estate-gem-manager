const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyAnalysis {
  monthlyIncome: number;
  annualRevenue: number;
  occupancyRate: number;
  peakSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  midSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  lowSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  monthlyData: Array<{ month: string; revenue: number; occupancy: number }>;
  rentalRates: {
    low: { min: number; max: number };
    mid: { min: number; max: number };
    high: { min: number; max: number };
  };
  expenses: {
    cleaning: number;
    maintenance: number;
    utilities: number;
    insurance: number;
    platformFees: number;
    management: number;
    total: number;
  };
  longTermRental: {
    monthlyRent: number;
    annualIncome: number;
    occupancyRate: number;
  };
  comparison: {
    shortTermAnnual: number;
    longTermAnnual: number;
    recommendation: string;
  };
  marketInsights: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyData } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    console.log("Analyzing property:", propertyData);

    const systemPrompt = `You are a professional real estate cash flow analyst specializing in the Spanish Costa del Sol market (Marbella, Malaga, Benalmadena, Fuengirola, Estepona area). 

You have access to current market data and should provide realistic, location-specific estimates based on:
- Current Airbnb and Booking.com market rates for the specific area
- The exact neighborhood and its desirability
- Seasonal tourism patterns in Costa del Sol
- Local property management costs (typically 15-25% for short-term rentals)
- Platform commission rates (typically 3% host fee + 14% guest fee for Airbnb)

IMPORTANT: Provide DIFFERENT estimates based on the specific location. Properties in:
- Puerto Banus/Golden Mile: Premium rates, €300-1000+/night for luxury
- Marbella Center: High rates, €150-500/night
- Nueva Andalucia: Upper-mid rates, €120-400/night
- Fuengirola/Benalmadena: Mid-range, €80-200/night
- Inland areas: Lower rates, €60-150/night

Always adjust your estimates based on:
1. Exact location and neighborhood prestige
2. Number of bedrooms (more = higher total but lower per-night rate per guest)
3. Property type (villa commands premium over apartment)
4. Size and amenities implied

Peak season: June-August (85-95% occupancy)
Mid season: April-May, September-October (60-75% occupancy)
Low season: November-March (30-50% occupancy)`;

    const userPrompt = `Analyze this property for vacation rental potential and provide detailed cash flow analysis:

Property Details:
- Address/Location: ${propertyData.address}
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Property Type: ${propertyData.propertyType || "Apartment"}
- Size: ${propertyData.size ? propertyData.size + " sqm" : "Not specified"}

Provide a comprehensive analysis with REALISTIC market data specific to this exact location. The estimates should vary significantly based on the neighborhood prestige and property characteristics. Include seasonal breakdowns, expense estimates, and comparison between short-term and long-term rental strategies.

Return your analysis as a JSON object with this exact structure:
{
  "monthlyIncome": number (average monthly net income in EUR),
  "annualRevenue": number (total annual revenue in EUR),
  "occupancyRate": number (average occupancy 0-100),
  "peakSeason": { "period": "Jun-Aug", "occupancy": number, "nightlyRate": number, "monthlyIncome": number },
  "midSeason": { "period": "Apr-May, Sep-Oct", "occupancy": number, "nightlyRate": number, "monthlyIncome": number },
  "lowSeason": { "period": "Nov-Mar", "occupancy": number, "nightlyRate": number, "monthlyIncome": number },
  "monthlyData": [{ "month": "Jan", "revenue": number, "occupancy": number }, ... for all 12 months],
  "rentalRates": { "low": { "min": number, "max": number }, "mid": { "min": number, "max": number }, "high": { "min": number, "max": number } },
  "expenses": { "cleaning": number, "maintenance": number, "utilities": number, "insurance": number, "platformFees": number, "management": number, "total": number },
  "longTermRental": { "monthlyRent": number, "annualIncome": number, "occupancyRate": number },
  "comparison": { "shortTermAnnual": number, "longTermAnnual": number, "recommendation": "string with brief recommendation" },
  "marketInsights": "2-3 sentences about market conditions specific to this location"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://frontier-residences.com",
        "X-Title": "Frontier Residences Property Analysis",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    // Extract the JSON response from the message content
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let analysis: PropertyAnalysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from the response if it contains extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse AI response:", content);
        throw new Error("Invalid JSON in AI response");
      }
    }

    console.log("Parsed analysis:", analysis);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-property function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
