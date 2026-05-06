import { useMemo } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { Subscription, SubStatus } from '@/types';
import { SUBSCRIPTION_USAGE_SEEDS } from '@/shared/data/seeds';
import type { SubscriptionUsage } from '@/features/subscriptions/seeds';

export interface SubscriptionsView extends RepositoryView<Subscription> {
  all: readonly Subscription[];
  /** Static-for-now; supabase swap point. */
  usage: readonly SubscriptionUsage[];
}

export function useSubscriptions(status?: SubStatus): SubscriptionsView {
  const view = useRepository(getDataSource().subscriptions);
  const { data: all } = view;
  const data = useMemo(() => {
    if (!status) return all;
    return all.filter((s) => s.status === status);
  }, [all, status]);
  return useMemo(
    () => ({ ...view, data, all, usage: SUBSCRIPTION_USAGE_SEEDS }),
    [view, data, all],
  );
}
