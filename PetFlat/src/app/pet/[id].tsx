import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Share, Text, View } from 'react-native';
import { goBack } from '../../components/nav';
import { colors, monoFont } from '../../components/theme';
import { Button, Card, Empty, H1, H2, IconBadge, KeyValue, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { SERVICES, SPECIES_ICON } from '../../data/catalog';
import { useT } from '../../i18n';
import { usePet, useStore } from '../../store/AppStore';

export default function PetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = usePet(id);
  const { state, removePet, hasService } = useStore();
  const { t, tr, date, age, join } = useT();

  if (!pet) return <Empty icon="paw" text={t('pet.notFound')} />;

  const activeLost = state.posts.find((p) => p.ownPetId === pet.id && p.kind === 'lost' && !p.resolved);
  const speciesLabel = t(`species.${pet.species}`);

  const shareId = () =>
    Share.share({
      message: [
        `${t('pet.id')}: ${pet.id.toUpperCase()}`,
        `${pet.name} — ${speciesLabel}${pet.breed ? `, ${pet.breed}` : ''}`,
        pet.chipNumber ? t('pet.shareChip', { chip: pet.chipNumber }) : '',
        t('pet.shareOwner', { name: state.owner.name, phone: state.owner.phone }),
      ]
        .filter(Boolean)
        .join('\n'),
    });

  const remove = () =>
    Alert.alert(t('pet.deleteTitle', { name: pet.name }), t('pet.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          goBack();
          removePet(pet.id);
        },
      },
    ]);

  const petServices = SERVICES.filter((s) => s.id !== 'club');

  return (
    <Screen>
      <Stack.Screen options={{ title: pet.name }} />
      <Card style={{ alignItems: 'center' }}>
        <IconBadge icon={SPECIES_ICON[pet.species]} color={colors.primary} size={80} />
        <H1>{pet.name}</H1>
        <Muted>{join([speciesLabel, pet.breed, age(pet.birthDate)])}</Muted>
        {activeLost && <Tag text={t('pet.wanted')} color={colors.accent} />}
      </Card>

      <Card>
        <KeyValue k={t('pet.sex')} v={pet.sex === 'male' ? t('pet.male') : t('pet.female')} />
        <KeyValue k={t('pet.birthDate')} v={date(pet.birthDate)} />
        <KeyValue k={t('pet.color')} v={pet.color} />
        <KeyValue k={t('pet.weight')} v={pet.weightKg ? t('pet.weightVal', { n: pet.weightKg }) : undefined} />
        <KeyValue k={t('pet.chip')} v={pet.chipNumber} />
        <KeyValue k={t('pet.license')} v={pet.licenseNumber} />
        <KeyValue k={t('pet.marks')} v={pet.specialMarks} />
        <Row>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.muted }}>{t('pet.id')}</Text>
            <Text style={{ fontFamily: monoFont, fontSize: 16, color: colors.text }}>{pet.id.toUpperCase()}</Text>
          </View>
          <Button title={t('common.share')} variant="secondary" icon="share-social" onPress={shareId} />
        </Row>
      </Card>

      {activeLost ? (
        <Button
          title={t('pet.openLost')}
          variant="danger"
          icon="alert-circle"
          onPress={() => router.push(`/findypet/${activeLost.id}`)}
        />
      ) : (
        <Button
          title={t('pet.lost')}
          variant="danger"
          icon="alert-circle"
          onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'lost', petId: pet.id } })}
        />
      )}

      <H2>{t('pet.services')}</H2>
      {petServices.map((s) => (
        <ListItem
          key={s.id}
          icon={s.icon}
          color={s.color}
          title={tr(s.title)}
          subtitle={hasService(s.id) ? tr(s.subtitle) : t('pet.unavailableInPlan')}
          onPress={() =>
            s.id === 'findypet'
              ? router.push('/findypet')
              : router.push({ pathname: `/service/${s.id}`, params: { petId: pet.id } })
          }
        />
      ))}

      <Button title={t('pet.delete')} variant="ghost" icon="trash" onPress={remove} />
    </Screen>
  );
}
