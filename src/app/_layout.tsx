import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../components/theme';
import { AppStoreProvider, useStore } from '../store/AppStore';

// Deep-linked screens (e.g. a FindYpet post from a notification) get the tabs underneath, so "back" works.
export const unstable_settings = { anchor: '(tabs)' };

function RootStack() {
  const { ready, state } = useStore();

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
        <Stack.Screen name="plans" options={{ title: 'Тарифы', presentation: 'modal' }} />
        <Stack.Screen name="pet/new" options={{ title: 'Новый питомец', presentation: 'modal' }} />
        <Stack.Screen name="pet/[id]" options={{ title: 'Питомец' }} />
        <Stack.Screen name="service/medical" options={{ title: 'Больничная карта' }} />
        <Stack.Screen name="service/club" options={{ title: 'Клубная карта' }} />
        <Stack.Screen name="service/hotel" options={{ title: 'Карта для гостиниц' }} />
        <Stack.Screen name="service/grooming" options={{ title: 'Грумеры' }} />
        <Stack.Screen name="findypet/new" options={{ title: 'Новое объявление', presentation: 'modal' }} />
        <Stack.Screen name="findypet/[id]" options={{ title: 'Объявление' }} />
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
