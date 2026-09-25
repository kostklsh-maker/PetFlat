import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Text, View } from 'react-native';
import { goBack } from '../components/nav';
import { colors } from '../components/theme';
import { Button, Card, H1, Muted, Row, Screen, Tag } from '../components/ui';
import { PLANS, type Plan } from '../data/catalog';
import { useT } from '../i18n';
import { useStore } from '../store/AppStore';

export default function Plans() {
  const { state, setPlan } = useStore();
  const { t, tr, price } = useT();

  const choose = (plan: Plan) => {
    if (state.pets.length > plan.maxPets) {
      Alert.alert(t('plans.tooManyTitle'), t('plans.tooManyMsg', { plan: tr(plan.title), max: plan.maxPets }));
      return;
    }
    // TODO: connect real billing (App Store / Google Play subscriptions or an Israeli payment provider) before release.
    Alert.alert(
      t('plans.planTitle', { plan: tr(plan.title) }),
      plan.pricePerMonth ? t('plans.confirmPaid', { price: price(plan.pricePerMonth) }) : t('plans.confirmFree'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            setPlan(plan.id);
            goBack();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Muted>{t('plans.intro')}</Muted>
      {PLANS.map((plan) => {
        const current = plan.id === state.plan;
        return (
          <Card key={plan.id} style={current && { borderWidth: 2, borderColor: colors.primary }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <H1>{tr(plan.title)}</H1>
              {current && <Tag text={t('plans.current')} />}
            </Row>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>
              {plan.pricePerMonth ? t('common.perMonth', { price: price(plan.pricePerMonth) }) : t('common.free')}
            </Text>
            <View style={{ gap: 6 }}>
              {plan.perks.map((perk) => (
                <Row key={perk.en} style={{ gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={{ color: colors.text, flex: 1 }}>{tr(perk)}</Text>
                </Row>
              ))}
            </View>
            {!current && <Button title={t('plans.choose')} onPress={() => choose(plan)} />}
          </Card>
        );
      })}
      <Muted style={{ textAlign: 'center' }}>{t('plans.vat')}</Muted>
    </Screen>
  );
}
