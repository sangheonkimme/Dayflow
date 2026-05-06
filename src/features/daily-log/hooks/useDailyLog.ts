// ============================================================
// useDailyLog — 1 row per date keyed by YYYY-MM-DD
// ============================================================

import { useMemo, useCallback } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository } from '@/shared/data/hooks/useRepository';
import type { DailyLog, Mood } from '@/shared/data/seeds/types';

function todayId(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface DailyLogView {
  entry: DailyLog | null;
  setOneLine: (text: string) => Promise<void>;
  setMood: (mood: Mood) => Promise<void>;
  isLoading: boolean;
}

export function useDailyLog(date?: string): DailyLogView {
  const repo = getDataSource().dailyLog;
  const view = useRepository(repo);
  const id = date ?? todayId();
  const entry = useMemo(
    () => view.data.find((e) => e.id === id) ?? null,
    [view.data, id],
  );

  const setOneLine = useCallback(
    async (text: string) => {
      const base: DailyLog = entry ?? { id, date: id, mood: 'calm', oneLine: '' };
      await view.upsert({ ...base, oneLine: text });
    },
    [entry, id, view],
  );

  const setMood = useCallback(
    async (mood: Mood) => {
      const base: DailyLog = entry ?? { id, date: id, mood: 'calm', oneLine: '' };
      await view.upsert({ ...base, mood });
    },
    [entry, id, view],
  );

  return { entry, setOneLine, setMood, isLoading: view.isLoading };
}
