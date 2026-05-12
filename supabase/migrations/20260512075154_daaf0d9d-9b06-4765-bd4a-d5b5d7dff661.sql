
ALTER TABLE public.reservations
  ALTER COLUMN deposit_amount DROP NOT NULL,
  ALTER COLUMN expires_at DROP NOT NULL,
  ALTER COLUMN status SET DEFAULT 'demande_visite'::reservation_status;

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS requested_visit_date date,
  ADD COLUMN IF NOT EXISTS requested_time_slot text,
  ADD COLUMN IF NOT EXISTS confirmed_visit_at timestamptz;

DROP POLICY IF EXISTS "Anyone can submit a valid reservation" ON public.reservations;

CREATE POLICY "Anyone can submit a valid visit request"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (phone IS NULL OR char_length(phone) <= 30)
  AND (message IS NULL OR char_length(message) <= 2000)
  AND status = 'demande_visite'::reservation_status
  AND requested_visit_date IS NOT NULL
  AND requested_visit_date >= CURRENT_DATE
  AND requested_visit_date <= (CURRENT_DATE + INTERVAL '180 days')
  AND (requested_time_slot IS NULL OR requested_time_slot IN ('matin','apres_midi'))
);
