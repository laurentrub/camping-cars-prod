
ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'demande_visite';
ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'visite_confirmee';
ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'visite_realisee';
