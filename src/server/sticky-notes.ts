import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as StickyMap from "@/data/source/mappers/sticky-notes";
import type { StickyNote } from "@/types";

export const fetchStickyNotes = cache(async (): Promise<StickyNote[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("sticky_notes")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => StickyMap.toDomain(r as never));
});
