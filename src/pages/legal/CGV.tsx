import { SEO } from "@/components/SEO";

const CGV = () => (
  <>
    <SEO
      title="Conditions Générales de Vente | Horizon Évasion"
      description="Conditions générales de vente applicables aux achats de véhicules et prestations chez Horizon Évasion."
    />

    <section className="border-b border-border bg-secondary/40 py-10">
      <div className="container-prose">
        <span className="eyebrow">Informations légales</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Conditions Générales de Vente</h1>
        <p className="mt-2 text-sm text-muted-foreground">Mise à jour : mai 2026</p>
      </div>
    </section>

    <section className="container-prose py-12">
      <div className="prose prose-neutral max-w-3xl">

        <h2>1. Objet et champ d'application</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
          <strong> Horizon Évasion SAS</strong> (ci-après « le Vendeur ») et tout acheteur professionnel
          ou particulier (ci-après « l'Acheteur ») pour toute vente de véhicule de loisirs (camping-car neuf
          ou d'occasion) et toute prestation associée (entretien, accessoires, financement, reprise).
        </p>
        <p>
          Toute commande implique l'acceptation pleine et entière des présentes CGV, qui prévalent sur tout
          autre document de l'Acheteur.
        </p>

        <h2>2. Prix</h2>
        <p>
          Les prix affichés sur le site et dans nos locaux sont exprimés en euros toutes taxes comprises (TTC).
          Ils incluent la TVA au taux en vigueur au jour de la commande. Horizon Évasion se réserve le droit
          de modifier ses prix à tout moment ; les prix applicables sont ceux en vigueur à la date de la commande.
        </p>
        <p>
          Les prix des véhicules d'occasion sont fixés librement et ne sont pas soumis à la réglementation
          sur les prix imposés.
        </p>

        <h2>3. Commande et bon de commande</h2>
        <p>
          Toute vente est formalisée par la signature d'un bon de commande précisant : la désignation du
          véhicule, le prix TTC, les conditions de paiement, la date de livraison prévisionnelle et, le
          cas échéant, les modalités de reprise.
        </p>
        <p>
          Un acompte dont le montant est précisé sur le bon de commande est exigible à la signature.
          Cet acompte est retenu en cas d'annulation imputable à l'Acheteur, sauf cas de force majeure
          ou exercice du droit de rétractation dans les délais légaux.
        </p>

        <h2>4. Droit de rétractation</h2>
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, l'Acheteur particulier
          bénéficie d'un délai de rétractation de <strong>14 jours</strong> à compter de la signature du
          bon de commande pour les ventes conclues hors établissement ou à distance.
        </p>
        <p>
          Ce droit ne s'applique pas aux ventes conclues dans les locaux du Vendeur à la suite d'une visite
          physique du véhicule.
        </p>

        <h2>5. Livraison et transfert de propriété</h2>
        <p>
          La livraison du véhicule s'effectue dans nos locaux, après règlement intégral du prix. Le transfert
          de propriété intervient au moment du paiement complet. Le transfert des risques intervient à la
          remise des clés.
        </p>
        <p>
          Lors de la livraison, une prise en main complète du véhicule est réalisée par un conseiller
          (fonctionnement des équipements, documents, entretien).
        </p>

        <h2>6. Garanties</h2>
        <h3>6.1 Véhicules neufs</h3>
        <p>
          Les véhicules neufs bénéficient de la garantie constructeur (conditions et durée variables selon
          la marque) ainsi que de la garantie légale de conformité (2 ans) et de la garantie contre les
          vices cachés prévues par le Code civil.
        </p>
        <h3>6.2 Véhicules d'occasion</h3>
        <p>
          Les véhicules d'occasion bénéficient d'une garantie contractuelle de <strong>6 mois minimum</strong>
          (pièces et main d'œuvre), sauf indication contraire sur le bon de commande. La garantie légale
          contre les vices cachés s'applique également.
        </p>
        <p>
          La garantie ne couvre pas l'usure normale, les dommages liés à un défaut d'entretien, une
          utilisation anormale ou une modification non autorisée du véhicule.
        </p>

        <h2>7. Modalités de paiement</h2>
        <p>Les modes de paiement acceptés sont :</p>
        <ul>
          <li>Virement bancaire</li>
          <li>Chèque de banque</li>
          <li>Financement (sous réserve d'accord de l'organisme prêteur)</li>
          <li>Espèces dans la limite légale en vigueur</li>
        </ul>
        <p>
          Le financement est soumis à l'acceptation de l'organisme de crédit partenaire. En cas de refus,
          la vente est résolue de plein droit et l'acompte restitué.
        </p>

        <h2>8. Reprise de véhicule</h2>
        <p>
          La reprise d'un véhicule est subordonnée à une inspection physique. La valeur de reprise estimée
          en ligne est indicative et ne vaut pas offre ferme. L'offre définitive est formulée après inspection.
          En cas d'accord, la reprise est formalisée sur le bon de commande et déduite du prix du véhicule acquis.
        </p>

        <h2>9. Données personnelles</h2>
        <p>
          Les données collectées lors de la commande sont traitées conformément à notre
          <a href="/politique-confidentialite"> Politique de confidentialité (RGPD)</a>.
        </p>

        <h2>10. Litiges et médiation</h2>
        <p>
          En cas de litige, l'Acheteur s'adressera en priorité à Horizon Évasion pour une résolution amiable.
          À défaut d'accord, l'Acheteur particulier peut recourir gratuitement au médiateur de la consommation
          compétent (coordonnées disponibles sur demande).
        </p>
        <p>
          Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des tribunaux
          de Bordeaux.
        </p>

      </div>
    </section>
  </>
);

export default CGV;
