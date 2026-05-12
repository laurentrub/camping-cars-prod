import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Calendar, Trash2, CheckCircle2, XCircle, FileText, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/types";

const STATUS_OPTS = [
  { value: "demande_visite", label: "À traiter", color: "bg-amber-100 text-amber-900" },
  { value: "visite_confirmee", label: "Visite confirmée", color: "bg-emerald-100 text-emerald-900" },
  { value: "visite_realisee", label: "Visite réalisée", color: "bg-blue-100 text-blue-900" },
  { value: "annulee", label: "Annulée", color: "bg-zinc-200 text-zinc-700" },
];

const slotLabel = (s: string | null) => s === "matin" ? "Matin" : s === "apres_midi" ? "Après-midi" : "—";

const AdminReservations = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*, vehicles(id, title, slug, price, status)")
      .order("requested_visit_date", { ascending: true, nullsFirst: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const confirmVisit = async (r: any) => {
    const { error } = await supabase.from("reservations")
      .update({ status: "visite_confirmee", confirmed_visit_at: new Date().toISOString() })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Visite confirmée. Pensez à rappeler le client.");
    load();
  };

  const markRealised = async (r: any) => {
    if (!confirm("Marquer la visite comme réalisée ?")) return;
    await supabase.from("reservations").update({ status: "visite_realisee" }).eq("id", r.id);
    load();
  };

  const cancel = async (r: any) => {
    const reason = prompt("Raison de l'annulation ?", "");
    if (reason === null) return;
    const { error } = await supabase.from("reservations")
      .update({ status: "annulee", cancelled_at: new Date().toISOString(), cancellation_reason: reason || null })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Demande annulée.");
    load();
  };

  const saveNote = async (id: string, note: string) => {
    const { error } = await supabase.from("reservations").update({ admin_notes: note || null }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Note enregistrée");
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    await supabase.from("reservations").delete().eq("id", id);
    load();
  };

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== "all") out = out.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((r) =>
        r.reference.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.vehicles?.title?.toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    STATUS_OPTS.forEach((s) => c[s.value] = items.filter((r) => r.status === s.value).length);
    return c;
  }, [items]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Demandes de visite</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} demande{items.length > 1 ? "s" : ""} au total. À valider après contact téléphonique.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", filter === "all" ? "border-accent bg-accent text-accent-foreground" : "border-border")}>
          Toutes ({counts.all})
        </button>
        {STATUS_OPTS.map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", filter === s.value ? "border-accent bg-accent text-accent-foreground" : "border-border")}>
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
      </div>

      <Input placeholder="Rechercher par référence, email, nom ou véhicule…" value={search} onChange={(e) => setSearch(e.target.value)} className="mt-4 max-w-md" />

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Aucune demande.</div>}
        {filtered.map((r) => {
          const status = STATUS_OPTS.find((s) => s.value === r.status);
          const open = openId === r.id;
          const isPending = r.status === "demande_visite";
          const isConfirmed = r.status === "visite_confirmee";
          const visitDate = r.requested_visit_date
            ? format(new Date(r.requested_visit_date + "T00:00:00"), "EEE d MMM yyyy", { locale: fr })
            : "—";
          return (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold">{r.reference}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", status?.color)}>{status?.label}</span>
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-semibold">{r.first_name} {r.last_name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-accent"><Mail className="h-3 w-3" /> {r.email}</a>
                    {r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-accent"><Phone className="h-3 w-3" /> {r.phone}</a>}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Reçu le {new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isPending && (
                    <Button size="sm" variant="hero" onClick={() => confirmVisit(r)}>
                      <CheckCircle2 className="h-4 w-4" /> Valider la visite
                    </Button>
                  )}
                  {isConfirmed && (
                    <Button size="sm" variant="elegant" onClick={() => markRealised(r)}>
                      <CalendarCheck className="h-4 w-4" /> Visite réalisée
                    </Button>
                  )}
                  {(isPending || isConfirmed) && (
                    <Button size="sm" variant="ghost" onClick={() => cancel(r)}>
                      <XCircle className="h-4 w-4 text-destructive" /> Annuler
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => setOpenId(open ? null : r.id)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-md bg-accent/10 px-3 py-1 text-accent capitalize">
                  Visite : <strong>{visitDate}</strong> — {slotLabel(r.requested_time_slot)}
                </span>
                {r.vehicles && (
                  <span className="rounded-md bg-secondary px-3 py-1">
                    Véhicule : <strong>{r.vehicles.title}</strong> — {formatPrice(Number(r.vehicles.price))}
                  </span>
                )}
              </div>

              {r.message && <p className="mt-3 whitespace-pre-line rounded-md bg-secondary/50 p-3 text-sm">{r.message}</p>}

              {open && (
                <div className="mt-4 border-t border-border pt-4">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notes internes</label>
                  <Textarea
                    defaultValue={r.admin_notes ?? ""}
                    rows={3}
                    className="mt-2"
                    onBlur={(e) => { if (e.target.value !== (r.admin_notes ?? "")) saveNote(r.id, e.target.value); }}
                  />
                  {r.cancellation_reason && (
                    <p className="mt-3 text-xs text-muted-foreground">Raison annulation : {r.cancellation_reason}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReservations;
