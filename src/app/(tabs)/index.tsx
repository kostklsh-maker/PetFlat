import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { daysUntil } from '../../components/format';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Card, H1, H2, IconBadge, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { GROOMING_SALONS, SERVICES, SPECIES_ICON, planById } from '../../data/catalog';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function Home() {
  const { state, hasService } = useStore();
  const { t, tr, price, date, join } = useT();
  const plan = planById(state.plan);

  const reminders = hasService('medical')
    ? state.pets
        .flatMap((p) =>
          p.medical.vaccinations
            .filter((v) => v.nextDate && daysUntil(v.nextDate) <= 30)
            .map((v) => ({ pet: p, v, days: daysUntil(v.nextDate!) })),
        )
        .sort((a, b) => a.days - b.days)
    : [];

  const upcoming = state.bookings
    .filter((b) => daysUntil(b.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const myLost = state.posts.filter((p) => p.ownPetId && p.kind === 'lost' && !p.resolved);

  return (
    <Screen>
      <H1>{t('home.hello', { name: state.owner.name || t('home.friend') })}</H1>

      <Card onPress={() => router.push('/plans')} style={{ backgroundColor: colors.primary }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#fff', opacity: 0.8 }}>{t('home.yourPlan')}</Text>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{tr(plan.title)}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {plan.pricePerMonth ? t('common.perMonth', { price: price(plan.pricePerMonth) }) : t('common.free')}
          </Text>
        </Row>
        <Text style={{ color: '#fff', opacity: 0.9 }}>
          {t('home.stats', { n: plan.services.length, total: SERVICES.length, p: state.pets.length, max: plan.maxPets })}
        </Text>
      </Card>

      {myLost.map((p) => (
        <Card key={p.id} onPress={() => router.push(`/findypet/${p.id}`)} style={{ borderWidth: 2, borderColor: colors.accent }}>
          <Row>
            <IconBadge icon="alert-circle" color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.accent }}>{t('home.petWanted', { name: p.petName ?? '' })}</Text>
              <Muted>{t('home.postActive', { date: date(p.date) })}</Muted>
            </View>
          </Row>
        </Card>
      ))}

      <H2>{t('home.myPets')}</H2>
      {state.pets.length === 0 ? (
        <Card>
          <Muted>{t('home.addFirstPet')}</Muted>
          <Button title={t('common.addPet')} icon="add" onPress={() => router.push('/pet/new')} />
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
          <H2>{t('home.reminders')}</H2>
          {reminders.map(({ pet, v, days }) => (
            <ListItem
              key={pet.id + v.id}
              icon="medkit"
              color={days < 0 ? colors.danger : colors.success}
              title={`${pet.name}: ${v.name}`}
              subtitle={
                days < 0
                  ? t('home.overdueSince', { date: date(v.nextDate) })
                  : t('home.inDays', { n: days, date: date(v.nextDate) })
              }
              onPress={() => router.push({ pathname: '/service/medical', params: { petId: pet.id } })}
            />
          ))}
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <H2>{t('home.grooming')}</H2>
          {upcoming.map((b) => {
            const salon = GROOMING_SALONS.find((s) => s.id === b.salonId);
            const service = salon?.services.find((s) => s.id === b.serviceId);
            const pet = state.pets.find((p) => p.id === b.petId);
            return (
              <ListItem
                key={b.id}
                icon="cut"
                color="#E76F9A"
                title={`${date(b.date)}, ${b.time}`}
                subtitle={join([pet?.name, service && tr(service.name), salon && tr(salon.name)])}
                onPress={() => router.push('/service/grooming')}
              />
            );
          })}
        </>
      )}

      <H2>{t('home.services')}</H2>
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
                alignItems: 'flex-start',
              }}
            >
              <IconBadge icon={s.icon} color={s.color} />
              <Text style={{ fontWeight: '600', color: colors.text }}>{tr(s.title)}</Text>
              {!on && <Tag text={t('common.unavailable')} color={colors.muted} />}
            </Pressable>
          );
        })}
      </Row>
    </Screen>
  );
}
