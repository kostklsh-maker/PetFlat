import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { isIsoDate } from '../../components/format';
import { Button, Field, Screen, Segmented } from '../../components/ui';
import { SPECIES_LABEL } from '../../data/catalog';
import { emptyHotel, emptyMedical } from '../../data/seed';
import type { Species } from '../../data/types';
import { useStore } from '../../store/AppStore';

const SPECIES = Object.keys(SPECIES_LABEL) as Species[];

export default function NewPet() {
  const { addPet, canAddPet } = useStore();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [chipNumber, setChipNumber] = useState('');
  const [specialMarks, setSpecialMarks] = useState('');

  const save = () => {
    if (!canAddPet) {
      Alert.alert('Достигнут лимит тарифа');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Укажите кличку');
      return;
    }
    if (birthDate && !isIsoDate(birthDate)) {
      Alert.alert('Дата рождения', 'Введите дату в формате ГГГГ-ММ-ДД, например 2021-05-14.');
      return;
    }
    const w = parseFloat(weight.replace(',', '.'));
    const id = addPet({
      name: name.trim(),
      species,
      sex,
      breed: breed.trim(),
      birthDate,
      color: color.trim(),
      weightKg: Number.isFinite(w) ? w : undefined,
      chipNumber: chipNumber.trim() || undefined,
      specialMarks: specialMarks.trim() || undefined,
      medical: emptyMedical(),
      hotel: emptyHotel(),
    });
    router.replace(`/pet/${id}`);
  };

  return (
    <Screen>
      <Field label="Кличка *" value={name} onChangeText={setName} />
      <Segmented value={species} onChange={setSpecies} options={SPECIES.map((s) => ({ value: s, label: SPECIES_LABEL[s] }))} />
      <Segmented
        value={sex}
        onChange={setSex}
        options={[
          { value: 'male', label: 'Мальчик' },
          { value: 'female', label: 'Девочка' },
        ]}
      />
      <Field label="Порода" value={breed} onChangeText={setBreed} />
      <Field label="Дата рождения (ГГГГ-ММ-ДД)" value={birthDate} onChangeText={setBirthDate} placeholder="2021-05-14" />
      <Field label="Окрас" value={color} onChangeText={setColor} />
      <Field label="Вес, кг" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      <Field label="Номер чипа" value={chipNumber} onChangeText={setChipNumber} keyboardType="number-pad" />
      <Field label="Особые приметы" value={specialMarks} onChangeText={setSpecialMarks} multiline />
      <Button title="Сохранить" icon="checkmark" onPress={save} />
    </Screen>
  );
}
