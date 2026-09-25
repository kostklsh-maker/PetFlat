import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { planById } from '../data/catalog';
import { initialState } from '../data/seed';
import type {
  AppState,
  GroomingBooking,
  HotelCard,
  LostFoundPost,
  MedicalCard,
  Owner,
  Pet,
  PlanId,
  ServiceId,
} from '../data/types';

const STORAGE_KEY = 'petflat/state/v1';

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const clubNumber = () =>
  'PF ' + Array.from({ length: 3 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');

interface Store {
  state: AppState;
  ready: boolean;
  hasService: (id: ServiceId) => boolean;
  canAddPet: boolean;
  completeOnboarding: (owner: Owner) => void;
  updateOwner: (owner: Owner) => void;
  setPlan: (plan: PlanId) => void;
  addPet: (pet: Omit<Pet, 'id'>) => string;
  updatePet: (id: string, patch: Partial<Omit<Pet, 'id'>>) => void;
  removePet: (id: string) => void;
  updateMedical: (petId: string, patch: Partial<MedicalCard>) => void;
  updateHotel: (petId: string, card: HotelCard) => void;
  addBooking: (b: Omit<GroomingBooking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  addPost: (p: Omit<LostFoundPost, 'id'>) => void;
  resolvePost: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const mapPet = useCallback((petId: string, fn: (p: Pet) => Pet) => {
    setState((s) => ({ ...s, pets: s.pets.map((p) => (p.id === petId ? fn(p) : p)) }));
  }, []);

  const store = useMemo<Store>(() => {
    const plan = planById(state.plan);
    return {
      state,
      ready,
      hasService: (id) => plan.services.includes(id),
      canAddPet: state.pets.length < plan.maxPets,
      completeOnboarding: (owner) => setState((s) => ({ ...s, owner, onboarded: true })),
      updateOwner: (owner) => setState((s) => ({ ...s, owner })),
      setPlan: (id) =>
        setState((s) => ({
          ...s,
          plan: id,
          club: planById(id).services.includes('club') && !s.club.number
            ? { ...s.club, number: clubNumber() }
            : s.club,
        })),
      addPet: (pet) => {
        const id = newId();
        setState((s) => ({ ...s, pets: [...s.pets, { ...pet, id }] }));
        return id;
      },
      updatePet: (id, patch) => mapPet(id, (p) => ({ ...p, ...patch })),
      removePet: (id) =>
        setState((s) => ({
          ...s,
          pets: s.pets.filter((p) => p.id !== id),
          bookings: s.bookings.filter((b) => b.petId !== id),
        })),
      updateMedical: (petId, patch) => mapPet(petId, (p) => ({ ...p, medical: { ...p.medical, ...patch } })),
      updateHotel: (petId, card) => mapPet(petId, (p) => ({ ...p, hotel: card })),
      addBooking: (b) => setState((s) => ({ ...s, bookings: [...s.bookings, { ...b, id: newId() }] })),
      cancelBooking: (id) => setState((s) => ({ ...s, bookings: s.bookings.filter((b) => b.id !== id) })),
      addPost: (p) => setState((s) => ({ ...s, posts: [{ ...p, id: newId() }, ...s.posts] })),
      resolvePost: (id) =>
        setState((s) => ({ ...s, posts: s.posts.map((p) => (p.id === id ? { ...p, resolved: true } : p)) })),
      resetAll: () => setState(initialState),
    };
  }, [state, ready, mapPet]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside AppStoreProvider');
  return s;
}

export function usePet(id: string | undefined): Pet | undefined {
  const { state } = useStore();
  return state.pets.find((p) => p.id === id);
}
