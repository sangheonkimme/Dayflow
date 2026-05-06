// ============================================================
// Sticky notes — derived display selectors
// ============================================================

import type { StickyNote } from '@/types';
import { getRelativeDateLabel } from '@/lib/date';

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
