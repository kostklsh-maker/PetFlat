import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { L10n } from '../i18n/types';
import type { PlanId, ServiceId, Species } from './types';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface Plan {
  id: PlanId;
  title: L10n;
  /** Monthly price in ILS, VAT included. */
  pricePerMonth: number;
  maxPets: number;
  services: ServiceId[];
  perks: L10n[];
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    title: { ru: 'Базовый', en: 'Basic', he: 'בסיסי' },
    pricePerMonth: 0,
    maxPets: 1,
    services: ['findypet'],
    perks: [
      { ru: 'Цифровой профиль владельца', en: 'Digital owner profile', he: 'פרופיל בעלים דיגיטלי' },
      { ru: '1 питомец', en: '1 pet', he: 'חיית מחמד אחת' },
      {
        ru: 'FindYpet: объявления о пропаже и находке',
        en: 'FindYpet: lost & found posts',
        he: 'FindYpet: מודעות אבידה ומציאה',
      },
    ],
  },
  {
    id: 'standard',
    title: { ru: 'Стандарт', en: 'Standard', he: 'סטנדרט' },
    pricePerMonth: 29.9,
    maxPets: 3,
    services: ['findypet', 'medical', 'club', 'hotel'],
    perks: [
      { ru: 'До 3 питомцев', en: 'Up to 3 pets', he: 'עד 3 חיות מחמד' },
      {
        ru: 'Больничная карта с напоминаниями о прививках',
        en: 'Medical record with vaccination reminders',
        he: 'תיק רפואי עם תזכורות לחיסונים',
      },
      { ru: 'Клубная карта зоомагазинов', en: 'Pet store club card', he: 'כרטיס מועדון לחנויות חיות' },
      { ru: 'Информационная карта для пансионов', en: 'Info card for pet hotels', he: 'כרטיס מידע לפנסיונים' },
    ],
  },
  {
    id: 'premium',
    title: { ru: 'Премиум', en: 'Premium', he: 'פרימיום' },
    pricePerMonth: 59.9,
    maxPets: 10,
    services: ['findypet', 'medical', 'club', 'hotel', 'grooming'],
    perks: [
      { ru: 'До 10 питомцев', en: 'Up to 10 pets', he: 'עד 10 חיות מחמד' },
      { ru: 'Все сервисы тарифа «Стандарт»', en: 'Everything in Standard', he: 'כל השירותים של מסלול סטנדרט' },
      { ru: 'Онлайн-запись к грумерам', en: 'Online grooming appointments', he: 'קביעת תורים למספרות כלבים' },
      {
        ru: 'Повышенный кешбэк по клубной карте (+2%)',
        en: 'Higher club card cashback (+2%)',
        he: 'קאשבק מוגדל בכרטיס המועדון (‎+2%)',
      },
      {
        ru: 'Приоритетный показ объявлений FindYpet',
        en: 'Priority placement for FindYpet posts',
        he: 'הצגה מועדפת למודעות FindYpet',
      },
    ],
  },
];

/** Extra cashback (percentage points) on the Premium plan. */
export const PREMIUM_CASHBACK_BONUS = 2;

export interface ServiceInfo {
  id: ServiceId;
  title: L10n;
  subtitle: L10n;
  icon: IconName;
  color: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    id: 'findypet',
    title: { ru: 'FindYpet', en: 'FindYpet', he: 'FindYpet' },
    subtitle: { ru: 'Поиск потерявшихся питомцев', en: 'Lost pet search', he: 'חיפוש חיות מחמד אבודות' },
    icon: 'search',
    color: '#E4572E',
  },
  {
    id: 'medical',
    title: { ru: 'Больничная карта', en: 'Medical record', he: 'תיק רפואי' },
    subtitle: {
      ru: 'Прививки, визиты к ветеринару, аллергии',
      en: 'Vaccinations, vet visits, allergies',
      he: 'חיסונים, ביקורים אצל וטרינר, אלרגיות',
    },
    icon: 'medkit',
    color: '#2A9D8F',
  },
  {
    id: 'club',
    title: { ru: 'Клубная карта', en: 'Club card', he: 'כרטיס מועדון' },
    subtitle: { ru: 'Баллы и скидки в зоомагазинах', en: 'Points and discounts at pet stores', he: 'נקודות והנחות בחנויות חיות' },
    icon: 'card',
    color: '#6C5CE7',
  },
  {
    id: 'hotel',
    title: { ru: 'Карта для пансионов', en: 'Pet hotel card', he: 'כרטיס לפנסיון' },
    subtitle: {
      ru: 'Всё о питомце для пансиона или передержки',
      en: 'Everything a pet hotel or sitter needs to know',
      he: 'כל מה שפנסיון או דוגיסיטר צריכים לדעת',
    },
    icon: 'bed',
    color: '#F4A261',
  },
  {
    id: 'grooming',
    title: { ru: 'Грумеры', en: 'Grooming', he: 'מספרות לכלבים' },
    subtitle: { ru: 'Запись в салоны груминга', en: 'Book grooming salons', he: 'קביעת תור במספרה' },
    icon: 'cut',
    color: '#E76F9A',
  },
];

