// Edge function: AI-powered trade-in estimation
// Returns a price range + qualitative analysis based on the vehicle's data.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EstimateInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vehicle_type: "profile" | "integral" | "fourgon" | "capucine";
  condition: "excellent" | "bon" | "moyen" | "a_renover";
  fuel?: string | null;
  seats?: number | null;
  length_cm?: number | null;
  message?: string | null;
}

// --- Local heuristic ----------------------------------------------------------
// Returns a coarse fair-market range in EUR before AI refinement.
function localEstimate(v: EstimateInput): { low: number; high: number; base: number } {
  // Base price by type (new, ~2024)
  const basePriceByType: Record<EstimateInput["vehicle_type"], number> = {
    fourgon: 65000,
    profile: 78000,
    integral: 98000,
    capucine: 70000,
  };
  let base = basePriceByType[v.vehicle_type] ?? 75000;

  // Brand premium (subtle multiplier)
  const premiumBrands = ["hymer", "rapido", "pilote", "frankia", "niesmann", "morelo", "concorde"];
  const value = ["chausson", "challenger", "sun living", "sunlight", "weinsberg", "roller team"];
  const brandLower = v.brand.toLowerCase();
  if (premiumBrands.some((b) => brandLower.includes(b))) base *= 1.12;
  else if (value.some((b) => brandLower.includes(b))) base *= 0.92;

  // Age depreciation (non-linear): 15% first year, then ~8% per year, floor 25%
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - v.year);
  let ageMultiplier = 1;
  if (age >= 1) ageMultiplier *= 0.85;
  for (let i = 1; i < age; i++) ageMultiplier *= 0.92;
  ageMultiplier = Math.max(0.25, ageMultiplier);

  // Mileage adjustment: reference 8000 km/year
  const expectedKm = age * 8000;
  const kmDelta = v.mileage - expectedKm;
  // -1% per 5000 km above expected, +0.5% per 5000 km below (capped)
  let kmMultiplier = 1 - (kmDelta / 5000) * 0.01;
  kmMultiplier = Math.max(0.7, Math.min(1.1, kmMultiplier));

  // Condition multiplier
  const conditionMultiplier: Record<EstimateInput["condition"], number> = {
    excellent: 1.05,
    bon: 1.0,
    moyen: 0.85,
    a_renover: 0.65,
  };

  const estimated = base * ageMultiplier * kmMultiplier * conditionMultiplier[v.condition];

  // Range: ±10%
  const low = Math.round((estimated * 0.9) / 500) * 500;
  const high = Math.round((estimated * 1.1) / 500) * 500;

  return { low, high, base: Math.round(estimated) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input = (await req.json()) as EstimateInput;

    // Basic validation
    if (
      !input.brand ||
      !input.model ||
      !input.year ||
      input.mileage == null ||
      !input.vehicle_type ||
      !input.condition
    ) {
      return new Response(JSON.stringify({ error: "Champs requis manquants." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const local = localEstimate(input);

    // Call Lovable AI for qualitative refinement
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let aiAnalysis: string | null = null;
    let aiLow = local.low;
    let aiHigh = local.high;

    if (LOVABLE_API_KEY) {
      const systemPrompt = `Tu es un expert en évaluation de camping-cars d'occasion sur le marché français. 
Tu reçois les caractéristiques d'un véhicule et une fourchette d'estimation locale calculée par un barème.
Ta mission :
1. Affiner la fourchette en €uros (basse / haute) en restant réaliste pour le marché de la reprise pro (10-20% sous la cote du marché particulier).
2. Rédiger une analyse courte (3-4 phrases) en français, ton professionnel et rassurant, expliquant les facteurs qui jouent sur la valeur (âge, km, marque, état) et un conseil concret.
N'invente pas de spécificités techniques que tu ne connais pas. Sois honnête sur l'incertitude.`;

      const userPrompt = `Véhicule à évaluer pour une reprise professionnelle :
- Marque : ${input.brand}
- Modèle : ${input.model}
- Année : ${input.year}
- Kilométrage : ${input.mileage.toLocaleString("fr-FR")} km
- Type : ${input.vehicle_type}
- État déclaré : ${input.condition}
- Carburant : ${input.fuel ?? "non précisé"}
- Places : ${input.seats ?? "non précisé"}
- Longueur : ${input.length_cm ? `${input.length_cm / 100} m` : "non précisée"}
- Note du client : ${input.message ?? "aucune"}

Fourchette indicative locale calculée : ${local.low.toLocaleString("fr-FR")} € — ${local.high.toLocaleString("fr-FR")} €
(prix neuf de référence pour ce type : ${local.base.toLocaleString("fr-FR")} € après dépréciation)

Renvoie ta réponse via l'outil refine_estimate.`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "refine_estimate",
                description: "Renvoie une fourchette d'estimation affinée et une analyse courte.",
                parameters: {
                  type: "object",
                  properties: {
                    low: { type: "number", description: "Borne basse de la fourchette en euros" },
                    high: { type: "number", description: "Borne haute de la fourchette en euros" },
                    analysis: {
                      type: "string",
                      description: "Analyse courte (3-4 phrases) en français.",
                    },
                  },
                  required: ["low", "high", "analysis"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "refine_estimate" } },
        }),
      });

      if (aiResp.status === 429) {
        console.warn("AI rate limited, returning local estimate only");
      } else if (aiResp.status === 402) {
        console.warn("AI credits exhausted, returning local estimate only");
      } else if (!aiResp.ok) {
        console.error("AI gateway error", aiResp.status, await aiResp.text());
      } else {
        const data = await aiResp.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          try {
            const parsed = JSON.parse(toolCall.function.arguments);
            if (typeof parsed.low === "number" && typeof parsed.high === "number") {
              aiLow = Math.round(parsed.low / 500) * 500;
              aiHigh = Math.round(parsed.high / 500) * 500;
            }
            if (typeof parsed.analysis === "string") {
              aiAnalysis = parsed.analysis;
            }
          } catch (e) {
            console.error("Failed to parse AI tool call", e);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        local: { low: local.low, high: local.high },
        estimate: { low: aiLow, high: aiHigh },
        analysis: aiAnalysis,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("estimate-trade-in error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
