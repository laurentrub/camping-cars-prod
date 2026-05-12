import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, Trash2, Mail, Phone, ImageIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/types";
import { Database } from "@/integrations/supabase/types";

type TradeIn = Database["public"]["Tables"]["trade_ins"]["Row"];
type TradeInStatus = Database["public"]["Enums"]["trade_in_status"];

const STATUS_LABELS: Record<TradeInStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  estime: "Estimé",
  refuse: "Refusé",
  archive: "Archivé",
};

const STATUS_COLORS: Record<TradeInStatus, string> = {
  nouveau: "bg-accent text-accent-foreground",
  en_cours: "bg-primary text-primary-foreground",
  estime: "bg-emerald-600 text-white",
  refuse: "bg-destructive text-destructive-foreground",
  archive: "bg-muted text-muted-foreground",
};

const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excellent",
  bon: "Bon",
  moyen: "Moyen",
  a_renover: "À rénover",
};

const TYPE_LABELS: Record<string, string> = {
  profile: "Profilé",
  integral: "Intégral",
  fourgon: "Fourgon",
  capucine: "Capucine",
};

const AdminTradeIns = () => {
  const [items, setItems] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TradeInStatus | "all">("all");
  const [selected, setSelected] = useState<TradeIn | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trade_ins")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Erreur de chargement");
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: TradeInStatus) => {
    const { error } = await supabase.from("trade_ins").update({ status }).eq("id", id);
    if (error) toast.error("Erreur de mise à jour");
    else {
      toast.success("Statut mis à jour");
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    const { error } = await supabase.from("trade_ins").delete().eq("id", id);
    if (error) toast.error("Erreur de suppression");
    else {
      toast.success("Demande supprimée");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelected(null);
    }
  };

  const openDetails = async (item: TradeIn) => {
    setSelected(item);
    setPhotoUrls([]);
    if (item.photos && item.photos.length > 0) {
      const urls: string[] = [];
      for (const path of item.photos) {
        const { data } = await supabase.storage
          .from("trade-in-photos")
          .createSignedUrl(path, 3600);
        if (data?.signedUrl) urls.push(data.signedUrl);
      }
      setPhotoUrls(urls);
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = (filter === "all" ? items : items.filter((i) => i.status === filter)).filter((i) => {
    if (!q) return true;
    return [i.first_name, i.last_name, i.email, i.phone, i.brand, i.model, String(i.year)]
      .filter(Boolean)
      .some((s) => String(s).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Demandes de reprise</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} demande{items.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as TradeInStatus | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par client, email, marque, modèle…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          Aucune demande {filter !== "all" && `« ${STATUS_LABELS[filter]} »`}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Véhicule</th>
                  <th className="px-4 py-3 text-left">Année / km</th>
                  <th className="px-4 py-3 text-left">Estimation</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Reçu le</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 transition-smooth hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.first_name} {item.last_name}</div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.brand} {item.model}</div>
                      <div className="text-xs text-muted-foreground">
                        {TYPE_LABELS[item.vehicle_type]} · {CONDITION_LABELS[item.condition]}
                        {item.photos && item.photos.length > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> {item.photos.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{item.year}</div>
                      <div className="text-muted-foreground">{item.mileage.toLocaleString("fr-FR")} km</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {item.estimate_low && item.estimate_high ? (
                        <span className="font-medium text-foreground">
                          {formatPrice(Number(item.estimate_low))} – {formatPrice(Number(item.estimate_high))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openDetails(item)} aria-label="Détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(item.id)} aria-label="Supprimer">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  {selected.brand} {selected.model} ({selected.year})
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status & estimate */}
                <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/50 p-4">
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as TradeInStatus)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selected.estimate_low && selected.estimate_high && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Estimation : </span>
                      <strong>{formatPrice(Number(selected.estimate_low))} – {formatPrice(Number(selected.estimate_high))}</strong>
                    </div>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <h3 className="font-semibold">Client</h3>
                  <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                    <div>{selected.first_name} {selected.last_name}</div>
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-accent hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {selected.email}
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-accent hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {selected.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <h3 className="font-semibold">Véhicule</h3>
                  <dl className="mt-2 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Type</dt><dd>{TYPE_LABELS[selected.vehicle_type]}</dd></div>
                    <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">État</dt><dd>{CONDITION_LABELS[selected.condition]}</dd></div>
                    <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Année</dt><dd>{selected.year}</dd></div>
                    <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Kilométrage</dt><dd>{selected.mileage.toLocaleString("fr-FR")} km</dd></div>
                    {selected.fuel && <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Carburant</dt><dd>{selected.fuel}</dd></div>}
                    {selected.seats != null && <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Places</dt><dd>{selected.seats}</dd></div>}
                    {selected.length_cm != null && <div className="flex justify-between border-b border-border pb-1"><dt className="text-muted-foreground">Longueur</dt><dd>{(selected.length_cm / 100).toFixed(2)} m</dd></div>}
                  </dl>
                </div>

                {selected.message && (
                  <div>
                    <h3 className="font-semibold">Message du client</h3>
                    <p className="mt-2 whitespace-pre-wrap rounded-lg bg-secondary/40 p-3 text-sm">{selected.message}</p>
                  </div>
                )}

                {selected.ai_analysis && (
                  <div>
                    <h3 className="font-semibold">Analyse IA</h3>
                    <p className="mt-2 rounded-lg bg-accent-soft/40 p-3 text-sm">{selected.ai_analysis}</p>
                  </div>
                )}

                {photoUrls.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Photos ({photoUrls.length})</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {photoUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-lg border border-border">
                          <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover transition-smooth hover:scale-105" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTradeIns;
