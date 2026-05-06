import { getDataSource } from '@/data/source';
import { useRepository, type RepositoryView } from '@/data/hooks/useRepository';
import type { Ranker } from '@/data/seeds/types';

export function useRanking(): RepositoryView<Ranker> {
  return useRepository(getDataSource().ranking);
}
