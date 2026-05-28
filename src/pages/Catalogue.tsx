import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { VehicleCard } from "@/components/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { useFavorites } from "@/hooks/useFavorites";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TYPE_LABELS, VehicleType, VehicleCondition } from "@/lib/types";
import { ChevronLeft, ChevronRight, Filter, Heart, X, Search } from "lucide-react";

const PAGE_SIZE = 12;

const TYPES: VehicleType[] = ["fourgon", "profile", "integral", "capucine"];

const Catalogue = () => {
  const { vehicles, loading } = useVehicles();
  const { isFavorite, toggle: toggleFavorite, ids: favoriteIds } = useFavorites();
  const [params, setParams] = useSearchParams();

  const initialType = (params.get("type") as VehicleType | null) ?? null;
  const initialQuery = params.get("q") ?? "";

  const [search, setSearch] = useState(initialQuery);
  const [type, setType] = useState<VehicleType | null>(initialType);
  const [condition, setCondition] = useState<VehicleCondition | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minSeats, setMinSeats] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))).sort(), [vehicles]);
  const [brand, setBrand] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    setPage(1);
    return vehicles.filter((v) => {
      if (search && !`${v.brand} ${v.model} ${v.title}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && v.type !== type) return false;
      if (condition && v.condition !== condition) return false;
      if (brand && v.brand !== brand) return false;
      if (v.price > maxPrice) return false;
      if (minSeats && v.seats < minSeats) return false;
      return true;
    });
  }, [vehicles, search, type, condition, brand, maxPrice, minSeats]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setSearch(""); setType(null); setCondition(null); setBrand(null); setMaxPrice(150000); setMinSeats(0);
    setParams({});
  };

  const handleType = (t: VehicleType | null) => {
    setType(t);
    if (t) setParams({ type: t });
    else setParams({});
  };

  return (
    <>
      <SEO
        title="Catalogue camping-cars neufs & occasion | ST Services"
        description="Découvrez notre sélection de camping-cars : fourgons, profilés, intégraux et capucines. Filtrez par prix, marque, places."
      />

      <section className="border-b border-border bg-gradient-soft py-12 md:py-16">
        <div className="container-prose">
          <span className="eyebrow">Catalogue</span>
          <h1 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Trouvez votre prochain compagnon de route</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {vehicles.length} véhicules sélectionnés et préparés par nos techniciens.
          </p>
        </div>
      </section>

      <section className="container-prose py-10">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="text-sm text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</div>
            <Button variant="elegant" size="sm" onClick={() => setOpen((v) => !v)}>
              <Filter className="h-4 w-4" /> Filtres
            </Button>
          </div>

          {/* Sidebar filters */}
          <aside className={`${open ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">Filtres</h2>
                <button onClick={reset} className="text-xs font-medium text-accent hover:underline">Réinitialiser</button>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <Label htmlFor="search">Recherche</Label>
                  <div className="relative mt-1.5">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Marque, modèle…" className="pl-9" />
                  </div>
                </div>

                <div>
                  <Label>Type de véhicule</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleType(type === t ? null : t)}
                        className={`rounded-md border px-3 py-2 text-xs font-medium transition-smooth ${type === t ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent/50"}`}
                      >
                        {TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>État</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["neuf", "occasion"] as VehicleCondition[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(condition === c ? null : c)}
                        className={`rounded-md border px-3 py-2 text-xs font-medium capitalize transition-smooth ${condition === c ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent/50"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Marque</Label>
                  <select
                    value={brand ?? ""}
                    onChange={(e) => setBrand(e.target.value || null)}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Toutes les marques</option>
                    {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Budget max</Label>
                    <span className="text-xs font-semibold text-foreground">{new Intl.NumberFormat("fr-FR").format(maxPrice)} €</span>
                  </div>
                  <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={30000} max={150000} step={5000} className="mt-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Places min.</Label>
                    <span className="text-xs font-semibold text-foreground">{minSeats || "Toutes"}</span>
                  </div>
                  <Slider value={[minSeats]} onValueChange={(v) => setMinSeats(v[0])} min={0} max={6} step={1} className="mt-3" />
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <div className="text-sm text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {vehicles.length}</div>
              {favoriteIds.length > 0 && (
                <Link to="/favoris" className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                  <Heart className="h-4 w-4 fill-current" /> {favoriteIds.length} favori{favoriteIds.length > 1 ? "s" : ""}
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                <X className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-4 font-medium">Aucun véhicule ne correspond à vos critères</p>
                <Button variant="elegant" size="sm" onClick={reset} className="mt-4">Réinitialiser les filtres</Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      isFavorite={isFavorite(v.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === totalPages}
                    >
                      Suivant <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Catalogue;
