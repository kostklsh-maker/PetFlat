import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { daysUntil, formatDate, rub } from '../../components/format';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Card, H1, H2, IconBadge, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { GROOMING_SALONS, SERVICES, SPECIES_ICON, planById } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function Home() {
  const { state, hasService } = useStore();
  const plan = planById(state.plan);

  const reminders = hasService('medical')
    ? state.pets.flatMap((p) =>
        p.medical.vaccinations
          .filter((v) => v.nextDate && daysUntil(v.nextDate) <= 30)
          .map((v) => ({ pet: p, v, days: daysUntil(v.nextDate!) })),
      ).sort((a, b) => a.days - b.days)
    : [];

  const upcoming = state.bookings
    .filter((b) => daysUntil(b.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const myLost = state.posts.filter((p) => p.ownPetId && p.kind === 'lost' && !p.resolved);

  return (
    <Screen>
      <H1>Привет, {state.owner.name || 'друг'}!</H1>

      <Card onPress={() => router.push('/plans')} style={{ backgroundColor: colors.primary }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#fff', opacity: 0.8 }}>Ваш тариф</Text>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{plan.title}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {plan.pricePerMonth ? `${rub(plan.pricePerMonth)}/мес` : 'Бесплатно'}
          </Text>
        </Row>
        <Text style={{ color: '#fff', opacity: 0.9 }}>
          Подключено сервисов: {plan.services.length} из {SERVICES.length} · Питомцев: {state.pets.length} из{' '}
          {plan.maxPets}
        </Text>
      </Card>

      {myLost.map((p) => (
        <Card key={p.id} onPress={() => router.push(`/findypet/${p.id}`)} style={{ borderWidth: 2, borderColor: colors.accent }}>
          <Row>
            <IconBadge icon="alert-circle" color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.accent }}>{p.petName} в розыске</Text>
              <Muted>Объявление FindYpet активно с {formatDate(p.date)}</Muted>
            </View>
          </Row>
        </Card>
      ))}

      <H2>Мои питомцы</H2>
      {state.pets.length === 0 ? (
        <Card>
          <Muted>Добавьте первого питомца, чтобы подключить к нему сервисы.</Muted>
          <Button title="Добавить питомца" icon="add" onPress={() => router.push('/pet/new')} />
        </Card>
      ) : (
        <Row style={{ flexWrap: 'wrap' }}>
          {state.pets.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/pet/${p.id}`)}
              style={{
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing(3),
                alignItems: 'center',
                gap: spacing(1),
                minWidth: 96,
              }}
            >
              <IconBadge icon={SPECIES_ICON[p.species]} color={colors.primary} size={52} />
              <Text style={{ fontWeight: '600', color: colors.text }}>{p.name}</Text>
            </Pressable>
          ))}
        </Row>
      )}

      {reminders.length > 0 && (
        <>
          <H2>Напоминания</H2>
          {reminders.map(({ pet, v, days }) => (
            <ListItem
              key={pet.id + v.id}
              icon="medkit"
              color={days < 0 ? colors.danger : colors.success}
              title={`${pet.name}: ${v.name}`}
              subtitle={days < 0 ? `Просрочено с ${formatDate(v.nextDate)}` : `Через ${days} дн. — ${formatDate(v.nextDate)}`}
              onPress={() => router.push({ pathname: '/service/medical', params: { petId: pet.id } })}
            />
          ))}
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <H2>Запись к грумеру</H2>
          {upcoming.map((b) => {
            const salon = GROOMING_SALONS.find((s) => s.id === b.salonId);
            const pet = state.pets.find((p) => p.id === b.petId);
            return (
              <ListItem
                key={b.id}
                icon="cut"
                color="#E76F9A"
                title={`${formatDate(b.date)}, ${b.time}`}
                subtitle={`${pet?.name ?? ''} · ${b.service} · ${salon?.name ?? ''}`}
                onPress={() => router.push('/service/grooming')}
              />
            );
          })}
        </>
      )}

      <H2>Сервисы</H2>
      <Row style={{ flexWrap: 'wrap' }}>
        {SERVICES.map((s) => {
          const on = hasService(s.id);
          return (
            <Pressable
              key={s.id}
              onPress={() => router.push(s.id === 'findypet' ? '/findypet' : `/service/${s.id}`)}
              style={{
                width: '47%',
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing(3),
                gap: spacing(2),
                opacity: on ? 1 : 0.6,
              }}
            >
              <IconBadge icon={s.icon} color={s.color} />
              <Text style={{ fontWeight: '600', color: colors.text }}>{s.title}</Text>
              {!on && <Tag text="Недоступно" color={colors.muted} />}
            </Pressable>
          );
        })}
      </Row>
    </Screen>
  );
}
