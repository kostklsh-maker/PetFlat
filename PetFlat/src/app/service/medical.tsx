import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { daysUntil, parseDateInput, todayIso, toInputDate } from '../../components/format';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { colors } from '../../components/theme';
import { Button, Card, Field, H2, ListItem, Muted, Screen, Tag } from '../../components/ui';
import type { Pet } from '../../data/types';
import { useT } from '../../i18n';
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
  const { t, date, join } = useT();
  const [allergies, setAllergies] = useState(pet.medical.allergies);
  const [chronic, setChronic] = useState(pet.medical.chronic);
  const [form, setForm] = useState<'none' | 'vaccine' | 'visit'>('none');

  const med = pet.medical;
  const dirty = allergies !== med.allergies || chronic !== med.chronic;

  const confirmDelete = (title: string, onDelete: () => void) =>
    Alert.alert(title, undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: onDelete },
    ]);

  return (
    <>
      <Card>
        <Field label={t('medical.allergies')} value={allergies} onChangeText={setAllergies} placeholder={t('medical.none')} multiline />
        <Field label={t('medical.chronic')} value={chronic} onChangeText={setChronic} placeholder={t('medical.none')} multiline />
        {dirty && (
          <Button title={t('common.save')} icon="checkmark" onPress={() => updateMedical(pet.id, { allergies, chronic })} />
        )}
      </Card>

      <H2>{t('medical.vaccines')}</H2>
      {pet.species === 'dog' && <Muted>{t('medical.rabiesHint')}</Muted>}
      {med.vaccinations.length === 0 && <Muted>{t('medical.noRecords')}</Muted>}
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
              subtitle={join([date(v.date), v.nextDate && t('medical.next', { date: date(v.nextDate) })])}
              right={
                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    confirmDelete(t('medical.deleteRecord'), () =>
                      updateMedical(pet.id, { vaccinations: med.vaccinations.filter((x) => x.id !== v.id) }),
                    )
                  }
                >
                  {days !== undefined && days <= 30 ? (
                    <Tag
                      text={days < 0 ? t('medical.overdue') : t('common.inDays', { n: days })}
                      color={days < 0 ? colors.danger : colors.accent}
                    />
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
        <Button title={t('medical.addVaccine')} variant="secondary" icon="add" onPress={() => setForm('vaccine')} />
      )}

      <H2>{t('medical.visits')}</H2>
      {med.visits.length === 0 && <Muted>{t('medical.noVisits')}</Muted>}
      {[...med.visits]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((v) => (
          <ListItem
            key={v.id}
            icon="medkit"
            color="#2A9D8F"
            title={v.reason}
            subtitle={join([date(v.date), v.clinic, v.notes])}
            right={
              <Pressable
                hitSlop={8}
                onPress={() =>
                  confirmDelete(t('medical.deleteVisit'), () =>
                    updateMedical(pet.id, { visits: med.visits.filter((x) => x.id !== v.id) }),
                  )
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
        <Button title={t('medical.addVisit')} variant="secondary" icon="add" onPress={() => setForm('visit')} />
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
  const { t } = useT();
  const [name, setName] = useState('');
  const [date, setDate] = useState(toInputDate(todayIso()));
  const [nextDate, setNextDate] = useState('');
  const submit = () => {
    const iso = parseDateInput(date);
    const nextIso = nextDate.trim() ? parseDateInput(nextDate) : undefined;
    if (!name.trim() || !iso || nextIso === null) {
      Alert.alert(t('common.checkFields'), t('medical.vaccineErr'));
      return;
    }
    onSave({ name: name.trim(), date: iso, nextDate: nextIso });
  };
  return (
    <Card>
      <Field label={t('medical.vaccineName')} value={name} onChangeText={setName} placeholder={t('medical.vaccinePh')} />
      <Field label={t('common.dateLabel')} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
      <Field
        label={t('medical.nextLabel')}
        value={nextDate}
        onChangeText={setNextDate}
        placeholder={t('common.optional')}
        keyboardType="numbers-and-punctuation"
      />
      <Button title={t('common.add')} onPress={submit} />
      <Button title={t('common.cancel')} variant="ghost" onPress={onCancel} />
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
  const { t } = useT();
  const [date, setDate] = useState(toInputDate(todayIso()));
  const [clinic, setClinic] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const submit = () => {
    const iso = parseDateInput(date);
    if (!reason.trim() || !iso) {
      Alert.alert(t('common.checkFields'), t('medical.visitErr'));
      return;
    }
    onSave({ date: iso, clinic: clinic.trim(), reason: reason.trim(), notes: notes.trim() || undefined });
  };
  return (
    <Card>
      <Field label={t('common.dateLabel')} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
      <Field label={t('medical.clinic')} value={clinic} onChangeText={setClinic} />
      <Field label={t('medical.reason')} value={reason} onChangeText={setReason} />
      <Field label={t('medical.notes')} value={notes} onChangeText={setNotes} multiline />
      <Button title={t('common.add')} onPress={submit} />
      <Button title={t('common.cancel')} variant="ghost" onPress={onCancel} />
    </Card>
  );
}
