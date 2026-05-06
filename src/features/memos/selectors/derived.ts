// ============================================================
// Memos — derived display selectors
// ============================================================

import type { MemoDoc } from '@/types';
import { getRelativeDateLabel } from '@/lib/date';

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
