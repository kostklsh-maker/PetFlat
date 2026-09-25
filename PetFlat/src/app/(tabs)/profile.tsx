import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, H2, KeyValue, LanguagePicker, ListItem, Screen } from '../../components/ui';
import { planById } from '../../data/catalog';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function Profile() {
  const { state, updateOwner, resetAll } = useStore();
  const { t, tr, price } = useT();
  const [editing, setEditing] = useState(false);
  const [owner, setOwner] = useState(state.owner);
  const plan = planById(state.plan);

  const save = () => {
    if (!owner.name.trim() || !owner.phone.trim()) {
      Alert.alert(t('profile.required'));
      return;
    }
    updateOwner(owner);
    setEditing(false);
  };

  const confirmReset = () =>
    Alert.alert(t('profile.logoutTitle'), t('profile.logoutMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: resetAll },
    ]);

  return (
    <Screen>
      <H2>{t('profile.title')}</H2>
      {editing ? (
        <Card>
          <Field label={t('owner.name')} value={owner.name} onChangeText={(name) => setOwner({ ...owner, name })} />
          <Field
            label={t('owner.phone')}
            value={owner.phone}
            keyboardType="phone-pad"
            placeholder="+972 5X-XXX-XXXX"
            onChangeText={(phone) => setOwner({ ...owner, phone })}
          />
          <Field
            label={t('owner.email')}
            value={owner.email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(email) => setOwner({ ...owner, email })}
          />
          <Field
            label={t('owner.city')}
            value={owner.city}
            placeholder={t('owner.cityPh')}
            onChangeText={(city) => setOwner({ ...owner, city })}
          />
          <Button title={t('common.save')} icon="checkmark" onPress={save} />
          <Button
            title={t('common.cancel')}
            variant="ghost"
            onPress={() => {
              setOwner(state.owner);
              setEditing(false);
            }}
          />
        </Card>
      ) : (
        <Card>
          <KeyValue k={t('owner.name')} v={state.owner.name} />
          <KeyValue k={t('owner.phone')} v={state.owner.phone} />
          <KeyValue k={t('owner.email')} v={state.owner.email} />
          <KeyValue k={t('owner.city')} v={state.owner.city} />
          <KeyValue k={t('profile.petsCount')} v={state.pets.length} />
          <Button
            title={t('profile.edit')}
            variant="secondary"
            icon="pencil"
            onPress={() => {
              setOwner(state.owner);
              setEditing(true);
            }}
          />
        </Card>
      )}

      <H2>{t('common.language')}</H2>
      <LanguagePicker />

      <H2>{t('profile.subscription')}</H2>
      <ListItem
        icon="rocket"
        title={t('plans.planTitle', { plan: tr(plan.title) })}
        subtitle={plan.pricePerMonth ? t('profile.perMonthLong', { price: price(plan.pricePerMonth) }) : t('common.free')}
        onPress={() => router.push('/plans')}
      />

      <Button title={t('profile.logout')} variant="danger" icon="log-out" onPress={confirmReset} />
    </Screen>
  );
}
