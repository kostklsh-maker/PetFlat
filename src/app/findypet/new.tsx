import { goBack } from '../../components/nav';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { isIsoDate, todayIso } from '../../components/format';
import { Button, Field, Muted, Screen, Segmented } from '../../components/ui';
import { SPECIES_LABEL } from '../../data/catalog';
import type { LostFoundKind, Species } from '../../data/types';
import { usePet, useStore } from '../../store/AppStore';

const SPECIES = Object.keys(SPECIES_LABEL) as Species[];

export default function NewPost() {
  const params = useLocalSearchParams<{ kind?: LostFoundKind; petId?: string }>();
  const pet = usePet(params.petId);
  const { state, addPost } = useStore();

  const [kind, setKind] = useState<LostFoundKind>(params.kind ?? 'lost');
  const [petName, setPetName] = useState(pet?.name ?? '');
  const [species, setSpecies] = useState<Species>(pet?.species ?? 'dog');
  const [breed, setBreed] = useState(pet?.breed ?? '');
  const [color, setColor] = useState(pet?.color ?? '');
  const [description, setDescription] = useState(
    [pet?.specialMarks, pet?.chipNumber ? `Чипирован: ${pet.chipNumber}` : ''].filter(Boolean).join('. '),
  );
  const [area, setArea] = useState(state.owner.city);
  const [date, setDate] = useState(todayIso());
  const [contactName, setContactName] = useState(state.owner.name);
  const [contactPhone, setContactPhone] = useState(state.owner.phone);
  const [reward, setReward] = useState('');

  const submit = () => {
    if (!area.trim() || !contactPhone.trim() || !isIsoDate(date)) {
      Alert.alert('Проверьте поля', 'Укажите место, дату (ГГГГ-ММ-ДД) и телефон для связи.');
      return;
    }
    const r = parseInt(reward.replace(/\D/g, ''), 10);
    addPost({
      kind,
      petName: kind === 'lost' ? petName.trim() || undefined : undefined,
      species,
      breed: breed.trim() || 'Не указана',
      color: color.trim() || 'Не указан',
      description: description.trim(),
      area: area.trim(),
      date,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      reward: kind === 'lost' && r > 0 ? r : undefined,
      ownPetId: kind === 'lost' ? pet?.id : undefined,
    });
    // TODO: publish to the FindYpet backend and notify nearby users (push notifications).
    goBack();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: pet ? `${pet.name} потерялся` : 'Новое объявление' }} />
      {!pet && (
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'lost', label: 'Потерялся' },
            { value: 'found', label: 'Нашёл животное' },
          ]}
        />
      )}
      {pet && <Muted>Данные подставлены из профиля питомца — проверьте и дополните.</Muted>}
      {kind === 'lost' && <Field label="Кличка" value={petName} onChangeText={setPetName} />}
      <Segmented value={species} onChange={setSpecies} options={SPECIES.map((s) => ({ value: s, label: SPECIES_LABEL[s] }))} />
      <Field label="Порода" value={breed} onChangeText={setBreed} />
      <Field label="Окрас" value={color} onChangeText={setColor} />
      <Field label="Описание и приметы" value={description} onChangeText={setDescription} multiline />
      <Field label={kind === 'lost' ? 'Где потерялся *' : 'Где найден *'} value={area} onChangeText={setArea} />
      <Field label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} />
      <Field label="Контактное лицо" value={contactName} onChangeText={setContactName} />
      <Field label="Телефон *" value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />
      {kind === 'lost' && (
        <Field label="Вознаграждение, ₽" value={reward} onChangeText={setReward} keyboardType="number-pad" />
      )}
      <Button title="Опубликовать" icon="megaphone" onPress={submit} />
    </Screen>
  );
}
