// ============================================================
// useChecklist — RQ-based with optimistic toggle
// 모바일 핵심: 체크박스 즉시 반응 + 실패 시 롤백
// ============================================================

import { useQueryClient } from '@tanstack/react-query';
import { getDataSource } from '@/shared/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/shared/data/hooks/useRepositoryQuery';
import type { ChecklistTask } from '@/types';

const QUERY_KEY = ['checklist'] as const;

export function useChecklist(): RepositoryQueryView<ChecklistTask> {
  const qc = useQueryClient();
  const repo = getDataSource().checklist;
  return useRepositoryQuery(repo, {
    queryKey: QUERY_KEY,
    upsertOptions: {
      onMutate: async (input) => {
        if (!input.id) return undefined;
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        const existing = prev.find((t) => t.id === input.id);
        if (existing) repo.store.upsert({ ...existing, ...input } as ChecklistTask);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        const prev = (ctx as { prev?: readonly ChecklistTask[] } | undefined)?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
    removeOptions: {
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        repo.store.remove(id);
        return { prev };
      },
      onError: (_err, _id, ctx) => {
        const prev = (ctx as { prev?: readonly ChecklistTask[] } | undefined)?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
  });
}
