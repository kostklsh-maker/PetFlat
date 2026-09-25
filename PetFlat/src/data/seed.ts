import { deviceLang } from '../i18n/device';
import type { AppState, HotelCard, MedicalCard } from './types';

export const emptyMedical = (): MedicalCard => ({
  allergies: '',
  chronic: '',
  vaccinations: [],
  visits: [],
});

export const emptyHotel = (): HotelCard => ({
  feeding: '',
  walks: '',
  habits: '',
  medications: '',
  emergencyContact: '',
});

export const initialState = (): AppState => ({
  onboarded: false,
  lang: deviceLang(),
  owner: { name: '', phone: '', email: '', city: '' },
  plan: 'basic',
  pets: [],
  club: { number: '', points: 0, level: 'bronze' },
  bookings: [],
  // Demo feed so FindYpet is not empty before a backend exists. Posts are user content,
  // so each one stays in the language its author wrote it in — as it would in Israel.
  posts: [
    {
      id: 'demo-1',
      kind: 'lost',
      petName: "ג'ינג'י",
      species: 'cat',
      breed: 'מעורב',
      color: "ג'ינג'י",
      description: 'ברח מהבניין, ביישן. קולר כחול עם פעמון.',
      area: 'תל אביב, פלורנטין',
      date: '2026-09-22',
      contactName: 'נועה',
      contactPhone: '+972 52-111-2233',
      reward: 500,
    },
    {
      id: 'demo-2',
      kind: 'found',
      species: 'dog',
      breed: 'Похож на лабрадора',
      color: 'Палевый',
      description: 'Найден у парка на Кармеле, дружелюбный, без ошейника. Временно у нас.',
      area: 'Хайфа, Кармель',
      date: '2026-09-24',
      contactName: 'Игорь',
      contactPhone: '+972 54-444-5566',
    },
    {
      id: 'demo-3',
      kind: 'lost',
      petName: 'Max',
      species: 'dog',
      breed: 'Beagle',
      color: 'Tricolor',
      description: 'Ran off near the First Station. Microchipped, very friendly.',
      area: 'Jerusalem, German Colony',
      date: '2026-09-23',
      contactName: 'David',
      contactPhone: '+972 50-777-8899',
      reward: 1000,
    },
  ],
});
