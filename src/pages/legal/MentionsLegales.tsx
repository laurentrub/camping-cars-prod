import { SEO } from "@/components/SEO";

const MentionsLegales = () => (
  <>
    <SEO
      title="Mentions légales | Horizon Évasion"
      description="Mentions légales du site Horizon Évasion, concessionnaire de camping-cars à Bordeaux."
    />

    <section className="border-b border-border bg-secondary/40 py-10">
      <div className="container-prose">
        <span className="eyebrow">Informations légales</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Mentions légales</h1>
        <p className="mt-2 text-sm text-muted-foreground">Mise à jour : mai 2026</p>
      </div>
    </section>

    <section className="container-prose py-12">
      <div className="prose prose-neutral max-w-3xl">

        <h2>1. Éditeur du site</h2>
        <p>
          Le site <strong>horizon-evasion.fr</strong> est édité par la société <strong>Horizon Évasion SAS</strong>,
          société par actions simplifiée au capital de 50 000 €, immatriculée au Registre du Commerce et des Sociétés
          de Bordeaux sous le numéro <strong>XXX XXX XXX</strong>.
        </p>
        <ul>
          <li><strong>Siège social :</strong> 25 route de l'Aventure, 33000 Bordeaux, France</li>
          <li><strong>Téléphone :</strong> 01 23 45 67 89</li>
          <li><strong>N° TVA intracommunautaire :</strong> FR XX XXX XXX XXX</li>
          <li><strong>Directeur de la publication :</strong> [Nom du dirigeant]</li>
        </ul>

        <h2>2. Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Supabase Inc.</strong> et <strong>Vercel Inc.</strong>,
          dont les serveurs sont situés dans l'Union européenne et aux États-Unis.
        </p>

        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images, logos, icônes, vidéos, etc.) est la propriété
          exclusive d'Horizon Évasion ou de ses partenaires et est protégé par les lois françaises et internationales
          relatives à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments
          du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable
          d'Horizon Évasion.
        </p>

        <h2>4. Responsabilité</h2>
        <p>
          Les informations contenues sur ce site sont données à titre indicatif. Horizon Évasion s'efforce de
          maintenir ces informations à jour mais ne peut garantir leur exactitude, leur exhaustivité ou leur
          actualité. Les prix, disponibilités et caractéristiques des véhicules sont susceptibles d'évoluer
          sans préavis.
        </p>
        <p>
          Horizon Évasion ne saurait être tenu responsable des dommages directs ou indirects résultant de
          l'utilisation de ce site ou de l'impossibilité d'y accéder.
        </p>

        <h2>5. Liens hypertextes</h2>
        <p>
          Ce site peut contenir des liens vers des sites tiers. Horizon Évasion n'exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu.
        </p>

        <h2>6. Droit applicable</h2>
        <p>
          Le présent site et ses mentions légales sont soumis au droit français. Tout litige relatif à
          l'utilisation de ce site relève de la compétence exclusive des tribunaux de Bordeaux.
        </p>

      </div>
    </section>
  </>
);

export default MentionsLegales;
