import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { colors, radius, spacing } from '../../components/theme';
import { Button, Empty, ListItem, Muted, Row, Screen, Segmented, Tag } from '../../components/ui';
import type { LostFoundKind } from '../../data/types';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function FindYpet() {
  const { state } = useStore();
  const { t, money, date, join } = useT();
  const [kind, setKind] = useState<LostFoundKind | 'all'>('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const posts = state.posts
    .filter((p) => !p.resolved)
    .filter((p) => kind === 'all' || p.kind === kind)
    .filter(
      (p) =>
        !q ||
        [p.petName, p.breed, p.color, p.area, p.description, t(`species.${p.species}`)]
          .join(' ')
          .toLowerCase()
          .includes(q),
    );

  return (
    <Screen>
      <Muted>{t('fyp.intro')}</Muted>
      <Row>
        <Button
          title={t('fyp.lostBtn')}
          icon="alert-circle"
          onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'lost' } })}
        />
        <Button
          title={t('fyp.foundBtn')}
          variant="secondary"
          icon="hand-left"
          onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'found' } })}
        />
      </Row>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('fyp.searchPh')}
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
          { value: 'all', label: t('fyp.all') },
          { value: 'lost', label: t('fyp.lostTab') },
          { value: 'found', label: t('fyp.foundTab') },
        ]}
      />
      {posts.length === 0 && <Empty icon="search" text={t('fyp.nothing')} />}
      {posts.map((p) => (
        <ListItem
          key={p.id}
          icon={p.kind === 'lost' ? 'alert-circle' : 'heart'}
          color={p.kind === 'lost' ? colors.accent : colors.success}
          title={
            p.kind === 'lost'
              ? t('fyp.lostTitle', { name: p.petName || t(`species.${p.species}`) })
              : t('fyp.foundTitle', { species: t(`species.${p.species}`) })
          }
          subtitle={join([`${p.breed}, ${p.color}`, p.area, date(p.date)])}
          right={p.reward ? <Tag text={money(p.reward)} color={colors.accent} /> : undefined}
          onPress={() => router.push(`/findypet/${p.id}`)}
        />
      ))}
    </Screen>
  );
}
