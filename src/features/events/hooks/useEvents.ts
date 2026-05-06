// ============================================================
// useEvents / useEventsByDate
// ============================================================

import { useMemo } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import type { CalendarEvent } from '@/types';

export function useEvents(): RepositoryView<CalendarEvent> {
  return useRepository(getDataSource().events);
}

export function useEventsByDate(date: string): readonly CalendarEvent[] {
  const { data } = useEvents();
  return useMemo(() => data.filter((e) => e.date === date), [data, date]);
}
