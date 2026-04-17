import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Inbox, BadgeEuro, Sparkles } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ vehicles: 0, leads: 0, available: 0, newLeads: 0 });

  useEffect(() => {
    (async () => {
      const [v, vAvail, l, lNew] = await Promise.all([
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "disponible"),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "nouveau"),
      ]);
      setStats({
        vehicles: v.count ?? 0,
        available: vAvail.count ?? 0,
        leads: l.count ?? 0,
        newLeads: lNew.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Véhicules", value: stats.vehicles, icon: Truck, to: "/admin/vehicles" },
    { label: "Disponibles", value: stats.available, icon: Sparkles, to: "/admin/vehicles" },
    { label: "Demandes", value: stats.leads, icon: Inbox, to: "/admin/leads" },
    { label: "Nouvelles demandes", value: stats.newLeads, icon: BadgeEuro, to: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">Vue d'ensemble de votre activité.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-smooth hover:shadow-card hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 font-serif text-3xl font-semibold">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-accent/30 bg-accent-soft/40 p-6">
        <h2 className="font-serif text-lg font-semibold">Astuce</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Utilisez la section <strong>Véhicules</strong> pour ajouter, modifier ou marquer comme vendus vos camping-cars. Les nouvelles demandes clients apparaissent dans <strong>Demandes</strong>.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
