// ============================================================
// daily-log mapper — DailyLog ↔ public.daily_logs
// ============================================================

import type { DailyLog, Mood } from "@/data/daily-log";
import type { TablesInsert, Tables } from "@/data/source/db.types";

type Row = Tables<"daily_logs">;
type Insert = TablesInsert<"daily_logs">;

// 도메인 id ↔ DB
// - DB id 는 uuid (내부 PK).
// - 도메인 id 는 'YYYY-MM-DD' (date) — useDailyLog 가 date 로 entry 를 찾기 때문.
// - 쓰기 시 id 는 절대 보내지 않음 — supabase.ts 의 dailyLog repo 가
//   onConflict='user_id,date' 로 upsert 처리 (unique 인덱스 활용).
export function toDomain(row: Row): DailyLog {
  return {
    id: row.date,
    date: row.date,
    mood: (row.mood as Mood) ?? "calm",
    oneLine: row.one_line ?? "",
    updatedAt: row.updated_at,
  };
}

export function toRow(
  input: Partial<DailyLog>,
  userId: string,
): Omit<Insert, "id"> {
  return {
    user_id: userId,
    date: input.date ?? new Date().toISOString().slice(0, 10),
    mood: input.mood ?? null,
    one_line: input.oneLine ?? null,
  };
}
