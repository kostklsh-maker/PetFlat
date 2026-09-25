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

export const initialState: AppState = {
  onboarded: false,
  owner: { name: '', phone: '', email: '', city: '' },
  plan: 'basic',
  pets: [],
  club: { number: '', points: 0, level: 'Бронза' },
  bookings: [],
  // Demo feed so FindYpet is not empty before a backend exists.
  posts: [
    {
      id: 'demo-1',
      kind: 'lost',
      petName: 'Рыжик',
      species: 'cat',
      breed: 'Беспородный',
      color: 'Рыжий',
      description: 'Убежал из подъезда, пугливый, на шее синий ошейник.',
      area: 'Центральный район, ул. Пушкина',
      date: '2026-09-22',
      contactName: 'Анна',
      contactPhone: '+7 900 111-22-33',
      reward: 5000,
    },
    {
      id: 'demo-2',
      kind: 'found',
      species: 'dog',
      breed: 'Похож на лабрадора',
      color: 'Палевый',
      description: 'Найден у парка, дружелюбный, без ошейника. Временно у нас.',
      area: 'Парк Победы',
      date: '2026-09-24',
      contactName: 'Игорь',
      contactPhone: '+7 900 444-55-66',
    },
  ],
};
