import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Calendar, Trash2, CheckCircle2, XCircle, FileText, CalendarCheck, PhoneCall, Clock, History, MessageSquarePlus, Filter, X, CheckSquare, Square } from "lucide-react";
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
  { value: "contact_effectue", label: "Contact effectué", color: "bg-sky-100 text-sky-900" },
  { value: "en_attente_client", label: "Attente client", color: "bg-orange-100 text-orange-900" },
  { value: "visite_confirmee", label: "Visite confirmée", color: "bg-emerald-100 text-emerald-900" },
  { value: "visite_realisee", label: "Visite réalisée", color: "bg-blue-100 text-blue-900" },
  { value: "annulee", label: "Annulée", color: "bg-zinc-200 text-zinc-700" },
];

const statusLabel = (s?: string | null) =>
  STATUS_OPTS.find((o) => o.value === s)?.label ?? s ?? "—";
const slotLabel = (s: string | null) => s === "matin" ? "Matin" : s === "apres_midi" ? "Après-midi" : "—";

const AdminReservations = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [eventsByRes, setEventsByRes] = useState<Record<string, any[]>>({});
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [visitFrom, setVisitFrom] = useState("");
  const [visitTo, setVisitTo] = useState("");
  const [slotFilter, setSlotFilter] = useState<string>("all");

  const load = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*, vehicles(id, title, slug, price, status)")
      .order("requested_visit_date", { ascending: true, nullsFirst: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const loadEvents = async (reservationId: string) => {
    const { data, error } = await supabase
      .from("reservation_events")
      .select("*")
      .eq("reservation_id", reservationId)
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setEventsByRes((m) => ({ ...m, [reservationId]: data ?? [] }));
  };

  const toggleOpen = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) loadEvents(next);
  };

  const updateStatus = async (r: any, status: string, extra: Record<string, any> = {}) => {
    const { error } = await supabase.from("reservations").update({ status: status as any, ...extra }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Statut mis à jour");
    load();
    if (openId === r.id) loadEvents(r.id);
  };

  const logContact = async (r: any) => {
    const note = prompt("Résumé de l'appel (optionnel) :", "") ?? "";
    const { error: evErr } = await supabase.from("reservation_events").insert({
      reservation_id: r.id,
      event_type: "phone_contact",
      note: note || "Contact téléphonique effectué",
    });
    if (evErr) return toast.error(evErr.message);
    if (r.status === "demande_visite") {
      await supabase.from("reservations").update({ status: "contact_effectue" as any }).eq("id", r.id);
    }
    toast.success("Contact enregistré");
    load();
    if (openId === r.id) loadEvents(r.id);
  };

  const addNote = async (r: any) => {
    const txt = (noteDraft[r.id] ?? "").trim();
    if (!txt) return;
    const { error } = await supabase.from("reservation_events").insert({
      reservation_id: r.id,
      event_type: "note",
      note: txt,
    });
    if (error) return toast.error(error.message);
    setNoteDraft((m) => ({ ...m, [r.id]: "" }));
    loadEvents(r.id);
    toast.success("Note ajoutée à l'historique");
  };

  const confirmVisit = (r: any) =>
    updateStatus(r, "visite_confirmee", { confirmed_visit_at: new Date().toISOString() });

  const markRealised = async (r: any) => {
    if (!confirm("Marquer la visite comme réalisée ?")) return;
    updateStatus(r, "visite_realisee");
  };

  const waitClient = (r: any) => updateStatus(r, "en_attente_client");

  const cancel = async (r: any) => {
    const reason = prompt("Raison de l'annulation ?", "");
    if (reason === null) return;
    updateStatus(r, "annulee", {
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason || null,
    });
  };

  const saveAdminNote = async (id: string, note: string) => {
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
    if (slotFilter !== "all") out = out.filter((r) => (r.requested_time_slot ?? "") === slotFilter);
    if (createdFrom) out = out.filter((r) => new Date(r.created_at) >= new Date(createdFrom + "T00:00:00"));
    if (createdTo) out = out.filter((r) => new Date(r.created_at) <= new Date(createdTo + "T23:59:59"));
    if (visitFrom) out = out.filter((r) => r.requested_visit_date && r.requested_visit_date >= visitFrom);
    if (visitTo) out = out.filter((r) => r.requested_visit_date && r.requested_visit_date <= visitTo);
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
  }, [items, filter, search, slotFilter, createdFrom, createdTo, visitFrom, visitTo]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    STATUS_OPTS.forEach((s) => c[s.value] = items.filter((r) => r.status === s.value).length);
    return c;
  }, [items]);

  const activeAdvancedCount =
    (slotFilter !== "all" ? 1 : 0) +
    (createdFrom ? 1 : 0) + (createdTo ? 1 : 0) +
    (visitFrom ? 1 : 0) + (visitTo ? 1 : 0);

  const resetAdvanced = () => {
    setSlotFilter("all"); setCreatedFrom(""); setCreatedTo(""); setVisitFrom(""); setVisitTo("");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Demandes de visite</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} demande{items.length > 1 ? "s" : ""} au total. Workflow :
        <span className="ml-1 font-medium text-foreground">À traiter → Contact effectué → Visite confirmée → Visite réalisée</span>.
      </p>

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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input placeholder="Rechercher par référence, email, nom ou véhicule…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        <Button variant="outline" size="sm" onClick={() => setShowAdvanced((v) => !v)}>
          <Filter className="h-4 w-4" /> Filtres avancés{activeAdvancedCount > 0 ? ` (${activeAdvancedCount})` : ""}
        </Button>
        {activeAdvancedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetAdvanced}>
            <X className="h-4 w-4" /> Réinitialiser
          </Button>
        )}
        <span className="text-xs text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
      </div>

      {showAdvanced && (
        <div className="mt-3 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date de demande</label>
            <div className="mt-2 flex items-center gap-2">
              <Input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} />
              <span className="text-xs text-muted-foreground">→</span>
              <Input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date de rendez-vous</label>
            <div className="mt-2 flex items-center gap-2">
              <Input type="date" value={visitFrom} onChange={(e) => setVisitFrom(e.target.value)} />
              <span className="text-xs text-muted-foreground">→</span>
              <Input type="date" value={visitTo} onChange={(e) => setVisitTo(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Créneau</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { v: "all", l: "Tous" },
                { v: "matin", l: "Matin" },
                { v: "apres_midi", l: "Après-midi" },
              ].map((o) => (
                <button key={o.v} onClick={() => setSlotFilter(o.v)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", slotFilter === o.v ? "border-accent bg-accent text-accent-foreground" : "border-border")}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Aucune demande.</div>}
        {filtered.map((r) => {
          const status = STATUS_OPTS.find((s) => s.value === r.status);
          const open = openId === r.id;
          const isPending = r.status === "demande_visite";
          const isContacted = r.status === "contact_effectue";
          const isWaiting = r.status === "en_attente_client";
          const isConfirmed = r.status === "visite_confirmee";
          const isFinal = r.status === "visite_realisee" || r.status === "annulee";
          const visitDate = r.requested_visit_date
            ? format(new Date(r.requested_visit_date + "T00:00:00"), "EEE d MMM yyyy", { locale: fr })
            : "—";
          const events = eventsByRes[r.id] ?? [];
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
                  {!isFinal && (
                    <Button size="sm" variant="outline" onClick={() => logContact(r)} title="Enregistrer un appel téléphonique">
                      <PhoneCall className="h-4 w-4" /> Contact effectué
                    </Button>
                  )}
                  {(isContacted || isWaiting) && (
                    <Button size="sm" variant="hero" onClick={() => confirmVisit(r)}>
                      <CheckCircle2 className="h-4 w-4" /> Valider la visite
                    </Button>
                  )}
                  {isPending && (
                    <Button size="sm" variant="hero" onClick={() => confirmVisit(r)}>
                      <CheckCircle2 className="h-4 w-4" /> Valider directement
                    </Button>
                  )}
                  {(isContacted) && (
                    <Button size="sm" variant="ghost" onClick={() => waitClient(r)} title="Le client doit revenir vers nous">
                      <Clock className="h-4 w-4" /> Attente client
                    </Button>
                  )}
                  {isConfirmed && (
                    <Button size="sm" variant="elegant" onClick={() => markRealised(r)}>
                      <CalendarCheck className="h-4 w-4" /> Visite réalisée
                    </Button>
                  )}
                  {!isFinal && (
                    <Button size="sm" variant="ghost" onClick={() => cancel(r)}>
                      <XCircle className="h-4 w-4 text-destructive" /> Annuler
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => toggleOpen(r.id)} title="Détails et historique">
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
                <div className="mt-4 space-y-5 border-t border-border pt-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notes internes (résumé)</label>
                    <Textarea
                      defaultValue={r.admin_notes ?? ""}
                      rows={3}
                      className="mt-2"
                      onBlur={(e) => { if (e.target.value !== (r.admin_notes ?? "")) saveAdminNote(r.id, e.target.value); }}
                    />
                    {r.cancellation_reason && (
                      <p className="mt-2 text-xs text-muted-foreground">Raison annulation : {r.cancellation_reason}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <History className="h-3.5 w-3.5" /> Historique ({events.length})
                      </label>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Ajouter une entrée à l'historique…"
                        value={noteDraft[r.id] ?? ""}
                        onChange={(e) => setNoteDraft((m) => ({ ...m, [r.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNote(r); } }}
                      />
                      <Button size="sm" variant="outline" onClick={() => addNote(r)}>
                        <MessageSquarePlus className="h-4 w-4" /> Ajouter
                      </Button>
                    </div>

                    <ol className="mt-4 space-y-3">
                      {events.length === 0 && (
                        <li className="text-xs text-muted-foreground">Aucun événement enregistré.</li>
                      )}
                      {events.map((ev) => (
                        <li key={ev.id} className="relative flex gap-3 pl-4">
                          <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-accent" />
                          <div className="flex-1 text-sm">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <time dateTime={ev.created_at}>
                                {format(new Date(ev.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                              </time>
                              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                                {ev.event_type === "created" && "Création"}
                                {ev.event_type === "status_change" && "Statut"}
                                {ev.event_type === "phone_contact" && "Appel"}
                                {ev.event_type === "note" && "Note"}
                              </span>
                            </div>
                            {ev.event_type === "status_change" && (
                              <p className="mt-0.5">
                                <span className="text-muted-foreground">{statusLabel(ev.from_status)}</span>
                                <span className="mx-1">→</span>
                                <span className="font-medium">{statusLabel(ev.to_status)}</span>
                              </p>
                            )}
                            {ev.event_type === "created" && (
                              <p className="mt-0.5 text-muted-foreground">{ev.note ?? "Demande reçue"}</p>
                            )}
                            {(ev.event_type === "phone_contact" || ev.event_type === "note") && ev.note && (
                              <p className="mt-0.5 whitespace-pre-line">{ev.note}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
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
