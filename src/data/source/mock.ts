// ============================================================
// MockSource — in-memory implementation of DataSource
// ============================================================
//
// 모든 도메인 repository를 시드 데이터로 채우고, upsert/remove 시
// 새 id 발급 + store 업데이트를 담당한다.
//
// Supabase로 교체 시 이 파일과 동일한 인터페이스의 SupabaseSource를 작성하고
// `data/source/index.ts`에서 환경변수로 선택만 하면 된다.

import { createStore, type Store } from "@/data/store";
import type { Identifiable } from "@/data/store";
import type { DataSource, Repository } from "@/data/source/types";
import {
  TRANSACTION_SEEDS,
  EVENT_SEEDS,
  MEMO_SEEDS,
  STICKY_NOTE_SEEDS,
  CHECKLIST_SEEDS,
  SUBSCRIPTION_SEEDS,
  PINNED_INFO_SEEDS,
  DAILY_LOG_SEEDS,
} from "@/data/seeds";

let idCounter = 1_000_000;
const newId = () => String(Date.now()) + "-" + (idCounter++).toString(36);

function makeMockRepo<T extends Identifiable>(
  seeds: T[],
  getId: () => T["id"] = newId,
): Repository<T> {
  const store: Store<T> = createStore<T>([]);
  return {
    store,
    init: async () => {
      store.setAll(seeds);
    },
    upsert: async (input) => {
      const item = {
        ...input,
        id: input.id ?? getId(),
      } as T;
      store.upsert(item);
      return item;
    },
    remove: async (id) => {
      store.remove(id);
    },
  };
}

export function createMockSource(): DataSource {
  return {
    transactions: makeMockRepo(TRANSACTION_SEEDS),
    events: makeMockRepo(EVENT_SEEDS),
    memos: makeMockRepo(MEMO_SEEDS),
    stickyNotes: makeMockRepo(STICKY_NOTE_SEEDS),
    checklist: makeMockRepo(CHECKLIST_SEEDS),
    subscriptions: makeMockRepo(SUBSCRIPTION_SEEDS),
    pinnedInfo: makeMockRepo(PINNED_INFO_SEEDS),
    dailyLog: makeMockRepo(DAILY_LOG_SEEDS),
  };
}
