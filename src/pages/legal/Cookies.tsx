import { SEO } from "@/components/SEO";

const Cookies = () => (
  <>
    <SEO
      title="Politique de gestion des cookies | Horizon Évasion"
      description="Informations sur l'utilisation des cookies sur le site Horizon Évasion."
    />

    <section className="border-b border-border bg-secondary/40 py-10">
      <div className="container-prose">
        <span className="eyebrow">Informations légales</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Politique de gestion des cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Mise à jour : mai 2026</p>
      </div>
    </section>

    <section className="container-prose py-12">
      <div className="prose prose-neutral max-w-3xl">

        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette)
          lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite
          (langue, préférences, identifiant de session…).
        </p>

        <h2>2. Cookies utilisés sur ce site</h2>

        <h3>Cookies strictement nécessaires</h3>
        <p>
          Ces cookies sont indispensables au fonctionnement du site. Ils ne nécessitent pas votre consentement.
        </p>
        <table>
          <thead><tr><th>Nom</th><th>Finalité</th><th>Durée</th></tr></thead>
          <tbody>
            <tr><td>sb-auth-token</td><td>Session d'authentification (espace admin)</td><td>Session</td></tr>
            <tr><td>he_favorites</td><td>Sauvegarde des véhicules favoris en local</td><td>Permanent (localStorage)</td></tr>
          </tbody>
        </table>

        <h3>Cookies de performance et statistiques</h3>
        <p>
          Ces cookies nous permettent de mesurer l'audience du site et d'améliorer son fonctionnement.
          Ils sont déposés uniquement avec votre consentement.
        </p>
        <table>
          <thead><tr><th>Nom</th><th>Finalité</th><th>Durée</th></tr></thead>
          <tbody>
            <tr><td>_ga, _gid</td><td>Mesure d'audience (Google Analytics)</td><td>13 mois / 24h</td></tr>
          </tbody>
        </table>

        <h3>Cookies tiers (carte interactive)</h3>
        <p>
          La carte OpenStreetMap intégrée sur la page Contact peut déposer des cookies lors de son affichage.
          Ces cookies sont soumis à la politique de confidentialité d'OpenStreetMap Foundation.
        </p>

        <h2>3. Gestion de vos préférences</h2>
        <p>
          Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de votre navigateur :
        </p>
        <ul>
          <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
          <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies et données de sites</li>
          <li><strong>Safari :</strong> Préférences → Confidentialité</li>
          <li><strong>Edge :</strong> Paramètres → Confidentialité, recherche et services</li>
        </ul>
        <p>
          La désactivation des cookies strictement nécessaires peut altérer le fonctionnement du site.
        </p>

        <h2>4. Contact</h2>
        <p>
          Pour toute question relative à notre utilisation des cookies, contactez-nous au 01 23 45 67 89
          ou consultez notre <a href="/politique-confidentialite">Politique de confidentialité</a>.
        </p>

      </div>
    </section>
  </>
);

export default Cookies;
