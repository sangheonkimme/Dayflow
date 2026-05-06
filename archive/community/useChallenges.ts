import { getDataSource } from '@/data/source';
import { useRepository, type RepositoryView } from '@/data/hooks/useRepository';
import type { Challenge } from '@/data/seeds/types';

export function useChallenges(): RepositoryView<Challenge> {
  return useRepository(getDataSource().challenges);
}
