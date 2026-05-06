import { getDataSource } from '@/data/source';
import { useRepository, type RepositoryView } from '@/data/hooks/useRepository';
import type { ChecklistTask } from '@/types';

export function useChecklist(): RepositoryView<ChecklistTask> {
  return useRepository(getDataSource().checklist);
}
