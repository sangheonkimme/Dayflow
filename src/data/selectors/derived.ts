// ============================================================
// Derived selectors — DB에 없는 표시 필드를 도메인 데이터에서 계산.
// ============================================================
//
// 정책: 컴포넌트는 `txn.icon` 같은 표시 필드를 직접 참조하지 말고
// 항상 selector를 통해 값을 받는다. 이렇게 두면 Supabase 마이그레이션 시
// DB row에 해당 컬럼이 없어도 화면 동작이 유지된다.
//
// 시드 데이터에는 표시 필드가 채워진 채로 들어오는 경우가 있어,
// 모든 selector는 "주어진 값이 있으면 그대로, 없으면 derive" 패턴을 따른다.

import type { Txn, Subscription, MemoDoc, StickyNote } from '@/types';
import { TRANSACTION_CATEGORIES, SUBS_CATEGORIES } from '@/lib/categories';
import { getRelativeDateLabel } from '@/lib/date';

// ─────────────────────────────────────────────
// Transactions
// ─────────────────────────────────────────────

const ICON_BY_CAT: Record<string, string> = {
  식비: 'wallet',
  외식: 'wallet',
  주거: 'home',
  교통: 'zap',
  쇼핑: 'wallet',
  여가: 'sparkle',
  구독: 'repeat',
  건강: 'repeat',
  도서: 'wallet',
  급여: 'cash',
  부수입: 'sparkle',
  환불: 'repeat',
  기타: 'cash',
};

const ICON_BY_LABEL: Array<{ test: RegExp; icon: string }> = [
  { test: /스타벅스|커피|카페/i, icon: 'coffee' },
  { test: /택시|지하철|버스/i, icon: 'zap' },
  { test: /월세|관리비|전기|가스|수도/i, icon: 'home' },
  { test: /월급|급여|입금/i, icon: 'cash' },
  { test: /넷플릭스|스포티파이|노션|chatgpt|구독/i, icon: 'repeat' },
  { test: /CGV|영화|콘서트/i, icon: 'sparkle' },
];

export function inferIcon(txn: Pick<Txn, 'icon' | 'cat' | 'label'>): string {
  if (txn.icon) return txn.icon;
  for (const r of ICON_BY_LABEL) if (txn.label && r.test.test(txn.label)) return r.icon;
  if (txn.cat && ICON_BY_CAT[txn.cat]) return ICON_BY_CAT[txn.cat];
  return 'wallet';
}

export function inferPayday(
  txn: Pick<Txn, 'payday' | 'type' | 'label' | 'cat'>,
): boolean {
  if (typeof txn.payday === 'boolean') return txn.payday;
  if (txn.type !== 'in') return false;
  return /월급|급여/.test(txn.label ?? '') || txn.cat === '급여';
}

// ─────────────────────────────────────────────
// Subscriptions
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Memos
// ─────────────────────────────────────────────

export function memoExcerpt(memo: Pick<MemoDoc, 'excerpt' | 'body'>, max = 140): string {
  if (memo.excerpt) return memo.excerpt;
  const flat = (memo.body ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? flat.slice(0, max) + '…' : flat;
}

export function memoWordCount(memo: Pick<MemoDoc, 'word' | 'body'>): number {
  if (typeof memo.word === 'number') return memo.word;
  return (memo.body ?? '').replace(/\s/g, '').length;
}

export function memoUpdatedLabel(
  memo: Pick<MemoDoc, 'updated'>,
  fallbackDate?: Date,
): string {
  if (memo.updated) return memo.updated;
  if (fallbackDate) return getRelativeDateLabel(fallbackDate);
  return '—';
}

// ─────────────────────────────────────────────
// Sticky notes
// ─────────────────────────────────────────────

export function stickyDateLabel(
  note: Pick<StickyNote, 'date'> & { updatedAt?: string },
): string {
  if (note.date) return note.date;
  if (note.updatedAt) return getRelativeDateLabel(note.updatedAt);
  return '오늘';
}

export function stickyAuthorLabel(
  note: Pick<StickyNote, 'author'>,
  authProfileName?: string,
): string {
  return note.author ?? authProfileName ?? '나';
}

// 거래 라벨/설명 — DB는 `memo`만 가지므로 label/note 통합 표시용
export function txnDisplayLabel(txn: Pick<Txn, 'label' | 'note'>): string {
  return txn.label ?? txn.note ?? '거래';
}

void TRANSACTION_CATEGORIES; // 향후 카테고리 색상 derive 용도 reserve
