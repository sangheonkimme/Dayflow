import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as MemoMap from "@/data/source/mappers/memos";
import type { MemoDoc } from "@/types";

export const fetchMemos = cache(async (): Promise<MemoDoc[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => MemoMap.toDomain(r as never));
});
