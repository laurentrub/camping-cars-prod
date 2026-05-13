import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/services", label: "Services" },
  { to: "/reprise", label: "Reprise" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { ids: favoriteIds } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-prose flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-deep text-primary-foreground font-serif text-lg shadow-soft transition-smooth group-hover:shadow-gold">
            H
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold text-foreground">Horizon Évasion</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Camping-cars premium</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-smooth",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-[2px] bg-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {favoriteIds.length > 0 && (
            <Link
              to="/favoris"
              aria-label={`Mes favoris (${favoriteIds.length})`}
              className="relative flex items-center justify-center text-muted-foreground transition-smooth hover:text-accent"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {favoriteIds.length}
              </span>
            </Link>
          )}
          <a
            href="tel:+33123456789"
            className="flex items-center gap-2 text-sm font-semibold text-foreground transition-smooth hover:text-accent"
          >
            <Phone className="h-4 w-4 text-accent" />
            04 51 45 94 68
          </a>
          <Button asChild variant="hero" size="sm">
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-prose flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <a href="tel:+33123456789" className="flex items-center gap-2 py-2 text-sm font-semibold">
                <Phone className="h-4 w-4 text-accent" /> 01 23 45 67 89
              </a>
              <Button asChild variant="hero" size="sm" className="w-full">
                <Link to="/contact" onClick={() => setOpen(false)}>Nous contacter</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
