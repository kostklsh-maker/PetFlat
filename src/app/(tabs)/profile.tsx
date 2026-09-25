import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { rub } from '../../components/format';
import { Button, Card, Field, H2, KeyValue, ListItem, Screen } from '../../components/ui';
import { planById } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function Profile() {
  const { state, updateOwner, resetAll } = useStore();
  const [editing, setEditing] = useState(false);
  const [owner, setOwner] = useState(state.owner);
  const plan = planById(state.plan);

  const save = () => {
    if (!owner.name.trim() || !owner.phone.trim()) {
      Alert.alert('Имя и телефон обязательны');
      return;
    }
    updateOwner(owner);
    setEditing(false);
  };

  const confirmReset = () =>
    Alert.alert('Выйти и удалить данные?', 'Все данные профиля на этом устройстве будут удалены.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: resetAll },
    ]);

  return (
    <Screen>
      <H2>Цифровой профиль владельца</H2>
      {editing ? (
        <Card>
          <Field label="Имя" value={owner.name} onChangeText={(name) => setOwner({ ...owner, name })} />
          <Field label="Телефон" value={owner.phone} keyboardType="phone-pad" onChangeText={(phone) => setOwner({ ...owner, phone })} />
          <Field label="Email" value={owner.email} autoCapitalize="none" keyboardType="email-address" onChangeText={(email) => setOwner({ ...owner, email })} />
          <Field label="Город" value={owner.city} onChangeText={(city) => setOwner({ ...owner, city })} />
          <Button title="Сохранить" icon="checkmark" onPress={save} />
          <Button title="Отмена" variant="ghost" onPress={() => { setOwner(state.owner); setEditing(false); }} />
        </Card>
      ) : (
        <Card>
          <KeyValue k="Имя" v={state.owner.name} />
          <KeyValue k="Телефон" v={state.owner.phone} />
          <KeyValue k="Email" v={state.owner.email} />
          <KeyValue k="Город" v={state.owner.city} />
          <KeyValue k="Питомцев" v={state.pets.length} />
          <Button title="Редактировать" variant="secondary" icon="pencil" onPress={() => { setOwner(state.owner); setEditing(true); }} />
        </Card>
      )}

      <H2>Подписка</H2>
      <ListItem
        icon="rocket"
        title={`Тариф «${plan.title}»`}
        subtitle={plan.pricePerMonth ? `${rub(plan.pricePerMonth)} в месяц` : 'Бесплатно'}
        onPress={() => router.push('/plans')}
      />

      <Button title="Выйти и удалить данные" variant="danger" icon="log-out" onPress={confirmReset} />
    </Screen>
  );
}
