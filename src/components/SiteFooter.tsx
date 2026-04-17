import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-deep text-primary-foreground">
      <div className="container-prose grid gap-10 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground font-serif text-lg">H</div>
            <div className="font-serif text-lg font-semibold">Horizon Évasion</div>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
            Concessionnaire spécialiste du camping-car neuf et d'occasion depuis 1998. Vente, reprise, financement et SAV.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-accent">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/catalogue" className="hover:text-accent transition-smooth">Catalogue</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-smooth">Services</Link></li>
            <li><Link to="/a-propos" className="hover:text-accent transition-smooth">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-smooth">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-accent">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-accent" /> <a href="tel:+33123456789" className="hover:text-accent transition-smooth">01 23 45 67 89</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-accent" /> <a href="mailto:contact@horizon-evasion.fr" className="hover:text-accent transition-smooth">contact@horizon-evasion.fr</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> 25 route de l'Aventure, 33000 Bordeaux</li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-accent">Horaires</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-accent" /><div><div>Lun–Ven : 9h–12h / 14h–18h30</div><div>Samedi : 9h–18h non-stop</div><div>Dimanche : fermé</div></div></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-prose flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <div>© {new Date().getFullYear()} Horizon Évasion — Tous droits réservés</div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-accent">Mentions légales</Link>
            <Link to="/contact" className="hover:text-accent">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
