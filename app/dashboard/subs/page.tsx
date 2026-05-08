import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchSubscriptions } from "@/server/queries/subscriptions";
import SubsClient from "./SubsClient";

export default async function Page() {
  const dehydrated = await prefetch([
    { key: queryKeys.subscriptions, fn: fetchSubscriptions },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <SubsClient />
    </HydrationBoundary>
  );
}
