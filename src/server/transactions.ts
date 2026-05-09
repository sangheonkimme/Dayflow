import { cache } from "react";
import { getCurrentUser } from "./_session";
import * as TxnMap from "@/data/source/mappers/transactions";
import type { Txn } from "@/types";

export const fetchTransactions = cache(async (): Promise<Txn[]> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color), accounts(name)")
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => TxnMap.toDomain(r as TxnMap.TxnJoinedRow));
});
