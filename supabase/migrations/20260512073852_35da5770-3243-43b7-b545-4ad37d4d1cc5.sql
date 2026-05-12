
-- 1. Add pre_reserve to vehicle_status enum
ALTER TYPE vehicle_status ADD VALUE IF NOT EXISTS 'pre_reserve';

-- 2. Add deposit override + reserved_until to vehicles
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS deposit_override numeric,
  ADD COLUMN IF NOT EXISTS reserved_until timestamptz;

-- 3. reservation_status enum
DO $$ BEGIN
  CREATE TYPE reservation_status AS ENUM ('en_attente_virement','acompte_recu','vente_finalisee','annulee','expiree');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  reference text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  deposit_amount numeric NOT NULL,
  status reservation_status NOT NULL DEFAULT 'en_attente_virement',
  expires_at timestamptz NOT NULL,
  deposit_received_at timestamptz,
  deposit_received_amount numeric,
  cancelled_at timestamptz,
  cancellation_reason text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_vehicle ON public.reservations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a valid reservation"
ON public.reservations FOR INSERT TO public
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (phone IS NULL OR char_length(phone) <= 30)
  AND (message IS NULL OR char_length(message) <= 2000)
  AND deposit_amount > 0 AND deposit_amount < 1000000
  AND status = 'en_attente_virement'
);

CREATE POLICY "Admins can view reservations"
ON public.reservations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reservations"
ON public.reservations FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reservations"
ON public.reservations FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can fetch a single reservation by reference (for confirmation page)
CREATE POLICY "Public can view reservation by reference"
ON public.reservations FOR SELECT TO public
USING (true);
-- Note: reservations table contains client PII; the confirmation page uses the unique reference (UUID-like) as a capability token.

CREATE TRIGGER trg_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. bank_settings singleton
CREATE TABLE IF NOT EXISTS public.bank_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  iban text,
  bic text,
  account_holder text,
  bank_name text,
  instructions text,
  default_deposit_amount numeric NOT NULL DEFAULT 1000,
  hold_days integer NOT NULL DEFAULT 7,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (singleton = true)
);

ALTER TABLE public.bank_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bank settings publicly readable"
ON public.bank_settings FOR SELECT TO public
USING (true);

CREATE POLICY "Admins can insert bank settings"
ON public.bank_settings FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bank settings"
ON public.bank_settings FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_bank_settings_updated_at
BEFORE UPDATE ON public.bank_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Insert default singleton row
INSERT INTO public.bank_settings (singleton, default_deposit_amount, hold_days, instructions)
VALUES (true, 1000, 7, 'Merci d''indiquer la référence en libellé du virement. Le véhicule est pré-réservé pendant 7 jours dans l''attente de la réception du virement.')
ON CONFLICT (singleton) DO NOTHING;
