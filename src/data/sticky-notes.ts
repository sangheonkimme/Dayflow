// ============================================================
// Sticky notes — seeds + selectors + hook
// ============================================================

import { useMemo, useCallback } from 'react';
import type { StickyNote } from '@/types';
import { getRelativeDateLabel } from '@/lib/date';
import { getDataSource } from '@/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/data/useRepositoryQuery';

export const STICKY_NOTE_SEEDS: StickyNote[] = [
  {
    id: 1,
    color: 'yellow',
    title: '오늘의 목표',
    emoji: '✨',
    text: '디자인 시안 마무리하고\n팀에 공유하기 — 6시 전!',
    date: '오늘',
    author: '나',
  },
  {
    id: 2,
    color: 'pink',
    title: '감사 메모',
    emoji: '💌',
    text: '민수씨가 도와준 거\n잊지 말고 답례하기.\n커피 한 잔 어때?',
    date: '어제',
    author: '나',
  },
  {
    id: 3,
    color: 'blue',
    title: '내일 회의 준비',
    emoji: '📋',
    text: '· 디자인 시안 3개\n· 카피 초안 정리\n· 일정표 출력',
    date: '오늘',
    author: '나',
  },
];

// ─────────────────────────────────────────────
// Derived display selectors
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

// ─────────────────────────────────────────────
// Hook (soft-cap 3)
// ─────────────────────────────────────────────
const MAX_STICKY = 3;

export function useStickyNotes(): RepositoryQueryView<StickyNote> {
  const view = useRepositoryQuery(getDataSource().stickyNotes, {
    queryKey: ['stickyNotes'],
  });
  const { data, upsert: rawUpsert } = view;

  const upsert = useCallback<RepositoryQueryView<StickyNote>['upsert']>(
    async (item) => {
      const exists = item.id != null && data.some((n) => n.id === item.id);
      if (!exists && data.length >= MAX_STICKY) {
        return data[0]!;
      }
      return rawUpsert(item);
    },
    [data, rawUpsert],
  );

  return useMemo(() => ({ ...view, upsert }), [view, upsert]);
}
