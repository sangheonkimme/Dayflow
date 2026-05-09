import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as EventMap from "@/data/source/mappers/events";
import type { CalendarEvent } from "@/types";

export const fetchEvents = cache(async (): Promise<CalendarEvent[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => EventMap.toDomain(r as never));
});
