// ============================================================
// SUBSCRIPTION_SEEDS + SUBSCRIPTION_USAGE_SEEDS — from subs.tsx
// ============================================================

import type { Subscription } from '@/types';

// Brief authorized adding `SubscriptionUsage` to seeds; seeds/types.ts is
// frozen per constraints, so we colocate it here.
export interface SubscriptionUsage {
  /** Subscription.id */
  subscriptionId: number | string;
  /** Display string ("2025.08.12 (90일 전)" etc.) */
  lastUsed: string;
  /** 5 most recent months, oldest → newest */
  monthlyMinutes: number[];
  avgPerWeek: number;
  /** Names of overlapping subscriptions */
  overlap: string[];
}

export const SUBSCRIPTION_SEEDS: Subscription[] = [
  { id: 1,  name: 'Netflix',       cat: '엔터테인먼트', price: 17000, cycle: '월', day: 7,  color: '#e25c4d', initial: 'N',  status: 'active', started: '2023.05' },
  { id: 2,  name: 'Spotify',       cat: '음악',         price: 13900, cycle: '월', day: 12, color: '#4a8d5a', initial: 'S',  status: 'active', started: '2022.11' },
  { id: 3,  name: 'Adobe CC',      cat: '업무 도구',    price: 24000, cycle: '월', day: 15, color: '#ee5a3d', initial: 'Ai', status: 'active', started: '2024.01' },
  { id: 4,  name: 'Figma Pro',     cat: '업무 도구',    price: 18500, cycle: '월', day: 21, color: '#a259ff', initial: 'F',  status: 'active', started: '2023.09' },
  { id: 5,  name: 'iCloud+ 200GB', cat: '클라우드',     price: 3300,  cycle: '월', day: 3,  color: '#3a8dde', initial: 'iC', status: 'active', started: '2021.04' },
  { id: 6,  name: '쿠팡 와우',      cat: '쇼핑',        price: 7890,  cycle: '월', day: 8,  color: '#e8c84a', initial: '쿠', status: 'active', started: '2022.06' },
  { id: 7,  name: '왓챠',           cat: '엔터테인먼트', price: 12900, cycle: '월', day: 18, color: '#e89aac', initial: 'W',  status: 'paused', started: '2024.06' },
  { id: 8,  name: 'ChatGPT Plus',  cat: '업무 도구',    price: 28000, cycle: '월', day: 25, color: '#1a1a1a', initial: 'G',  status: 'active', started: '2024.03' },
  { id: 9,  name: '노션 패밀리',    cat: '업무 도구',    price: 12000, cycle: '월', day: 6,  color: '#000000', initial: 'N',  status: 'active', started: '2023.02' },
  { id: 10, name: '교보문고 sam',   cat: '독서',         price: 9900,  cycle: '월', day: 14, color: '#2c5e8b', initial: '사', status: 'active', started: '2024.07' },
  { id: 11, name: '헬스장',         cat: '건강',         price: 89000, cycle: '월', day: 1,  color: '#a8d09b', initial: '헬', status: 'active', started: '2025.04' },
  { id: 12, name: '도메인 갱신',    cat: '기타',         price: 22000, cycle: '년', day: 4,  color: '#c9bd9f', initial: 'D',  status: 'active', started: '2020.04' },
];

export const SUBSCRIPTION_USAGE_SEEDS: SubscriptionUsage[] = [
  {
    subscriptionId: 7,
    lastUsed: '2025.08.12 (90일 전)',
    monthlyMinutes: [240, 180, 60, 0, 0],
    avgPerWeek: 0,
    overlap: ['Netflix'],
  },
  {
    subscriptionId: 3,
    lastUsed: '2025.11.04 (어제)',
    monthlyMinutes: [1820, 1640, 1500, 980, 760],
    avgPerWeek: 12,
    overlap: ['Figma Pro'],
  },
  {
    subscriptionId: 4,
    lastUsed: '2025.11.05 (오늘)',
    monthlyMinutes: [2200, 2400, 2600, 2800, 3000],
    avgPerWeek: 28,
    overlap: ['Adobe CC'],
  },
];
