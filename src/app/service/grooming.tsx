import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { daysUntil, formatDate, isIsoDate, rub } from '../../components/format';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Card, Field, H2, ListItem, Muted, Row, Screen } from '../../components/ui';
import { GROOMING_SALONS } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function GroomingScreen() {
  return (
    <PlanGate service="grooming">
      <Grooming />
    </PlanGate>
  );
}

const TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00'];

function Grooming() {
  const [pet, selectPet] = useSelectedPet();
  const { state, addBooking, cancelBooking } = useStore();
  const [salonId, setSalonId] = useState<string>();
  const [service, setService] = useState<string>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIMES[0]);

  const salon = GROOMING_SALONS.find((s) => s.id === salonId);
  const bookings = state.bookings
    .filter((b) => daysUntil(b.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const book = () => {
    if (!pet || !salon || !service) return;
    if (!isIsoDate(date) || daysUntil(date) < 0) {
      Alert.alert('Дата', 'Укажите будущую дату в формате ГГГГ-ММ-ДД.');
      return;
    }
    // TODO: send the booking to the salon's system via the PetFlat backend.
    addBooking({ petId: pet.id, salonId: salon.id, service, date, time });
    setSalonId(undefined);
    setService(undefined);
    setDate('');
    Alert.alert('Готово', `${pet.name} записан(а) в «${salon.name}» на ${formatDate(date)}, ${time}.`);
  };

  return (
    <Screen>
      {bookings.length > 0 && (
        <>
          <H2>Мои записи</H2>
          {bookings.map((b) => {
            const s = GROOMING_SALONS.find((x) => x.id === b.salonId);
            const p = state.pets.find((x) => x.id === b.petId);
            return (
              <ListItem
                key={b.id}
                icon="calendar"
                color="#E76F9A"
                title={`${formatDate(b.date)}, ${b.time} · ${p?.name ?? ''}`}
                subtitle={`${b.service} · ${s?.name}, ${s?.address}`}
                right={
                  <Pressable
                    onPress={() =>
                      Alert.alert('Отменить запись?', undefined, [
                        { text: 'Нет', style: 'cancel' },
                        { text: 'Отменить', style: 'destructive', onPress: () => cancelBooking(b.id) },
                      ])
                    }
                  >
                    <Text style={{ color: colors.danger }}>Отменить</Text>
                  </Pressable>
                }
              />
            );
          })}
        </>
      )}

      <H2>Новая запись</H2>
      <PetPicker value={pet} onChange={selectPet} />
      {pet &&
        GROOMING_SALONS.map((s) => (
          <ListItem
            key={s.id}
            icon="cut"
            color={s.id === salonId ? colors.primary : '#E76F9A'}
            title={`${s.name} · ★ ${s.rating}`}
            subtitle={s.address}
            onPress={() => {
              setSalonId(s.id);
              setService(undefined);
            }}
          />
        ))}

      {pet && salon && (
        <Card>
          <Muted>Услуга в «{salon.name}»</Muted>
          {salon.services.map((svc) => (
            <Pressable
              key={svc.name}
              onPress={() => setService(svc.name)}
              style={{
                padding: spacing(3),
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: service === svc.name ? colors.primary : colors.border,
              }}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text }}>{svc.name}</Text>
                <Text style={{ color: colors.muted }}>{rub(svc.price)}</Text>
              </Row>
            </Pressable>
          ))}
          <Field label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} placeholder="2026-10-01" />
          <Row style={{ flexWrap: 'wrap', gap: spacing(2) }}>
            {TIMES.map((t) => (
              <Pressable
                key={t}
                onPress={() => setTime(t)}
                style={{
                  paddingHorizontal: spacing(3),
                  paddingVertical: spacing(2),
                  borderRadius: radius.sm,
                  backgroundColor: t === time ? colors.primary : colors.bg,
                }}
              >
                <Text style={{ color: t === time ? '#fff' : colors.text }}>{t}</Text>
              </Pressable>
            ))}
          </Row>
          <Button title="Записаться" icon="checkmark" disabled={!service || !date} onPress={book} />
        </Card>
      )}
    </Screen>
  );
}
