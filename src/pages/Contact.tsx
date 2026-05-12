import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => (
  <>
    <SEO
      title="Contact — Horizon Évasion | Concessionnaire camping-car Bordeaux"
      description="Contactez nos conseillers pour votre projet camping-car. Téléphone, email, adresse et formulaire de contact."
    />

    <section className="border-b border-border bg-gradient-soft py-12 md:py-16">
      <div className="container-prose">
        <span className="eyebrow">Contact</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Parlons de votre projet</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Notre équipe est à votre écoute du lundi au samedi.
        </p>
      </div>
    </section>

    <section className="container-prose py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr,1.2fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold">Par téléphone</h2>
            <a href="tel:+33123456789" className="mt-1 block text-2xl font-serif font-semibold text-accent hover:underline">
              01 23 45 67 89
            </a>
            <p className="mt-1 text-xs text-muted-foreground">Du lundi au samedi · Appel non surtaxé</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold">Par email</h2>
            <a href="mailto:contact@horizon-evasion.fr" className="mt-1 block text-base font-medium text-foreground hover:text-accent">
              contact@horizon-evasion.fr
            </a>
            <p className="mt-1 text-xs text-muted-foreground">Réponse sous 24h ouvrées</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold">Notre adresse</h2>
            <address className="mt-1 not-italic text-sm text-foreground">
              25 route de l'Aventure<br />33000 Bordeaux<br />France
            </address>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold">Horaires</h2>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              <li className="flex justify-between"><span className="text-muted-foreground">Lundi – Vendredi</span><span>9h – 12h / 14h – 18h30</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Samedi</span><span>9h – 18h non-stop</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Dimanche</span><span>Fermé</span></li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6 shadow-card md:p-8">
            <span className="eyebrow">Visite au showroom</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold md:text-3xl">Réservez un créneau pour voir un véhicule</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Pour avancer concrètement sur votre projet, le plus efficace est de venir voir le véhicule. Choisissez-le dans le catalogue, proposez une date et un créneau, nous vous rappelons pour confirmer le rendez-vous selon les disponibilités du garage.
            </p>
            <ol className="mt-5 space-y-2 text-sm text-foreground">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">1</span>Choisissez un véhicule dans le catalogue</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">2</span>Proposez une date et un créneau</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">3</span>Confirmation par téléphone</li>
            </ol>
            <Button asChild variant="hero" size="lg" className="mt-6 w-full sm:w-auto">
              <Link to="/catalogue">Voir le catalogue</Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Pour une question précise sur un véhicule, utilisez le bouton « Réserver une visite » directement sur sa fiche. Pour une reprise, rendez-vous sur la page <Link to="/reprise" className="font-medium text-accent hover:underline">Reprise</Link>.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border shadow-soft">
            <iframe
              title="Plan d'accès"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.6%2C44.82%2C-0.55%2C44.86&layer=mapnik"
              className="h-[320px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Contact;
