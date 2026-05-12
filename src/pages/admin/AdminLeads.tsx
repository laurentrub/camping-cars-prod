import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Calendar, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traité" },
  { value: "archive", label: "Archivé" },
];

const TYPE_LABEL: Record<string, string> = {
  contact: "Contact", rappel: "Rappel", vehicule: "Véhicule", reprise: "Reprise", financement: "Financement",
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*, vehicles(title, slug)")
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = filter === "all" ? leads : leads.filter((l) => l.status === filter);
    if (q) {
      out = out.filter((l) =>
        [l.first_name, l.last_name, l.email, l.phone, l.message, l.vehicles?.title]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(q)),
      );
    }
    return out;
  }, [leads, filter, query]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Demandes clients</h1>
      <p className="mt-1 text-sm text-muted-foreground">{leads.length} demande{leads.length > 1 ? "s" : ""} reçues.</p>

      <div className="mt-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, email, téléphone, message…"
          className="pl-9"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", filter === "all" ? "border-accent bg-accent text-accent-foreground" : "border-border")}>Toutes</button>
        {STATUS_OPTS.map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", filter === s.value ? "border-accent bg-accent text-accent-foreground" : "border-border")}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Aucune demande.</div>}
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold">{l.first_name} {l.last_name}</h3>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">{TYPE_LABEL[l.type] ?? l.type}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-accent"><Mail className="h-3 w-3" /> {l.email}</a>
                  {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-accent"><Phone className="h-3 w-3" /> {l.phone}</a>}
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(l.created_at).toLocaleString("fr-FR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-xs">
                  {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <Button variant="ghost" size="icon" onClick={() => del(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            {l.vehicles && (
              <div className="mt-3 inline-block rounded-md bg-secondary px-3 py-1 text-xs">
                Véhicule : <strong>{l.vehicles.title}</strong>
              </div>
            )}
            {l.message && <p className="mt-3 whitespace-pre-line text-sm text-foreground">{l.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLeads;
