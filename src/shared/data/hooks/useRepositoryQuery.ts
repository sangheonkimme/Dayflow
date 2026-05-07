// ============================================================
// useRepositoryQuery — React Query 기반 Repository 어댑터
// ============================================================
//
// 외부에 노출하는 API는 기존 RepositoryView와 동일하다. 변경점:
// - mutation은 useMutation으로 감쌈 → pending state, 낙관적 업데이트 인프라
// - read는 여전히 store(useSyncExternalStore)에서 가져옴 — store가 진실 원천
//   (mock: 인메모리, supabase: init 후 store에 캐시 + realtime 갱신 가능)
// - useQuery는 init()을 lifecycle에 매달아주는 역할 (idempotent)
//
// 낙관적 업데이트는 호출부에서 도메인별로 useMutation을 직접 추가하거나,
// 이 훅의 upsertOptions / removeOptions 옵션으로 onMutate/onError를 주입.

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import type { Repository } from '@/shared/data/source/types';
import type { Status } from '@/shared/data/store';

export interface RepositoryQueryView<T extends { id: string | number }> {
  data: readonly T[];
  status: Status;
  error: Error | null;
  isLoading: boolean;
  upsert: (item: Partial<T> & { id?: T['id'] }) => Promise<T>;
  remove: (id: T['id']) => Promise<void>;
}

export interface UseRepositoryQueryOptions<T extends { id: string | number }> {
  /** queryKey의 도메인 prefix — 예: ['transactions']. */
  queryKey: readonly unknown[];
  /** 추가 mutation 훅 옵션 (낙관적 업데이트용). */
  upsertOptions?: Omit<
    UseMutationOptions<T, Error, Partial<T> & { id?: T['id'] }>,
    'mutationFn'
  >;
  removeOptions?: Omit<
    UseMutationOptions<void, Error, T['id']>,
    'mutationFn'
  >;
}

export function useRepositoryQuery<T extends { id: string | number }>(
  repo: Repository<T>,
  options: UseRepositoryQueryOptions<T>,
): RepositoryQueryView<T> {
  const qc = useQueryClient();
  const { queryKey } = options;

  // store를 RQ와 분리해서 직접 구독 — 외부 변경(mutation 결과, realtime)이 즉시 반영
  const data = useSyncExternalStore(repo.store.subscribe, repo.store.getSnapshot);

  // queryFn은 init lifecycle만 담당. 데이터 자체는 위 useSyncExternalStore에서.
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      await repo.init();
      return repo.store.getSnapshot();
    },
    staleTime: Infinity, // store가 진실 원천이라 자동 refetch 안 함
  });

  const upsertM = useMutation<T, Error, Partial<T> & { id?: T['id'] }>({
    mutationFn: (item) => repo.upsert(item),
    ...options.upsertOptions,
    onSettled: (...args) => {
      qc.setQueryData(queryKey, repo.store.getSnapshot());
      options.upsertOptions?.onSettled?.(...args);
    },
  });

  const removeM = useMutation<void, Error, T['id']>({
    mutationFn: (id) => repo.remove(id),
    ...options.removeOptions,
    onSettled: (...args) => {
      qc.setQueryData(queryKey, repo.store.getSnapshot());
      options.removeOptions?.onSettled?.(...args);
    },
  });

  return {
    data,
    status: repo.store.getStatus(),
    error: repo.store.getError(),
    isLoading: query.isPending,
    upsert: (item) => upsertM.mutateAsync(item),
    remove: (id) => removeM.mutateAsync(id),
  };
}
