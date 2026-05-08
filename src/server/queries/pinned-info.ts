import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as PinnedMap from "@/data/source/mappers/pinned-info";
import type { PinnedInfo } from "@/data/pinned-info";

export const fetchPinnedInfo = cache(async (): Promise<PinnedInfo[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pinned_info")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => PinnedMap.toDomain(r as never));
});
