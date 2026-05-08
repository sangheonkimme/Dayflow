import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import * as TxnMap from "@/data/source/mappers/transactions";
import type { Txn } from "@/types";

export const fetchTransactions = cache(async (): Promise<Txn[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color), accounts(name)")
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => TxnMap.toDomain(r as TxnMap.TxnJoinedRow));
});
