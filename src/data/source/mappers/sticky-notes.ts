// ============================================================
// sticky-notes mapper — StickyNote ↔ public.sticky_notes
// ============================================================

import type { StickyNote, StickyColor } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";

type Row = Tables<"sticky_notes">;
type Insert = TablesInsert<"sticky_notes">;

export function toDomain(row: Row): StickyNote {
  return {
    id: row.id as unknown as number,
    color: row.color as StickyColor,
    title: row.title ?? "",
    emoji: row.emoji ?? undefined,
    text: row.body ?? "",
    date: row.updated_at, // selector(stickyDateLabel)에서 표시 변환
  };
}

export function toRow(input: Partial<StickyNote>, userId: string): Insert {
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    color: input.color ?? "yellow",
    title: input.title ?? null,
    body: input.text ?? null,
    emoji: input.emoji ?? null,
  };
}
