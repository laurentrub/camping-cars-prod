import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { SEO } from "@/components/SEO";
import { VehicleCard } from "@/components/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { vehicles } = useVehicles();
  const { ids, isFavorite, toggle } = useFavorites();

  const favorites = vehicles.filter((v) => ids.includes(v.id));

  return (
    <>
      <SEO
        title="Mes favoris | Horizon Évasion"
        description="Retrouvez les camping-cars que vous avez sauvegardés."
      />

      <section className="border-b border-border bg-secondary/40 py-8">
        <div className="container-prose">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 fill-accent text-accent" />
            <h1 className="font-serif text-3xl font-semibold">Mes favoris</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {favorites.length === 0
              ? "Vous n'avez pas encore de favoris."
              : `${favorites.length} véhicule${favorites.length > 1 ? "s" : ""} sauvegardé${favorites.length > 1 ? "s" : ""}.`}
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        {favorites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">Aucun favori pour l'instant</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cliquez sur le cœur d'une fiche véhicule pour la sauvegarder ici.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <Link to="/catalogue">Explorer le catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isFavorite={isFavorite(v.id)}
                onToggleFavorite={toggle}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Favorites;
