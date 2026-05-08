import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import * as SubMap from "@/data/source/mappers/subscriptions";
import type { Subscription } from "@/types";

export const fetchSubscriptions = cache(async (): Promise<Subscription[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => SubMap.toDomain(r as never));
});
