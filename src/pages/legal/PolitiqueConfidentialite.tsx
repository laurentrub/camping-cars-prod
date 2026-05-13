import { SEO } from "@/components/SEO";

const PolitiqueConfidentialite = () => (
  <>
    <SEO
      title="Politique de confidentialité (RGPD) | Horizon Évasion"
      description="Comment Horizon Évasion collecte, utilise et protège vos données personnelles conformément au RGPD."
    />

    <section className="border-b border-border bg-secondary/40 py-10">
      <div className="container-prose">
        <span className="eyebrow">Informations légales</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-muted-foreground">Mise à jour : mai 2026 — Conforme au Règlement (UE) 2016/679 (RGPD)</p>
      </div>
    </section>

    <section className="container-prose py-12">
      <div className="prose prose-neutral max-w-3xl">

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement de vos données personnelles est :
        </p>
        <ul>
          <li><strong>Horizon Évasion SAS</strong></li>
          <li>25 route de l'Aventure, 33000 Bordeaux</li>
          <li>Téléphone : 01 23 45 67 89</li>
        </ul>

        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes selon les formulaires utilisés :</p>
        <ul>
          <li><strong>Demande de visite / contact :</strong> nom, prénom, email, téléphone, message, véhicule concerné, date et créneau souhaités.</li>
          <li><strong>Demande de reprise :</strong> nom, prénom, email, téléphone, caractéristiques du véhicule à reprendre, photos.</li>
          <li><strong>Navigation :</strong> données techniques (adresse IP, navigateur, pages visitées) via les cookies.</li>
        </ul>

        <h2>3. Finalités et bases légales</h2>
        <table>
          <thead>
            <tr><th>Finalité</th><th>Base légale</th></tr>
          </thead>
          <tbody>
            <tr><td>Traitement des demandes de visite et de contact</td><td>Exécution d'un contrat / mesures précontractuelles</td></tr>
            <tr><td>Traitement des demandes de reprise</td><td>Mesures précontractuelles</td></tr>
            <tr><td>Amélioration du site et statistiques</td><td>Intérêt légitime</td></tr>
            <tr><td>Respect des obligations légales</td><td>Obligation légale</td></tr>
          </tbody>
        </table>

        <h2>4. Durée de conservation</h2>
        <ul>
          <li><strong>Prospects (demande sans suite commerciale) :</strong> 3 ans à compter du dernier contact.</li>
          <li><strong>Clients (vente conclue) :</strong> 10 ans à compter de la fin de la relation commerciale.</li>
          <li><strong>Données de navigation :</strong> 13 mois maximum.</li>
        </ul>

        <h2>5. Destinataires des données</h2>
        <p>
          Vos données sont destinées exclusivement aux équipes d'Horizon Évasion (conseillers, SAV).
          Elles ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales.
        </p>
        <p>
          Nous faisons appel à des sous-traitants techniques (hébergement, CRM) qui traitent vos données
          uniquement sur nos instructions et dans le respect du RGPD.
        </p>

        <h2>6. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données.</li>
          <li><strong>Droit à la limitation</strong> : limiter le traitement dans certains cas.</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement basé sur notre intérêt légitime.</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous par téléphone au 01 23 45 67 89 ou par courrier à notre
          adresse. Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong>
          (www.cnil.fr).
        </p>

        <h2>7. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
          données contre tout accès non autorisé, perte ou divulgation : chiffrement TLS, accès restreint
          aux données, authentification sécurisée.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Pour plus d'informations sur l'utilisation des cookies, consultez notre
          <a href="/cookies"> Politique de gestion des cookies</a>.
        </p>

      </div>
    </section>
  </>
);

export default PolitiqueConfidentialite;
