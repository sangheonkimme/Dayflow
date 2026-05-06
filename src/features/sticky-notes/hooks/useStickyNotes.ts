// ============================================================
// useStickyNotes — enforces 3-item max in upsert
// ============================================================

import { useMemo, useCallback } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { StickyNote } from '@/types';

const MAX_STICKY = 3;

export function useStickyNotes(): RepositoryView<StickyNote> {
  const view = useRepository(getDataSource().stickyNotes);
  const { data, upsert: rawUpsert } = view;

  const upsert = useCallback<RepositoryView<StickyNote>['upsert']>(
    async (item) => {
      const exists = item.id != null && data.some((n) => n.id === item.id);
      if (!exists && data.length >= MAX_STICKY) {
        // soft-cap: silently drop the add (matches the prior UI semantics)
        return data[0]!;
      }
      return rawUpsert(item);
    },
    [data, rawUpsert],
  );

  return useMemo(() => ({ ...view, upsert }), [view, upsert]);
}
