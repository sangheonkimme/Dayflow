import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchTransactions } from "@/server/queries/transactions";
import { fetchEvents } from "@/server/queries/events";
import { fetchMemos } from "@/server/queries/memos";
import { fetchStickyNotes } from "@/server/queries/sticky-notes";
import { fetchChecklist } from "@/server/queries/checklist";
import { fetchSubscriptions } from "@/server/queries/subscriptions";
import { fetchPinnedInfo } from "@/server/queries/pinned-info";
import { fetchDailyLog } from "@/server/queries/daily-log";
import HomeClient from "./HomeClient";

export default async function Page() {
  // Home 은 위젯이 다양해 모든 도메인 prefetch.
  const dehydrated = await prefetch([
    { key: queryKeys.transactions, fn: fetchTransactions },
    { key: queryKeys.events, fn: fetchEvents },
    { key: queryKeys.memos, fn: fetchMemos },
    { key: queryKeys.stickyNotes, fn: fetchStickyNotes },
    { key: queryKeys.checklist, fn: fetchChecklist },
    { key: queryKeys.subscriptions, fn: fetchSubscriptions },
    { key: queryKeys.pinnedInfo, fn: fetchPinnedInfo },
    { key: queryKeys.dailyLog, fn: fetchDailyLog },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <HomeClient />
    </HydrationBoundary>
  );
}
