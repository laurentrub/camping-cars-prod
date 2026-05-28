import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Pages principales",
    links: [
      { to: "/", label: "Accueil" },
      { to: "/catalogue", label: "Catalogue des camping-cars" },
      { to: "/services", label: "Nos services" },
      { to: "/reprise", label: "Reprise de votre véhicule" },
      { to: "/a-propos", label: "À propos d'ST Services" },
      { to: "/contact", label: "Contact & accès" },
      { to: "/favoris", label: "Mes favoris" },
    ],
  },
  {
    title: "Types de camping-cars",
    links: [
      { to: "/catalogue?type=fourgon", label: "Fourgons aménagés" },
      { to: "/catalogue?type=profile", label: "Profilés" },
      { to: "/catalogue?type=integral", label: "Intégraux" },
      { to: "/catalogue?type=capucine", label: "Capucines" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { to: "/mentions-legales", label: "Mentions légales" },
      { to: "/cgv", label: "Conditions Générales de Vente" },
      { to: "/politique-confidentialite", label: "Politique de confidentialité (RGPD)" },
      { to: "/cookies", label: "Gestion des cookies" },
    ],
  },
];

const PlanDuSite = () => (
  <>
    <SEO
      title="Plan du site | ST Services"
      description="Retrouvez toutes les pages du site ST Services, concessionnaire de camping-cars."
    />

    <section className="border-b border-border bg-secondary/40 py-10">
      <div className="container-prose">
        <span className="eyebrow">Navigation</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Plan du site</h1>
      </div>
    </section>

    <section className="container-prose py-12">
      <div className="grid gap-10 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-serif text-lg font-semibold">{section.title}</h2>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-accent"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default PlanDuSite;
