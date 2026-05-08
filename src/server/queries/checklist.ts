import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import * as ChecklistMap from "@/data/source/mappers/checklist";
import type { ChecklistTask } from "@/types";

export const fetchChecklist = cache(async (): Promise<ChecklistTask[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ChecklistMap.toDomain(r as never));
});
