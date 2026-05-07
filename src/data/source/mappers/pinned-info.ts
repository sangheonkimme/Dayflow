// ============================================================
// pinned-info mapper — PinnedInfo ↔ public.pinned_info
// ============================================================

import type { PinnedInfo } from '@/data/pinned-info';
import type { TablesInsert, Tables } from '@/data/source/db.types';

type Row = Tables<'pinned_info'>;
type Insert = TablesInsert<'pinned_info'>;

export function toDomain(row: Row): PinnedInfo {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    category: row.category ?? undefined,
    isSecret: row.is_secret,
    position: row.position,
  };
}

export function toRow(input: Partial<PinnedInfo>, userId: string): Insert {
  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    user_id: userId,
    label: input.label ?? '',
    value: input.value ?? '',
    category: input.category ?? null,
    is_secret: input.isSecret ?? false,
    position: input.position ?? 0,
  };
}
