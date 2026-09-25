import { useState } from 'react';
import { Share } from 'react-native';
import { ageLabel } from '../../components/format';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { Button, Card, Field, Muted, Screen } from '../../components/ui';
import { SPECIES_LABEL } from '../../data/catalog';
import type { HotelCard, Pet } from '../../data/types';
import { useStore } from '../../store/AppStore';

export default function HotelScreen() {
  return (
    <PlanGate service="hotel">
      <Hotel />
    </PlanGate>
  );
}

const FIELDS: { key: keyof HotelCard; label: string; placeholder: string }[] = [
  { key: 'feeding', label: 'Кормление', placeholder: 'Корм, порции, время кормления' },
  { key: 'walks', label: 'Прогулки', placeholder: 'Сколько раз в день, особенности' },
  { key: 'habits', label: 'Характер и привычки', placeholder: 'Боится громких звуков, не ладит с котами…' },
  { key: 'medications', label: 'Лекарства', placeholder: 'Что, когда и в какой дозировке' },
  { key: 'emergencyContact', label: 'Контакт на экстренный случай', placeholder: 'Имя, телефон, ветклиника' },
];

function Hotel() {
  const [pet, selectPet] = useSelectedPet();
  return (
    <Screen>
      <PetPicker value={pet} onChange={selectPet} />
      {/* Keyed by pet so unsaved edits reset when switching pets. */}
      {pet && <HotelBody key={pet.id} pet={pet} />}
    </Screen>
  );
}

function HotelBody({ pet }: { pet: Pet }) {
  const { state, updateHotel } = useStore();
  const [card, setCard] = useState<HotelCard>(pet.hotel);
  const [saved, setSaved] = useState(true);

  const share = () =>
    Share.share({
      title: `Карта питомца ${pet.name}`,
      message: [
        `🐾 ${pet.name} — ${SPECIES_LABEL[pet.species]}${pet.breed ? `, ${pet.breed}` : ''}${pet.birthDate ? `, ${ageLabel(pet.birthDate)}` : ''}`,
        pet.weightKg ? `Вес: ${pet.weightKg} кг` : '',
        pet.medical.allergies ? `Аллергии: ${pet.medical.allergies}` : '',
        ...FIELDS.map((f) => (card[f.key] ? `${f.label}: ${card[f.key]}` : '')),
        `Владелец: ${state.owner.name}, ${state.owner.phone}`,
        'Карта создана в PetFlat',
      ]
        .filter(Boolean)
        .join('\n'),
    });

  return (
    <>
      <Muted>Заполните один раз и отправляйте в зоогостиницу, на передержку или ситтеру.</Muted>
      <Card>
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            value={card[f.key]}
            multiline
            onChangeText={(t) => {
              setCard({ ...card, [f.key]: t });
              setSaved(false);
            }}
          />
        ))}
        {!saved && (
          <Button
            title="Сохранить"
            icon="checkmark"
            onPress={() => {
              updateHotel(pet.id, card);
              setSaved(true);
            }}
          />
        )}
      </Card>
      <Button title="Отправить карту" variant="secondary" icon="share-social" onPress={share} />
    </>
  );
}
