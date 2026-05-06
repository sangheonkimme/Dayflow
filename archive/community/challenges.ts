// ============================================================
// CHALLENGE_SEEDS — extracted from mobile-app.tsx MobileCommunity
// `days` was originally a "5/30일" display string; canonical type
// stores the elapsed-day number with /30 implied (matches `progress`).
// ============================================================

import type { Challenge } from '@/data/seeds/types';

export const CHALLENGE_SEEDS: Challenge[] = [
  { id: 'c1', title: '11월 무지출 5일',  sub: '외식·배달 끊기',     members: 1284, days: 5,  progress: 0.82, color: '#ffd84d', emoji: '🍱' },
  { id: 'c2', title: '커피값 모으기',     sub: '매일 ₩4,500 적금',   members: 892,  days: 12, progress: 0.40, color: '#cfe7ff', emoji: '☕' },
  { id: 'c3', title: '구독 다이어트',     sub: '월 ₩50,000 줄이기',  members: 567,  days: 8,  progress: 0.62, color: '#ffb38a', emoji: '✂️' },
];
