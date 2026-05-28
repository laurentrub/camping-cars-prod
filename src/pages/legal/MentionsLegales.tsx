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
      title="Mentions légales | ST Services"
      description="Mentions légales du site ST Services, concessionnaire de camping-cars."
    />
    <LegalLayout title="Mentions légales" updatedAt="mai 2026" sections={SECTIONS}>

      <LegalSection id="editeur" number="1" title="Éditeur du site">
        <p>
          Le site <strong className="text-foreground">stservices-campingcar.fr</strong> est édité par{" "}
          <strong className="text-foreground">Robert Stéphane</strong>, entrepreneur individuel exerçant
          sous les enseignes <strong className="text-foreground">Destock'Loisirs</strong> et{" "}
          <strong className="text-foreground">ST Services</strong>.
        </p>
        <LegalList items={[
          { label: "Siège social :", value: "4 Rue des Portes, 16130 Saint-Fort-sur-le-Né, France" },
          { label: "SIREN :", value: "828 610 758" },
          { label: "SIRET :", value: "828 610 758 00033" },
          { label: "N° RCS :", value: "828 610 758 R.C.S. Angoulême" },
          { label: "N° TVA intracommunautaire :", value: "FR94828610758" },
          { label: "Directeur de publication :", value: "Robert Stéphane" },
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
          exclusive de Robert Stéphane ou de ses partenaires et est protégé par les lois françaises et internationales
          relatives à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification ou adaptation, quel que soit le moyen utilisé, est
          interdite sans autorisation écrite préalable de Robert Stéphane.
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" number="4" title="Responsabilité">
        <p>
          Les informations contenues sur ce site sont données à titre indicatif. Robert Stéphane s'efforce de
          les maintenir à jour mais ne peut garantir leur exactitude ou exhaustivité. Les prix, disponibilités
          et caractéristiques des véhicules sont susceptibles d'évoluer sans préavis.
        </p>
        <p>
          Robert Stéphane ne saurait être tenu responsable des dommages directs ou indirects résultant de
          l'utilisation de ce site ou de l'impossibilité d'y accéder.
        </p>
      </LegalSection>

      <LegalSection id="liens" number="5" title="Liens hypertextes">
        <p>
          Ce site peut contenir des liens vers des sites tiers. Robert Stéphane n'exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu.
        </p>
      </LegalSection>

      <LegalSection id="droit" number="6" title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation
          de ce site relève de la compétence exclusive des tribunaux d'Angoulême.
        </p>
      </LegalSection>

    </LegalLayout>
  </>
);

export default MentionsLegales;
