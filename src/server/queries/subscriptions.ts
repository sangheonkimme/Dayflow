import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as SubMap from "@/data/source/mappers/subscriptions";
import type { Subscription } from "@/types";

export const fetchSubscriptions = cache(async (): Promise<Subscription[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => SubMap.toDomain(r as never));
});
