import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import showroom from "@/assets/showroom.jpg";
import interior from "@/assets/interior-1.jpg";
import { Award, Heart, Users, Compass, Wrench, Shield, MapPin, Star } from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Passion", text: "Le camping-car n'est pas qu'un véhicule, c'est un mode de vie. Chaque membre de l'équipe est lui-même voyageur — cette passion se ressent dans chaque conseil." },
  { icon: Award, title: "Exigence", text: "Chaque véhicule passe par un contrôle rigoureux avant d'entrer au stock : mécanique, étanchéité, électronique, équipements. Aucun compromis." },
  { icon: Users, title: "Écoute", text: "Votre projet est unique. Nous prenons le temps de le comprendre avant de vous orienter — sans pression, sans vente forcée." },
  { icon: Compass, title: "Accompagnement", text: "Notre relation ne s'arrête pas à la remise des clés. Conseils d'utilisation, suivi entretien, questions techniques : nous restons disponibles." },
];

const STEPS = [
  { icon: MapPin, title: "Une implantation locale", text: "Installés en Charente, au cœur d'une région qui se prête naturellement à l'escapade, nous connaissons nos clients et ils nous connaissent. Le bouche-à-oreille reste notre meilleur ambassadeur." },
  { icon: Wrench, title: "Un savoir-faire technique", text: "Avant d'être commerçants, nous sommes techniciens. Chaque véhicule proposé à la vente a été inspecté, testé et préparé en atelier. Vous repartez l'esprit tranquille." },
  { icon: Shield, title: "Une sélection rigoureuse", text: "Nous n'achetons pas n'importe quoi. Chaque camping-car intègre notre stock après vérification sérieuse de son historique, de son état général et de sa cohérence de prix." },
];

const TESTIMONIALS = [
  { name: "Famille Dupont", text: "Accueil chaleureux, véhicule exactement comme décrit, aucune mauvaise surprise. On reviendra sans hésiter pour notre prochain camping-car.", rating: 5 },
  { name: "Michel R.", text: "J'ai fait confiance à leur expertise pour la reprise de mon ancien véhicule. Estimation honnête, paiement rapide. Sérieux du début à la fin.", rating: 5 },
  { name: "Sophie & Luc", text: "On cherchait un fourgon aménagé depuis des mois. En une visite, ils ont cerné exactement ce qu'il nous fallait. Un vrai conseil, pas un discours commercial.", rating: 5 },
];

const About = () => (
  <>
    <SEO
      title="À propos — Spécialiste camping-car en Charente | ST Services"
      description="ST Services, votre spécialiste camping-cars en Charente. Vente, reprise, conseil personnalisé. Une équipe passionnée à votre service."
    />

    {/* HERO */}
    <section className="relative overflow-hidden">
      <img src={showroom} alt="Showroom ST Services" width={1920} height={1080} fetchPriority="high" className="h-[55vh] w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 flex items-end pb-16">
        <div className="container-prose text-primary-foreground">
          <span className="eyebrow !text-accent">À propos</span>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Des passionnés au service de votre liberté.
          </h1>
        </div>
      </div>
    </section>

    {/* INTRO */}
    <section className="container-prose py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img src={interior} alt="Intérieur d'un camping-car" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="eyebrow">Notre histoire</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Née d'une passion, construite sur la confiance</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            ST Services est née d'un constat simple : trop d'acheteurs de camping-cars se retrouvaient seuls face à un marché complexe, sans interlocuteur de confiance pour les guider. L'envie de changer ça, combinée à une vraie passion pour le voyage itinérant, a donné naissance à notre activité.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Installés en Charente, nous avons choisi de rester une structure à taille humaine. Pas de pression commerciale, pas de promesses excessives — juste un service honnête, des véhicules soigneusement sélectionnés et un accompagnement sincère à chaque étape de votre projet.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Qu'il s'agisse de votre premier camping-car ou d'un renouvellement, nous prenons le temps qu'il faut pour vous orienter vers le véhicule qui correspond vraiment à vos besoins — et non au plus facile à vendre.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
            <div><div className="font-serif text-3xl font-semibold text-accent">80+</div><div className="text-xs text-muted-foreground">véhicules traités</div></div>
            <div><div className="font-serif text-3xl font-semibold text-accent">100%</div><div className="text-xs text-muted-foreground">indépendant</div></div>
            <div><div className="font-serif text-3xl font-semibold text-accent">4,9★</div><div className="text-xs text-muted-foreground">satisfaction client</div></div>
          </div>
        </div>
      </div>
    </section>

    {/* CE QUI NOUS DIFFÉRENCIE */}
    <section className="bg-secondary/50 py-20">
      <div className="container-prose">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ce qui nous différencie</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Pas un simple revendeur</h2>
          <p className="mt-4 text-muted-foreground">
            Notre approche repose sur trois piliers que nous ne négocions pas.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
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

    {/* VALEURS */}
    <section className="container-prose py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Nos engagements</span>
        <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Ce qui nous anime au quotidien</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <v.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* TÉMOIGNAGES */}
    <section className="bg-secondary/50 py-20">
      <div className="container-prose">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ils nous font confiance</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">La parole à nos clients</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-xl border border-border bg-card p-6 shadow-soft">
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
      </div>
    </section>

    {/* CTA */}
    <section className="container-prose py-20">
      <div className="rounded-2xl bg-gradient-deep p-8 md:p-14 text-center">
        <span className="eyebrow !text-accent">Prêt à partir ?</span>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-foreground md:text-4xl">
          Votre prochain camping-car vous attend
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-primary-foreground/80">
          Parcourez notre catalogue, réservez une visite ou demandez un devis — notre équipe vous répond rapidement.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogue" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-smooth hover:opacity-90">
            Voir le catalogue
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-transparent px-6 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary-foreground/10">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default About;
