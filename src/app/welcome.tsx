import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../components/theme';
import { Button, Field, LanguagePicker, Muted, Screen } from '../components/ui';
import { useT } from '../i18n';
import { useStore } from '../store/AppStore';

export default function Welcome() {
  const { completeOnboarding } = useStore();
  const { t } = useT();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(t('welcome.fillTitle'), t('welcome.fillMsg'));
      return;
    }
    completeOnboarding({ name: name.trim(), phone: phone.trim(), email: email.trim(), city: city.trim() });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen>
          <LanguagePicker />
          <View style={{ alignItems: 'center', gap: spacing(2), marginVertical: spacing(6) }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 28,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="paw" size={48} color="#fff" />
            </View>
            <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text }}>PetFlat</Text>
            <Muted style={{ textAlign: 'center' }}>{t('welcome.tagline')}</Muted>
          </View>
          <Field label={t('welcome.name')} value={name} onChangeText={setName} placeholder={t('welcome.namePh')} />
          <Field label={t('welcome.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+972 5X-XXX-XXXX" />
          <Field label={t('owner.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field label={t('owner.city')} value={city} onChangeText={setCity} placeholder={t('owner.cityPh')} />
          <Button title={t('welcome.create')} icon="arrow-forward" onPress={submit} />
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
