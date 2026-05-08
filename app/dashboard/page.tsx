import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/queries/keys";
import { fetchTransactions } from "@/server/queries/transactions";
import { fetchEvents } from "@/server/queries/events";
import { fetchStickyNotes } from "@/server/queries/sticky-notes";
import { fetchChecklist } from "@/server/queries/checklist";
import { fetchPinnedInfo } from "@/server/queries/pinned-info";
import { fetchDailyLog } from "@/server/queries/daily-log";
import HomeClient from "./HomeClient";

export default async function Page() {
  // 홈에서 실제로 사용하는 도메인만 prefetch.
  // memos / subscriptions 는 홈에 위젯이 없어 client-side 진입 시 lazy fetch.
  const dehydrated = await prefetch([
    { key: queryKeys.transactions, fn: fetchTransactions },
    { key: queryKeys.events, fn: fetchEvents },
    { key: queryKeys.stickyNotes, fn: fetchStickyNotes },
    { key: queryKeys.checklist, fn: fetchChecklist },
    { key: queryKeys.pinnedInfo, fn: fetchPinnedInfo },
    { key: queryKeys.dailyLog, fn: fetchDailyLog },
  ]);
  return (
    <HydrationBoundary state={dehydrated}>
      <HomeClient />
    </HydrationBoundary>
  );
}
