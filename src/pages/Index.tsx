import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroRoad from "@/assets/hero-road.jpg";
import interior from "@/assets/interior-1.jpg";
import showroom from "@/assets/showroom.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Shield, HandCoins, Wrench, Repeat, Star, Quote } from "lucide-react";
import { SEO } from "@/components/SEO";
import { VehicleCard } from "@/components/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { useFavorites } from "@/hooks/useFavorites";


const SERVICES = [
  { icon: HandCoins, title: "Vente neuve & occasion", text: "Plus de 80 modèles soigneusement sélectionnés des plus grandes marques européennes." },
  { icon: Repeat, title: "Reprise de votre véhicule", text: "Estimation gratuite sous 24h, paiement sous 48h. Reprise même non roulant." },
  { icon: Shield, title: "Garantie & financement", text: "Garantie jusqu'à 24 mois, financements personnalisés à partir de 0,9% TAEG." },
  { icon: Wrench, title: "Entretien & SAV", text: "Atelier intégré, mécaniciens spécialistes camping-car, pièces d'origine." },
];

const TESTIMONIALS = [
  { name: "Sophie & Marc L.", text: "Accompagnement remarquable de A à Z. Notre Hymer est arrivé au jour près, parfaitement préparé.", rating: 5 },
  { name: "Pierre D.", text: "Reprise de mon ancien camping-car au bon prix et financement clair. Que du sérieux.", rating: 5 },
  { name: "Famille Mercier", text: "Un vrai conseil. On nous a déconseillé un modèle trop grand pour nos besoins. Bravo l'équipe.", rating: 5 },
];

