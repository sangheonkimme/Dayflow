// ============================================================
// DataSource singleton
// ============================================================
//
// 환경변수로 mock/supabase 구현체를 선택. 컴포넌트는 직접 import하지 않고
// 항상 `useDataSource()` hook을 통해 접근한다.

import type { DataSource } from "@/data/source/types";
import { createMockSource } from "@/data/source/mock";

let instance: DataSource | null = null;
let initPromise: Promise<void> | null = null;

export function getDataSource(): DataSource {
  if (!instance) {
    // TODO: import.meta.env.VITE_SUPABASE_URL 있으면 createSupabaseSource() 사용
    instance = createMockSource();
    initPromise = Promise.all([
      instance.transactions.init(),
      instance.events.init(),
      instance.memos.init(),
      instance.stickyNotes.init(),
      instance.checklist.init(),
      instance.subscriptions.init(),
      instance.pinnedInfo.init(),
      instance.dailyLog.init(),
    ]).then(() => undefined);
  }
  return instance;
}

export function getReadyPromise(): Promise<void> {
  // 초기화는 getDataSource 첫 호출 시 트리거된다.
  if (!initPromise) getDataSource();
  return initPromise!;
}

export type { DataSource, Repository } from "@/data/source/types";
