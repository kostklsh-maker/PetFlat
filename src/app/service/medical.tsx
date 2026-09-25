import { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { daysUntil, formatDate, isIsoDate, todayIso } from '../../components/format';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { colors } from '../../components/theme';
import { Button, Card, Field, H2, ListItem, Muted, Screen, Tag } from '../../components/ui';
import type { Pet } from '../../data/types';
import { newId, useStore } from '../../store/AppStore';

export default function MedicalScreen() {
  return (
    <PlanGate service="medical">
      <Medical />
    </PlanGate>
  );
}

function Medical() {
  const [pet, selectPet] = useSelectedPet();
  return (
    <Screen>
      <PetPicker value={pet} onChange={selectPet} />
      {/* Keyed by pet so the edit state resets when switching pets. */}
      {pet && <MedicalBody key={pet.id} pet={pet} />}
    </Screen>
  );
}

function MedicalBody({ pet }: { pet: Pet }) {
  const { updateMedical } = useStore();
  const [allergies, setAllergies] = useState(pet.medical.allergies);
  const [chronic, setChronic] = useState(pet.medical.chronic);
  const [form, setForm] = useState<'none' | 'vaccine' | 'visit'>('none');
  const med = pet.medical;
  const dirty = allergies !== med.allergies || chronic !== med.chronic;

  const confirmDelete = (what: string, onDelete: () => void) =>
    Alert.alert(`Удалить ${what}?`, undefined, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: onDelete },
    ]);

  return (
    <>
      <Card>
        <Field label="Аллергии" value={allergies} onChangeText={setAllergies} placeholder="Нет" multiline />
        <Field label="Хронические заболевания" value={chronic} onChangeText={setChronic} placeholder="Нет" multiline />
        {dirty && <Button title="Сохранить" icon="checkmark" onPress={() => updateMedical(pet.id, { allergies, chronic })} />}
      </Card>

      <H2>Прививки и обработки</H2>
      {med.vaccinations.length === 0 && <Muted>Записей пока нет.</Muted>}
      {[...med.vaccinations]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((v) => {
          const days = v.nextDate ? daysUntil(v.nextDate) : undefined;
          return (
            <ListItem
              key={v.id}
              icon="shield-checkmark"
              color={colors.success}
              title={v.name}
              subtitle={`${formatDate(v.date)}${v.nextDate ? ` · следующая ${formatDate(v.nextDate)}` : ''}`}
              right={
                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    confirmDelete('запись', () =>
                      updateMedical(pet.id, { vaccinations: med.vaccinations.filter((x) => x.id !== v.id) }),
                    )
                  }
                >
                  {days !== undefined && days <= 30 ? (
                    <Tag text={days < 0 ? 'Просрочено' : `${days} дн.`} color={days < 0 ? colors.danger : colors.accent} />
                  ) : (
                    <Ionicons name="trash-outline" size={20} color={colors.muted} />
                  )}
                </Pressable>
              }
            />
          );
        })}
      {form === 'vaccine' ? (
        <VaccineForm
          onCancel={() => setForm('none')}
          onSave={(v) => {
            updateMedical(pet.id, { vaccinations: [...med.vaccinations, { id: newId(), ...v }] });
            setForm('none');
          }}
        />
      ) : (
        <Button title="Добавить прививку" variant="secondary" icon="add" onPress={() => setForm('vaccine')} />
      )}

      <H2>Визиты к ветеринару</H2>
      {med.visits.length === 0 && <Muted>Визитов пока нет.</Muted>}
      {[...med.visits]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((v) => (
          <ListItem
            key={v.id}
            icon="medkit"
            color="#2A9D8F"
            title={v.reason}
            subtitle={[formatDate(v.date), v.clinic, v.notes].filter(Boolean).join(' · ')}
            right={
              <Pressable
                hitSlop={8}
                onPress={() =>
                  confirmDelete('визит', () => updateMedical(pet.id, { visits: med.visits.filter((x) => x.id !== v.id) }))
                }
              >
                <Ionicons name="trash-outline" size={20} color={colors.muted} />
              </Pressable>
            }
          />
        ))}
      {form === 'visit' ? (
        <VisitForm
          onCancel={() => setForm('none')}
          onSave={(v) => {
            updateMedical(pet.id, { visits: [...med.visits, { id: newId(), ...v }] });
            setForm('none');
          }}
        />
      ) : (
        <Button title="Добавить визит" variant="secondary" icon="add" onPress={() => setForm('visit')} />
      )}
    </>
  );
}

function VaccineForm({
  onSave,
  onCancel,
}: {
  onSave: (v: { name: string; date: string; nextDate?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayIso());
  const [nextDate, setNextDate] = useState('');
  const submit = () => {
    if (!name.trim() || !isIsoDate(date) || (nextDate && !isIsoDate(nextDate))) {
      Alert.alert('Проверьте поля', 'Название обязательно, даты — в формате ГГГГ-ММ-ДД.');
      return;
    }
    onSave({ name: name.trim(), date, nextDate: nextDate || undefined });
  };
  return (
    <Card>
      <Field label="Название" value={name} onChangeText={setName} placeholder="Бешенство, комплексная, от клещей…" />
      <Field label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} />
      <Field label="Следующая (ГГГГ-ММ-ДД)" value={nextDate} onChangeText={setNextDate} placeholder="Необязательно" />
      <Button title="Добавить" onPress={submit} />
      <Button title="Отмена" variant="ghost" onPress={onCancel} />
    </Card>
  );
}

function VisitForm({
  onSave,
  onCancel,
}: {
  onSave: (v: { date: string; clinic: string; reason: string; notes?: string }) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [clinic, setClinic] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const submit = () => {
    if (!reason.trim() || !isIsoDate(date)) {
      Alert.alert('Проверьте поля', 'Укажите причину визита и дату в формате ГГГГ-ММ-ДД.');
      return;
    }
    onSave({ date, clinic: clinic.trim(), reason: reason.trim(), notes: notes.trim() || undefined });
  };
  return (
    <Card>
      <Field label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} />
      <Field label="Клиника" value={clinic} onChangeText={setClinic} />
      <Field label="Причина" value={reason} onChangeText={setReason} />
      <Field label="Назначения / заметки" value={notes} onChangeText={setNotes} multiline />
      <Button title="Добавить" onPress={submit} />
      <Button title="Отмена" variant="ghost" onPress={onCancel} />
    </Card>
  );
}
