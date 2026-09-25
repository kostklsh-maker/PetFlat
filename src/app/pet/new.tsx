import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { parseDateInput } from '../../components/format';
import { Button, Field, Screen, Segmented } from '../../components/ui';
import { SPECIES } from '../../data/catalog';
import { emptyHotel, emptyMedical } from '../../data/seed';
import type { Species } from '../../data/types';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function NewPet() {
  const { addPet, canAddPet } = useStore();
  const { t } = useT();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [chipNumber, setChipNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialMarks, setSpecialMarks] = useState('');

  const save = () => {
    if (!canAddPet) {
      Alert.alert(t('pet.limitReached'));
      return;
    }
    if (!name.trim()) {
      Alert.alert(t('pet.enterName'));
      return;
    }
    const birthIso = birthDate.trim() ? parseDateInput(birthDate) : '';
    if (birthIso === null) {
      Alert.alert(t('pet.birthDate'), t('pet.dateErr'));
      return;
    }
    const w = parseFloat(weight.replace(',', '.'));
    const id = addPet({
      name: name.trim(),
      species,
      sex,
      breed: breed.trim(),
      birthDate: birthIso,
      color: color.trim(),
      weightKg: Number.isFinite(w) ? w : undefined,
      chipNumber: chipNumber.trim() || undefined,
      licenseNumber: species === 'dog' ? licenseNumber.trim() || undefined : undefined,
      specialMarks: specialMarks.trim() || undefined,
      medical: emptyMedical(),
      hotel: emptyHotel(),
    });
    router.replace(`/pet/${id}`);
  };

  return (
    <Screen>
      <Field label={t('pet.nameReq')} value={name} onChangeText={setName} />
      <Segmented value={species} onChange={setSpecies} options={SPECIES.map((s) => ({ value: s, label: t(`species.${s}`) }))} />
      <Segmented
        value={sex}
        onChange={setSex}
        options={[
          { value: 'male', label: t('pet.male') },
          { value: 'female', label: t('pet.female') },
        ]}
      />
      <Field label={t('pet.breed')} value={breed} onChangeText={setBreed} />
      <Field
        label={t('pet.birthDateLabel')}
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder={t('common.datePh')}
        keyboardType="numbers-and-punctuation"
      />
      <Field label={t('pet.color')} value={color} onChangeText={setColor} />
      <Field label={t('pet.weight')} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      <Field label={t('pet.chip')} value={chipNumber} onChangeText={setChipNumber} keyboardType="number-pad" />
      {species === 'dog' && <Field label={t('pet.license')} value={licenseNumber} onChangeText={setLicenseNumber} />}
      <Field label={t('pet.marks')} value={specialMarks} onChangeText={setSpecialMarks} multiline />
      <Button title={t('common.save')} icon="checkmark" onPress={save} />
    </Screen>
  );
}
