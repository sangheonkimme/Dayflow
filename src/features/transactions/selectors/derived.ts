// ============================================================
// Transactions — derived display selectors
// ============================================================

import type { Txn } from '@/types';
import { TRANSACTION_CATEGORIES } from '@/lib/categories';

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

// 거래 라벨/설명 — DB는 `memo`만 가지므로 label/note 통합 표시용
export function txnDisplayLabel(txn: Pick<Txn, 'label' | 'note'>): string {
  return txn.label ?? txn.note ?? '거래';
}

void TRANSACTION_CATEGORIES; // 향후 카테고리 색상 derive 용도 reserve
