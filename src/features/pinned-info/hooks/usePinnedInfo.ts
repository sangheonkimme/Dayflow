import { getDataSource } from '@/shared/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/shared/data/hooks/useRepositoryQuery';
import type { PinnedInfo } from '@/shared/data/seeds/types';

export function usePinnedInfo(): RepositoryQueryView<PinnedInfo> {
  return useRepositoryQuery(getDataSource().pinnedInfo, {
    queryKey: ['pinnedInfo'],
  });
}
