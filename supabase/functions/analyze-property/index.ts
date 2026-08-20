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
    // Require authenticated caller (JWT validation)
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    try {
      const verifyRes = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
        },
      });
      if (!verifyRes.ok) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { propertyData } = await req.json();
    // Basic input validation
    if (
      !propertyData ||
      typeof propertyData !== "object" ||
      typeof propertyData.address !== "string" ||
      propertyData.address.length === 0 ||
      propertyData.address.length > 500
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid propertyData" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Analyzing property:", JSON.stringify(propertyData));

    const systemPrompt = `You are an expert real estate analyst specializing in Costa del Sol, Spain vacation rentals. You MUST ALWAYS respond with ONLY a valid JSON object, never with explanatory text, questions, or markdown.

Your knowledge includes:
- Current 2024-2025 Airbnb/Booking.com market rates for Costa del Sol neighborhoods
- Seasonal tourism patterns and occupancy rates
- Property management costs (15-25% for short-term)
- Platform fees (Airbnb ~15% total, Booking.com ~15%)

LOCATION PRICING GUIDELINES:
- PREMIUM (€250-800+/night): Puerto Banus, Golden Mile, Sierra Blanca, La Zagaleta, Beachfront Marbella, Los Monteros
- HIGH-END (€150-400/night): Marbella Old Town, Nueva Andalucia golf areas, San Pedro beachfront, Estepona port
- MID-RANGE (€80-200/night): Fuengirola center, Benalmadena Costa, Torremolinos, Mijas Costa, Calahonda
- BUDGET (€50-120/night): Inland Mijas, Alhaurin, Coin, Non-beachfront apartments

PROPERTY ADJUSTMENTS:
- Bedrooms: 1BR=base, 2BR=+40%, 3BR=+70%, 4BR+=+100%
- Villa/house: +30-50% vs apartment
- Size: Adjust proportionally for sqm
- GUEST CAPACITY: Properties that can accommodate more guests command higher rates. 8+ guests = +20-40% premium over standard rates.

CRITICAL FORMATTING RULES:
- All occupancy rates MUST be expressed as WHOLE NUMBERS (e.g., 70 for 70%, NOT 0.7)
- All monetary values in EUR
- Even if the address is vague, you MUST provide estimates using mid-range values for that area. Never refuse - make reasonable assumptions and return JSON.`;

    const userPrompt = `Analyze this property. Return ONLY valid JSON, no text.

Property:
- Address: ${propertyData.address}
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Type: ${propertyData.propertyType || "Apartment"}
- Size: ${propertyData.size ? propertyData.size + " sqm" : "Unknown"}
- Maximum Guests: ${propertyData.guests || "Not specified"}

IMPORTANT: Consider the guest capacity when calculating rates. Properties that can host more guests typically achieve higher nightly rates.

Return this exact JSON structure with realistic EUR values. ALL OCCUPANCY RATES MUST BE WHOLE NUMBERS (e.g., 70 for 70%, NOT 0.7):
{"monthlyIncome":number,"annualRevenue":number,"occupancyRate":number,"peakSeason":{"period":"Jun-Aug","occupancy":number,"nightlyRate":number,"monthlyIncome":number},"midSeason":{"period":"Apr-May, Sep-Oct","occupancy":number,"nightlyRate":number,"monthlyIncome":number},"lowSeason":{"period":"Nov-Mar","occupancy":number,"nightlyRate":number,"monthlyIncome":number},"monthlyData":[{"month":"Jan","revenue":number,"occupancy":number},{"month":"Feb","revenue":number,"occupancy":number},{"month":"Mar","revenue":number,"occupancy":number},{"month":"Apr","revenue":number,"occupancy":number},{"month":"May","revenue":number,"occupancy":number},{"month":"Jun","revenue":number,"occupancy":number},{"month":"Jul","revenue":number,"occupancy":number},{"month":"Aug","revenue":number,"occupancy":number},{"month":"Sep","revenue":number,"occupancy":number},{"month":"Oct","revenue":number,"occupancy":number},{"month":"Nov","revenue":number,"occupancy":number},{"month":"Dec","revenue":number,"occupancy":number}],"rentalRates":{"low":{"min":number,"max":number},"mid":{"min":number,"max":number},"high":{"min":number,"max":number}},"expenses":{"cleaning":number,"maintenance":number,"utilities":number,"insurance":number,"platformFees":number,"management":number,"total":number},"longTermRental":{"monthlyRent":number,"annualIncome":number,"occupancyRate":number},"comparison":{"shortTermAnnual":number,"longTermAnnual":number,"recommendation":"string"},"marketInsights":"string"}`;

    // Direct Gemini REST call — the previous version routed through Lovable's
    // AI Gateway, a "seamless" (zero-config) Lovable integration whose key is
    // auto-provisioned only when Lovable itself deploys the function. Since
    // this project is deployed independently now, that key was never set and
    // never will be through normal means — a real Gemini key from Google AI
    // Studio replaces it (docs/DECISIONS.md, "Weg 2").
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("No content in AI response");
    }

    let analysis: PropertyAnalysis;
    try {
      // Try direct parse first
      analysis = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks or text
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        analysis = JSON.parse(jsonStr);
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
