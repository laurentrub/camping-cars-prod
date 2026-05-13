import { SEO } from "@/components/SEO";
import { LegalLayout, LegalSection, LegalList } from "@/components/LegalLayout";

const SECTIONS = [
  { id: "editeur", title: "Éditeur du site" },
  { id: "hebergement", title: "Hébergement" },
  { id: "propriete", title: "Propriété intellectuelle" },
  { id: "responsabilite", title: "Responsabilité" },
  { id: "liens", title: "Liens hypertextes" },
  { id: "droit", title: "Droit applicable" },
];

const MentionsLegales = () => (
  <>
    <SEO
      title="Mentions légales | Horizon Évasion"
      description="Mentions légales du site Horizon Évasion, concessionnaire de camping-cars à Bordeaux."
    />
    <LegalLayout title="Mentions légales" updatedAt="mai 2026" sections={SECTIONS}>

      <LegalSection id="editeur" number="1" title="Éditeur du site">
        <p>
          Le site <strong className="text-foreground">horizon-evasion.fr</strong> est édité par la société{" "}
          <strong className="text-foreground">Horizon Évasion SAS</strong>, société par actions simplifiée
          au capital de 50 000 €, immatriculée au Registre du Commerce et des Sociétés de Bordeaux.
        </p>
        <LegalList items={[
          { label: "Siège social :", value: "25 route de l'Aventure, 33000 Bordeaux, France" },
          { label: "Téléphone :", value: "01 23 45 67 89" },
          { label: "N° RCS :", value: "XXX XXX XXX RCS Bordeaux" },
          { label: "N° TVA :", value: "FR XX XXX XXX XXX" },
          { label: "Directeur de publication :", value: "[Nom du dirigeant]" },
        ]} />
      </LegalSection>

      <LegalSection id="hebergement" number="2" title="Hébergement">
        <p>
          Le site est hébergé par <strong className="text-foreground">Supabase Inc.</strong> (base de données et
          authentification) et <strong className="text-foreground">Vercel Inc.</strong> (frontend), dont les serveurs
          sont situés dans l'Union européenne et aux États-Unis dans le cadre du Privacy Shield / clauses contractuelles types.
        </p>
      </LegalSection>

      <LegalSection id="propriete" number="3" title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus présents sur ce site — textes, images, logos, icônes, vidéos — est la propriété
          exclusive d'Horizon Évasion ou de ses partenaires et est protégé par les lois françaises et internationales
          relatives à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification ou adaptation, quel que soit le moyen utilisé, est
          interdite sans autorisation écrite préalable d'Horizon Évasion.
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" number="4" title="Responsabilité">
        <p>
          Les informations contenues sur ce site sont données à titre indicatif. Horizon Évasion s'efforce de
          les maintenir à jour mais ne peut garantir leur exactitude ou exhaustivité. Les prix, disponibilités
          et caractéristiques des véhicules sont susceptibles d'évoluer sans préavis.
        </p>
        <p>
          Horizon Évasion ne saurait être tenu responsable des dommages directs ou indirects résultant de
          l'utilisation de ce site ou de l'impossibilité d'y accéder.
        </p>
      </LegalSection>

      <LegalSection id="liens" number="5" title="Liens hypertextes">
        <p>
          Ce site peut contenir des liens vers des sites tiers. Horizon Évasion n'exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu.
        </p>
      </LegalSection>

      <LegalSection id="droit" number="6" title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation
          de ce site relève de la compétence exclusive des tribunaux de Bordeaux.
        </p>
      </LegalSection>

    </LegalLayout>
  </>
);

export default MentionsLegales;
