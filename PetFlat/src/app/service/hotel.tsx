import { useState } from 'react';
import { Share } from 'react-native';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { Button, Card, Field, Muted, Screen } from '../../components/ui';
import type { HotelCard, Pet } from '../../data/types';
import { useT, type TKey } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function HotelScreen() {
  return (
    <PlanGate service="hotel">
      <Hotel />
    </PlanGate>
  );
}

const FIELDS: { key: keyof HotelCard; label: TKey; placeholder: TKey }[] = [
  { key: 'feeding', label: 'hotel.feeding', placeholder: 'hotel.feedingPh' },
  { key: 'walks', label: 'hotel.walks', placeholder: 'hotel.walksPh' },
  { key: 'habits', label: 'hotel.habits', placeholder: 'hotel.habitsPh' },
  { key: 'medications', label: 'hotel.medications', placeholder: 'hotel.medicationsPh' },
  { key: 'emergencyContact', label: 'hotel.emergency', placeholder: 'hotel.emergencyPh' },
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
  const { t, age } = useT();
  const [card, setCard] = useState<HotelCard>(pet.hotel);
  const [saved, setSaved] = useState(true);

  const share = () =>
    Share.share({
      title: t('hotel.shareTitle', { name: pet.name }),
      message: [
        `🐾 ${pet.name} — ${[t(`species.${pet.species}`), pet.breed, age(pet.birthDate)].filter(Boolean).join(', ')}`,
        pet.weightKg ? t('hotel.weightLine', { n: pet.weightKg }) : '',
        pet.medical.allergies ? t('hotel.allergiesLine', { text: pet.medical.allergies }) : '',
        ...FIELDS.map((f) => (card[f.key] ? `${t(f.label)}: ${card[f.key]}` : '')),
        t('pet.shareOwner', { name: state.owner.name, phone: state.owner.phone }),
        t('hotel.createdIn'),
      ]
        .filter(Boolean)
        .join('\n'),
    });

  return (
    <>
      <Muted>{t('hotel.intro')}</Muted>
      <Card>
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            label={t(f.label)}
            placeholder={t(f.placeholder)}
            value={card[f.key]}
            multiline
            onChangeText={(text) => {
              setCard({ ...card, [f.key]: text });
              setSaved(false);
            }}
          />
        ))}
        {!saved && (
          <Button
            title={t('common.save')}
            icon="checkmark"
            onPress={() => {
              updateHotel(pet.id, card);
              setSaved(true);
            }}
          />
        )}
      </Card>
      <Button title={t('hotel.send')} variant="secondary" icon="share-social" onPress={share} />
    </>
  );
}
