// ============================================================
// daily-log mapper — DailyLog ↔ public.daily_logs
// ============================================================

import type { DailyLog, Mood } from '@/data/daily-log';
import type { TablesInsert, Tables } from '@/data/source/db.types';

type Row = Tables<'daily_logs'>;
type Insert = TablesInsert<'daily_logs'>;

export function toDomain(row: Row): DailyLog {
  return {
    id: row.id,
    date: row.date,
    mood: (row.mood as Mood) ?? 'calm',
    oneLine: row.one_line ?? '',
    updatedAt: row.updated_at,
  };
}

export function toRow(input: Partial<DailyLog>, userId: string): Insert {
  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    user_id: userId,
    date: input.date ?? new Date().toISOString().slice(0, 10),
    mood: input.mood ?? null,
    one_line: input.oneLine ?? null,
  };
}
