import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { PinnedInfo } from '@/shared/data/seeds/types';

export function usePinnedInfo(): RepositoryView<PinnedInfo> {
  return useRepository(getDataSource().pinnedInfo);
}
