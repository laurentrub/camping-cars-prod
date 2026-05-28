-- La policy TO public avec USING(true) s'applique aussi aux utilisateurs
-- authentifiés (Supabase combine les policies en OR), ce qui annule le filtrage
-- par équipe. On la remplace par une policy TO anon uniquement, qui cible
-- la page de confirmation (accès par référence = capability token).

DROP POLICY IF EXISTS "Public can view reservation by reference" ON public.reservations;

CREATE POLICY "Anon can view reservation by reference"
  ON public.reservations FOR SELECT
  TO anon
  USING (true);
