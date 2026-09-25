import { goBack } from '../../components/nav';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Share } from 'react-native';
import { formatDate, rub } from '../../components/format';
import { colors } from '../../components/theme';
import { Button, Card, Empty, H1, IconBadge, KeyValue, Muted, Screen, Tag } from '../../components/ui';
import { SPECIES_LABEL } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, resolvePost } = useStore();
  const post = state.posts.find((p) => p.id === id);

  if (!post) return <Empty icon="search" text="Объявление не найдено" />;

  const lost = post.kind === 'lost';
  const mine = !!post.ownPetId;
  const title = lost ? `Потерялся: ${post.petName || SPECIES_LABEL[post.species]}` : `Найден: ${SPECIES_LABEL[post.species]}`;

  const call = () => Linking.openURL(`tel:${post.contactPhone.replace(/[^\d+]/g, '')}`);

  const share = () =>
    Share.share({
      message: [
        `FindYpet — ${title}`,
        `${post.breed}, ${post.color}`,
        post.description,
        `Где: ${post.area}, ${formatDate(post.date)}`,
        post.reward ? `Вознаграждение: ${rub(post.reward)}` : '',
        `Связь: ${post.contactName} ${post.contactPhone}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });

  const resolve = () =>
    Alert.alert('Питомец нашёлся?', 'Объявление будет снято с публикации.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Да, нашёлся!',
        onPress: () => {
          resolvePost(post.id);
          goBack();
        },
      },
    ]);

  return (
    <Screen>
      <Card style={{ alignItems: 'center' }}>
        <IconBadge icon={lost ? 'alert-circle' : 'heart'} color={lost ? colors.accent : colors.success} size={72} />
        <H1>{title}</H1>
        {post.reward ? <Tag text={`Вознаграждение ${rub(post.reward)}`} color={colors.accent} /> : null}
      </Card>
      <Card>
        <KeyValue k="Вид" v={SPECIES_LABEL[post.species]} />
        <KeyValue k="Порода" v={post.breed} />
        <KeyValue k="Окрас" v={post.color} />
        <KeyValue k={lost ? 'Где потерялся' : 'Где найден'} v={post.area} />
        <KeyValue k="Дата" v={formatDate(post.date)} />
        <KeyValue k="Контакт" v={post.contactName} />
        {post.description ? <Muted>{post.description}</Muted> : null}
      </Card>
      {mine ? (
        <Button title="Питомец нашёлся" icon="checkmark-circle" onPress={resolve} />
      ) : (
        <Button title={lost ? 'Я видел этого питомца' : 'Это мой питомец'} icon="call" onPress={call} />
      )}
      <Button title="Поделиться объявлением" variant="secondary" icon="share-social" onPress={share} />
    </Screen>
  );
}
