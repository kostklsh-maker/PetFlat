import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { parseDateInput, todayIso, toInputDate } from '../../components/format';
import { goBack } from '../../components/nav';
import { Button, Field, Muted, Screen, Segmented } from '../../components/ui';
import { SPECIES } from '../../data/catalog';
import type { LostFoundKind, Species } from '../../data/types';
import { useT } from '../../i18n';
import { usePet, useStore } from '../../store/AppStore';

export default function NewPost() {
  const params = useLocalSearchParams<{ kind?: LostFoundKind; petId?: string }>();
  const pet = usePet(params.petId);
  const { state, addPost } = useStore();
  const { t } = useT();

  const [kind, setKind] = useState<LostFoundKind>(params.kind ?? 'lost');
  const [petName, setPetName] = useState(pet?.name ?? '');
  const [species, setSpecies] = useState<Species>(pet?.species ?? 'dog');
  const [breed, setBreed] = useState(pet?.breed ?? '');
  const [color, setColor] = useState(pet?.color ?? '');
  const [description, setDescription] = useState(
    [pet?.specialMarks, pet?.chipNumber ? t('fyp.chipped', { chip: pet.chipNumber }) : ''].filter(Boolean).join('. '),
  );
  const [area, setArea] = useState(state.owner.city);
  const [date, setDate] = useState(toInputDate(todayIso()));
  const [contactName, setContactName] = useState(state.owner.name);
  const [contactPhone, setContactPhone] = useState(state.owner.phone);
  const [reward, setReward] = useState('');

  const submit = () => {
    const iso = parseDateInput(date);
    if (!area.trim() || !contactPhone.trim() || !iso) {
      Alert.alert(t('common.checkFields'), t('fyp.checkMsg'));
      return;
    }
    const r = parseInt(reward.replace(/\D/g, ''), 10);
    addPost({
      kind,
      petName: kind === 'lost' ? petName.trim() || undefined : undefined,
      species,
      breed: breed.trim() || t('fyp.noBreed'),
      color: color.trim() || t('fyp.noColor'),
      description: description.trim(),
      area: area.trim(),
      date: iso,
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
      <Stack.Screen options={{ title: pet ? t('fyp.newForPet', { name: pet.name }) : t('title.newPost') }} />
      {!pet && (
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'lost', label: t('fyp.kindLost') },
            { value: 'found', label: t('fyp.kindFound') },
          ]}
        />
      )}
      {pet && <Muted>{t('fyp.prefilled')}</Muted>}
      {kind === 'lost' && <Field label={t('pet.name')} value={petName} onChangeText={setPetName} />}
      <Segmented value={species} onChange={setSpecies} options={SPECIES.map((s) => ({ value: s, label: t(`species.${s}`) }))} />
      <Field label={t('pet.breed')} value={breed} onChangeText={setBreed} />
      <Field label={t('pet.color')} value={color} onChangeText={setColor} />
      <Field label={t('fyp.desc')} value={description} onChangeText={setDescription} multiline />
      <Field
        label={kind === 'lost' ? t('fyp.whereLostReq') : t('fyp.whereFoundReq')}
        value={area}
        onChangeText={setArea}
        placeholder={t('owner.cityPh')}
      />
      <Field label={t('common.dateLabel')} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
      <Field label={t('fyp.contactName')} value={contactName} onChangeText={setContactName} />
      <Field
        label={t('fyp.phoneReq')}
        value={contactPhone}
        onChangeText={setContactPhone}
        keyboardType="phone-pad"
        placeholder="+972 5X-XXX-XXXX"
      />
      {kind === 'lost' && <Field label={t('fyp.reward')} value={reward} onChangeText={setReward} keyboardType="number-pad" />}
      <Button title={t('fyp.publish')} icon="megaphone" onPress={submit} />
    </Screen>
  );
}
