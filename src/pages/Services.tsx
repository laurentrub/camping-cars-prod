import { SEO } from "@/components/SEO";
import { LeadForm } from "@/components/LeadForm";
import { HandCoins, Repeat, Shield, Wrench, FileCheck, Sparkles } from "lucide-react";
import showroom from "@/assets/showroom.jpg";

const SERVICES = [
  { icon: HandCoins, title: "Vente neuf & occasion", text: "Plus de 80 véhicules en stock des plus grandes marques européennes : Hymer, Pilote, Rapido, Chausson, Adria, Bürstner, Benimar… Préparation complète avant livraison.", points: ["Préparation 150 points", "Livraison France entière", "Prise en main offerte"] },
  { icon: Repeat, title: "Reprise de votre véhicule", text: "Estimation transparente sous 24h. Nous reprenons tous types de camping-cars, même non roulants. Paiement comptant sous 48h.", points: ["Estimation gratuite", "Paiement sous 48h", "Reprise possible à distance"] },
  { icon: FileCheck, title: "Financement sur mesure", text: "Solutions de financement personnalisées : crédit classique, location longue durée, location avec option d'achat. Réponse de principe en 48h.", points: ["TAEG dès 0,9%", "Durée 12 à 120 mois", "Premier loyer offert -1 mois"] },
  { icon: Shield, title: "Garantie premium", text: "Tous nos véhicules sont garantis pièces et main d'œuvre. Extension possible jusqu'à 24 mois. Assistance 7j/7 partout en Europe.", points: ["Garantie 12 à 24 mois", "Assistance Europe 24/7", "Pièces d'origine"] },
  { icon: Wrench, title: "Atelier & SAV", text: "Notre atelier intégré assure l'entretien, les révisions et toutes les réparations. Mécaniciens spécialistes camping-car.", points: ["Atelier 800 m²", "Carrosserie & étanchéité", "Rendez-vous sous 7 jours"] },
  { icon: Sparkles, title: "Préparation & accessoires", text: "Antennes satellite, panneaux solaires, attelages, porte-vélos, climatisation… Posez et personnalisez votre véhicule chez nous.", points: ["Plus de 500 références", "Pose certifiée", "Devis gratuit"] },
];

const Services = () => (
  <>
    <SEO
      title="Nos services — Vente, reprise, financement & SAV | Horizon Évasion"
      description="Vente neuve et occasion, reprise de votre camping-car, financement sur mesure, garantie et atelier SAV intégré."
    />
    <section className="relative overflow-hidden bg-gradient-deep py-20 text-primary-foreground">
      <img src={showroom} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
      <div className="container-prose relative">
        <span className="eyebrow !text-accent">Nos services</span>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
          Un accompagnement professionnel à chaque étape de votre projet.
        </h1>
        <p className="mt-4 max-w-2xl text-primary-foreground/85">
          De l'achat au SAV, en passant par le financement et la reprise : nos équipes mettent leur expertise à votre service depuis 1998.
        </p>
      </div>
    </section>

    <section className="container-prose py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <article key={s.title} className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-card hover:-translate-y-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold">
              <s.icon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-serif text-xl font-semibold">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            <ul className="mt-5 space-y-2 border-t border-border pt-4">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>

    <section className="container-prose pb-20">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card md:p-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="eyebrow">Une question ?</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Un conseiller vous rappelle</h2>
            <p className="mt-3 text-muted-foreground">
              Présentez-nous votre projet, vos besoins et votre budget. Nous vous proposons les meilleures options sous 24h.
            </p>
          </div>
          <LeadForm type="rappel" title="Demande de rappel" subtitle="Réponse sous 24h ouvrées" compact />
        </div>
      </div>
    </section>
  </>
);

export default Services;
