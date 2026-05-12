export type VehicleType = 'profile' | 'integral' | 'fourgon' | 'capucine';
export type VehicleCondition = 'neuf' | 'occasion';
export type VehicleStatus = 'disponible' | 'pre_reserve' | 'reserve' | 'vendu';

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  type: VehicleType;
  condition: VehicleCondition;
  status: VehicleStatus;
  seats: number;
  beds: number;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  power_hp: number | null;
  length_cm: number | null;
  description: string;
  short_description: string | null;
  features: string[];
  images: string[];
  cover_image: string | null;
  is_featured: boolean;
  deposit_override: number | null;
  reserved_until: string | null;
  created_at: string;
  updated_at: string;
}

export const TYPE_LABELS: Record<VehicleType, string> = {
  profile: 'Profilé',
  integral: 'Intégral',
  fourgon: 'Fourgon',
  capucine: 'Capucine',
};

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  disponible: 'Disponible',
  pre_reserve: 'Pré-réservé',
  reserve: 'Réservé',
  vendu: 'Vendu',
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

export const formatMileage = (km: number | null) =>
  km == null ? '—' : `${new Intl.NumberFormat('fr-FR').format(km)} km`;
