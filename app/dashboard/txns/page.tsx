import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/keys";
import { fetchTransactions } from "@/server/transactions";
import TxnsClient from "./TxnsClient";

export default async function Page() {
  const dehydrated = await prefetch([
    { key: queryKeys.transactions, fn: fetchTransactions },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <TxnsClient />
    </HydrationBoundary>
  );
}
