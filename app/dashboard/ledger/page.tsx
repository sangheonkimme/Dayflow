import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchTransactions } from "@/server/queries/transactions";
import LedgerClient from "./LedgerClient";

export default async function Page() {
  const dehydrated = await prefetch([
    { key: queryKeys.transactions, fn: fetchTransactions },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <LedgerClient />
    </HydrationBoundary>
  );
}
