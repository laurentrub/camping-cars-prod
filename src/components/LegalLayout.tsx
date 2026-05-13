import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  eyebrow?: string;
  title: string;
  updatedAt?: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export function LegalLayout({ eyebrow = "Informations légales", title, updatedAt, sections, children }: LegalLayoutProps) {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40 py-10">
        <div className="container-prose">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">{title}</h1>
          {updatedAt && <p className="mt-2 text-sm text-muted-foreground">Mise à jour : {updatedAt}</p>}
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="grid gap-10 lg:grid-cols-[240px,1fr]">

          {/* Sommaire sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sommaire</p>
              <nav className="mt-3 space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-5 border-t border-border pt-4 space-y-1 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Pages légales</p>
                <Link to="/mentions-legales" className="block hover:text-accent transition-smooth">Mentions légales</Link>
                <Link to="/cgv" className="block hover:text-accent transition-smooth">CGV</Link>
                <Link to="/politique-confidentialite" className="block hover:text-accent transition-smooth">Politique de confidentialité</Link>
                <Link to="/cookies" className="block hover:text-accent transition-smooth">Cookies</Link>
              </div>
            </div>
          </aside>

          {/* Contenu */}
          <div className="min-w-0">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

/* Blocs réutilisables */

export function LegalSection({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-border pb-10 pt-8 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 font-serif text-sm font-semibold text-accent">
          {number}
        </span>
        <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="mt-4 space-y-3 pl-10 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex gap-2">
          <span className="shrink-0 font-medium text-foreground">{item.label}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/60">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-foreground/80">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground/80">
      {children}
    </div>
  );
}
