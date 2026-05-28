-- 1. Add 'team' to app_role enum (must commit before using in same tx)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'team';

-- 2. Add created_by to vehicles (tracks which team member added it)
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
