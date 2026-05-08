// ============================================================
// sticky-notes mapper — StickyNote ↔ public.sticky_notes
// ============================================================

import type { StickyNote, StickyColor } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";
import { getRelativeDateLabel } from "@/lib/date";

type Row = Tables<"sticky_notes">;
type Insert = TablesInsert<"sticky_notes">;

// macOS IME가 한글을 NFD(자모 분리)로 넘겨주는 경우가 있어 표시·저장 모두에서 NFC로 합침
const nfc = (s: string | null | undefined) =>
  typeof s === "string" ? s.normalize("NFC") : s ?? "";

export function toDomain(row: Row): StickyNote {
  return {
    id: row.id as unknown as number,
    color: row.color as StickyColor,
    title: nfc(row.title),
    emoji: row.emoji ?? undefined,
    text: nfc(row.body),
    date: getRelativeDateLabel(row.updated_at), // 오늘/어제/MM.DD 상대 라벨
  };
}

export function toRow(input: Partial<StickyNote>, userId: string): Insert {
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    color: input.color ?? "yellow",
    title: input.title ? input.title.normalize("NFC") : null,
    body: input.text ? input.text.normalize("NFC") : null,
    emoji: input.emoji ?? null,
  };
}
