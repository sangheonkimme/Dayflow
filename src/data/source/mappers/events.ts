// ============================================================
// events mapper — CalendarEvent ↔ public.calendar_events
// ============================================================

import type { CalendarEvent, EventRepeat } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";
import { toLocalYmd, toLocalHm } from "@/lib/date";

type Row = Tables<"calendar_events">;
type Insert = TablesInsert<"calendar_events">;

export function toDomain(row: Row): CalendarEvent {
  // starts_at/ends_at 는 UTC instant(timestamptz) — 문자열 slice 로 읽으면
  // KST 기준 9시간(자정 전후엔 날짜까지) 어긋난다. 반드시 로컬로 변환해 복원.
  const start = new Date(row.starts_at);
  const end = row.ends_at ? new Date(row.ends_at) : null;
  let startTime: string | undefined = toLocalHm(start);
  // 시간 미지정 일정은 00:00 + 종료 없음으로 저장됨 — "시간 없음"으로 복원.
  if (!row.all_day && startTime === "00:00" && !end) startTime = undefined;
  return {
    id: row.id,
    title: row.title,
    date: toLocalYmd(start),
    startTime: row.all_day ? undefined : startTime,
    endTime: row.all_day || !end ? undefined : toLocalHm(end),
    allDay: row.all_day,
    cat: row.cat ?? undefined,
    color: row.color ?? undefined,
    place: row.place ?? undefined,
    memo: row.description ?? undefined,
    alarm: row.alarm,
    repeat: (row.recurrence_rule as EventRepeat | null) ?? undefined,
  };
}

export function toRow(input: Partial<CalendarEvent>, userId: string): Insert {
  const date = input.date ?? toLocalYmd(new Date());
  // 종일 일정은 시간 의미 없음 — 00:00 고정 (편집 폼의 잔존 시간값 무시).
  const startTime = input.allDay ? "00:00" : (input.startTime ?? "00:00");
  const starts_at = new Date(`${date}T${startTime}:00`).toISOString();
  const ends_at =
    !input.allDay && input.endTime
      ? new Date(`${date}T${input.endTime}:00`).toISOString()
      : null;
  // 폼에서 문자열로 올 수 있음 — 0/NaN 은 "알림 없음"으로 정규화.
  const alarmNum = input.alarm == null ? null : Number(input.alarm);
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    title: input.title ?? "",
    description: input.memo ?? null,
    starts_at,
    ends_at,
    all_day: input.allDay ?? false,
    cat: input.cat ?? null,
    color: input.color ?? null,
    place: input.place ?? null,
    alarm: alarmNum && alarmNum > 0 ? alarmNum : null,
    recurrence_rule:
      input.repeat && input.repeat !== "none" ? input.repeat : null,
  };
}
