import { SEO } from "@/components/SEO";
import showroom from "@/assets/showroom.jpg";
import interior from "@/assets/interior-1.jpg";
import { Award, Heart, Users, Compass } from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Passion", text: "Nous sommes nous-mêmes voyageurs. Nous ne vendons que des véhicules dans lesquels nous partirions volontiers." },
  { icon: Award, title: "Exigence", text: "Sélection rigoureuse, préparation 150 points, contrôles techniques systématiques." },
  { icon: Users, title: "Conseil", text: "Pas de vente forcée. Nous prenons le temps de comprendre votre projet pour vous orienter." },
  { icon: Compass, title: "Accompagnement", text: "Du premier rendez-vous au SAV, nous restons disponibles pour la vie de votre véhicule." },
];

const About = () => (
  <>
    <SEO
      title="À propos — Concessionnaire camping-car depuis 1998 | ST Services"
      description="Découvrez l'histoire d'ST Services, concessionnaire indépendant spécialisé en camping-cars premium depuis plus de 25 ans."
    />

    <section className="relative overflow-hidden">
      <img src={showroom} alt="Showroom ST Services" width={1920} height={1080} fetchPriority="high" className="h-[50vh] w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 flex items-end pb-16">
        <div className="container-prose text-primary-foreground">
          <span className="eyebrow !text-accent">À propos</span>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            25 ans de passion pour le voyage en camping-car.
          </h1>
        </div>
      </div>
    </section>

    <section className="container-prose py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img src={interior} alt="Intérieur d'un camping-car" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="eyebrow">Notre histoire</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Une aventure familiale depuis 1998</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Tout commence en 1998 quand Jean Bernard, mécanicien passionné, ouvre un petit atelier de réparation de camping-cars en Gironde. Très vite, la qualité du service attire les passionnés de la région. En 2005, son fils Antoine rejoint l'aventure et ouvre la première activité de vente.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Aujourd'hui, ST Services c'est une équipe de 18 personnes, un showroom de 2 000 m² et un atelier de 800 m². Nous restons fidèles à nos valeurs : conseil honnête, qualité irréprochable et accompagnement sur le long terme.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
            <div><div className="font-serif text-3xl font-semibold text-accent">25+</div><div className="text-xs text-muted-foreground">années</div></div>
            <div><div className="font-serif text-3xl font-semibold text-accent">4 800</div><div className="text-xs text-muted-foreground">clients</div></div>
            <div><div className="font-serif text-3xl font-semibold text-accent">18</div><div className="text-xs text-muted-foreground">collaborateurs</div></div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-secondary/50 py-20">
      <div className="container-prose">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Nos engagements</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Ce qui nous anime</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
