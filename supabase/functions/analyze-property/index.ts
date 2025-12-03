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

    console.log("Analyzing property:", JSON.stringify(propertyData));

    const systemPrompt = `You are an expert real estate analyst specializing in Costa del Sol, Spain vacation rentals. You have deep knowledge of:
- Current 2024-2025 Airbnb/Booking.com market rates for SPECIFIC neighborhoods
- Seasonal tourism patterns and occupancy rates
- Property management costs (15-25% for short-term)
- Platform fees (Airbnb ~15% total, Booking.com ~15%)

CRITICAL: Your estimates MUST vary significantly based on the EXACT address/location provided:

PREMIUM AREAS (€250-800+/night):
- Puerto Banus, Golden Mile, Sierra Blanca, La Zagaleta
- Beachfront Marbella, Los Monteros

HIGH-END AREAS (€150-400/night):
- Marbella Old Town, Nueva Andalucia golf areas
- San Pedro beachfront, Estepona port area

MID-RANGE AREAS (€80-200/night):
- Fuengirola center, Benalmadena Costa
- Torremolinos, Mijas Costa, Calahonda

BUDGET AREAS (€50-120/night):
- Inland Mijas, Alhaurin, Coin
- Non-beachfront standard apartments

For EACH property, calculate unique values based on:
1. EXACT street/neighborhood (research typical rates)
2. Bedrooms: 1BR=base, 2BR=+40%, 3BR=+70%, 4BR+=+100%
3. Property type: Villa/house=+30-50% vs apartment
4. Size: Adjust for sqm if provided
5. Season: Peak (Jun-Aug), Mid (Apr-May, Sep-Oct), Low (Nov-Mar)

Be SPECIFIC and REALISTIC. A 2BR in Puerto Banus ≠ 2BR in Fuengirola center.`;

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
        "HTTP-Referer": "https://frontierresidences.com",
        "X-Title": "Frontier Residences Property Analysis",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
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
          JSON.stringify({ error: "AI service credits depleted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Lovable AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

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

    console.log("Parsed analysis successfully");

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
