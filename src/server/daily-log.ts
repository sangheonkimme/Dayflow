import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as DailyMap from "@/data/source/mappers/daily-log";
import type { DailyLog } from "@/data/daily-log";

export const fetchDailyLog = cache(async (): Promise<DailyLog[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => DailyMap.toDomain(r));
});
