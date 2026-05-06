// ============================================================
// DAILY_LOG_SEEDS — synthesized from notes.tsx DeskPile journal/mood
// One entry keyed by today's YYYY-MM-DD.
// ============================================================

import type { DailyLog } from '@/shared/data/seeds/types';

const today = new Date();
const id = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export const DAILY_LOG_SEEDS: DailyLog[] = [
  {
    id,
    date: id,
    mood: 'fire', // 🔥
    oneLine: '디자인 시안 미팅 잘 끝났다. 오후엔 카피 정리만 하면 끝!',
  },
];
