import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/keys";
import { fetchEvents } from "@/server/events";
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
