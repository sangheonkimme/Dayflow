import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchEvents } from "@/server/queries/events";
import CalendarClient from "./CalendarClient";

export default async function Page() {
  const dehydrated = await prefetch([
    { key: queryKeys.events, fn: fetchEvents },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <CalendarClient />
    </HydrationBoundary>
  );
}
