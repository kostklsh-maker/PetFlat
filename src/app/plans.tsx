import { goBack } from '../components/nav';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Text, View } from 'react-native';
import { rub } from '../components/format';
import { colors } from '../components/theme';
import { Button, Card, H1, Muted, Row, Screen, Tag } from '../components/ui';
import { PLANS, type Plan } from '../data/catalog';
import { useStore } from '../store/AppStore';

export default function Plans() {
  const { state, setPlan } = useStore();

  const choose = (plan: Plan) => {
    if (state.pets.length > plan.maxPets) {
      Alert.alert('Слишком много питомцев', `В тарифе «${plan.title}» можно держать до ${plan.maxPets} питомц(а/ев).`);
      return;
    }
    // TODO: connect real billing (App Store / Google Play subscriptions or a payment provider) before release.
    Alert.alert(
      `Тариф «${plan.title}»`,
      plan.pricePerMonth ? `Оформить подписку за ${rub(plan.pricePerMonth)} в месяц?` : 'Перейти на бесплатный тариф?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Подтвердить',
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
      <Muted>Выберите тариф — сервисы подключатся к вашему профилю сразу после оплаты.</Muted>
      {PLANS.map((plan) => {
        const current = plan.id === state.plan;
        return (
          <Card key={plan.id} style={current && { borderWidth: 2, borderColor: colors.primary }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <H1>{plan.title}</H1>
              {current && <Tag text="Текущий" />}
            </Row>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>
              {plan.pricePerMonth ? `${rub(plan.pricePerMonth)} / мес` : 'Бесплатно'}
            </Text>
            <View style={{ gap: 6 }}>
              {plan.perks.map((perk) => (
                <Row key={perk} style={{ gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={{ color: colors.text, flex: 1 }}>{perk}</Text>
                </Row>
              ))}
            </View>
            {!current && <Button title="Выбрать" onPress={() => choose(plan)} />}
          </Card>
        );
      })}
    </Screen>
  );
}
