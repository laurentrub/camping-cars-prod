import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Loader2, Phone, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

type Reservation = {
  reference: string;
  first_name: string;
  email: string;
  phone: string | null;
  requested_visit_date: string | null;
  requested_time_slot: string | null;
  status: string;
  vehicle_id: string;
};

const slotLabel = (s: string | null) => s === "matin" ? "matin" : s === "apres_midi" ? "après-midi" : "";

const ReservationConfirmation = () => {
  const { reference } = useParams();
  const [res, setRes] = useState<Reservation | null>(null);
  const [vehicleTitle, setVehicleTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) return;
    (async () => {
      const { data: r } = await supabase.from("reservations").select("*").eq("reference", reference).maybeSingle();
      setRes(r as any);
      if (r?.vehicle_id) {
        const { data: v } = await supabase.from("vehicles").select("title").eq("id", r.vehicle_id).maybeSingle();
        setVehicleTitle(v?.title ?? "");
      }
      setLoading(false);
    })();
  }, [reference]);

  if (loading) return <div className="container-prose py-20 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (!res) return <div className="container-prose py-20 text-center">Demande introuvable.</div>;

  const visitDate = res.requested_visit_date
    ? format(new Date(res.requested_visit_date + "T00:00:00"), "EEEE d MMMM yyyy", { locale: fr })
    : "";

  return (
    <>
      <SEO title={`Demande de visite ${res.reference} | Horizon Évasion`} description="Confirmation de votre demande de visite. Sous réserve de validation par notre équipe." />
      <section className="container-prose py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-7 w-7" />
            </div>
          </div>
          <h1 className="mt-4 text-center font-serif text-3xl font-semibold">Demande de visite envoyée</h1>
          <p className="mt-3 text-center text-muted-foreground">
            Merci {res.first_name} ! Votre demande pour <strong>{vehicleTitle}</strong> a bien été enregistrée.
          </p>

          <div className="mt-8 rounded-xl border border-accent/30 bg-accent-soft/30 p-6 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Référence de votre demande</div>
            <div className="mt-2 font-mono text-2xl font-bold tracking-wider">{res.reference}</div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <CalendarCheck className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <h2 className="font-serif text-lg font-semibold">Créneau demandé</h2>
                <p className="mt-1 text-sm capitalize">{visitDate} — {slotLabel(res.requested_time_slot)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-300/60 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-amber-700" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900">Sous réserve de validation</p>
                <p className="mt-1 text-amber-900/90">
                  Cette demande est <strong>provisoire</strong>. Un conseiller vous appellera{res.phone ? ` au ${res.phone}` : ""} dans les prochaines heures
                  pour confirmer la date selon la disponibilité du garage. Vous recevrez ensuite une confirmation par email à <strong>{res.email}</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="elegant"><Link to="/catalogue">Retour au catalogue</Link></Button>
            <Button asChild variant="hero"><a href={`mailto:contact@horizon-evasion.fr?subject=Visite ${res.reference}`}>Nous contacter</a></Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReservationConfirmation;
