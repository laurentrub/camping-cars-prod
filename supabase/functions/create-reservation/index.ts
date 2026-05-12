import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const isEmail = (s: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s);
const isISODate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

function makeReference() {
  const rnd = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `VIS-${rnd}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }

  const { vehicle_id, first_name, last_name, email, phone, message, requested_visit_date, requested_time_slot } = body ?? {};
  if (!vehicle_id || typeof vehicle_id !== "string") return json(400, { error: "vehicle_id requis" });
  if (!first_name || first_name.length > 100) return json(400, { error: "Prénom invalide" });
  if (!last_name || last_name.length > 100) return json(400, { error: "Nom invalide" });
  if (!email || !isEmail(email)) return json(400, { error: "Email invalide" });
  if (phone && phone.length > 30) return json(400, { error: "Téléphone invalide" });
  if (message && message.length > 2000) return json(400, { error: "Message trop long" });
  if (!requested_visit_date || !isISODate(requested_visit_date)) return json(400, { error: "Date de visite invalide" });
  if (requested_time_slot && !["matin", "apres_midi"].includes(requested_time_slot)) {
    return json(400, { error: "Créneau invalide" });
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const visitDate = new Date(requested_visit_date + "T00:00:00");
  if (isNaN(visitDate.getTime()) || visitDate < today) {
    return json(400, { error: "La date de visite doit être future" });
  }
  const maxDate = new Date(today.getTime() + 180 * 86400000);
  if (visitDate > maxDate) return json(400, { error: "Date trop éloignée (max 6 mois)" });

  const { data: vehicle, error: vErr } = await admin
    .from("vehicles")
    .select("id, title, slug, status")
    .eq("id", vehicle_id)
    .maybeSingle();
  if (vErr || !vehicle) return json(404, { error: "Véhicule introuvable" });
  if (vehicle.status === "vendu") {
    return json(409, { error: "Ce véhicule n'est plus disponible" });
  }

  let reference = makeReference();
  let inserted: any = null;
  for (let i = 0; i < 3; i++) {
    const { data, error } = await admin.from("reservations").insert({
      vehicle_id,
      reference,
      first_name,
      last_name,
      email,
      phone: phone || null,
      message: message || null,
      requested_visit_date,
      requested_time_slot: requested_time_slot || null,
      status: "demande_visite",
    }).select().single();
    if (!error) { inserted = data; break; }
    if (error.code === "23505") { reference = makeReference(); continue; }
    return json(500, { error: error.message });
  }
  if (!inserted) return json(500, { error: "Impossible de générer une référence" });

  return json(200, { reservation: inserted });
});
