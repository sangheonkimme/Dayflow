// ============================================================
// checklist mapper — ChecklistTask ↔ public.checklist_items
// ============================================================

import type { ChecklistTask } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";

type Row = Tables<"checklist_items">;
type Insert = TablesInsert<"checklist_items">;

/** "10:30" → "오전 10:30" / "14:05" → "오후 2:05" */
function formatKoreanTime(due_at: string | null): string | undefined {
  if (!due_at) return undefined;
  const d = new Date(due_at);
  if (isNaN(d.getTime())) return undefined;
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? "오전" : "오후";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${period} ${h12}:${String(m).padStart(2, "0")}`;
}

export function toDomain(row: Row): ChecklistTask {
  return {
    id: row.id as unknown as number,
    text: row.content,
    done: row.done,
    time: formatKoreanTime(row.due_at),
  };
}

export function toRow(input: Partial<ChecklistTask>, userId: string): Insert {
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    content: input.text ?? "",
    done: input.done ?? false,
    // due_at은 도메인 time(한국어)에서 역변환 어려움 — 입력은 별도 시간 picker로 처리 예정
  };
}
