import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../components/theme';
import { serviceById } from '../data/catalog';
import { useT } from '../i18n';
import { AppStoreProvider, useStore } from '../store/AppStore';

// Deep-linked screens (e.g. a FindYpet post from a notification) get the tabs underneath, so "back" works.
export const unstable_settings = { anchor: '(tabs)' };

function RootStack() {
  const { ready, state } = useStore();
  const { t, tr } = useT();
  const serviceTitle = (id: Parameters<typeof serviceById>[0]) => ({ title: tr(serviceById(id).title) });

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.bg },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Protected guard={!state.onboarded}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={state.onboarded}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="plans" options={{ title: t('title.plans'), presentation: 'modal' }} />
        <Stack.Screen name="pet/new" options={{ title: t('title.newPet'), presentation: 'modal' }} />
        <Stack.Screen name="pet/[id]" options={{ title: t('title.pet') }} />
        <Stack.Screen name="service/medical" options={serviceTitle('medical')} />
        <Stack.Screen name="service/club" options={serviceTitle('club')} />
        <Stack.Screen name="service/hotel" options={serviceTitle('hotel')} />
        <Stack.Screen name="service/grooming" options={serviceTitle('grooming')} />
        <Stack.Screen name="findypet/new" options={{ title: t('title.newPost'), presentation: 'modal' }} />
        <Stack.Screen name="findypet/[id]" options={{ title: t('title.post') }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="dark" />
        <RootStack />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
