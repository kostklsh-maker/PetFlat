import { router } from 'expo-router';
import { colors } from '../../components/theme';
import { Button, ListItem, Muted, Screen, Tag } from '../../components/ui';
import { SERVICES, minPlanFor } from '../../data/catalog';
import { useStore } from '../../store/AppStore';

export default function Services() {
  const { hasService } = useStore();

  return (
    <Screen>
      <Muted>
        Сервисы привязываются к вашему цифровому профилю. Набор доступных сервисов зависит от ежемесячного тарифа.
      </Muted>
      {SERVICES.map((s) => {
        const on = hasService(s.id);
        return (
          <ListItem
            key={s.id}
            icon={s.icon}
            color={s.color}
            title={s.title}
            subtitle={s.subtitle}
            right={on ? <Tag text="Подключён" color={colors.success} /> : <Tag text={minPlanFor(s.id).title} color={colors.muted} />}
            onPress={() => router.push(s.id === 'findypet' ? '/findypet' : `/service/${s.id}`)}
          />
        );
      })}
      <Button title="Сравнить тарифы" variant="secondary" icon="layers" onPress={() => router.push('/plans')} />
    </Screen>
  );
}
