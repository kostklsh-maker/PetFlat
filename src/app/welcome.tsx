import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../components/theme';
import { Button, Field, Muted, Screen } from '../components/ui';
import { useStore } from '../store/AppStore';

export default function Welcome() {
  const { completeOnboarding } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Заполните профиль', 'Укажите имя и телефон — по ним с вами свяжутся, если питомец потеряется.');
      return;
    }
    completeOnboarding({ name: name.trim(), phone: phone.trim(), email: email.trim(), city: city.trim() });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen>
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
            <Muted style={{ textAlign: 'center' }}>
              Единый цифровой профиль владельца: медкарта, клубные карты, грумеры, гостиницы и поиск питомцев
              FindYpet — в одном приложении.
            </Muted>
          </View>
          <Field label="Имя *" value={name} onChangeText={setName} placeholder="Как к вам обращаться" />
          <Field label="Телефон *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+7 ..." />
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Город" value={city} onChangeText={setCity} />
          <Button title="Создать профиль" icon="arrow-forward" onPress={submit} />
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
