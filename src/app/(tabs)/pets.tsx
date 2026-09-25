import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ageLabel } from '../../components/format';
import { Button, Empty, ListItem, Muted, Screen } from '../../components/ui';
import { SPECIES_ICON, SPECIES_LABEL, planById } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function Pets() {
  const { state, canAddPet } = useStore();
  const plan = planById(state.plan);

  const add = () => {
    if (canAddPet) {
      router.push('/pet/new');
      return;
    }
    Alert.alert('Лимит питомцев', `Тариф «${plan.title}» позволяет добавить до ${plan.maxPets} питомц(а/ев).`, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Сменить тариф', onPress: () => router.push('/plans') },
    ]);
  };

  return (
    <Screen>
      {state.pets.length === 0 && <Empty icon="paw" text="Пока нет питомцев" />}
      {state.pets.map((p) => (
        <ListItem
          key={p.id}
          icon={SPECIES_ICON[p.species]}
          title={p.name}
          subtitle={[SPECIES_LABEL[p.species], p.breed, ageLabel(p.birthDate)].filter(Boolean).join(' · ')}
          onPress={() => router.push(`/pet/${p.id}`)}
        />
      ))}
      <Button title="Добавить питомца" icon="add" onPress={add} />
      <Muted style={{ textAlign: 'center' }}>
        {state.pets.length} из {plan.maxPets} по тарифу «{plan.title}»
      </Muted>
    </Screen>
  );
}
