import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";

type Reservation = {
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  deposit_amount: number;
  expires_at: string;
  status: string;
  vehicle_id: string;
};

type BankSettings = {
  iban: string | null;
  bic: string | null;
  account_holder: string | null;
  bank_name: string | null;
  instructions: string | null;
};

const ReservationConfirmation = () => {
  const { reference } = useParams();
  const [res, setRes] = useState<Reservation | null>(null);
  const [bank, setBank] = useState<BankSettings | null>(null);
  const [vehicleTitle, setVehicleTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) return;
    (async () => {
      const [{ data: r }, { data: b }] = await Promise.all([
        supabase.from("reservations").select("*").eq("reference", reference).maybeSingle(),
        supabase.from("bank_settings").select("iban, bic, account_holder, bank_name, instructions").eq("singleton", true).maybeSingle(),
      ]);
      setRes(r as any);
      setBank(b as any);
      if (r?.vehicle_id) {
        const { data: v } = await supabase.from("vehicles").select("title").eq("id", r.vehicle_id).maybeSingle();
        setVehicleTitle(v?.title ?? "");
      }
      setLoading(false);
    })();
  }, [reference]);

  if (loading) return <div className="container-prose py-20 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (!res) return <div className="container-prose py-20 text-center">Réservation introuvable.</div>;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié`);
  };

  const Row = ({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) => (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 text-right">
        <span className="font-mono text-sm font-medium">{value}</span>
        {copyable && (
          <button type="button" onClick={() => copy(value, label)} className="text-muted-foreground hover:text-accent">
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  const expiresDate = new Date(res.expires_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <SEO title={`Réservation ${res.reference} | Horizon Évasion`} description={`Confirmation de pré-réservation ${res.reference}. Instructions de virement bancaire pour valider l'acompte.`} />
      <section className="container-prose py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-7 w-7" />
            </div>
          </div>
          <h1 className="mt-4 text-center font-serif text-3xl font-semibold">Pré-réservation enregistrée</h1>
          <p className="mt-3 text-center text-muted-foreground">
            Merci {res.first_name}. Le véhicule <strong>{vehicleTitle}</strong> est pré-réservé à votre nom jusqu'au <strong>{expiresDate}</strong>.<br />
            Pour confirmer la réservation, effectuez un virement bancaire en utilisant les informations ci-dessous.
          </p>

          <div className="mt-8 rounded-xl border border-accent/30 bg-accent-soft/30 p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Référence à indiquer en libellé du virement</div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="font-mono text-2xl font-bold tracking-wider">{res.reference}</div>
              <Button variant="elegant" size="sm" onClick={() => copy(res.reference, "Référence")}>
                <Copy className="h-4 w-4" /> Copier
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-serif text-xl font-semibold">Coordonnées bancaires</h2>
            <div className="mt-4">
              <Row label="Bénéficiaire" value={bank?.account_holder ?? "—"} copyable={!!bank?.account_holder} />
              {bank?.bank_name && <Row label="Banque" value={bank.bank_name} />}
              <Row label="IBAN" value={bank?.iban ?? "—"} copyable={!!bank?.iban} />
              <Row label="BIC / SWIFT" value={bank?.bic ?? "—"} copyable={!!bank?.bic} />
              <Row label="Montant" value={formatPrice(Number(res.deposit_amount))} />
            </div>
            {bank?.instructions && (
              <p className="mt-5 whitespace-pre-line rounded-md bg-secondary/50 p-4 text-sm text-muted-foreground">{bank.instructions}</p>
            )}
          </div>

          <div className="mt-6 rounded-md border border-border bg-card p-5 text-sm">
            <p>
              <strong>Et après ?</strong> Dès réception de votre virement, nous vous enverrons une confirmation par email à <strong>{res.email}</strong>. Le véhicule passe alors en statut « Réservé » ferme.
            </p>
            <p className="mt-2 text-muted-foreground">
              Si nous ne recevons pas votre virement avant le {expiresDate}, la pré-réservation sera automatiquement libérée.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="elegant"><Link to="/catalogue">Retour au catalogue</Link></Button>
            <Button asChild variant="hero"><a href={`mailto:contact@horizon-evasion.fr?subject=Réservation ${res.reference}`}>Nous contacter</a></Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReservationConfirmation;
