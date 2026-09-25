import { Text, View } from 'react-native';
import { PlanGate } from '../../components/PlanGate';
import { colors, monoFont, radius, spacing } from '../../components/theme';
import { H2, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { PARTNER_SHOPS, PREMIUM_CASHBACK_BONUS } from '../../data/catalog';
import { useT } from '../../i18n';
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
  const { t, tr, num } = useT();
  const { club, owner } = state;
  const bonus = state.plan === 'premium' ? PREMIUM_CASHBACK_BONUS : 0;

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
          <Tag text={t(`club.level.${club.level}`)} color="#FFFFFF" />
        </Row>
        <View>
          <Text style={{ color: '#fff', opacity: 0.8 }}>{t('club.points')}</Text>
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>{num(club.points)}</Text>
        </View>
        <Row style={{ justifyContent: 'space-between' }}>
          {/* Card numbers read left-to-right in every language. */}
          <Text style={{ color: '#fff', fontSize: 18, letterSpacing: 2, fontFamily: monoFont, writingDirection: 'ltr' }}>
            {club.number}
          </Text>
          <Text style={{ color: '#fff', opacity: 0.9 }}>{owner.name}</Text>
        </Row>
      </View>
      <Muted style={{ textAlign: 'center' }}>{t('club.hint')}</Muted>

      <H2>{t('club.partners')}</H2>
      {PARTNER_SHOPS.map((s) => (
        <ListItem
          key={s.id}
          icon="storefront"
          color="#6C5CE7"
          title={tr(s.name)}
          subtitle={tr(s.address)}
          right={<Tag text={`${s.cashbackPercent + bonus}%`} color={colors.success} />}
        />
      ))}
    </Screen>
  );
}
