import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { validateConfirmedContact, noPasteProps } from "@/lib/contactValidation";

const leadSchema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis").max(100),
  last_name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type LeadType = "contact" | "rappel" | "vehicule" | "reprise" | "financement";

interface LeadFormProps {
  type?: LeadType;
  vehicleId?: string;
  defaultMessage?: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
}

export function LeadForm({ type = "contact", vehicleId, defaultMessage, compact, title, subtitle }: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      first_name: String(fd.get("first_name") ?? ""),
      last_name: String(fd.get("last_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      type,
      vehicle_id: vehicleId ?? null,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Une erreur est survenue. Merci de réessayer.");
      return;
    }
    setDone(true);
    toast.success("Demande envoyée — nous vous recontactons sous 24h.");
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-accent/30 bg-accent-soft/40 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <h3 className="mt-3 font-serif text-xl font-semibold">Merci pour votre demande</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Un conseiller vous recontacte sous 24h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {(title || subtitle) && (
        <div>
          {title && <h3 className="font-serif text-xl font-semibold">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="first_name">Prénom *</Label>
          <Input id="first_name" name="first_name" required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Nom *</Label>
          <Input id="last_name" name="last_name" required maxLength={100} />
        </div>
      </div>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required maxLength={255} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" maxLength={30} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} maxLength={2000} defaultValue={defaultMessage} placeholder="Précisez votre projet, vos disponibilités…" />
      </div>
      <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        {submitting ? "Envoi…" : "Envoyer ma demande"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Vos données sont uniquement utilisées pour répondre à votre demande.
      </p>
    </form>
  );
}
