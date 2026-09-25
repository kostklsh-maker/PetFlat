import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { minPlanFor, serviceById } from '../data/catalog';
import type { ServiceId } from '../data/types';
import { useStore } from '../store/AppStore';
import { rub } from './format';
import { Button, Card, H1, IconBadge, Muted, Screen } from './ui';

/** Renders children only when the current plan includes the service; otherwise offers an upgrade. */
export function PlanGate({ service, children }: { service: ServiceId; children: ReactNode }) {
  const { hasService } = useStore();
  if (hasService(service)) return <>{children}</>;
  const info = serviceById(service);
  const plan = minPlanFor(service);
  return (
    <Screen>
      <Card style={{ alignItems: 'center', gap: 12 }}>
        <IconBadge icon={info.icon} color={info.color} size={64} />
        <H1>{info.title}</H1>
        <Muted style={{ textAlign: 'center' }}>{info.subtitle}</Muted>
        <Muted style={{ textAlign: 'center' }}>
          Сервис доступен с тарифа «{plan.title}» — {rub(plan.pricePerMonth)}/мес.
        </Muted>
        <Button title="Выбрать тариф" icon="rocket" onPress={() => router.push('/plans')} />
      </Card>
    </Screen>
  );
}
