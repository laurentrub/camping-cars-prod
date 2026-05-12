-- Add new statuses to the reservation_status enum
ALTER TYPE public.reservation_status ADD VALUE IF NOT EXISTS 'contact_effectue';
ALTER TYPE public.reservation_status ADD VALUE IF NOT EXISTS 'en_attente_client';

-- Create reservation_events table for full history
CREATE TABLE IF NOT EXISTS public.reservation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  note TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservation_events_reservation_id
  ON public.reservation_events(reservation_id, created_at DESC);

ALTER TABLE public.reservation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view reservation events"
  ON public.reservation_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert reservation events"
  ON public.reservation_events FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reservation events"
  ON public.reservation_events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger function to auto-log status changes
CREATE OR REPLACE FUNCTION public.log_reservation_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.reservation_events (reservation_id, event_type, to_status, note)
    VALUES (NEW.id, 'created', NEW.status::text, 'Demande de visite reçue');
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.reservation_events (reservation_id, event_type, from_status, to_status, created_by)
    VALUES (NEW.id, 'status_change', OLD.status::text, NEW.status::text, auth.uid());
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_reservation_status ON public.reservations;
CREATE TRIGGER trg_log_reservation_status
  AFTER INSERT OR UPDATE OF status ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_reservation_status_change();

-- Trigger for updated_at on reservations (if not already there)
DROP TRIGGER IF EXISTS trg_reservations_updated_at ON public.reservations;
CREATE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();