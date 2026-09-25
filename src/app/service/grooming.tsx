import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { daysUntil, parseDateInput, weekday } from '../../components/format';
import { PetPicker, useSelectedPet } from '../../components/PetPicker';
import { PlanGate } from '../../components/PlanGate';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Card, Field, H2, ListItem, Muted, Row, Screen } from '../../components/ui';
import { GROOMING_SALONS } from '../../data/catalog';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function GroomingScreen() {
  return (
    <PlanGate service="grooming">
      <Grooming />
    </PlanGate>
  );
}

const TIMES = ['09:00', '11:00', '13:00', '15:00', '17:00'];

function Grooming() {
  const [pet, selectPet] = useSelectedPet();
  const { state, addBooking, cancelBooking } = useStore();
  const { t, tr, price, join, date: fmtDate } = useT();
  const [salonId, setSalonId] = useState<string>();
  const [serviceId, setServiceId] = useState<string>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIMES[0]);

  const salon = GROOMING_SALONS.find((s) => s.id === salonId);
  const bookings = state.bookings
    .filter((b) => daysUntil(b.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const book = () => {
    if (!pet || !salon || !serviceId) return;
    const iso = parseDateInput(date);
    if (!iso || daysUntil(iso) < 0) {
      Alert.alert(t('common.date'), t('grooming.futureDate'));
      return;
    }
    if (salon.closedDays.includes(weekday(iso))) {
      Alert.alert(t('common.date'), t('grooming.closedDay'));
      return;
    }
    // TODO: send the booking to the salon's system via the PetFlat backend.
    addBooking({ petId: pet.id, salonId: salon.id, serviceId, date: iso, time });
    setSalonId(undefined);
    setServiceId(undefined);
    setDate('');
    Alert.alert(t('common.done'), t('grooming.booked', { pet: pet.name, salon: tr(salon.name), date: fmtDate(iso), time }));
  };

  return (
    <Screen>
      {bookings.length > 0 && (
        <>
          <H2>{t('grooming.myBookings')}</H2>
          {bookings.map((b) => {
            const s = GROOMING_SALONS.find((x) => x.id === b.salonId);
            const svc = s?.services.find((x) => x.id === b.serviceId);
            const p = state.pets.find((x) => x.id === b.petId);
            return (
              <ListItem
                key={b.id}
                icon="calendar"
                color="#E76F9A"
                title={join([`${fmtDate(b.date)}, ${b.time}`, p?.name])}
                subtitle={join([svc && tr(svc.name), s && `${tr(s.name)}, ${tr(s.address)}`])}
                right={
                  <Pressable
                    onPress={() =>
                      Alert.alert(t('grooming.cancelTitle'), undefined, [
                        { text: t('common.no'), style: 'cancel' },
                        { text: t('grooming.cancel'), style: 'destructive', onPress: () => cancelBooking(b.id) },
                      ])
                    }
                  >
                    <Text style={{ color: colors.danger }}>{t('grooming.cancel')}</Text>
                  </Pressable>
                }
              />
            );
          })}
        </>
      )}

      <H2>{t('grooming.new')}</H2>
      <PetPicker value={pet} onChange={selectPet} />
      {pet &&
        GROOMING_SALONS.map((s) => (
          <ListItem
            key={s.id}
            icon="cut"
            color={s.id === salonId ? colors.primary : '#E76F9A'}
            title={join([tr(s.name), `★ ${s.rating}`])}
            subtitle={tr(s.address)}
            onPress={() => {
              setSalonId(s.id);
              setServiceId(undefined);
            }}
          />
        ))}

      {pet && salon && (
        <Card>
          <Muted>{t('grooming.serviceIn', { salon: tr(salon.name) })}</Muted>
          {salon.services.map((svc) => (
            <Pressable
              key={svc.id}
              onPress={() => setServiceId(svc.id)}
              style={{
                padding: spacing(3),
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: serviceId === svc.id ? colors.primary : colors.border,
              }}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text }}>{tr(svc.name)}</Text>
                <Text style={{ color: colors.muted }}>{price(svc.price)}</Text>
              </Row>
            </Pressable>
          ))}
          <Field
            label={t('common.dateLabel')}
            value={date}
            onChangeText={setDate}
            placeholder={t('common.datePh')}
            keyboardType="numbers-and-punctuation"
          />
          <Row style={{ flexWrap: 'wrap', gap: spacing(2) }}>
            {TIMES.map((slot) => (
              <Pressable
                key={slot}
                onPress={() => setTime(slot)}
                style={{
                  paddingHorizontal: spacing(3),
                  paddingVertical: spacing(2),
                  borderRadius: radius.sm,
                  backgroundColor: slot === time ? colors.primary : colors.bg,
                }}
              >
                <Text style={{ color: slot === time ? '#fff' : colors.text }}>{slot}</Text>
              </Pressable>
            ))}
          </Row>
          <Button title={t('grooming.book')} icon="checkmark" disabled={!serviceId || !date} onPress={book} />
        </Card>
      )}
    </Screen>
  );
}
