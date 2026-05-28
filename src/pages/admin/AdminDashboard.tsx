import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Truck, Inbox, Sparkles, BookmarkCheck, Repeat, CalendarCheck } from "lucide-react";

type ActivityItem = {
  id: string;
  type: "reservation" | "lead" | "trade_in";
  label: string;
  sub: string;
  date: string;
  to: string;
};

const AdminDashboard = () => {
  const { isAdmin, isTeam, user } = useAuth();
  const [stats, setStats] = useState({
    vehicles: 0,
    available: 0,
    pendingVisits: 0,
    confirmedVisits: 0,
    newLeads: 0,
    newTradeIns: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        const [v, vAvail, rPending, rConfirmed, l, ti] = await Promise.all([
          supabase.from("vehicles").select("*", { count: "exact", head: true }),
          supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "disponible"),
          supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "demande_visite"),
          supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "visite_confirmee"),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "nouveau"),
          supabase.from("trade_ins").select("*", { count: "exact", head: true }).eq("status", "nouveau"),
        ]);
        setStats({
          vehicles: v.count ?? 0,
          available: vAvail.count ?? 0,
          pendingVisits: rPending.count ?? 0,
          confirmedVisits: rConfirmed.count ?? 0,
          newLeads: l.count ?? 0,
          newTradeIns: ti.count ?? 0,
        });

        const [recentRes, recentLeads, recentTi] = await Promise.all([
          supabase.from("reservations").select("id, reference, first_name, last_name, status, created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("leads").select("id, first_name, last_name, type, status, created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("trade_ins").select("id, first_name, last_name, status, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

        const items: ActivityItem[] = [
          ...(recentRes.data ?? []).map((r) => ({
            id: r.id,
            type: "reservation" as const,
            label: `${r.first_name} ${r.last_name}`,
            sub: `Visite · ${r.reference}`,
            date: r.created_at,
            to: "/admin/reservations",
          })),
          ...(recentLeads.data ?? []).map((l) => ({
            id: l.id,
            type: "lead" as const,
            label: `${l.first_name} ${l.last_name}`,
            sub: `Demande · ${l.type}`,
            date: l.created_at,
            to: "/admin/leads",
          })),
          ...(recentTi.data ?? []).map((t) => ({
            id: t.id,
            type: "trade_in" as const,
            label: `${t.first_name} ${t.last_name}`,
            sub: "Reprise",
            date: t.created_at,
            to: "/admin/trade-ins",
          })),
        ]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 8);

        setActivity(items);
      } else if (isTeam && user) {
        const [v, vAvail, rPending, rConfirmed] = await Promise.all([
          supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("created_by", user.id),
          supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("created_by", user.id).eq("status", "disponible"),
          supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "demande_visite"),
          supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "visite_confirmee"),
        ]);
        setStats({
          vehicles: v.count ?? 0,
          available: vAvail.count ?? 0,
          pendingVisits: rPending.count ?? 0,
          confirmedVisits: rConfirmed.count ?? 0,
          newLeads: 0,
          newTradeIns: 0,
        });

        const { data: recentRes } = await supabase
          .from("reservations")
          .select("id, reference, first_name, last_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8);

        setActivity(
          (recentRes ?? []).map((r) => ({
            id: r.id,
            type: "reservation" as const,
            label: `${r.first_name} ${r.last_name}`,
            sub: `Visite · ${r.reference}`,
            date: r.created_at,
            to: "/admin/reservations",
          }))
        );
      }
    })();
  }, [isAdmin, isTeam, user]);

  const cards = isAdmin
    ? [
        { label: "Véhicules", value: stats.vehicles, icon: Truck, to: "/admin/vehicles" },
        { label: "Disponibles", value: stats.available, icon: Sparkles, to: "/admin/vehicles" },
        { label: "Visites à traiter", value: stats.pendingVisits, icon: BookmarkCheck, to: "/admin/reservations", urgent: stats.pendingVisits > 0 },
        { label: "Visites confirmées", value: stats.confirmedVisits, icon: CalendarCheck, to: "/admin/reservations" },
        { label: "Nouveaux leads", value: stats.newLeads, icon: Inbox, to: "/admin/leads", urgent: stats.newLeads > 0 },
        { label: "Reprises à traiter", value: stats.newTradeIns, icon: Repeat, to: "/admin/trade-ins", urgent: stats.newTradeIns > 0 },
      ]
    : [
        { label: "Mes véhicules", value: stats.vehicles, icon: Truck, to: "/admin/vehicles" },
        { label: "Disponibles", value: stats.available, icon: Sparkles, to: "/admin/vehicles" },
        { label: "Visites à traiter", value: stats.pendingVisits, icon: BookmarkCheck, to: "/admin/reservations", urgent: stats.pendingVisits > 0 },
        { label: "Visites confirmées", value: stats.confirmedVisits, icon: CalendarCheck, to: "/admin/reservations" },
      ];

  const typeColor = (type: ActivityItem["type"]) => {
    if (type === "reservation") return "bg-amber-100 text-amber-800";
    if (type === "lead") return "bg-sky-100 text-sky-800";
    return "bg-violet-100 text-violet-800";
  };

  const typeLabel = (type: ActivityItem["type"]) => {
    if (type === "reservation") return "Visite";
    if (type === "lead") return "Lead";
    return "Reprise";
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">Vue d'ensemble de votre activité.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={`group rounded-xl border bg-card p-5 shadow-soft transition-smooth hover:shadow-card hover:-translate-y-0.5 ${
              c.urgent ? "border-amber-300 bg-amber-50" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <c.icon className={`h-4 w-4 ${c.urgent ? "text-amber-600" : "text-accent"}`} />
            </div>
            <div className={`mt-3 font-serif text-3xl font-semibold ${c.urgent ? "text-amber-700" : ""}`}>
              {c.value}
            </div>
          </Link>
        ))}
      </div>

      {activity.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold">Activité récente</h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card shadow-soft">
            {activity.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-smooth hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeColor(item.type)}`}>
                    {typeLabel(item.type)}
                  </span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                  {format(new Date(item.date), "d MMM à HH:mm", { locale: fr })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
