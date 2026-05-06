// ============================================================
// EVENT_SEEDS — canonical calendar events
// Combines pages.tsx CalendarPage events (day-of-month keyed) and
// money.tsx MiniCalendar inline events (ev-1 / ev-2). Constructed
// against the 2026-05 month so they line up with TRANSACTION_SEEDS.
// ============================================================

import type { CalendarEvent } from '@/types';

const m = (day: number) => `2026-05-${String(day).padStart(2, '0')}`;

export const EVENT_SEEDS: CalendarEvent[] = [
  // From money.tsx MiniCalendar inline edit handlers
  {
    id: 'ev-1',
    title: '팀 스탠드업',
    date: m(2),
    startTime: '15:00',
    endTime: '15:30',
    cat: '업무',
    color: 'var(--red)',
  },
  {
    id: 'ev-2',
    title: '저녁 약속 — 한강',
    date: m(2),
    startTime: '19:00',
    cat: '개인',
    color: 'var(--ink)',
  },
  // From pages.tsx CalendarPage events map
  {
    id: 'ev-3',
    title: '필라테스',
    date: m(3),
    startTime: '07:00',
    cat: '운동',
    color: '#8ec0d6',
    place: '강남 스튜디오',
  },
  {
    id: 'ev-4',
    title: '디자인 리뷰',
    date: m(7),
    startTime: '14:00',
    endTime: '15:00',
    cat: '업무',
    color: 'var(--red)',
    place: '온라인',
  },
  {
    id: 'ev-5',
    title: '저녁 약속',
    date: m(7),
    startTime: '19:00',
    endTime: '21:00',
    cat: '개인',
    color: '#e8c84a',
    place: '한남동',
  },
  {
    id: 'ev-6',
    title: '월급 입금',
    date: m(12),
    cat: '금융',
    color: '#4a8d5a',
    place: '(주)디자인하우스',
  },
  {
    id: 'ev-7',
    title: '치과 예약',
    date: m(15),
    startTime: '10:30',
    cat: '개인',
    color: 'var(--ink)',
    place: '강남 미소치과',
  },
  {
    id: 'ev-8',
    title: '팀 워크샵',
    date: m(21),
    allDay: true,
    cat: '업무',
    color: 'var(--red)',
    place: '양양',
  },
  {
    id: 'ev-9',
    title: '엄마 생신',
    date: m(24),
    cat: '개인',
    color: '#e89aac',
    place: '본가',
  },
  {
    id: 'ev-10',
    title: '포트폴리오 마감',
    date: m(28),
    startTime: '23:59',
    cat: '업무',
    color: 'var(--red)',
    place: '온라인 제출',
  },
];
