import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as ChecklistMap from "@/data/source/mappers/checklist";
import type { ChecklistTask } from "@/types";

export const fetchChecklist = cache(async (): Promise<ChecklistTask[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ChecklistMap.toDomain(r as never));
});
