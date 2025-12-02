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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing property:", propertyData);

    const systemPrompt = `You are a professional real estate cash flow analyst specializing in the Spanish Costa del Sol market (Marbella, Malaga, Benalmadena, Fuengirola area). 

Analyze vacation rental properties and provide realistic market data based on:
- Current Airbnb and Booking.com market rates for the area
- Seasonal tourism patterns in Costa del Sol
- Local property management costs
- Platform commission rates (typically 3% host fee + 14% guest fee for Airbnb)

Always provide realistic, market-based estimates. For Costa del Sol:
- Peak season: June-August (high tourist demand)
- Mid season: April-May, September-October (good weather, moderate demand)
- Low season: November-March (lower demand but still tourists)

Consider the property size, bedrooms, and location when estimating rates. Luxury properties in Marbella command premium prices.`;

    const userPrompt = `Analyze this property for vacation rental potential and provide detailed cash flow analysis:

Property Details:
- Address: ${propertyData.address}
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Property Type: ${propertyData.propertyType || "Apartment"}
- Size: ${propertyData.size ? propertyData.size + " sqm" : "Not specified"}

Provide comprehensive analysis with realistic market data for this specific location. Include seasonal breakdowns, expense estimates, and comparison between short-term and long-term rental strategies.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_property_analysis",
              description: "Provide structured property cash flow analysis with market data",
              parameters: {
                type: "object",
                properties: {
                  monthlyIncome: {
                    type: "number",
                    description: "Average monthly net income in EUR"
                  },
                  annualRevenue: {
                    type: "number",
                    description: "Total annual revenue projection in EUR"
                  },
                  occupancyRate: {
                    type: "number",
                    description: "Average year-round occupancy rate as percentage (0-100)"
                  },
                  peakSeason: {
                    type: "object",
                    properties: {
                      period: { type: "string", description: "Peak season months e.g. 'Jun-Aug'" },
                      occupancy: { type: "number", description: "Occupancy rate percentage" },
                      nightlyRate: { type: "number", description: "Average nightly rate in EUR" },
                      monthlyIncome: { type: "number", description: "Average monthly income in EUR" }
                    },
                    required: ["period", "occupancy", "nightlyRate", "monthlyIncome"]
                  },
                  midSeason: {
                    type: "object",
                    properties: {
                      period: { type: "string", description: "Mid season months" },
                      occupancy: { type: "number" },
                      nightlyRate: { type: "number" },
                      monthlyIncome: { type: "number" }
                    },
                    required: ["period", "occupancy", "nightlyRate", "monthlyIncome"]
                  },
                  lowSeason: {
                    type: "object",
                    properties: {
                      period: { type: "string", description: "Low season months" },
                      occupancy: { type: "number" },
                      nightlyRate: { type: "number" },
                      monthlyIncome: { type: "number" }
                    },
                    required: ["period", "occupancy", "nightlyRate", "monthlyIncome"]
                  },
                  monthlyData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        month: { type: "string" },
                        revenue: { type: "number" },
                        occupancy: { type: "number" }
                      },
                      required: ["month", "revenue", "occupancy"]
                    },
                    description: "Monthly breakdown for all 12 months"
                  },
                  rentalRates: {
                    type: "object",
                    properties: {
                      low: {
                        type: "object",
                        properties: { min: { type: "number" }, max: { type: "number" } },
                        required: ["min", "max"]
                      },
                      mid: {
                        type: "object",
                        properties: { min: { type: "number" }, max: { type: "number" } },
                        required: ["min", "max"]
                      },
                      high: {
                        type: "object",
                        properties: { min: { type: "number" }, max: { type: "number" } },
                        required: ["min", "max"]
                      }
                    },
                    required: ["low", "mid", "high"]
                  },
                  expenses: {
                    type: "object",
                    properties: {
                      cleaning: { type: "number", description: "Annual cleaning costs" },
                      maintenance: { type: "number", description: "Annual maintenance costs" },
                      utilities: { type: "number", description: "Annual utilities costs" },
                      insurance: { type: "number", description: "Annual insurance costs" },
                      platformFees: { type: "number", description: "Annual platform fees" },
                      management: { type: "number", description: "Annual management fees" },
                      total: { type: "number", description: "Total annual expenses" }
                    },
                    required: ["cleaning", "maintenance", "utilities", "insurance", "platformFees", "management", "total"]
                  },
                  longTermRental: {
                    type: "object",
                    properties: {
                      monthlyRent: { type: "number" },
                      annualIncome: { type: "number" },
                      occupancyRate: { type: "number" }
                    },
                    required: ["monthlyRent", "annualIncome", "occupancyRate"]
                  },
                  comparison: {
                    type: "object",
                    properties: {
                      shortTermAnnual: { type: "number" },
                      longTermAnnual: { type: "number" },
                      recommendation: { type: "string", description: "Brief recommendation on which strategy is better for this property" }
                    },
                    required: ["shortTermAnnual", "longTermAnnual", "recommendation"]
                  },
                  marketInsights: {
                    type: "string",
                    description: "2-3 sentences about market conditions, trends, or opportunities specific to this property location"
                  }
                },
                required: ["monthlyIncome", "annualRevenue", "occupancyRate", "peakSeason", "midSeason", "lowSeason", "monthlyData", "rentalRates", "expenses", "longTermRental", "comparison", "marketInsights"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_property_analysis" } }
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
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract the structured data from tool call
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "provide_property_analysis") {
      throw new Error("Invalid AI response format");
    }

    const analysis: PropertyAnalysis = JSON.parse(toolCall.function.arguments);
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