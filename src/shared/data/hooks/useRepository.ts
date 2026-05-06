// ============================================================
// useRepository — 모든 도메인 hook의 공통 베이스
// ============================================================

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { Repository } from '@/shared/data/source/types';
import type { Status } from '@/shared/data/store';

export interface RepositoryView<T extends { id: string | number }> {
  data: readonly T[];
  status: Status;
  error: Error | null;
  isLoading: boolean;
  upsert: (item: Partial<T> & { id?: T['id'] }) => Promise<T>;
  remove: (id: T['id']) => Promise<void>;
}

export function useRepository<T extends { id: string | number }>(
  repo: Repository<T>,
): RepositoryView<T> {
  const data = useSyncExternalStore(repo.store.subscribe, repo.store.getSnapshot);
  const status = useSyncExternalStore(repo.store.subscribe, repo.store.getStatus);
  const error = useSyncExternalStore(repo.store.subscribe, repo.store.getError);

  // mock에선 즉시 채워지지만, supabase 전환 시 status==='idle'에서 init 트리거.
  useEffect(() => {
    if (status === 'idle') {
      repo.store.setStatus('loading');
      repo.init().catch((e) => repo.store.setStatus('error', e as Error));
    }
  }, [repo, status]);

  return useMemo(
    () => ({
      data,
      status,
      error,
      isLoading: status === 'loading',
      upsert: (item) => repo.upsert(item),
      remove: (id) => repo.remove(id),
    }),
    [data, status, error, repo],
  );
}
