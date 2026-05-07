// ============================================================
// useEvents / useEventsByDate — RQ-based with rollback
// ============================================================

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getDataSource } from '@/shared/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/shared/data/hooks/useRepositoryQuery';
import type { CalendarEvent } from '@/types';

const QUERY_KEY = ['events'] as const;

export function useEvents(): RepositoryQueryView<CalendarEvent> {
  const qc = useQueryClient();
  const repo = getDataSource().events;
  return useRepositoryQuery(repo, {
    queryKey: QUERY_KEY,
    upsertOptions: {
      onMutate: async (input) => {
        if (!input.id) return undefined;
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        const existing = prev.find((e) => e.id === input.id);
        if (existing) repo.store.upsert({ ...existing, ...input } as CalendarEvent);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        const prev = (ctx as { prev?: readonly CalendarEvent[] } | undefined)?.prev;
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
        const prev = (ctx as { prev?: readonly CalendarEvent[] } | undefined)?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
  });
}

export function useEventsByDate(date: string): readonly CalendarEvent[] {
  const { data } = useEvents();
  return useMemo(() => data.filter((e) => e.date === date), [data, date]);
}