const Index = () => {
  const { vehicles } = useVehicles();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const featured = useMemo(() => vehicles.filter((v) => v.is_featured).slice(0, 3), [vehicles]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/catalogue?q=${encodeURIComponent(q)}` : "/catalogue");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "ST Services",
    description: "Vendeur de camping-cars neufs et d'occasion. Vente, reprise, financement, entretien.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 Rue des Portes",
      addressLocality: "Saint-Fort-sur-le-Né",
      postalCode: "16130",
      addressCountry: "FR",
    },
    telephone: "+33123456789",
  };

  return (
    <>
      <SEO
        title="ST Services — Camping-cars neufs & d'occasion"
        description="Concessionnaire premium de camping-cars. Vente, reprise, financement et entretien. Plus de 80 véhicules en stock."
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="relative min-h-[88vh] w-full overflow-hidden">
        <img
          src={heroRoad}
          alt="Camping-car premium sur une route de montagne au coucher du soleil"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="container-prose relative z-10 flex min-h-[88vh] flex-col justify-center pb-20 pt-32 text-primary-foreground">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="eyebrow !text-accent">Concessionnaire premium · depuis 1998</span>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] text-balance text-primary-foreground md:text-6xl lg:text-7xl">
              Partez à l'aventure<br />
              <span className="italic text-accent">en toute liberté</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
              Plus de 80 camping-cars neufs et d'occasion sélectionnés. L'expertise d'un professionnel pour un achat serein, partout en France.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/catalogue">Découvrir le catalogue <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                <Link to="/devis">Demander un devis</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-6 text-center">
              <div><div className="font-serif text-2xl font-semibold text-accent">25+</div><div className="text-xs text-primary-foreground/70">années d'expertise</div></div>
              <div><div className="font-serif text-2xl font-semibold text-accent">80+</div><div className="text-xs text-primary-foreground/70">véhicules en stock</div></div>
              <div><div className="font-serif text-2xl font-semibold text-accent">4 800</div><div className="text-xs text-primary-foreground/70">clients heureux</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH */}
      <section className="container-prose -mt-16 relative z-20">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-deep md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold">Trouvez votre camping-car idéal</h2>
            <Link to="/catalogue" className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline md:inline-flex">
              Catalogue complet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <form onSubmit={submitSearch} className="mt-5 flex flex-col gap-3 sm:flex-row" role="search" aria-label="Rechercher un camping-car">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marque, modèle, mot-clé… (ex. Hymer, fourgon, intégral)"
                className="h-12 pl-9 text-base"
                aria-label="Rechercher par marque ou modèle"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="h-12 sm:w-auto">
              <Search className="h-4 w-4" /> Rechercher
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Ou parcourez par type</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Link to="/catalogue?type=fourgon" className="group rounded-lg border border-border p-4 transition-smooth hover:border-accent hover:shadow-soft">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Compact</div>
              <div className="mt-1 font-serif text-lg font-semibold group-hover:text-accent">Fourgons</div>
              <div className="mt-1 text-xs text-muted-foreground">À partir de 55 000 €</div>
            </Link>
            <Link to="/catalogue?type=profile" className="group rounded-lg border border-border p-4 transition-smooth hover:border-accent hover:shadow-soft">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Polyvalent</div>
              <div className="mt-1 font-serif text-lg font-semibold group-hover:text-accent">Profilés</div>
              <div className="mt-1 text-xs text-muted-foreground">À partir de 60 000 €</div>
            </Link>
            <Link to="/catalogue?type=integral" className="group rounded-lg border border-border p-4 transition-smooth hover:border-accent hover:shadow-soft">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Premium</div>
              <div className="mt-1 font-serif text-lg font-semibold group-hover:text-accent">Intégraux</div>
              <div className="mt-1 text-xs text-muted-foreground">À partir de 75 000 €</div>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-prose mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Sélection du moment</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Nos derniers camping-cars</h2>
          </div>
          <Button asChild variant="elegant" className="hidden md:inline-flex">
            <Link to="/catalogue">Voir tout le catalogue</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VehicleCard key={v.id} vehicle={v} isFavorite={isFavorite(v.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mt-24 bg-secondary/50 py-20">
        <div className="container-prose">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Nos services</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Un accompagnement de bout en bout</h2>
            <p className="mt-4 text-muted-foreground">
              De la découverte du véhicule au SAV, nos équipes sont à vos côtés à chaque étape de votre projet.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-6 transition-smooth hover:shadow-card hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMMERSIVE */}
      <section className="container-prose mt-24 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img src={interior} alt="Intérieur lumineux d'un camping-car premium" loading="lazy" width={1280} height={960} className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="eyebrow">Le sens du détail</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">L'art de voyager confortablement</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Chaque véhicule de notre flotte est minutieusement préparé par nos techniciens : contrôle technique récent, vidange, étanchéité, électronique, pneumatiques. Vous prenez la route en toute sérénité.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "150 points de contrôle avant livraison",
              "Garantie pièces & main d'œuvre incluse",
              "Prise en main complète à la livraison",
              "Service après-vente disponible 6j/7",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link to="/services">Découvrir nos services</Link>
          </Button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-prose mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ils nous font confiance</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">L'avis de nos clients</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="relative rounded-xl border border-border bg-card p-6 shadow-soft">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-accent/20" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="rdv" className="container-prose mt-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-deep p-8 md:p-14">
          <img src={showroom} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="eyebrow !text-accent">Passez nous voir</span>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-foreground md:text-4xl">
                Réservez une visite au showroom
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-md">
                Choisissez le véhicule qui vous intéresse dans notre catalogue, puis sélectionnez un créneau. Un conseiller vous rappelle pour confirmer le rendez-vous selon les disponibilités du garage.
              </p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-deep md:p-8">
              <h3 className="font-serif text-xl font-semibold">Comment ça marche</h3>
              <ol className="mt-4 space-y-3 text-sm text-foreground">
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">1</span>Choisissez un véhicule dans le catalogue</li>
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">2</span>Proposez une date et un créneau</li>
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary-foreground">3</span>Nous confirmons par téléphone</li>
              </ol>
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/catalogue">Voir le catalogue <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
