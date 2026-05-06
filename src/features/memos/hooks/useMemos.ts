// ============================================================
// useMemos
// ============================================================

import { useMemo } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { MemoDoc } from '@/types';

export interface MemosView extends RepositoryView<MemoDoc> {
  all: readonly MemoDoc[];
}

export function useMemos(folder?: string): MemosView {
  const view = useRepository(getDataSource().memos);
  const { data: all } = view;
  const data = useMemo(() => {
    if (!folder || folder === 'all') return all;
    if (folder === 'starred') return all.filter((m) => m.starred);
    if (folder === 'trash') return [];
    return all.filter((m) => m.folder === folder);
  }, [all, folder]);
  return useMemo(() => ({ ...view, data, all }), [view, data, all]);
}
