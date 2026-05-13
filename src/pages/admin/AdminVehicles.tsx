import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TYPE_LABELS, formatPrice } from "@/lib/types";
import { resolveImage } from "@/hooks/useVehicles";

const slugify = (s: string) =>
  s.toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/^-+|-+$/g, "");

const empty = {
  id: "" as string | null,
  slug: "",
  title: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 50000,
  type: "profile" as "profile"|"integral"|"fourgon"|"capucine",
  condition: "occasion" as "neuf"|"occasion",
  status: "disponible" as "disponible"|"pre_reserve"|"reserve"|"vendu",
  deposit_override: "" as string | number,
  seats: 4,
  beds: 4,
  mileage: 0,
  fuel: "Diesel",
  transmission: "Boîte manuelle",
  power_hp: 140,
  length_cm: 700,
  short_description: "",
  description: "",
  features: "",
  cover_image: "",
  is_featured: false,
};

type FormState = typeof empty;

const AdminVehicles = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startEdit = (v: any) => {
    setForm({
      ...empty, ...v,
      features: (v.features ?? []).join(", "),
      cover_image: v.cover_image ?? "",
    });
    setOpen(true);
  };

  const startNew = () => { setForm(empty); setOpen(true); };

  const save = async () => {
    const payload = {
      slug: form.slug || slugify(`${form.brand}-${form.model}-${form.year}`),
      title: form.title, brand: form.brand, model: form.model,
      year: Number(form.year), price: Number(form.price),
      type: form.type, condition: form.condition, status: form.status,
      seats: Number(form.seats), beds: Number(form.beds),
      mileage: Number(form.mileage) || null,
      fuel: form.fuel || null, transmission: form.transmission || null,
      power_hp: Number(form.power_hp) || null, length_cm: Number(form.length_cm) || null,
      short_description: form.short_description || null,
      description: form.description,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      cover_image: form.cover_image || null,
      is_featured: form.is_featured,
      deposit_override: form.deposit_override === "" || form.deposit_override === null ? null : Number(form.deposit_override),
    };
    const { error } = form.id
      ? await supabase.from("vehicles").update(payload).eq("id", form.id)
      : await supabase.from("vehicles").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Véhicule mis à jour" : "Véhicule ajouté");
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Supprimé");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Véhicules</h1>
          <p className="mt-1 text-sm text-muted-foreground">{list.length} véhicule{list.length > 1 ? "s" : ""} dans le catalogue.</p>
        </div>
        <Button variant="hero" onClick={startNew}><Plus className="h-4 w-4" /> Ajouter</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        {loading ? (
          <div className="p-8 text-sm text-muted-foreground">Chargement…</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Aucun véhicule. Cliquez sur Ajouter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Véhicule</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">État</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((v) => (
                  <tr key={v.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {v.cover_image && <img src={resolveImage(v.cover_image) ?? ""} alt="" loading="lazy" width={64} height={48} className="h-12 w-16 rounded object-cover" />}
                        <div>
                          <div className="font-medium">{v.title}</div>
                          <div className="text-xs text-muted-foreground">{v.brand} · {v.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{TYPE_LABELS[v.type as keyof typeof TYPE_LABELS]}</td>
                    <td className="px-4 py-3 capitalize">{v.condition}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(v.price)}</td>
                    <td className="px-4 py-3 capitalize">{v.status}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(v)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => del(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Modifier le véhicule" : "Nouveau véhicule"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5"><Label>Titre *</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Marque *</Label><Input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Modèle *</Label><Input value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Année</Label><Input type="number" value={form.year} onChange={(e) => setForm({...form, year: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Prix (€)</Label><Input type="number" value={form.price} onChange={(e) => setForm({...form, price: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Type</Label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={(e) => setForm({...form, type: e.target.value as any})}>
                <option value="profile">Profilé</option><option value="integral">Intégral</option><option value="fourgon">Fourgon</option><option value="capucine">Capucine</option>
              </select>
            </div>
            <div className="space-y-1.5"><Label>État</Label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.condition} onChange={(e) => setForm({...form, condition: e.target.value as any})}>
                <option value="neuf">Neuf</option><option value="occasion">Occasion</option>
              </select>
            </div>
            <div className="space-y-1.5"><Label>Statut</Label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({...form, status: e.target.value as any})}>
                <option value="disponible">Disponible</option><option value="pre_reserve">Pré-réservé</option><option value="reserve">Réservé</option><option value="vendu">Vendu</option>
              </select>
            </div>
            <div className="space-y-1.5"><Label>Acompte personnalisé (€)</Label><Input type="number" value={form.deposit_override} onChange={(e) => setForm({...form, deposit_override: e.target.value})} placeholder="Vide = montant par défaut" /></div>
            <div className="space-y-1.5"><Label>Places</Label><Input type="number" value={form.seats} onChange={(e) => setForm({...form, seats: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Couchages</Label><Input type="number" value={form.beds} onChange={(e) => setForm({...form, beds: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Kilométrage</Label><Input type="number" value={form.mileage} onChange={(e) => setForm({...form, mileage: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Carburant</Label><Input value={form.fuel} onChange={(e) => setForm({...form, fuel: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Boîte</Label><Input value={form.transmission} onChange={(e) => setForm({...form, transmission: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Puissance (ch)</Label><Input type="number" value={form.power_hp} onChange={(e) => setForm({...form, power_hp: +e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Longueur (cm)</Label><Input type="number" value={form.length_cm} onChange={(e) => setForm({...form, length_cm: +e.target.value})} /></div>
            <div className="sm:col-span-2 space-y-1.5"><Label>URL image principale</Label><Input value={form.cover_image} onChange={(e) => setForm({...form, cover_image: e.target.value})} placeholder="https://… ou /src/assets/…" /></div>
            <div className="sm:col-span-2 space-y-1.5"><Label>Résumé court</Label><Input value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} /></div>
            <div className="sm:col-span-2 space-y-1.5"><Label>Description complète *</Label><Textarea rows={5} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
            <div className="sm:col-span-2 space-y-1.5"><Label>Équipements (séparés par des virgules)</Label><Textarea rows={2} value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} /></div>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({...form, is_featured: e.target.checked})} />
              Mettre en avant sur la page d'accueil
            </label>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="elegant" onClick={() => setOpen(false)}>Annuler</Button>
            <Button variant="hero" onClick={save}>{form.id ? "Enregistrer" : "Créer"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVehicles;
