import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Repeat,
  Sparkles,
  ShieldCheck,
  Banknote,
  Camera,
  X,
  Loader2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/types";
import showroom from "@/assets/showroom.jpg";

const tradeInSchema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis").max(100),
  last_name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  brand: z.string().trim().min(1, "Marque requise").max(80),
  model: z.string().trim().min(1, "Modèle requis").max(120),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().int().min(0).max(2000000),
  vehicle_type: z.enum(["profile", "integral", "fourgon", "capucine"]),
  condition: z.enum(["excellent", "bon", "moyen", "a_renover"]),
  fuel: z.string().trim().max(40).optional().or(z.literal("")),
  seats: z.coerce.number().int().min(0).max(12).optional().or(z.literal("")),
  length_cm: z.coerce.number().int().min(0).max(2000).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

interface EstimateResult {
  estimate: { low: number; high: number };
  local: { low: number; high: number };
  analysis: string | null;
}

const ARGUMENTS = [
  { icon: Banknote, title: "Paiement sous 48h", text: "Virement bancaire sécurisé une fois la reprise actée." },
  { icon: ShieldCheck, title: "Estimation transparente", text: "Barème objectif basé sur la cote du marché et l'état déclaré." },
  { icon: Sparkles, title: "Tous types acceptés", text: "Profilé, intégral, fourgon, capucine — même non-roulant." },
];

