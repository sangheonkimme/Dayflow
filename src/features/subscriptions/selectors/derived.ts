// ============================================================
// Subscriptions — derived display selectors
// ============================================================

import type { Subscription } from '@/types';
import { SUBS_CATEGORIES } from '@/lib/categories';

const SUBS_COLOR_BY_CAT: Record<string, string> = Object.fromEntries(
  SUBS_CATEGORIES.map((c) => [c.id, c.color]),
);

export function subscriptionColor(
  sub: Pick<Subscription, 'color' | 'cat'>,
): string {
  if (sub.color) return sub.color;
  if (sub.cat && SUBS_COLOR_BY_CAT[sub.cat]) return SUBS_COLOR_BY_CAT[sub.cat];
  return 'var(--ink-soft)';
}

export function subscriptionInitial(
  sub: Pick<Subscription, 'initial' | 'name'>,
): string {
  if (sub.initial) return sub.initial;
  return (sub.name?.[0] ?? '?').toUpperCase();
}

/** "11.07" 형태로 다음 결제일 표시. day 또는 next 둘 중 하나라도 있으면 사용. */
export function formatNextBilling(
  sub: Pick<Subscription, 'next' | 'day'>,
  ref: Date = new Date(),
): string {
  if (sub.next) return sub.next;
  if (typeof sub.day === 'number') {
    const month = ref.getMonth() + 1;
    return `${String(month).padStart(2, '0')}.${String(sub.day).padStart(2, '0')}`;
  }
  return '—';
}

/** 가입 시점을 "2023.05" 형태로. 추후 created_at에서 derive. */
export function formatStarted(sub: Pick<Subscription, 'started'>): string {
  return sub.started ?? '—';
}
