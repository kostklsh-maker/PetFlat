import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import type { Pet } from '../data/types';
import { useT } from '../i18n';
import { useStore } from '../store/AppStore';
import { colors, spacing } from './theme';
import { Button, Card, Muted } from './ui';

/** Selected pet for per-pet service screens; defaults to the `petId` route param, then the first pet. */
export function useSelectedPet(): [Pet | undefined, (id: string) => void] {
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const { state } = useStore();
  const [selected, setSelected] = useState(petId);
  const pet = state.pets.find((p) => p.id === selected) ?? state.pets[0];
  return [pet, setSelected];
}

export function PetPicker({ value, onChange }: { value?: Pet; onChange: (id: string) => void }) {
  const { state } = useStore();
  const { t } = useT();
  if (state.pets.length === 0) {
    return (
      <Card>
        <Muted>{t('common.addPetFirst')}</Muted>
        <Button title={t('common.addPet')} icon="add" onPress={() => router.push('/pet/new')} />
      </Card>
    );
  }
  if (state.pets.length === 1) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing(2) }}>
      {state.pets.map((p) => {
        const active = p.id === value?.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onChange(p.id)}
            style={{
              paddingHorizontal: spacing(4),
              paddingVertical: spacing(2),
              borderRadius: 999,
              backgroundColor: active ? colors.primary : colors.card,
            }}
          >
            <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>{p.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
