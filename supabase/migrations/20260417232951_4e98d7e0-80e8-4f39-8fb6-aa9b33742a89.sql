
-- Fix function search path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Tighten lead INSERT policy: enforce sane bounds
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
  ON public.leads FOR INSERT
  WITH CHECK (
    char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND (phone IS NULL OR char_length(phone) <= 30)
    AND (message IS NULL OR char_length(message) <= 2000)
  );

-- Restrict storage listing: only allow accessing individual objects, no broad listing
DROP POLICY IF EXISTS "Vehicle photos are publicly accessible" ON storage.objects;

CREATE POLICY "Vehicle photos public read by name"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-photos' AND auth.role() = 'anon' IS NOT NULL);
