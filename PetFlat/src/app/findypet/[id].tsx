import { useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Share } from 'react-native';
import { goBack } from '../../components/nav';
import { colors } from '../../components/theme';
import { Button, Card, Empty, H1, IconBadge, KeyValue, Muted, Screen, Tag } from '../../components/ui';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, resolvePost } = useStore();
  const { t, money, date } = useT();
  const post = state.posts.find((p) => p.id === id);

  if (!post) return <Empty icon="search" text={t('fyp.notFound')} />;

  const lost = post.kind === 'lost';
  const mine = !!post.ownPetId;
  const speciesLabel = t(`species.${post.species}`);
  const title = lost
    ? t('fyp.lostTitle', { name: post.petName || speciesLabel })
    : t('fyp.foundTitle', { species: speciesLabel });

  const call = () => Linking.openURL(`tel:${post.contactPhone.replace(/[^\d+]/g, '')}`);

  const share = () =>
    Share.share({
      message: [
        `FindYpet — ${title}`,
        `${post.breed}, ${post.color}`,
        post.description,
        t('fyp.whereLine', { area: post.area, date: date(post.date) }),
        post.reward ? t('fyp.rewardLine', { amount: money(post.reward) }) : '',
        t('fyp.contactLine', { name: post.contactName, phone: post.contactPhone }),
      ]
        .filter(Boolean)
        .join('\n'),
    });

  const resolve = () =>
    Alert.alert(t('fyp.resolveTitle'), t('fyp.resolveMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('fyp.resolveYes'),
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
        {post.reward ? <Tag text={t('fyp.rewardTag', { amount: money(post.reward) })} color={colors.accent} /> : null}
      </Card>
      <Card>
        <KeyValue k={t('fyp.species')} v={speciesLabel} />
        <KeyValue k={t('pet.breed')} v={post.breed} />
        <KeyValue k={t('pet.color')} v={post.color} />
        <KeyValue k={lost ? t('fyp.whereLost') : t('fyp.whereFound')} v={post.area} />
        <KeyValue k={t('common.date')} v={date(post.date)} />
        <KeyValue k={t('fyp.contact')} v={post.contactName} />
        {post.description ? <Muted>{post.description}</Muted> : null}
      </Card>
      {mine ? (
        <Button title={t('fyp.resolved')} icon="checkmark-circle" onPress={resolve} />
      ) : (
        <Button title={lost ? t('fyp.sawIt') : t('fyp.itsMine')} icon="call" onPress={call} />
      )}
      <Button title={t('fyp.sharePost')} variant="secondary" icon="share-social" onPress={share} />
    </Screen>
  );
}
