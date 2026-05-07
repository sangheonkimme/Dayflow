// ============================================================
// events mapper — CalendarEvent ↔ public.calendar_events
// ============================================================

import type { CalendarEvent } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";

type Row = Tables<"calendar_events">;
type Insert = TablesInsert<"calendar_events">;

export function toDomain(row: Row): CalendarEvent {
  const date = row.starts_at.slice(0, 10);
  const startTime =
    row.starts_at.length >= 16 ? row.starts_at.slice(11, 16) : undefined;
  const endTime =
    row.ends_at && row.ends_at.length >= 16
      ? row.ends_at.slice(11, 16)
      : undefined;
  return {
    id: row.id,
    title: row.title,
    date,
    startTime,
    endTime,
    allDay: row.all_day,
    color: row.color ?? undefined,
    memo: row.description ?? undefined,
  };
}

export function toRow(input: Partial<CalendarEvent>, userId: string): Insert {
  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const startTime = input.startTime ?? "00:00";
  const starts_at = new Date(`${date}T${startTime}:00`).toISOString();
  const ends_at = input.endTime
    ? new Date(`${date}T${input.endTime}:00`).toISOString()
    : null;
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    title: input.title ?? "",
    description: input.memo ?? null,
    starts_at,
    ends_at,
    all_day: input.allDay ?? false,
    color: input.color ?? null,
  };
}
