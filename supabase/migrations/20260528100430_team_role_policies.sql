-- Helper: check if user has 'team' role
CREATE OR REPLACE FUNCTION public.is_team(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'team');
$$;

-- Vehicles: replace admin-only write policies with team-aware ones
DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;

CREATE POLICY "Team can insert vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    (public.is_team(auth.uid()) AND created_by = auth.uid())
  );

CREATE POLICY "Team can update own vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (public.is_team(auth.uid()) AND created_by = auth.uid())
  );

CREATE POLICY "Team can delete own vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (public.is_team(auth.uid()) AND created_by = auth.uid())
  );

-- Reservations: replace admin-only SELECT with team-scoped policy
DROP POLICY IF EXISTS "Admins can view reservations" ON public.reservations;
DROP POLICY IF EXISTS "Public can view reservation by reference" ON public.reservations;

-- Authenticated: admin sees all, team sees only reservations on their vehicles
CREATE POLICY "Admin or team can view reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    (
      public.is_team(auth.uid()) AND
      EXISTS (
        SELECT 1 FROM public.vehicles v
        WHERE v.id = reservations.vehicle_id
          AND v.created_by = auth.uid()
      )
    )
  );

-- Public: confirmation page fetches by reference (capability token)
CREATE POLICY "Public can view reservation by reference"
  ON public.reservations FOR SELECT
  TO public
  USING (true);

-- Storage: replace admin-only write policies with team-aware ones
DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;

CREATE POLICY "Admin or team can upload vehicle photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'vehicle-photos' AND (
      public.has_role(auth.uid(), 'admin') OR
      public.is_team(auth.uid())
    )
  );

CREATE POLICY "Admin or team can update vehicle photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'vehicle-photos' AND (
      public.has_role(auth.uid(), 'admin') OR
      public.is_team(auth.uid())
    )
  );

CREATE POLICY "Admin or team can delete vehicle photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'vehicle-photos' AND (
      public.has_role(auth.uid(), 'admin') OR
      public.is_team(auth.uid())
    )
  );
