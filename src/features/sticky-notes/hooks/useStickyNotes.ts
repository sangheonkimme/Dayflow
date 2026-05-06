// ============================================================
// useStickyNotes — RQ-based, soft-cap 3 enforced in upsert
// ============================================================

import { useMemo, useCallback } from 'react';
import { getDataSource } from '@/shared/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/shared/data/hooks/useRepositoryQuery';
import type { StickyNote } from '@/types';

const MAX_STICKY = 3;

export function useStickyNotes(): RepositoryQueryView<StickyNote> {
  const view = useRepositoryQuery(getDataSource().stickyNotes, {
    queryKey: ['stickyNotes'],
  });
  const { data, upsert: rawUpsert } = view;

  const upsert = useCallback<RepositoryQueryView<StickyNote>['upsert']>(
    async (item) => {
      const exists = item.id != null && data.some((n) => n.id === item.id);
      if (!exists && data.length >= MAX_STICKY) {
        return data[0]!;
      }
      return rawUpsert(item);
    },
    [data, rawUpsert],
  );

  return useMemo(() => ({ ...view, upsert }), [view, upsert]);
}
