## Contexte

La plupart des camping-cars sont en **dépôt-vente**. Les acomptes se font par **virement bancaire classique** (pas de paiement en ligne). Le site doit donc :
1. Permettre au client de **demander à réserver** un véhicule en ligne
2. Lui afficher les **coordonnées bancaires** + instructions
3. Permettre à l'admin de **confirmer la réception du virement** → bloque le véhicule
4. Offrir un **espace client** pour suivre son dossier
5. Gérer le **suivi de livraison** avec photos et étapes

## Sprint proposé — 3 modules

### 1. Demande de réservation + acompte par virement (priorité 1)

**Parcours client**
- Sur la fiche véhicule : nouveau bouton **« Réserver ce véhicule »**
- Formulaire de demande : coordonnées, message, montant d'acompte proposé (pré-rempli, ex 1 000 € ou 5 %)
- Page de confirmation affichant :
  - Coordonnées bancaires (IBAN, BIC, bénéficiaire) — configurables en admin
  - Référence unique à mettre en libellé du virement (ex `RES-A4F2-CC123`)
  - Montant à virer
  - Délai indicatif (ex « véhicule pré-réservé 7 jours en attente du virement »)
  - Bouton « Télécharger les instructions PDF » (récap envoyé aussi par email)
- Email automatique au client (instructions) + à l'admin (nouvelle demande)
- Le véhicule passe en **« Pré-réservé »** (visible sur la fiche, masqué des nouvelles réservations)

**Côté admin — onglet Réservations**
- Liste des demandes avec statut :
  - `en_attente_virement` — pré-réservé, virement non reçu
  - `acompte_recu` — admin a confirmé → véhicule **Réservé** ferme
  - `vente_finalisee` → véhicule **Vendu**
  - `annulee` (avec raison + remboursement à faire manuellement)
- Actions par dossier :
  - **Marquer le virement comme reçu** (date + montant réel) → email auto au client
  - Annuler la pré-réservation (libère le véhicule, email au client)
  - Convertir en vente
  - Ajouter une note interne
- Rappel automatique : si pré-réservation > X jours sans virement → alerte admin (badge)
- Stats dashboard : pré-réservations en attente, acomptes reçus du mois

**Paramètres admin (nouveau)**
- IBAN / BIC / titulaire du compte
- Texte libre d'instructions de virement
- Délai de validité d'une pré-réservation (jours)
- Montant d'acompte par défaut (forfait ou %)
- Override d'acompte par véhicule (champ optionnel sur la fiche)

---

### 2. Espace client

**Auth client** : inscription / connexion email + Google (séparée de l'admin, mêmes utilisateurs Supabase mais sans le rôle `admin`).

**Pages /mon-compte**
- **Tableau de bord** : mes réservations, leur statut (timeline visuelle : demande → virement reçu → préparation → livraison)
- **Mes réservations** : détail de chaque dossier avec instructions de virement encore visibles tant qu'il n'est pas reçu
- **Mes favoris** ❤️ (bouton sur chaque fiche véhicule)
- **Alertes recherche** : « prévenez-moi si un Profilé < 60 000 € arrive »
- **Mes documents** : devis, bon de commande, facture, contrat (uploadés par l'admin)
- **Mon dossier de reprise** (lien vers la demande existante)

**Côté admin — onglet Clients**
- Profil complet : réservations, reprises, favoris, documents, messages
- Upload de documents dans le dossier d'un client

---

### 3. Suivi de livraison

**Étapes par véhicule réservé/vendu**
1. Acompte reçu ✅
2. Préparation atelier (CT, vidange, nettoyage…)
3. Prêt à livrer
4. Livraison planifiée — date + lieu
5. Livré ✅ (signature numérique du PV)

**Côté client**
- Timeline visuelle dans l'espace client
- Photos uploadées par l'atelier à chaque étape
- Notification email à chaque changement
- Signature numérique du PV à la livraison

**Côté admin**
- Interface de mise à jour des étapes pour chaque dossier
- Upload photos de préparation
- Check-list pré-livraison (papiers, clés, plein, accessoires…)
- Saisie date + adresse de livraison

**Bonus** : calculateur simple de frais de livraison par code postal (forfait par tranche de km depuis le dépôt) — affiché sur la fiche véhicule.

---

## Détails techniques

**Nouvelles tables**
- `reservations` (id, vehicle_id, user_id?, customer info, deposit_amount, deposit_reference, status, deposit_received_at, expires_at, created_at)
- `bank_settings` (singleton : iban, bic, holder, instructions, default_deposit_amount, default_deposit_percent, hold_days)
- `customer_documents` (id, user_id, type, file_url, vehicle_id?)
- `favorites` (user_id, vehicle_id)
- `search_alerts` (user_id, filters jsonb)
- `delivery_tracking` (id, reservation_id, step, status, photos[], note, completed_at)

**Modifications**
- `vehicles` : nouveau statut `pre_reserve` ; champ optionnel `deposit_override`
- `vehicles` : champ `current_reservation_id` pour bloquer

**Edge functions**
- `create-reservation` (génère référence unique, envoie emails, met véhicule en `pre_reserve`)
- `confirm-deposit` (admin → marque reçu, statut `Réservé`, email client)
- `notify-delivery-step`
- `send-search-alerts` (cron, envoie alertes selon nouveaux véhicules)

**Auth client** : standard email/password + Google, page `/connexion` et `/inscription`, séparée de `/admin/auth`.

**Pas de Stripe / pas de Lovable Payments** — tout est virement bancaire géré manuellement.

---

## Ordre d'implémentation suggéré

1. **Module 1 — Réservation + acompte par virement** (impact business immédiat)
2. **Module 2 — Auth client + espace client + favoris**
3. **Module 3 — Suivi de livraison + photos**

On peut s'arrêter après chaque module pour valider.

## Questions avant de coder

1. **Montant d'acompte par défaut** : forfait (ex 1 000 €) ou pourcentage (ex 5 % du prix) ? Configurable par véhicule ?
2. **Délai de pré-réservation** sans virement reçu : 7 jours, 15 jours, autre ?
3. **Espace client** : obligatoire pour réserver, ou possible en mode invité (juste email) avec création de compte optionnelle ensuite ?
4. **Livraison** : zone France entière, régionale ? Tarif au km, par zone forfaitaire, ou toujours devis manuel ?
