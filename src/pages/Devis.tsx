import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Loader2, ArrowLeft } from "lucide-react";
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
import { validateConfirmedContact, noPasteProps } from "@/lib/contactValidation";
import { TYPE_LABELS } from "@/lib/types";

const devisSchema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis").max(100),
  last_name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  vehicle_type: z.enum(["profile", "integral", "fourgon", "capucine", "indifferent"]).optional(),
  condition: z.enum(["neuf", "occasion", "indifferent"]).optional(),
  budget_min: z.coerce.number().min(0).optional().or(z.literal("")),
  budget_max: z.coerce.number().min(0).optional().or(z.literal("")),
  financing: z.enum(["oui", "non", "peut_etre"]).optional(),
  trade_in: z.enum(["oui", "non"]).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const STEPS = [
  { num: "1", label: "Votre projet" },
  { num: "2", label: "Vos coordonnées" },
];

const Devis = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    vehicle_type: "",
    condition: "",
    budget_min: "",
    budget_max: "",
    financing: "",
    trade_in: "",
    message: "",
  });

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    const confirmErr = validateConfirmedContact({
      email,
      emailConfirm: String(fd.get("email_confirm") ?? "").trim(),
      phone,
      phoneConfirm: String(fd.get("phone_confirm") ?? "").trim(),
    });
    if (confirmErr) return toast.error(confirmErr);

    const raw = {
      first_name: String(fd.get("first_name") ?? ""),
      last_name: String(fd.get("last_name") ?? ""),
      email,
      phone,
      vehicle_type: form.vehicle_type || undefined,
      condition: form.condition || undefined,
      budget_min: form.budget_min || undefined,
      budget_max: form.budget_max || undefined,
      financing: form.financing || undefined,
      trade_in: form.trade_in || undefined,
      message: form.message || undefined,
    };

    const parsed = devisSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire incomplet");
      return;
    }

    setSubmitting(true);
    try {
      const messageBody = [
        `Type de véhicule : ${parsed.data.vehicle_type ?? "Non précisé"}`,
        `État : ${parsed.data.condition ?? "Non précisé"}`,
        `Budget : ${parsed.data.budget_min ? `${parsed.data.budget_min} €` : "—"} – ${parsed.data.budget_max ? `${parsed.data.budget_max} €` : "—"}`,
        `Financement souhaité : ${parsed.data.financing ?? "Non précisé"}`,
        `Reprise d'un véhicule : ${parsed.data.trade_in ?? "Non précisé"}`,
        parsed.data.message ? `\nMessage : ${parsed.data.message}` : "",
      ].filter(Boolean).join("\n");

      const { error } = await supabase.from("leads").insert({
        type: "vehicule",
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: messageBody,
        preferred_contact: "email",
      });

      if (error) throw error;
      setSubmitted(true);
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
        <SEO title="Demande de devis envoyée | Horizon Évasion" description="Votre demande de devis a bien été reçue." />
        <section className="container-prose flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold">Demande bien reçue !</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Un conseiller Horizon Évasion vous recontacte sous <strong className="text-foreground">24h ouvrées</strong> avec
            une proposition adaptée à votre projet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/catalogue">Explorer le catalogue</Link>
            </Button>
            <Button asChild variant="elegant" size="lg">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Demander un devis — Camping-car sur mesure | Horizon Évasion"
        description="Décrivez votre projet camping-car et recevez un devis personnalisé sous 24h de nos conseillers experts."
      />

      {/* Hero */}
      <section className="border-b border-border bg-secondary/40 py-10">
        <div className="container-prose">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="eyebrow">Devis gratuit</span>
              <h1 className="font-serif text-3xl font-semibold md:text-4xl">Demander un devis</h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Décrivez votre projet en quelques minutes. Un conseiller expert vous répond sous <strong className="text-foreground">24h ouvrées</strong> avec une proposition adaptée à votre budget.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr,360px]">

          <div>
            {/* Étapes */}
            <div className="mb-8 flex items-center gap-3">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => step === 2 && setStep(1)}
                    className="flex items-center gap-2"
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-smooth ${
                      step >= Number(s.num)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {s.num}
                    </span>
                    <span className={`text-sm font-medium ${step >= Number(s.num) ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              {/* Étape 1 — Projet */}
              {step === 1 && (
                <fieldset className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
                  <legend className="px-2">
                    <span className="eyebrow">Étape 1</span>
                    <h2 className="mt-1 font-serif text-2xl font-semibold">Votre projet</h2>
                  </legend>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Type de véhicule</Label>
                      <Select value={form.vehicle_type} onValueChange={(v) => setField("vehicle_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indifferent">Peu importe</SelectItem>
                          {(Object.entries(TYPE_LABELS) as [string, string][]).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>État du véhicule</Label>
                      <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indifferent">Peu importe</SelectItem>
                          <SelectItem value="neuf">Neuf</SelectItem>
                          <SelectItem value="occasion">Occasion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="budget_min">Budget minimum (€)</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        min={0}
                        placeholder="Ex : 40 000"
                        value={form.budget_min}
                        onChange={(e) => setField("budget_min", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="budget_max">Budget maximum (€)</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        min={0}
                        placeholder="Ex : 80 000"
                        value={form.budget_max}
                        onChange={(e) => setField("budget_max", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Financement souhaité ?</Label>
                      <Select value={form.financing} onValueChange={(v) => setField("financing", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oui">Oui</SelectItem>
                          <SelectItem value="non">Non, comptant</SelectItem>
                          <SelectItem value="peut_etre">Peut-être, à étudier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Avez-vous un véhicule à reprendre ?</Label>
                      <Select value={form.trade_in} onValueChange={(v) => setField("trade_in", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oui">Oui</SelectItem>
                          <SelectItem value="non">Non</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Précisions sur votre projet (optionnel)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      maxLength={2000}
                      placeholder="Nombre de places souhaité, usage prévu (road-trip, camping, longue durée…), marque préférée, options indispensables…"
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                    />
                  </div>

                  <Button type="button" variant="hero" size="lg" className="w-full" onClick={() => setStep(2)}>
                    Continuer →
                  </Button>
                </fieldset>
              )}

              {/* Étape 2 — Coordonnées */}
              {step === 2 && (
                <fieldset className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
                  <legend className="px-2">
                    <span className="eyebrow">Étape 2</span>
                    <h2 className="mt-1 font-serif text-2xl font-semibold">Vos coordonnées</h2>
                  </legend>

                  <div className="grid gap-5 sm:grid-cols-2">
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
                      <Label htmlFor="email_confirm">Confirmation email *</Label>
                      <Input id="email_confirm" name="email_confirm" type="email" required maxLength={255} {...noPasteProps} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" name="phone" type="tel" maxLength={30} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone_confirm">Confirmation téléphone</Label>
                      <Input id="phone_confirm" name="phone_confirm" type="tel" maxLength={30} {...noPasteProps} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                      ← Retour
                    </Button>
                    <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      {submitting ? "Envoi en cours…" : "Envoyer ma demande de devis"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En envoyant ce formulaire, vous acceptez d'être recontacté par nos équipes au sujet de votre projet.
                    Vos données sont traitées conformément à notre{" "}
                    <Link to="/politique-confidentialite" className="text-accent hover:underline">politique de confidentialité</Link>.
                  </p>
                </fieldset>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6">
              <h3 className="font-serif text-lg font-semibold">Devis gratuit & sans engagement</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "Réponse personnalisée sous 24h ouvrées",
                  "Proposition adaptée à votre budget",
                  "Conseil sur le financement si besoin",
                  "Estimation de reprise incluse si applicable",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif text-base font-semibold">Besoin d'une réponse rapide ?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Nos conseillers sont disponibles du lundi au samedi.</p>
              <a href="tel:+33123456789" className="mt-3 block font-serif text-xl font-semibold text-accent hover:underline">
                01 23 45 67 89
              </a>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-soft text-sm text-muted-foreground">
              <p>Vous avez déjà un véhicule en tête ?</p>
              <Link to="/catalogue" className="mt-2 block font-medium text-accent hover:underline">
                Explorer le catalogue →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Devis;
