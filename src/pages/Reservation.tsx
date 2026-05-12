import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useVehicle } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";

const Reservation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading } = useVehicle(slug);
  const [defaultDeposit, setDefaultDeposit] = useState<number>(1000);
  const [holdDays, setHoldDays] = useState<number>(7);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("bank_settings").select("default_deposit_amount, hold_days").eq("singleton", true).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDefaultDeposit(Number(data.default_deposit_amount));
          setHoldDays(Number(data.hold_days));
        }
      });
  }, []);

  if (loading) return <div className="container-prose py-20"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (!vehicle) return <div className="container-prose py-20 text-center">Véhicule introuvable.</div>;

  const deposit = vehicle.deposit_override ?? defaultDeposit;
  const available = vehicle.status === "disponible";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!available) return;
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      vehicle_id: vehicle.id,
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim() || null,
    };
    const { data, error } = await supabase.functions.invoke("create-reservation", { body: payload });
    setSubmitting(false);
    if (error || !data?.reservation) {
      toast.error((data as any)?.error || error?.message || "Erreur lors de la réservation");
      return;
    }
    navigate(`/reservation/${data.reservation.reference}`);
  };

  return (
    <>
      <SEO title={`Réserver ${vehicle.title} | Horizon Évasion`} description={`Réservez ${vehicle.title} avec un acompte de ${formatPrice(deposit)} par virement bancaire.`} />
      <section className="border-b border-border bg-secondary/40 py-6">
        <div className="container-prose">
          <Link to={`/vehicule/${vehicle.slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Retour au véhicule
          </Link>
        </div>
      </section>

      <section className="container-prose py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr,400px]">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Réserver ce véhicule</h1>
            <p className="mt-2 text-muted-foreground">
              La réservation est confirmée par un virement bancaire d'acompte. Renseignez vos coordonnées : nous vous enverrons par email les instructions de virement et une référence unique à indiquer en libellé.
            </p>

            {!available && (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Ce véhicule n'est plus disponible à la réservation.
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input id="first_name" name="first_name" required maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input id="last_name" name="last_name" required maxLength={100} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" maxLength={30} />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea id="message" name="message" rows={3} maxLength={2000} placeholder="Précisions, questions, demande de livraison…" />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={!available || submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Confirmer ma demande — acompte ${formatPrice(deposit)}`}
              </Button>
              <p className="text-xs text-muted-foreground">
                En validant, vous pré-réservez ce véhicule. Vous recevrez par email les coordonnées bancaires et la référence à utiliser. Le véhicule reste pré-réservé pendant {holdDays} jours en attente du virement.
              </p>
            </form>
          </div>

          <aside className="rounded-xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24 lg:h-fit">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Véhicule</div>
            <div className="mt-1 font-serif text-xl font-semibold">{vehicle.title}</div>
            {vehicle.cover_image && (
              <img src={vehicle.cover_image} alt={vehicle.title} className="mt-4 aspect-[4/3] w-full rounded-md object-cover" />
            )}
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Prix TTC</dt><dd className="font-medium">{formatPrice(vehicle.price)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Acompte demandé</dt><dd className="font-semibold text-accent">{formatPrice(deposit)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Durée pré-réservation</dt><dd>{holdDays} jours</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Reservation;
