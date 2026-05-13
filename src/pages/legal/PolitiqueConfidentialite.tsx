import { SEO } from "@/components/SEO";
import { LegalLayout, LegalSection, LegalTable, LegalNote } from "@/components/LegalLayout";

const SECTIONS = [
  { id: "responsable", title: "Responsable du traitement" },
  { id: "donnees", title: "Données collectées" },
  { id: "finalites", title: "Finalités et bases légales" },
  { id: "durees", title: "Durées de conservation" },
  { id: "destinataires", title: "Destinataires" },
  { id: "droits", title: "Vos droits" },
  { id: "securite", title: "Sécurité" },
  { id: "cookies", title: "Cookies" },
];

const PolitiqueConfidentialite = () => (
  <>
    <SEO
      title="Politique de confidentialité (RGPD) | Horizon Évasion"
      description="Comment Horizon Évasion collecte, utilise et protège vos données personnelles conformément au RGPD."
    />
    <LegalLayout
      title="Politique de confidentialité"
      updatedAt="mai 2026 — Conforme au Règlement (UE) 2016/679 (RGPD)"
      sections={SECTIONS}
    >

      <LegalSection id="responsable" number="1" title="Responsable du traitement">
        <p>Le responsable du traitement de vos données est :</p>
        <div className="mt-3 rounded-lg border border-border bg-card p-4">
          <p className="font-semibold text-foreground">Horizon Évasion SAS</p>
          <p>25 route de l'Aventure, 33000 Bordeaux</p>
          <p>Téléphone : 01 23 45 67 89</p>
        </div>
      </LegalSection>

      <LegalSection id="donnees" number="2" title="Données collectées">
        <p>Nous collectons les données suivantes selon les formulaires utilisés :</p>
        <ul className="mt-3 space-y-2">
          {[
            { label: "Demande de visite / contact", value: "Nom, prénom, email, téléphone, message, véhicule concerné, date et créneau souhaités." },
            { label: "Demande de reprise", value: "Nom, prénom, email, téléphone, caractéristiques du véhicule à reprendre, photos." },
            { label: "Navigation", value: "Données techniques (adresse IP, navigateur, pages visitées) via les cookies." },
          ].map((item) => (
            <li key={item.label} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span><strong className="text-foreground">{item.label} :</strong> {item.value}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection id="finalites" number="3" title="Finalités et bases légales">
        <LegalTable
          headers={["Finalité", "Base légale"]}
          rows={[
            ["Traitement des demandes de visite et de contact", "Exécution d'un contrat / mesures précontractuelles"],
            ["Traitement des demandes de reprise", "Mesures précontractuelles"],
            ["Amélioration du site et statistiques", "Intérêt légitime"],
            ["Respect des obligations légales", "Obligation légale"],
          ]}
        />
      </LegalSection>

      <LegalSection id="durees" number="4" title="Durées de conservation">
        <LegalTable
          headers={["Catégorie", "Durée"]}
          rows={[
            ["Prospects (sans suite commerciale)", "3 ans à compter du dernier contact"],
            ["Clients (vente conclue)", "10 ans à compter de la fin de la relation commerciale"],
            ["Données de navigation", "13 mois maximum"],
          ]}
        />
      </LegalSection>

      <LegalSection id="destinataires" number="5" title="Destinataires">
        <p>
          Vos données sont destinées exclusivement aux équipes d'Horizon Évasion (conseillers, SAV).
          Elles ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales.
        </p>
        <p className="mt-2">
          Nous faisons appel à des sous-traitants techniques (hébergement, CRM) qui traitent vos données
          uniquement sur nos instructions et dans le respect du RGPD.
        </p>
      </LegalSection>

      <LegalSection id="droits" number="6" title="Vos droits">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { droit: "Accès", desc: "Obtenir une copie de vos données." },
            { droit: "Rectification", desc: "Corriger des données inexactes." },
            { droit: "Effacement", desc: "Demander la suppression de vos données." },
            { droit: "Limitation", desc: "Limiter le traitement dans certains cas." },
            { droit: "Opposition", desc: "Vous opposer au traitement basé sur notre intérêt légitime." },
            { droit: "Portabilité", desc: "Recevoir vos données dans un format structuré." },
          ].map((r) => (
            <div key={r.droit} className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{r.droit}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
        <LegalNote>
          Pour exercer ces droits, contactez-nous par téléphone au 01 23 45 67 89 ou par courrier.
          Vous pouvez également introduire une réclamation auprès de la{" "}
          <strong className="text-foreground">CNIL</strong> (www.cnil.fr).
        </LegalNote>
      </LegalSection>

      <LegalSection id="securite" number="7" title="Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
          données : chiffrement TLS, accès restreint, authentification sécurisée, hébergement conforme RGPD.
        </p>
      </LegalSection>

      <LegalSection id="cookies" number="8" title="Cookies">
        <p>
          Pour plus d'informations sur l'utilisation des cookies, consultez notre{" "}
          <a href="/cookies" className="font-medium text-accent hover:underline">Politique de gestion des cookies</a>.
        </p>
      </LegalSection>

    </LegalLayout>
  </>
);

export default PolitiqueConfidentialite;
