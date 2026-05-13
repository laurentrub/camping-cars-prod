import { Link } from "react-router-dom";
import { Heart, Users, BedDouble, Calendar, Gauge } from "lucide-react";
import { Vehicle, TYPE_LABELS, STATUS_LABELS, formatPrice, formatMileage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function VehicleCard({ vehicle, isFavorite = false, onToggleFavorite }: VehicleCardProps) {
  const sold = vehicle.status === "vendu";
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-smooth hover:shadow-card hover:-translate-y-1">
      <Link to={`/vehicule/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {vehicle.cover_image && (
          <img
            src={vehicle.cover_image}
            alt={`${vehicle.title} — camping-car ${TYPE_LABELS[vehicle.type]} ${vehicle.condition}`}
            loading="lazy"
            width={1280}
            height={960}
            className={cn("h-full w-full object-cover transition-smooth group-hover:scale-105", sold && "grayscale")}
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
            {TYPE_LABELS[vehicle.type]}
          </span>
          <span className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold shadow-soft",
            vehicle.condition === "neuf" ? "bg-accent text-accent-foreground" : "bg-foreground text-background",
          )}>
            {vehicle.condition === "neuf" ? "Neuf" : "Occasion"}
          </span>
        </div>
        {vehicle.status !== "disponible" && (
          <div className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground shadow-soft">
            {STATUS_LABELS[vehicle.status]}
          </div>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onToggleFavorite(vehicle.id); }}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={cn(
              "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-soft transition-smooth",
              isFavorite
                ? "bg-destructive text-destructive-foreground"
                : "bg-background/90 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground",
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{vehicle.brand}</div>
        <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
          <Link to={`/vehicule/${vehicle.slug}`} className="hover:text-accent transition-smooth">{vehicle.title}</Link>
        </h3>
        {vehicle.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{vehicle.short_description}</p>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-accent" /> {vehicle.year}</li>
          <li className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-accent" /> {formatMileage(vehicle.mileage)}</li>
          <li className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" /> {vehicle.seats} places</li>
          <li className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-accent" /> {vehicle.beds} couchages</li>
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">À partir de</div>
            <div className="font-serif text-2xl font-semibold text-foreground">{formatPrice(vehicle.price)}</div>
          </div>
          <Button asChild variant="elegant" size="sm">
            <Link to={`/vehicule/${vehicle.slug}`}>Voir détails</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
