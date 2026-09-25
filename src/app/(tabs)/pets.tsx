import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Button, Empty, ListItem, Muted, Screen } from '../../components/ui';
import { SPECIES_ICON, planById } from '../../data/catalog';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function Pets() {
  const { state, canAddPet } = useStore();
  const { t, tr, age, join } = useT();
  const plan = planById(state.plan);

  const add = () => {
    if (canAddPet) {
      router.push('/pet/new');
      return;
    }
    Alert.alert(t('pets.limitTitle'), t('pets.limitMsg', { plan: tr(plan.title), max: plan.maxPets }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('pets.changePlan'), onPress: () => router.push('/plans') },
    ]);
  };

  return (
    <Screen>
      {state.pets.length === 0 && <Empty icon="paw" text={t('pets.empty')} />}
      {state.pets.map((p) => (
        <ListItem
          key={p.id}
          icon={SPECIES_ICON[p.species]}
          title={p.name}
          subtitle={join([t(`species.${p.species}`), p.breed, age(p.birthDate)])}
          onPress={() => router.push(`/pet/${p.id}`)}
        />
      ))}
      <Button title={t('common.addPet')} icon="add" onPress={add} />
      <Muted style={{ textAlign: 'center' }}>
        {t('pets.countOf', { n: state.pets.length, max: plan.maxPets, plan: tr(plan.title) })}
      </Muted>
    </Screen>
  );
}
