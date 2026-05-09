import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/keys";
import { fetchSubscriptions } from "@/server/subscriptions";
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
