// ============================================================
// memos mapper — MemoDoc ↔ public.notes
// ============================================================

import type { MemoDoc } from "@/types";
import type { TablesInsert, Tables } from "@/data/source/db.types";

type Row = Tables<"notes">;
type Insert = TablesInsert<"notes">;

export function toDomain(row: Row): MemoDoc {
  return {
    id: row.id as unknown as number,
    title: row.title ?? "",
    body: row.body ?? "",
    folder: row.folder ?? "all",
    tags: row.tags ?? [],
    starred: row.starred,
    pinned: row.pinned,
    updated: row.updated_at,
    word: 0, // selector(memoWordCount)에서 derive
  };
}

export function toRow(input: Partial<MemoDoc>, userId: string): Insert {
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    user_id: userId,
    title: input.title ?? null,
    body: input.body ?? null,
    folder: input.folder === "all" ? null : (input.folder ?? null),
    tags: input.tags ?? [],
    starred: input.starred ?? false,
    pinned: input.pinned ?? false,
  };
}
