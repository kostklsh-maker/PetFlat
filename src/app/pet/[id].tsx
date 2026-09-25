import { goBack } from '../../components/nav';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Share, Text, View } from 'react-native';
import { ageLabel, formatDate } from '../../components/format';
import { colors } from '../../components/theme';
import { Button, Card, Empty, H1, H2, IconBadge, KeyValue, ListItem, Muted, Row, Screen, Tag } from '../../components/ui';
import { SERVICES, SPECIES_ICON, SPECIES_LABEL } from '../../data/catalog';
import { usePet, useStore } from '../../store/AppStore';

export default function PetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = usePet(id);
  const { state, removePet, hasService } = useStore();

  if (!pet) return <Empty icon="paw" text="Питомец не найден" />;

  const activeLost = state.posts.find((p) => p.ownPetId === pet.id && p.kind === 'lost' && !p.resolved);

  const shareId = () =>
    Share.share({
      message: [
        `PetFlat ID: ${pet.id.toUpperCase()}`,
        `${pet.name} — ${SPECIES_LABEL[pet.species]}${pet.breed ? `, ${pet.breed}` : ''}`,
        pet.chipNumber ? `Чип: ${pet.chipNumber}` : '',
        `Владелец: ${state.owner.name}, ${state.owner.phone}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });

  const remove = () =>
    Alert.alert(`Удалить ${pet.name}?`, 'Медкарта и записи питомца будут удалены.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
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
        <Muted>{[SPECIES_LABEL[pet.species], pet.breed, ageLabel(pet.birthDate)].filter(Boolean).join(' · ')}</Muted>
        {activeLost && <Tag text="В розыске" color={colors.accent} />}
      </Card>

      <Card>
        <KeyValue k="Пол" v={pet.sex === 'male' ? 'Мальчик' : 'Девочка'} />
        <KeyValue k="Дата рождения" v={formatDate(pet.birthDate)} />
        <KeyValue k="Окрас" v={pet.color} />
        <KeyValue k="Вес" v={pet.weightKg ? `${pet.weightKg} кг` : undefined} />
        <KeyValue k="Чип" v={pet.chipNumber} />
        <KeyValue k="Приметы" v={pet.specialMarks} />
        <Row>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: colors.muted }}>PetFlat ID</Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 16, color: colors.text }}>{pet.id.toUpperCase()}</Text>
          </View>
          <Button title="Поделиться" variant="secondary" icon="share-social" onPress={shareId} />
        </Row>
      </Card>

      {activeLost ? (
        <Button title="Открыть объявление о пропаже" variant="danger" icon="alert-circle" onPress={() => router.push(`/findypet/${activeLost.id}`)} />
      ) : (
        <Button
          title="Питомец потерялся"
          variant="danger"
          icon="alert-circle"
          onPress={() => router.push({ pathname: '/findypet/new', params: { kind: 'lost', petId: pet.id } })}
        />
      )}

      <H2>Сервисы питомца</H2>
      {petServices.map((s) => (
        <ListItem
          key={s.id}
          icon={s.icon}
          color={s.color}
          title={s.title}
          subtitle={hasService(s.id) ? s.subtitle : 'Недоступно в текущем тарифе'}
          onPress={() =>
            s.id === 'findypet'
              ? router.push('/findypet')
              : router.push({ pathname: `/service/${s.id}`, params: { petId: pet.id } })
          }
        />
      ))}

      <Button title="Удалить питомца" variant="ghost" icon="trash" onPress={remove} />
    </Screen>
  );
}
