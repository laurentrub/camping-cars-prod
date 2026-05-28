// Admin users management edge function
// Lists auth users with their roles, allows promote/demote/delete role
// Verifies caller is authenticated and has admin role
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Non authentifié" }, 401);
    }

    // Verify caller identity using anon client + provided JWT
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Session invalide" }, 401);
    }
    const callerId = userData.user.id;

    // Service-role client for privileged ops
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Verify caller is admin
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return json({ error: "Accès réservé aux administrateurs" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 500);

      const ids = data.users.map((u) => u.id);
      const { data: roles } = await admin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

      const roleMap = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });

      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        roles: roleMap.get(u.id) ?? [],
      }));
      return json({ users });
    }

    if (action === "promote") {
      const target = body.user_id as string;
      if (!target) return json({ error: "user_id manquant" }, 400);
      const { error } = await admin
        .from("user_roles")
        .insert({ user_id: target, role: "admin" });
      if (error && !error.message.includes("duplicate")) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "demote") {
      const target = body.user_id as string;
      if (!target) return json({ error: "user_id manquant" }, 400);
      if (target === callerId) {
        return json({ error: "Vous ne pouvez pas vous retirer vos propres droits admin" }, 400);
      }
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", target)
        .eq("role", "admin");
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "promote_team") {
      const target = body.user_id as string;
      if (!target) return json({ error: "user_id manquant" }, 400);
      const { error } = await admin
        .from("user_roles")
        .insert({ user_id: target, role: "team" });
      if (error && !error.message.includes("duplicate")) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "demote_team") {
      const target = body.user_id as string;
      if (!target) return json({ error: "user_id manquant" }, 400);
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", target)
        .eq("role", "team");
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
