import { Text, View } from 'react-native';
import { PlanGate } from '../../components/PlanGate';
import { colors, radius, spacing } from '../../components/theme';
import { H2, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { PARTNER_SHOPS } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function ClubScreen() {
  return (
    <PlanGate service="club">
      <Club />
    </PlanGate>
  );
}

function Club() {
  const { state } = useStore();
  const { club, owner } = state;
  const bonus = state.plan === 'premium' ? 2 : 0;

  return (
    <Screen>
      <View
        style={{
          backgroundColor: '#6C5CE7',
          borderRadius: radius.lg,
          padding: spacing(5),
          gap: spacing(3),
          aspectRatio: 1.6,
          justifyContent: 'space-between',
        }}
      >
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>PetFlat Club</Text>
          <Tag text={club.level} color="#FFFFFF" />
        </Row>
        <View>
          <Text style={{ color: '#fff', opacity: 0.8 }}>Баллы</Text>
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>{club.points.toLocaleString('ru-RU')}</Text>
        </View>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff', fontSize: 18, letterSpacing: 2, fontFamily: 'monospace' }}>{club.number}</Text>
          <Text style={{ color: '#fff', opacity: 0.9 }}>{owner.name}</Text>
        </Row>
      </View>
      <Muted style={{ textAlign: 'center' }}>Покажите карту на кассе магазина-партнёра, чтобы получить кешбэк баллами.</Muted>

      <H2>Магазины-партнёры</H2>
      {PARTNER_SHOPS.map((s) => (
        <ListItem
          key={s.id}
          icon="storefront"
          color="#6C5CE7"
          title={s.name}
          subtitle={s.address}
          right={<Tag text={`${s.cashbackPercent + bonus}%`} color={colors.success} />}
        />
      ))}
    </Screen>
  );
}
