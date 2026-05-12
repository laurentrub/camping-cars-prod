import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const isEmail = (s: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s);

function makeReference() {
  const rnd = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `RES-${rnd}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }

  const { vehicle_id, first_name, last_name, email, phone, message } = body ?? {};
  if (!vehicle_id || typeof vehicle_id !== "string") return json(400, { error: "vehicle_id requis" });
  if (!first_name || first_name.length > 100) return json(400, { error: "Prénom invalide" });
  if (!last_name || last_name.length > 100) return json(400, { error: "Nom invalide" });
  if (!email || !isEmail(email)) return json(400, { error: "Email invalide" });
  if (phone && phone.length > 30) return json(400, { error: "Téléphone invalide" });
  if (message && message.length > 2000) return json(400, { error: "Message trop long" });

  // Fetch vehicle
  const { data: vehicle, error: vErr } = await admin
    .from("vehicles")
    .select("id, title, slug, status, deposit_override")
    .eq("id", vehicle_id)
    .maybeSingle();
  if (vErr || !vehicle) return json(404, { error: "Véhicule introuvable" });
  if (vehicle.status !== "disponible") {
    return json(409, { error: "Ce véhicule n'est plus disponible à la réservation" });
  }

  // Fetch settings
  const { data: settings } = await admin.from("bank_settings").select("default_deposit_amount, hold_days").eq("singleton", true).maybeSingle();
  const depositAmount = Number(vehicle.deposit_override ?? settings?.default_deposit_amount ?? 1000);
  const holdDays = Number(settings?.hold_days ?? 7);
  const expiresAt = new Date(Date.now() + holdDays * 86400000).toISOString();

  // Create reservation with unique reference (retry on rare collision)
  let reference = makeReference();
  let inserted: any = null;
  for (let i = 0; i < 3; i++) {
    const { data, error } = await admin.from("reservations").insert({
      vehicle_id, reference, first_name, last_name, email, phone: phone || null, message: message || null,
      deposit_amount: depositAmount, expires_at: expiresAt,
    }).select().single();
    if (!error) { inserted = data; break; }
    if (error.code === "23505") { reference = makeReference(); continue; }
    return json(500, { error: error.message });
  }
  if (!inserted) return json(500, { error: "Impossible de générer une référence" });

  // Mark vehicle as pre_reserve
  await admin.from("vehicles").update({ status: "pre_reserve", reserved_until: expiresAt }).eq("id", vehicle_id);

  return json(200, { reservation: inserted });
});
