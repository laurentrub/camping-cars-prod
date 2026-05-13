import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Calendar, Gauge, Users, BedDouble, Fuel, Settings, Zap, Ruler, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useVehicle } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";

import { TYPE_LABELS, STATUS_LABELS, formatPrice, formatMileage } from "@/lib/types";

const VehicleDetail = () => {
  const { slug } = useParams();
  const { vehicle, loading, notFound } = useVehicle(slug);
  const [activeImg, setActiveImg] = useState(0);

  if (loading) return <div className="container-prose py-20"><div className="aspect-video animate-pulse rounded-xl bg-muted" /></div>;

  if (notFound || !vehicle) {
    return (
      <div className="container-prose py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Véhicule introuvable</h1>
        <Button asChild variant="elegant" className="mt-6"><Link to="/catalogue">Retour au catalogue</Link></Button>
      </div>
    );
  }

  const gallery = [vehicle.cover_image, ...vehicle.images].filter(Boolean) as string[];
  const cover = gallery[activeImg] ?? gallery[0];

  const specs = [
    { icon: Calendar, label: "Année", value: vehicle.year },
    { icon: Gauge, label: "Kilométrage", value: formatMileage(vehicle.mileage) },
    { icon: Users, label: "Places", value: vehicle.seats },
    { icon: BedDouble, label: "Couchages", value: vehicle.beds },
    { icon: Fuel, label: "Carburant", value: vehicle.fuel ?? "—" },
    { icon: Settings, label: "Boîte", value: vehicle.transmission ?? "—" },
    { icon: Zap, label: "Puissance", value: vehicle.power_hp ? `${vehicle.power_hp} ch` : "—" },
    { icon: Ruler, label: "Longueur", value: vehicle.length_cm ? `${(vehicle.length_cm / 100).toFixed(2)} m` : "—" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: vehicle.mileage ? { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" } : undefined,
    fuelType: vehicle.fuel,
    numberOfDoors: undefined,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "EUR",
      availability: vehicle.status === "disponible" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    image: cover,
  };

  return (
    <>
      <SEO
        title={`${vehicle.title} — ${formatPrice(vehicle.price)} | Horizon Évasion`}
        description={vehicle.short_description ?? vehicle.description.slice(0, 155)}
        image={cover}
        jsonLd={jsonLd}
      />

      <section className="border-b border-border bg-secondary/40 py-6">
        <div className="container-prose">
          <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>
        </div>
      </section>

      <section className="container-prose py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-xl bg-muted shadow-card">
              {cover && (
                <img src={cover} alt={vehicle.title} width={1280} height={960} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`overflow-hidden rounded-md border-2 transition-smooth ${i === activeImg ? "border-accent" : "border-transparent hover:border-border"}`}
                  >
                    <img src={img} alt={`${vehicle.title} ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{TYPE_LABELS[vehicle.type]}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${vehicle.condition === "neuf" ? "bg-accent text-accent-foreground" : "bg-foreground text-background"}`}>
                {vehicle.condition === "neuf" ? "Neuf" : "Occasion"}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${vehicle.status === "disponible" ? "bg-emerald-100 text-emerald-900" : "bg-destructive/10 text-destructive"}`}>
                {STATUS_LABELS[vehicle.status]}
              </span>
            </div>
            <div className="mt-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">{vehicle.brand}</div>
            <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight md:text-4xl">{vehicle.title}</h1>
            {vehicle.short_description && (
              <p className="mt-3 text-muted-foreground">{vehicle.short_description}</p>
            )}

            <div className="mt-6 rounded-xl border border-accent/30 bg-accent-soft/40 p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Prix TTC</div>
              <div className="mt-1 font-serif text-4xl font-semibold text-foreground">{formatPrice(vehicle.price)}</div>
              <div className="mt-1 text-xs text-muted-foreground">Financement à partir de {Math.round(vehicle.price / 84)} €/mois</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {vehicle.status !== "vendu" ? (
                <Button asChild variant="hero" size="lg" className="flex-1 min-w-[200px]">
                  <Link to={`/reserver/${vehicle.slug}`}>Réserver une visite</Link>
                </Button>
              ) : (
                <Button disabled variant="hero" size="lg" className="flex-1 min-w-[200px]">
                  {STATUS_LABELS[vehicle.status]}
                </Button>
              )}
              <Button asChild variant="elegant" size="lg">
                <a href="tel:+33123456789">Nous appeler</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label} className="rounded-lg border border-border p-3 text-center">
                  <s.icon className="mx-auto h-4 w-4 text-accent" />
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description + features */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr,360px]">
          <div className="prose prose-neutral max-w-none">
            <h2 className="font-serif text-2xl font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground leading-relaxed">{vehicle.description}</p>

            {vehicle.features.length > 0 && (
              <>
                <h2 className="mt-10 font-serif text-2xl font-semibold">Équipements & options</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6 shadow-soft lg:sticky lg:top-24 lg:h-fit">
            <h3 className="font-serif text-xl font-semibold">Intéressé par ce véhicule&nbsp;?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Réservez un créneau pour le voir au showroom. Nous vous rappelons pour confirmer le rendez-vous.
            </p>
            {vehicle.status !== "vendu" && (
              <Button asChild variant="hero" size="lg" className="mt-5 w-full">
                <Link to={`/reserver/${vehicle.slug}`}>Réserver une visite</Link>
              </Button>
            )}
            <a href="tel:+33123456789" className="mt-4 block text-center text-sm font-semibold text-foreground hover:text-accent">
              ou appelez-nous au 01 23 45 67 89
            </a>
          </aside>
        </div>
      </section>
    </>
  );
};

export default VehicleDetail;
