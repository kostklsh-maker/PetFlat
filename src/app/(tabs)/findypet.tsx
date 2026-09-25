import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { formatDate, rub } from '../../components/format';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Empty, ListItem, Muted, Row, Screen, Segmented, Tag } from '../../components/ui';
import { SPECIES_LABEL } from '../../data/catalog';
import type { LostFoundKind } from '../../data/types';
import { useStore } from '../../store/AppStore';

export default function FindYpet() {
  const { state } = useStore();
  const [kind, setKind] = useState<LostFoundKind | 'all'>('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const posts = state.posts
    .filter((p) => !p.resolved)
    .filter((p) => kind === 'all' || p.kind === kind)
    .filter(
      (p) =>
        !q ||
        [p.petName, p.breed, p.color, p.area, p.description, SPECIES_LABEL[p.species]]
          .join(' ')
          .toLowerCase()
          .includes(q),
    );

  return (
    <Screen>
      <Muted>
        FindYpet — объявления о потерянных и найденных животных. Если ваш питомец пропал, создайте объявление в один
        клик из его профиля.
      </Muted>
      <Row>
        <Button title="Потерялся" icon="alert-circle" onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'lost' } })} />
        <Button title="Нашёл" variant="secondary" icon="hand-left" onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'found' } })} />
      </Row>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск: порода, окрас, район…"
        placeholderTextColor="#9CA3AF"
        style={{
          backgroundColor: colors.card,
          borderRadius: radius.md,
          padding: spacing(3),
          fontSize: 16,
          color: colors.text,
        }}
      />
      <Segmented
        value={kind}
        onChange={setKind}
        options={[
          { value: 'all', label: 'Все' },
          { value: 'lost', label: 'Потерялись' },
          { value: 'found', label: 'Найдены' },
        ]}
      />
      {posts.length === 0 && <Empty icon="search" text="Ничего не найдено" />}
      {posts.map((p) => (
        <ListItem
          key={p.id}
          icon={p.kind === 'lost' ? 'alert-circle' : 'heart'}
          color={p.kind === 'lost' ? colors.accent : colors.success}
          title={p.kind === 'lost' ? `Потерялся: ${p.petName || SPECIES_LABEL[p.species]}` : `Найден: ${SPECIES_LABEL[p.species]}`}
          subtitle={`${p.breed}, ${p.color} · ${p.area} · ${formatDate(p.date)}`}
          right={p.reward ? <Tag text={rub(p.reward)} color={colors.accent} /> : undefined}
          onPress={() => router.push(`/findypet/${p.id}`)}
        />
      ))}
    </Screen>
  );
}
