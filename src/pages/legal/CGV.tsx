import { SEO } from "@/components/SEO";
import { LegalLayout, LegalSection, LegalNote } from "@/components/LegalLayout";

const SECTIONS = [
  { id: "objet", title: "Objet et champ d'application" },
  { id: "prix", title: "Prix" },
  { id: "commande", title: "Commande et acompte" },
  { id: "retractation", title: "Droit de rétractation" },
  { id: "livraison", title: "Livraison et transfert de propriété" },
  { id: "garanties", title: "Garanties" },
  { id: "paiement", title: "Modalités de paiement" },
  { id: "reprise", title: "Reprise de véhicule" },
  { id: "litiges", title: "Litiges et médiation" },
];

const CGV = () => (
  <>
    <SEO
      title="Conditions Générales de Vente | ST Services"
      description="Conditions générales de vente applicables aux achats de véhicules et prestations chez ST Services."
    />
    <LegalLayout title="Conditions Générales de Vente" updatedAt="mai 2026" sections={SECTIONS}>

      <LegalSection id="objet" number="1" title="Objet et champ d'application">
        <p>
          Les présentes CGV régissent les relations contractuelles entre{" "}
          <strong className="text-foreground">ST Services</strong> (« le Vendeur ») et tout acheteur
          (« l'Acheteur ») pour toute vente de véhicule de loisirs (neuf ou d'occasion) et toute prestation
          associée (entretien, accessoires, financement, reprise).
        </p>
        <p>Toute commande implique l'acceptation pleine et entière des présentes CGV.</p>
      </LegalSection>

      <LegalSection id="prix" number="2" title="Prix">
        <p>
          Les prix affichés sont exprimés en euros <strong className="text-foreground">toutes taxes comprises (TTC)</strong>,
          TVA au taux en vigueur. ST Services se réserve le droit de les modifier à tout moment ;
          les prix applicables sont ceux en vigueur à la date de la commande.
        </p>
      </LegalSection>

      <LegalSection id="commande" number="3" title="Commande et acompte">
        <p>
          Toute vente est formalisée par la signature d'un bon de commande précisant la désignation du véhicule,
          le prix TTC, les conditions de paiement et la date de livraison prévisionnelle.
        </p>
        <LegalNote>
          Un acompte est exigible à la signature. Il est retenu en cas d'annulation imputable à l'Acheteur,
          sauf cas de force majeure ou exercice du droit de rétractation dans les délais légaux.
        </LegalNote>
      </LegalSection>

      <LegalSection id="retractation" number="4" title="Droit de rétractation">
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, l'Acheteur particulier
          dispose d'un délai de <strong className="text-foreground">14 jours</strong> à compter de la signature
          du bon de commande pour les ventes conclues hors établissement ou à distance.
        </p>
        <LegalNote>
          Ce droit ne s'applique pas aux ventes conclues dans les locaux du Vendeur à la suite d'une visite
          physique du véhicule.
        </LegalNote>
      </LegalSection>

      <LegalSection id="livraison" number="5" title="Livraison et transfert de propriété">
        <p>
          La livraison s'effectue dans nos locaux, après règlement intégral du prix. Le transfert de propriété
          intervient au moment du paiement complet ; le transfert des risques à la remise des clés.
        </p>
        <p>
          Une prise en main complète du véhicule est réalisée par un conseiller lors de la livraison.
        </p>
      </LegalSection>

      <LegalSection id="garanties" number="6" title="Garanties">
        <p className="font-medium text-foreground">Véhicules neufs</p>
        <p>
          Garantie constructeur (conditions variables selon la marque), garantie légale de conformité de
          2 ans et garantie contre les vices cachés prévues par le Code civil.
        </p>
        <p className="mt-4 font-medium text-foreground">Véhicules d'occasion</p>
        <p>
          Garantie contractuelle de <strong className="text-foreground">6 mois minimum</strong> (pièces et
          main d'œuvre), sauf indication contraire sur le bon de commande. La garantie légale contre les
          vices cachés s'applique également.
        </p>
        <LegalNote>
          La garantie ne couvre pas l'usure normale, les dommages liés à un défaut d'entretien, une
          utilisation anormale ou une modification non autorisée du véhicule.
        </LegalNote>
      </LegalSection>

      <LegalSection id="paiement" number="7" title="Modalités de paiement">
        <p>Les modes de paiement acceptés :</p>
        <ul className="mt-2 space-y-1 pl-4">
          {["Virement bancaire", "Chèque de banque", "Financement (sous réserve d'accord)", "Espèces dans la limite légale en vigueur"].map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {m}
            </li>
          ))}
        </ul>
        <LegalNote>
          En cas de refus de financement par l'organisme prêteur, la vente est résolue de plein droit
          et l'acompte restitué.
        </LegalNote>
      </LegalSection>

      <LegalSection id="reprise" number="8" title="Reprise de véhicule">
        <p>
          La valeur de reprise estimée en ligne est indicative et ne vaut pas offre ferme. L'offre définitive
          est formulée après inspection physique du véhicule. En cas d'accord, la reprise est formalisée sur
          le bon de commande et déduite du prix du véhicule acquis.
        </p>
      </LegalSection>

      <LegalSection id="litiges" number="9" title="Litiges et médiation">
        <p>
          En cas de litige, l'Acheteur s'adressera en priorité à ST Services pour une résolution amiable.
          À défaut, l'Acheteur particulier peut recourir gratuitement au médiateur de la consommation compétent.
        </p>
        <p>
          Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des tribunaux
          d'Angoulême.
        </p>
      </LegalSection>

    </LegalLayout>
  </>
);

export default CGV;
