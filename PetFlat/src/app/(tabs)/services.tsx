import { router } from 'expo-router';
import { colors } from '../../components/theme';
import { Button, ListItem, Muted, Screen, Tag } from '../../components/ui';
import { SERVICES, minPlanFor } from '../../data/catalog';
import { useT } from '../../i18n';
import { useStore } from '../../store/AppStore';

export default function Services() {
  const { hasService } = useStore();
  const { t, tr } = useT();

  return (
    <Screen>
      <Muted>{t('services.intro')}</Muted>
      {SERVICES.map((s) => {
        const on = hasService(s.id);
        return (
          <ListItem
            key={s.id}
            icon={s.icon}
            color={s.color}
            title={tr(s.title)}
            subtitle={tr(s.subtitle)}
            right={
              on ? (
                <Tag text={t('services.connected')} color={colors.success} />
              ) : (
                <Tag text={tr(minPlanFor(s.id).title)} color={colors.muted} />
              )
            }
            onPress={() => router.push(s.id === 'findypet' ? '/findypet' : `/service/${s.id}`)}
          />
        );
      })}
      <Button title={t('services.compare')} variant="secondary" icon="layers" onPress={() => router.push('/plans')} />
    </Screen>
  );
}
