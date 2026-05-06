import { getDataSource } from '@/data/source';
import { useRepository, type RepositoryView } from '@/data/hooks/useRepository';
import type { PinnedInfo } from '@/data/seeds/types';

export function usePinnedInfo(): RepositoryView<PinnedInfo> {
  return useRepository(getDataSource().pinnedInfo);
}