export const SPECIES: Species[] = ['dog', 'cat', 'bird', 'rodent', 'other'];

export const SPECIES_ICON: Record<Species, IconName> = {
  dog: 'paw',
  cat: 'paw',
  bird: 'egg',
  rodent: 'paw',
  other: 'help-circle',
};

// Partner and salon names below are placeholders for the MVP, not real businesses.

export interface PartnerShop {
  id: string;
  name: L10n;
  address: L10n;
  cashbackPercent: number;
}

export const PARTNER_SHOPS: PartnerShop[] = [
  {
    id: 's1',
    name: { ru: 'Zoo Point', en: 'Zoo Point', he: 'זו פוינט' },
    address: { ru: 'Тель-Авив, ул. Дизенгоф, 120', en: '120 Dizengoff St, Tel Aviv', he: 'דיזנגוף 120, תל אביב' },
    cashbackPercent: 5,
  },
  {
    id: 's2',
    name: { ru: 'Hayot Plus', en: 'Hayot Plus', he: 'חיות פלוס' },
    address: { ru: 'Хайфа, ул. Герцль, 35', en: '35 Herzl St, Haifa', he: 'הרצל 35, חיפה' },
    cashbackPercent: 5,
  },
  {
    id: 's3',
    name: { ru: 'Pet Market', en: 'Pet Market', he: 'פט מרקט' },
    address: { ru: 'Иерусалим, ул. Яффо, 45', en: '45 Jaffa Rd, Jerusalem', he: 'יפו 45, ירושלים' },
    cashbackPercent: 3,
  },
];

export interface GroomingService {
  id: string;
  name: L10n;
  price: number;
}

export interface GroomingSalon {
  id: string;
  name: L10n;
  address: L10n;
  rating: number;
  /** Weekdays the salon is closed (0 = Sunday … 6 = Saturday). */
  closedDays: number[];
  services: GroomingService[];
}

export const GROOMING_SALONS: GroomingSalon[] = [
  {
    id: 'g1',
    name: { ru: 'Fluffy Style', en: 'Fluffy Style', he: 'פלאפי סטייל' },
    address: { ru: 'Тель-Авив, ул. Ибн Гвироль, 50', en: '50 Ibn Gabirol St, Tel Aviv', he: 'אבן גבירול 50, תל אביב' },
    rating: 4.9,
    closedDays: [6],
    services: [
      { id: 'full', name: { ru: 'Комплексный груминг', en: 'Full grooming', he: 'טיפוח מלא' }, price: 250 },
      { id: 'nails', name: { ru: 'Стрижка когтей', en: 'Nail trim', he: 'גזיזת ציפורניים' }, price: 50 },
      { id: 'bath', name: { ru: 'Мытьё и сушка', en: 'Bath & dry', he: 'רחצה וייבוש' }, price: 150 },
    ],
  },
  {
    id: 'g2',
    name: { ru: 'Grooming Lab', en: 'Grooming Lab', he: 'גרומינג לאב' },
    address: { ru: 'Рамат-Ган, ул. Бялик, 20', en: '20 Bialik St, Ramat Gan', he: 'ביאליק 20, רמת גן' },
    rating: 4.7,
    closedDays: [6],
    services: [
      { id: 'cut', name: { ru: 'Модельная стрижка', en: 'Breed-style cut', he: 'תספורת לפי גזע' }, price: 320 },
      { id: 'deshed', name: { ru: 'Экспресс-линька', en: 'Deshedding', he: 'טיפול נגד נשירה' }, price: 200 },
      { id: 'ears', name: { ru: 'Чистка ушей', en: 'Ear cleaning', he: 'ניקוי אוזניים' }, price: 40 },
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
