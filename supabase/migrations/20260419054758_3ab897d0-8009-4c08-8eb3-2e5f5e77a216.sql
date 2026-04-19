-- Enum for trade-in vehicle condition
CREATE TYPE public.trade_in_condition AS ENUM ('excellent', 'bon', 'moyen', 'a_renover');

-- Enum for trade-in status
CREATE TYPE public.trade_in_status AS ENUM ('nouveau', 'en_cours', 'estime', 'refuse', 'archive');

-- Trade-in requests table
CREATE TABLE public.trade_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Customer info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- Vehicle info
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  vehicle_type public.vehicle_type NOT NULL,
  condition public.trade_in_condition NOT NULL,
  fuel TEXT,
  seats INTEGER,
  length_cm INTEGER,
  -- Additional notes
  message TEXT,
  -- Estimation
  estimate_low NUMERIC,
  estimate_high NUMERIC,
  ai_analysis TEXT,
  -- Photos (paths in storage)
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Tracking
  status public.trade_in_status NOT NULL DEFAULT 'nouveau',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit a valid trade-in"
ON public.trade_ins
FOR INSERT
TO public
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (phone IS NULL OR char_length(phone) <= 30)
  AND char_length(brand) BETWEEN 1 AND 80
  AND char_length(model) BETWEEN 1 AND 120
  AND year BETWEEN 1970 AND 2100
  AND mileage BETWEEN 0 AND 2000000
  AND (message IS NULL OR char_length(message) <= 2000)
  AND coalesce(array_length(photos, 1), 0) <= 8
);

CREATE POLICY "Admins can view trade-ins"
ON public.trade_ins
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update trade-ins"
ON public.trade_ins
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete trade-ins"
ON public.trade_ins
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER set_trade_ins_updated_at
BEFORE UPDATE ON public.trade_ins
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Index for admin listing
CREATE INDEX idx_trade_ins_status_created ON public.trade_ins (status, created_at DESC);

-- Storage bucket for trade-in photos (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-in-photos', 'trade-in-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Anyone can upload to a session-scoped folder (validated client-side; admins moderate)
CREATE POLICY "Public can upload trade-in photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'trade-in-photos');

-- Only admins can read photos
CREATE POLICY "Admins can read trade-in photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'trade-in-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete photos
CREATE POLICY "Admins can delete trade-in photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'trade-in-photos' AND has_role(auth.uid(), 'admin'::app_role));