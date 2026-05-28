import { SEO } from "@/components/SEO";
import { LegalLayout, LegalSection, LegalTable, LegalNote } from "@/components/LegalLayout";

const SECTIONS = [
  { id: "definition", title: "Qu'est-ce qu'un cookie ?" },
  { id: "utilises", title: "Cookies utilisés" },
  { id: "gestion", title: "Gérer vos préférences" },
  { id: "contact", title: "Contact" },
];

const Cookies = () => (
  <>
    <SEO
      title="Politique de gestion des cookies | ST Services"
      description="Informations sur l'utilisation des cookies sur le site ST Services."
    />
    <LegalLayout title="Gestion des cookies" updatedAt="mai 2026" sections={SECTIONS}>

      <LegalSection id="definition" number="1" title="Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site web.
          Il permet au site de mémoriser des informations sur votre visite (langue, préférences, session…).
        </p>
      </LegalSection>

      <LegalSection id="utilises" number="2" title="Cookies utilisés sur ce site">
        <p className="font-medium text-foreground">Cookies strictement nécessaires</p>
        <p className="mt-1">Indispensables au fonctionnement du site. Ils ne nécessitent pas votre consentement.</p>
        <LegalTable
          headers={["Nom", "Finalité", "Durée"]}
          rows={[
            ["sb-auth-token", "Session d'authentification (espace admin)", "Session"],
            ["he_favorites", "Sauvegarde des véhicules favoris (localStorage)", "Permanent"],
          ]}
        />

        <p className="mt-5 font-medium text-foreground">Cookies de performance</p>
        <p className="mt-1">Déposés uniquement avec votre consentement pour mesurer l'audience.</p>
        <LegalTable
          headers={["Nom", "Finalité", "Durée"]}
          rows={[
            ["_ga", "Mesure d'audience (Google Analytics)", "13 mois"],
            ["_gid", "Mesure d'audience (Google Analytics)", "24 heures"],
          ]}
        />

        <p className="mt-5 font-medium text-foreground">Cookies tiers (carte interactive)</p>
        <p className="mt-1">
          La carte OpenStreetMap sur la page Contact peut déposer des cookies lors de son affichage.
          Ces cookies sont soumis à la politique de confidentialité d'OpenStreetMap Foundation.
        </p>
      </LegalSection>

      <LegalSection id="gestion" number="3" title="Gérer vos préférences">
        <p>Vous pouvez modifier vos préférences via les paramètres de votre navigateur :</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { browser: "Chrome", path: "Paramètres → Confidentialité et sécurité → Cookies" },
            { browser: "Firefox", path: "Options → Vie privée et sécurité → Cookies" },
            { browser: "Safari", path: "Préférences → Confidentialité" },
            { browser: "Edge", path: "Paramètres → Confidentialité, recherche et services" },
          ].map((b) => (
            <div key={b.browser} className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold text-foreground">{b.browser}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{b.path}</p>
            </div>
          ))}
        </div>
        <LegalNote>
          La désactivation des cookies strictement nécessaires peut altérer le fonctionnement du site.
        </LegalNote>
      </LegalSection>

      <LegalSection id="contact" number="4" title="Contact">
        <p>
          Pour toute question relative à notre utilisation des cookies, contactez-nous au{" "}
          <strong className="text-foreground">01 23 45 67 89</strong> ou consultez notre{" "}
          <a href="/politique-confidentialite" className="font-medium text-accent hover:underline">
            Politique de confidentialité
          </a>.
        </p>
      </LegalSection>

    </LegalLayout>
  </>
);

export default Cookies;
