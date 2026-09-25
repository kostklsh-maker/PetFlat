import type { Lang } from '../i18n/types';

export type Species = 'dog' | 'cat' | 'bird' | 'rodent' | 'other';

export type PlanId = 'basic' | 'standard' | 'premium';

export type ServiceId = 'findypet' | 'medical' | 'club' | 'grooming' | 'hotel';

export interface Owner {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  nextDate?: string;
}

export interface VetVisit {
  id: string;
  date: string;
  clinic: string;
  reason: string;
  notes?: string;
}

export interface MedicalCard {
  allergies: string;
  chronic: string;
  vaccinations: Vaccination[];
  visits: VetVisit[];
}

export interface HotelCard {
  feeding: string;
  walks: string;
  habits: string;
  medications: string;
  emergencyContact: string;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string;
  sex: 'male' | 'female';
  color: string;
  weightKg?: number;
  chipNumber?: string;
  /** Municipal dog license (רישיון להחזקת כלב), required for dogs in Israel. */
  licenseNumber?: string;
  specialMarks?: string;
  medical: MedicalCard;
  hotel: HotelCard;
}

export interface ClubCard {
  number: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
}

export interface GroomingBooking {
  id: string;
  petId: string;
  salonId: string;
  serviceId: string;
  date: string;
  time: string;
}

export type LostFoundKind = 'lost' | 'found';

export interface LostFoundPost {
  id: string;
  kind: LostFoundKind;
  petName?: string;
  species: Species;
  breed: string;
  color: string;
  description: string;
  area: string;
  date: string;
  contactName: string;
  contactPhone: string;
  reward?: number;
  ownPetId?: string; // set when the post was created by this user for their pet
  resolved?: boolean;
}

export interface AppState {
  onboarded: boolean;
  lang: Lang;
  owner: Owner;
  plan: PlanId;
  pets: Pet[];
  club: ClubCard;
  bookings: GroomingBooking[];
  posts: LostFoundPost[];
}
