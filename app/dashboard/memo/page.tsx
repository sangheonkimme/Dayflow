import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchMemos } from "@/server/queries/memos";
import MemoClient from "./MemoClient";

export default async function Page() {
  const dehydrated = await prefetch([
    { key: queryKeys.memos, fn: fetchMemos },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <MemoClient />
    </HydrationBoundary>
  );
}
