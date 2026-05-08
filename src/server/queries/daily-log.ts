import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import * as DailyMap from "@/data/source/mappers/daily-log";
import type { DailyLog } from "@/data/daily-log";

export const fetchDailyLog = cache(async (): Promise<DailyLog[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => DailyMap.toDomain(r));
});
