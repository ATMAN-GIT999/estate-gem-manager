import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** docs/PROJECT.md C9: no owner has an account, so this can't stay a limit
 *  per signed-in user — it's per IP instead. Five is a starting guess for
 *  "more than a real owner needs, not enough to matter to the AI bill";
 *  adjust freely, nothing else depends on this exact number. */
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_HOURS = 24;

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

/** Claude's structured outputs (output_config.format) guarantee that the reply
 *  parses and carries every field below, which is why the prompt no longer
 *  needs to spell out a JSON template. Why not a forced tool call: the docs
 *  list tool_choice "tool"/"any" as unsupported on Sonnet 5.5 and name
 *  structured outputs as the replacement.
 *
 *  Constraints worth knowing before editing this: every object needs
 *  `additionalProperties: false`, and min/max-style keywords are not
 *  supported — so "exactly 12 months" and "whole-number occupancy" can only
 *  live in the prompt, not here. Keep this in sync with PropertyAnalysis above
 *  and with the interface in src/pages/Evaluate.tsx. */
const ANTHROPIC_MODEL = "claude-sonnet-5-5";

const num = { type: "number" } as const;
const str = { type: "string" } as const;

const seasonSchema = {
  type: "object",
  properties: { period: str, occupancy: num, nightlyRate: num, monthlyIncome: num },
  required: ["period", "occupancy", "nightlyRate", "monthlyIncome"],
  additionalProperties: false,
} as const;

const priceRangeSchema = {
  type: "object",
  properties: { min: num, max: num },
  required: ["min", "max"],
  additionalProperties: false,
} as const;

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    monthlyIncome: num,
    annualRevenue: num,
    occupancyRate: num,
    peakSeason: seasonSchema,
    midSeason: seasonSchema,
    lowSeason: seasonSchema,
    monthlyData: {
      type: "array",
      items: {
        type: "object",
        properties: { month: str, revenue: num, occupancy: num },
        required: ["month", "revenue", "occupancy"],
        additionalProperties: false,
      },
    },
    rentalRates: {
      type: "object",
      properties: { low: priceRangeSchema, mid: priceRangeSchema, high: priceRangeSchema },
      required: ["low", "mid", "high"],
      additionalProperties: false,
    },
    expenses: {
      type: "object",
      properties: {
        cleaning: num,
        maintenance: num,
        utilities: num,
        insurance: num,
        platformFees: num,
        management: num,
        total: num,
      },
      required: ["cleaning", "maintenance", "utilities", "insurance", "platformFees", "management", "total"],
      additionalProperties: false,
    },
    longTermRental: {
      type: "object",
      properties: { monthlyRent: num, annualIncome: num, occupancyRate: num },
      required: ["monthlyRent", "annualIncome", "occupancyRate"],
      additionalProperties: false,
    },
    comparison: {
      type: "object",
      properties: { shortTermAnnual: num, longTermAnnual: num, recommendation: str },
      required: ["shortTermAnnual", "longTermAnnual", "recommendation"],
      additionalProperties: false,
    },
    marketInsights: str,
  },
  required: [
    "monthlyIncome",
    "annualRevenue",
    "occupancyRate",
    "peakSeason",
    "midSeason",
    "lowSeason",
    "monthlyData",
    "rentalRates",
    "expenses",
    "longTermRental",
    "comparison",
    "marketInsights",
  ],
  additionalProperties: false,
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // docs/PROJECT.md C9: this used to require a signed-in session before
    // anything else — but no owner has an account, and self-registration
    // is being switched off anyway (C8), so the hero form on
    // /property-management ended on the login page for practically every
    // visitor. Replaced with a per-IP rate limit instead of a per-user one,
    // since there is no user to key it on anymore.
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const identifier = forwardedFor.split(",")[0].trim() || "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const windowStart = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("evaluator_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("identifier", identifier)
      .gte("requested_at", windowStart);

    if (countError) {
      // A broken count must not silently become "unlimited" — fail closed.
      console.error("Rate limit check failed:", countError);
      return new Response(
        JSON.stringify({ error: "Could not verify request limits, please try again shortly." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if ((count ?? 0) >= MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ error: `Too many analyses from this connection — try again in a few hours.` }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Counts against the limit from here — a request that passed validation
    // and is about to spend a Claude call, whether or not Claude itself
    // then succeeds. Not awaited: a slow insert must not delay the analysis
    // the visitor is actually waiting for, and losing a rate-limit row to a
    // rare failure just makes the limit trivially generous, never unsafe.
    void supabase.from("evaluator_rate_limits").insert({ identifier }).then(
      ({ error }) => { if (error) console.error("Rate limit insert failed:", error); }
    );

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
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
- Bathrooms: ${propertyData.bathrooms || "Not specified"}
- Type: ${propertyData.propertyType || "Apartment"}
- Size: ${propertyData.size ? propertyData.size + " sqm" : "Unknown"}
- Maximum Guests: ${propertyData.guests || "Not specified"}

IMPORTANT: Consider the guest capacity when calculating rates. Properties that can host more guests typically achieve higher nightly rates.

Fill every field of the structured result with realistic EUR values. monthlyData must contain exactly 12 entries, in the order Jan to Dec. ALL OCCUPANCY RATES MUST BE WHOLE NUMBERS (e.g., 70 for 70%, NOT 0.7). Season periods: peakSeason "Jun-Aug", midSeason "Apr-May, Sep-Oct", lowSeason "Nov-Mar".`;

    // Direct Anthropic Messages API call, no SDK — keeps the Deno function
    // dependency-free, the same approach the Gemini version took. The
    // temperature parameter is deliberately not sent: newest Claude models
    // are steered by the prompt, and the docs call it less commonly used.
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        // The full result is roughly 2k tokens; 4096 leaves headroom so a
        // long marketInsights text cannot cut the JSON off mid-object.
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        output_config: { format: { type: "json_schema", schema: ANALYSIS_SCHEMA } },
      }),
      // Give up before the platform's own wall-clock limit does, so the
      // visitor gets our error message instead of a gateway timeout.
      signal: AbortSignal.timeout(90_000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 529) {
        // Anthropic's "overloaded" status — temporary, worth a retry.
        return new Response(
          JSON.stringify({ error: "The analysis service is busy right now, please try again in a few minutes." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // The provider's response body stays in the log — this message reaches
      // the visitor, and an error body can name keys, models or account state.
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Structured outputs only guarantee the schema for a finished answer:
    // "max_tokens" cuts the JSON off mid-object and "refusal" may not match
    // the schema at all. Neither is worth parsing.
    if (data.stop_reason === "max_tokens" || data.stop_reason === "refusal") {
      console.error("Unusable AI response, stop_reason:", data.stop_reason);
      throw new Error("The analysis could not be completed, please try again.");
    }

    const content = Array.isArray(data.content)
      ? data.content.find((block: { type: string }) => block.type === "text")?.text
      : undefined;
    if (!content) {
      throw new Error("No content in AI response");
    }

    let analysis: PropertyAnalysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON in AI response");
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
