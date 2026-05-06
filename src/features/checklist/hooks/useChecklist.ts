import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { ChecklistTask } from '@/types';

export function useChecklist(): RepositoryView<ChecklistTask> {
  return useRepository(getDataSource().checklist);
}
