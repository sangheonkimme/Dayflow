// ============================================================
// Events — seeds + selectors + hook
// ============================================================

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent } from "@/types";
import { getDataSource } from "@/data/source";
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from "@/data/useRepositoryQuery";

// ─────────────────────────────────────────────
// Seeds
// ─────────────────────────────────────────────
const m = (day: number) => `2026-05-${String(day).padStart(2, "0")}`;

export const EVENT_SEEDS: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "팀 스탠드업",
    date: m(2),
    startTime: "15:00",
    endTime: "15:30",
    cat: "업무",
    color: "var(--red)",
  },
  {
    id: "ev-2",
    title: "저녁 약속 — 한강",
    date: m(2),
    startTime: "19:00",
    cat: "개인",
    color: "var(--ink)",
  },
  {
    id: "ev-3",
    title: "필라테스",
    date: m(3),
    startTime: "07:00",
    cat: "운동",
    color: "#8ec0d6",
    place: "강남 스튜디오",
  },
  {
    id: "ev-4",
    title: "디자인 리뷰",
    date: m(7),
    startTime: "14:00",
    endTime: "15:00",
    cat: "업무",
    color: "var(--red)",
    place: "온라인",
  },
  {
    id: "ev-5",
    title: "저녁 약속",
    date: m(7),
    startTime: "19:00",
    endTime: "21:00",
    cat: "개인",
    color: "#e8c84a",
    place: "한남동",
  },
  {
    id: "ev-6",
    title: "월급 입금",
    date: m(12),
    cat: "금융",
    color: "#4a8d5a",
    place: "(주)디자인하우스",
  },
  {
    id: "ev-7",
    title: "치과 예약",
    date: m(15),
    startTime: "10:30",
    cat: "개인",
    color: "var(--ink)",
    place: "강남 미소치과",
  },
  {
    id: "ev-8",
    title: "팀 워크샵",
    date: m(21),
    allDay: true,
    cat: "업무",
    color: "var(--red)",
    place: "양양",
  },
  {
    id: "ev-9",
    title: "엄마 생신",
    date: m(24),
    cat: "개인",
    color: "#e89aac",
    place: "본가",
  },
  {
    id: "ev-10",
    title: "포트폴리오 마감",
    date: m(28),
    startTime: "23:59",
    cat: "업무",
    color: "var(--red)",
    place: "온라인 제출",
  },
];

// ─────────────────────────────────────────────
// Pure selectors
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
const QUERY_KEY = ["events"] as const;

export function useEvents(): RepositoryQueryView<CalendarEvent> {
  const qc = useQueryClient();
  const repo = getDataSource().events;
  return useRepositoryQuery(repo, {
    queryKey: QUERY_KEY,
    upsertOptions: {
      onMutate: async (input) => {
        if (!input.id) return undefined;
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        const existing = prev.find((e) => e.id === input.id);
        if (existing)
          repo.store.upsert({ ...existing, ...input } as CalendarEvent);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        const prev = (ctx as { prev?: readonly CalendarEvent[] } | undefined)
          ?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
    removeOptions: {
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        repo.store.remove(id);
        return { prev };
      },
      onError: (_err, _id, ctx) => {
        const prev = (ctx as { prev?: readonly CalendarEvent[] } | undefined)
          ?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
  });
}

export function useEventsByDate(date: string): readonly CalendarEvent[] {
  const { data } = useEvents();
  return useMemo(() => data.filter((e) => e.date === date), [data, date]);
}
