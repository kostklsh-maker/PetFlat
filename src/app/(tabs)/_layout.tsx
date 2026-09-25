import Ionicons from '@expo/vector-icons/Ionicons';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { colors } from '../../components/theme';
import type { IconName } from '../../data/catalog';

function icon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} color={color as string} size={size} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Главная', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="pets" options={{ title: 'Питомцы', tabBarIcon: icon('paw') }} />
      <Tabs.Screen name="services" options={{ title: 'Сервисы', tabBarIcon: icon('apps') }} />
      <Tabs.Screen name="findypet" options={{ title: 'FindYpet', tabBarIcon: icon('search') }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: icon('person-circle') }} />
    </Tabs>
  );
}
