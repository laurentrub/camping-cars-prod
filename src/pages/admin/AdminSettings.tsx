import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

type Settings = {
  iban: string;
  bic: string;
  account_holder: string;
  bank_name: string;
  instructions: string;
  default_deposit_amount: number;
  hold_days: number;
};

const empty: Settings = {
  iban: "", bic: "", account_holder: "", bank_name: "", instructions: "",
  default_deposit_amount: 1000, hold_days: 7,
};

const AdminSettings = () => {
  const [s, setS] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("bank_settings").select("*").eq("singleton", true).maybeSingle().then(({ data }) => {
      if (data) setS({
        iban: data.iban ?? "", bic: data.bic ?? "", account_holder: data.account_holder ?? "",
        bank_name: data.bank_name ?? "", instructions: data.instructions ?? "",
        default_deposit_amount: Number(data.default_deposit_amount),
        hold_days: Number(data.hold_days),
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("bank_settings").update({
      iban: s.iban || null, bic: s.bic || null, account_holder: s.account_holder || null,
      bank_name: s.bank_name || null, instructions: s.instructions || null,
      default_deposit_amount: s.default_deposit_amount, hold_days: s.hold_days,
    }).eq("singleton", true);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Paramètres enregistrés");
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold">Paramètres réservations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Coordonnées bancaires affichées au client après une demande de réservation, et règles d'acompte par défaut.
      </p>

      <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft">
        <div>
          <h2 className="font-serif text-lg font-semibold">Coordonnées bancaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Bénéficiaire (titulaire du compte)</Label>
              <Input value={s.account_holder} onChange={(e) => setS({ ...s, account_holder: e.target.value })} placeholder="SARL Horizon Évasion" />
            </div>
            <div className="sm:col-span-2">
              <Label>Banque</Label>
              <Input value={s.bank_name} onChange={(e) => setS({ ...s, bank_name: e.target.value })} placeholder="Crédit Agricole" />
            </div>
            <div className="sm:col-span-2">
              <Label>IBAN</Label>
              <Input value={s.iban} onChange={(e) => setS({ ...s, iban: e.target.value })} placeholder="FR76 1234 5678 9012 3456 7890 123" className="font-mono" />
            </div>
            <div>
              <Label>BIC / SWIFT</Label>
              <Input value={s.bic} onChange={(e) => setS({ ...s, bic: e.target.value })} placeholder="AGRIFRPP123" className="font-mono" />
            </div>
          </div>
          <div className="mt-4">
            <Label>Instructions complémentaires (affichées au client)</Label>
            <Textarea value={s.instructions} onChange={(e) => setS({ ...s, instructions: e.target.value })} rows={4} />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="font-serif text-lg font-semibold">Règles d'acompte</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Acompte par défaut (€)</Label>
              <Input type="number" min={0} value={s.default_deposit_amount} onChange={(e) => setS({ ...s, default_deposit_amount: Number(e.target.value) })} />
              <p className="mt-1 text-xs text-muted-foreground">Modifiable individuellement par véhicule.</p>
            </div>
            <div>
              <Label>Durée de pré-réservation (jours)</Label>
              <Input type="number" min={1} max={90} value={s.hold_days} onChange={(e) => setS({ ...s, hold_days: Number(e.target.value) })} />
              <p className="mt-1 text-xs text-muted-foreground">Délai laissé au client pour effectuer le virement.</p>
            </div>
          </div>
        </div>

        <Button onClick={save} disabled={saving} variant="hero">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
