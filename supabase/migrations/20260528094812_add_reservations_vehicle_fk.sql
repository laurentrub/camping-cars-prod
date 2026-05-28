ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_vehicle_id_fkey
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE RESTRICT;
