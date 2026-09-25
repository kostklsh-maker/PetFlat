import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { PlanId, ServiceId, Species } from './types';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface Plan {
  id: PlanId;
  title: string;
  pricePerMonth: number;
  maxPets: number;
  services: ServiceId[];
  perks: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    title: 'Базовый',
    pricePerMonth: 0,
    maxPets: 1,
    services: ['findypet'],
    perks: ['Цифровой профиль владельца', '1 питомец', 'FindYpet: объявления о пропаже и находке'],
  },
  {
    id: 'standard',
    title: 'Стандарт',
    pricePerMonth: 299,
    maxPets: 3,
    services: ['findypet', 'medical', 'club', 'hotel'],
    perks: [
      'До 3 питомцев',
      'Больничная карта с напоминаниями о прививках',
      'Клубная карта зоомагазинов',
      'Информационная карта для гостиниц',
    ],
  },
  {
    id: 'premium',
    title: 'Премиум',
    pricePerMonth: 599,
    maxPets: 10,
    services: ['findypet', 'medical', 'club', 'hotel', 'grooming'],
    perks: [
      'До 10 питомцев',
      'Все сервисы тарифа «Стандарт»',
      'Онлайн-запись к грумерам',
      'Повышенный кешбэк по клубной карте (7%)',
      'Приоритетный показ объявлений FindYpet',
    ],
  },
];

export interface ServiceInfo {
  id: ServiceId;
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    id: 'findypet',
    title: 'FindYpet',
    subtitle: 'Поиск потерявшихся питомцев',
    icon: 'search',
    color: '#E4572E',
  },
  {
    id: 'medical',
    title: 'Больничная карта',
    subtitle: 'Прививки, визиты к ветеринару, аллергии',
    icon: 'medkit',
    color: '#2A9D8F',
  },
  {
    id: 'club',
    title: 'Клубная карта',
    subtitle: 'Баллы и скидки в зоомагазинах',
    icon: 'card',
    color: '#6C5CE7',
  },
  {
    id: 'hotel',
    title: 'Карта для гостиниц',
    subtitle: 'Всё о питомце для зоогостиницы или передержки',
    icon: 'bed',
    color: '#F4A261',
  },
  {
    id: 'grooming',
    title: 'Грумеры',
    subtitle: 'Запись в салоны груминга',
    icon: 'cut',
    color: '#E76F9A',
  },
];

export const SPECIES_LABEL: Record<Species, string> = {
  dog: 'Собака',
  cat: 'Кошка',
  bird: 'Птица',
  rodent: 'Грызун',
  other: 'Другое',
};

export const SPECIES_ICON: Record<Species, IconName> = {
  dog: 'paw',
  cat: 'paw',
  bird: 'egg',
  rodent: 'paw',
  other: 'help-circle',
};

export interface PartnerShop {
  id: string;
  name: string;
  address: string;
  cashbackPercent: number;
}

export const PARTNER_SHOPS: PartnerShop[] = [
  { id: 's1', name: 'ЗооМир', address: 'ул. Ленина, 12', cashbackPercent: 5 },
  { id: 's2', name: 'Четыре лапы', address: 'пр. Мира, 45', cashbackPercent: 5 },
  { id: 's3', name: 'Бетховен', address: 'ТЦ «Галерея», 2 этаж', cashbackPercent: 3 },
];

export interface GroomingSalon {
  id: string;
  name: string;
  address: string;
  rating: number;
  services: { name: string; price: number }[];
}

export const GROOMING_SALONS: GroomingSalon[] = [
  {
    id: 'g1',
    name: 'Пушистый стиль',
    address: 'ул. Садовая, 8',
    rating: 4.9,
    services: [
      { name: 'Комплексный груминг', price: 2500 },
      { name: 'Стрижка когтей', price: 400 },
      { name: 'Мытьё и сушка', price: 1200 },
    ],
  },
  {
    id: 'g2',
    name: 'Grooming Lab',
    address: 'пр. Победы, 101',
    rating: 4.7,
    services: [
      { name: 'Модельная стрижка', price: 3200 },
      { name: 'Экспресс-линька', price: 1800 },
      { name: 'Чистка ушей', price: 350 },
    ],
  },
];

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function serviceById(id: ServiceId): ServiceInfo {
  return SERVICES.find((s) => s.id === id)!;
}

/** Cheapest plan that includes the given service. */
export function minPlanFor(service: ServiceId): Plan {
  return PLANS.find((p) => p.services.includes(service))!;
}
