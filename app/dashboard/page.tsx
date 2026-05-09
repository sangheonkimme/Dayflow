import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import { queryKeys } from "@/server/keys";
import { fetchTransactions } from "@/server/transactions";
import { fetchEvents } from "@/server/events";
import { fetchStickyNotes } from "@/server/sticky-notes";
import { fetchChecklist } from "@/server/checklist";
import { fetchPinnedInfo } from "@/server/pinned-info";
import { fetchDailyLog } from "@/server/daily-log";
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
