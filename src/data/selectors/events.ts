// ============================================================
// Pure event selectors
// ============================================================

import type { CalendarEvent } from "@/types";

/** Map keyed by YYYY-MM-DD → events on that date. */
export function eventsByDate(
  events: readonly CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const arr = map.get(e.date);
    if (arr) arr.push(e);
    else map.set(e.date, [e]);
  }
  return map;
}

/** Upcoming events from now, ordered ascending. */
export function upcoming(
  events: readonly CalendarEvent[],
  limit = 5,
  now: Date = new Date(),
): CalendarEvent[] {
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return [...events]
    .filter((e) => e.date >= todayKey)
    .sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      if (d !== 0) return d;
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    })
    .slice(0, limit);
}

/** Set of day-of-month numbers that have any events in the given year/month. */
export function daysWithEventsInMonth(
  events: readonly CalendarEvent[],
  year: number,
  /** 0-indexed month, like Date#getMonth */
  month: number,
): Set<number> {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const set = new Set<number>();
  for (const e of events) {
    if (!e.date.startsWith(prefix)) continue;
    const day = parseInt(e.date.slice(8, 10), 10);
    if (!isNaN(day)) set.add(day);
  }
  return set;
}
