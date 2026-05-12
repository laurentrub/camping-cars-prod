import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useVehicle } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { validateConfirmedContact, noPasteProps } from "@/lib/contactValidation";

const Reservation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading } = useVehicle(slug);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string>("matin");

  if (loading) return <div className="container-prose py-20"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (!vehicle) return <div className="container-prose py-20 text-center">Véhicule introuvable.</div>;

  const available = vehicle.status !== "vendu";

  const minDate = new Date(); minDate.setHours(0, 0, 0, 0);
  const maxDate = new Date(minDate.getTime() + 180 * 86400000);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!available) return;
    if (!date) return toast.error("Veuillez choisir une date de visite");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const confirmErr = validateConfirmedContact({
      email,
      emailConfirm: String(fd.get("email_confirm") ?? "").trim(),
      phone,
      phoneConfirm: String(fd.get("phone_confirm") ?? "").trim(),
      phoneRequired: true,
    });
    if (confirmErr) return toast.error(confirmErr);
    setSubmitting(true);
    const payload = {
      vehicle_id: vehicle.id,
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      email,
      phone: phone || null,
      message: String(fd.get("message") ?? "").trim() || null,
      requested_visit_date: format(date, "yyyy-MM-dd"),
      requested_time_slot: slot,
    };
    const { data, error } = await supabase.functions.invoke("create-reservation", { body: payload });
    setSubmitting(false);
    if (error || !data?.reservation) {
      toast.error((data as any)?.error || error?.message || "Erreur lors de la demande");
      return;
    }
    navigate(`/reservation/${data.reservation.reference}`);
  };

  return (
    <>
      <SEO title={`Réserver une visite — ${vehicle.title} | Horizon Évasion`} description={`Réservez une visite pour ${vehicle.title}. Demande sous réserve de validation par notre équipe.`} />
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
            <h1 className="font-serif text-3xl font-semibold">Réserver une visite</h1>
            <p className="mt-2 text-muted-foreground">
              Choisissez la date et le créneau qui vous conviennent. Votre demande est <strong>sous réserve de validation</strong> :
              nous vous appellerons pour confirmer le rendez-vous selon la disponibilité du garage.
            </p>

            {!available && (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Ce véhicule a été vendu et n'est plus visitable.
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
                  <Label htmlFor="email_confirm">Confirmation email *</Label>
                  <Input id="email_confirm" name="email_confirm" type="email" required maxLength={255} {...noPasteProps} />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" name="phone" type="tel" required maxLength={30} />
                </div>
                <div>
                  <Label htmlFor="phone_confirm">Confirmation téléphone *</Label>
                  <Input id="phone_confirm" name="phone_confirm" type="tel" required maxLength={30} {...noPasteProps} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <Label className="mb-2">Date souhaitée *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < minDate || d > maxDate || d.getDay() === 0}
                        initialFocus
                        locale={fr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="mt-1 text-xs text-muted-foreground">Dimanche fermé. Jusqu'à 6 mois à l'avance.</p>
                </div>

                <div>
                  <Label className="mb-2 block">Créneau *</Label>
                  <RadioGroup value={slot} onValueChange={setSlot} className="grid grid-cols-2 gap-2">
                    <label className={cn("flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm", slot === "matin" && "border-accent bg-accent/5")}>
                      <RadioGroupItem value="matin" /> Matin
                    </label>
                    <label className={cn("flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm", slot === "apres_midi" && "border-accent bg-accent/5")}>
                      <RadioGroupItem value="apres_midi" /> Après-midi
                    </label>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea id="message" name="message" rows={3} maxLength={2000} placeholder="Précisions, questions, contraintes d'horaire…" />
              </div>

              <Button type="submit" variant="hero" size="lg" disabled={!available || submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer ma demande de visite"}
              </Button>
              <p className="text-xs text-muted-foreground">
                En validant, vous envoyez une demande. Un conseiller vous contactera par téléphone pour confirmer le rendez-vous selon la disponibilité du garage.
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
              <div className="flex justify-between"><dt className="text-muted-foreground">Visite</dt><dd className="font-semibold text-accent">Gratuite & sans engagement</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Reservation;