const Reprise = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [estimating, setEstimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 8 - photos.length;
    const accepted: File[] = [];
    for (const f of files.slice(0, remaining)) {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} : format non supporté`);
        continue;
      }
      if (f.size > 8 * 1024 * 1024) {
        toast.error(`${f.name} : 8 Mo max`);
        continue;
      }
      accepted.push(f);
    }
    setPhotos((prev) => [...prev, ...accepted]);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const collectFormData = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const raw = {
      first_name: String(fd.get("first_name") ?? ""),
      last_name: String(fd.get("last_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      brand: String(fd.get("brand") ?? ""),
      model: String(fd.get("model") ?? ""),
      year: String(fd.get("year") ?? ""),
      mileage: String(fd.get("mileage") ?? ""),
      vehicle_type: String(fd.get("vehicle_type") ?? ""),
      condition: String(fd.get("condition") ?? ""),
      fuel: String(fd.get("fuel") ?? ""),
      seats: String(fd.get("seats") ?? ""),
      length_cm: String(fd.get("length_cm") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    return tradeInSchema.safeParse(raw);
  };

  const handleEstimate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const parsed = collectFormData(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Renseignez les champs véhicule");
      return;
    }
    setEstimating(true);
    setEstimate(null);
    try {
      const { data, error } = await supabase.functions.invoke("estimate-trade-in", {
        body: {
          brand: parsed.data.brand,
          model: parsed.data.model,
          year: parsed.data.year,
          mileage: parsed.data.mileage,
          vehicle_type: parsed.data.vehicle_type,
          condition: parsed.data.condition,
          fuel: parsed.data.fuel || null,
          seats: parsed.data.seats ? Number(parsed.data.seats) : null,
          length_cm: parsed.data.length_cm ? Number(parsed.data.length_cm) : null,
          message: parsed.data.message || null,
        },
      });
      if (error) throw error;
      setEstimate(data as EstimateResult);
      // Smooth scroll to estimate panel
      setTimeout(() => {
        document.getElementById("estimate-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      const msg = err?.context?.status === 429
        ? "Trop de requêtes, réessayez dans un instant."
        : err?.context?.status === 402
        ? "Service d'estimation IA indisponible — un conseiller vous recontactera."
        : "Impossible de calculer l'estimation. Réessayez ou envoyez la demande pour un devis manuel.";
      toast.error(msg);
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = collectFormData(e.currentTarget);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire incomplet");
      return;
    }
    setSubmitting(true);
    try {
      // Upload photos first
      const uploadedPaths: string[] = [];
      if (photos.length > 0) {
        const folder = crypto.randomUUID();
        for (const file of photos) {
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const path = `${folder}/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("trade-in-photos")
            .upload(path, file, { contentType: file.type, upsert: false });
          if (upErr) {
            console.error("upload error", upErr);
            toast.error(`Échec upload ${file.name}`);
          } else {
            uploadedPaths.push(path);
          }
        }
      }

      const { error } = await supabase.from("trade_ins").insert({
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        brand: parsed.data.brand,
        model: parsed.data.model,
        year: parsed.data.year,
        mileage: parsed.data.mileage,
        vehicle_type: parsed.data.vehicle_type,
        condition: parsed.data.condition,
        fuel: parsed.data.fuel || null,
        seats: parsed.data.seats ? Number(parsed.data.seats) : null,
        length_cm: parsed.data.length_cm ? Number(parsed.data.length_cm) : null,
        message: parsed.data.message || null,
        estimate_low: estimate?.estimate.low ?? null,
        estimate_high: estimate?.estimate.high ?? null,
        ai_analysis: estimate?.analysis ?? null,
        photos: uploadedPaths,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Demande envoyée — un conseiller vous recontacte sous 24h.");
    } catch (err: any) {
      console.error(err);
      toast.error("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Demande de reprise envoyée | Horizon Évasion"
          description="Votre demande de reprise a bien été enregistrée."
        />
        <section className="container-prose flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold md:text-4xl">Demande bien reçue</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Un expert reprises analyse votre dossier et vous recontacte sous 24h ouvrées avec une offre ferme.
            {estimate && (
              <>
                {" "}Pour rappel, votre fourchette indicative était de{" "}
                <strong className="text-foreground">
                  {formatPrice(estimate.estimate.low)} – {formatPrice(estimate.estimate.high)}
                </strong>.
              </>
            )}
          </p>
          <Button asChild variant="elegant" className="mt-8">
            <a href="/">Retour à l'accueil</a>
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Reprise de camping-car — Estimation gratuite en ligne | Horizon Évasion"
        description="Faites estimer votre camping-car en quelques minutes. Reprise transparente, paiement sous 48h, tous types et toutes marques acceptés."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-deep py-20 text-primary-foreground">
        <img src={showroom} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="container-prose relative">
          <div className="flex items-center gap-2 text-accent">
            <Repeat className="h-5 w-5" />
            <span className="eyebrow !text-accent">Reprise</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Estimez votre camping-car en quelques minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Renseignez les caractéristiques de votre véhicule et obtenez une fourchette d'estimation immédiate, affinée par notre expertise du marché. Paiement comptant sous 48h après validation.
          </p>
        </div>
      </section>

      {/* Arguments */}
      <section className="border-b border-border bg-secondary/40 py-10">
        <div className="container-prose grid gap-6 md:grid-cols-3">
          {ARGUMENTS.map((a) => (
            <div key={a.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold">
                <a.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="container-prose py-16">
        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {/* Vehicle */}
            <fieldset className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-soft">
              <legend className="px-2">
                <span className="eyebrow">Étape 1</span>
                <h2 className="mt-1 font-serif text-2xl font-semibold">Votre véhicule</h2>
              </legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Marque *</Label>
                  <Input id="brand" name="brand" placeholder="Hymer, Pilote, Chausson…" required maxLength={80} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="model">Modèle *</Label>
                  <Input id="model" name="model" placeholder="B-Klasse 678, P746GJ…" required maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="year">Année *</Label>
                  <Input id="year" name="year" type="number" min={1970} max={new Date().getFullYear() + 1} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mileage">Kilométrage *</Label>
                  <Input id="mileage" name="mileage" type="number" min={0} max={2000000} placeholder="Ex : 45000" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vehicle_type">Type *</Label>
                  <Select name="vehicle_type" required>
                    <SelectTrigger id="vehicle_type"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profile">Profilé</SelectItem>
                      <SelectItem value="integral">Intégral</SelectItem>
                      <SelectItem value="fourgon">Fourgon</SelectItem>
                      <SelectItem value="capucine">Capucine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="condition">État général *</Label>
                  <Select name="condition" required>
                    <SelectTrigger id="condition"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent — comme neuf</SelectItem>
                      <SelectItem value="bon">Bon — usures normales</SelectItem>
                      <SelectItem value="moyen">Moyen — quelques travaux</SelectItem>
                      <SelectItem value="a_renover">À rénover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fuel">Carburant</Label>
                  <Input id="fuel" name="fuel" placeholder="Diesel, essence…" maxLength={40} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seats">Places carte grise</Label>
                  <Input id="seats" name="seats" type="number" min={0} max={12} placeholder="4" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="length_cm">Longueur (cm)</Label>
                  <Input id="length_cm" name="length_cm" type="number" min={0} max={2000} placeholder="Ex : 699" />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="message">Précisions complémentaires</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  placeholder="Options (panneaux solaires, climatisation, attelage…), entretien récent, défauts éventuels…"
                  className="mt-1.5"
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Obtenez une fourchette indicative immédiate.
                </div>
                <Button type="button" variant="gold" onClick={handleEstimate} disabled={estimating}>
                  {estimating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {estimating ? "Calcul en cours…" : "Estimer mon véhicule"}
                </Button>
              </div>
            </fieldset>

            {/* Estimate result */}
            {estimate && (
              <div id="estimate-result" className="rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent-soft/60 to-card p-6 md:p-8 shadow-gold">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-gold text-primary-foreground">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="eyebrow">Estimation indicative</span>
                    <div className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                      {formatPrice(estimate.estimate.low)} – {formatPrice(estimate.estimate.high)}
                    </div>
                    {estimate.analysis && (
                      <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                        {estimate.analysis}
                      </p>
                    )}
                    <p className="mt-4 text-xs text-muted-foreground">
                      Estimation à titre indicatif, sous réserve d'inspection physique du véhicule. L'offre ferme vous sera transmise sous 24h après envoi du dossier complet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Photos */}
            <fieldset className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-soft">
              <legend className="px-2">
                <span className="eyebrow">Étape 2</span>
                <h2 className="mt-1 font-serif text-2xl font-semibold">Photos (optionnel)</h2>
              </legend>
              <p className="mt-2 text-sm text-muted-foreground">
                Jusqu'à 8 photos (8 Mo max chacune). Idéalement : extérieur 4 faces, intérieur, cellule, compteur.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((file, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                    <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow-soft transition-smooth hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Retirer la photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 8 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/50 text-center text-xs text-muted-foreground transition-smooth hover:border-accent hover:bg-accent-soft/30 hover:text-accent">
                    <Camera className="h-6 w-6" />
                    Ajouter
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
            </fieldset>

            {/* Contact */}
            <fieldset className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-soft">
              <legend className="px-2">
                <span className="eyebrow">Étape 3</span>
                <h2 className="mt-1 font-serif text-2xl font-semibold">Vos coordonnées</h2>
              </legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input id="first_name" name="first_name" required maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input id="last_name" name="last_name" required maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" maxLength={30} />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                En envoyant ce formulaire, vous acceptez d'être recontacté par nos équipes au sujet de votre projet de reprise.
              </p>
              <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat className="h-4 w-4" />}
                {submitting ? "Envoi…" : "Envoyer ma demande de reprise"}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif text-lg font-semibold">Comment ça marche ?</h3>
              <ol className="mt-4 space-y-4 text-sm">
                {[
                  "Vous renseignez les caractéristiques de votre véhicule",
                  "Estimation indicative immédiate basée sur la cote du marché",
                  "Un expert vous recontacte sous 24h pour affiner",
                  "Inspection physique et offre ferme",
                  "Paiement par virement sous 48h",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6">
              <h3 className="font-serif text-lg font-semibold">Une question ?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nos experts reprises sont disponibles du lundi au samedi.
              </p>
              <a href="tel:+33123456789" className="mt-3 block font-semibold text-accent hover:underline">
                01 23 45 67 89
              </a>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
};

export default Reprise;
