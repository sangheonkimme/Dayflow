// ============================================================
// SupabaseSource — DataSource 구현 (실 Supabase 연결)
// ============================================================
//
// 모든 repository는 Mock과 동일한 인터페이스를 따른다.
// init: select + 매핑하여 store.setAll
// upsert: FK resolve → mapper.toRow → upsert → mapper.toDomain → store.upsert
// remove: supabase delete → store.remove
//
// RLS가 user_id 기반이라 SupabaseClient가 인증된 세션을 가지고 있다고 가정.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createStore, type Store, type Identifiable } from "@/data/store";
import type { DataSource, Repository } from "@/data/source/types";
import type { Database } from "@/data/source/db.types";
import type {
  Txn,
  CalendarEvent,
  MemoDoc,
  StickyNote,
  ChecklistTask,
  Subscription,
} from "@/types";
import type { PinnedInfo } from "@/data/pinned-info";
import type { DailyLog } from "@/data/daily-log";
import {
  loadCategoryCache,
  resolveCategoryId,
  clearCategoryCache,
} from "@/data/source/mappers/categories";
import * as TxnMap from "@/data/source/mappers/transactions";
import * as EventMap from "@/data/source/mappers/events";
import * as MemoMap from "@/data/source/mappers/memos";
import * as StickyMap from "@/data/source/mappers/sticky-notes";
import * as ChecklistMap from "@/data/source/mappers/checklist";
import * as SubMap from "@/data/source/mappers/subscriptions";
import * as PinnedMap from "@/data/source/mappers/pinned-info";
import * as DailyMap from "@/data/source/mappers/daily-log";

type Client = SupabaseClient<Database>;

function makeRepo<T extends Identifiable, Row>(
  client: Client,
  store: Store<T>,
  cfg: {
    table: string;
    select: string;
    toDomain: (row: Row) => T;
    toRow: (input: Partial<T>) => Record<string, unknown>;
    orderBy?: { column: string; ascending?: boolean };
  },
): Repository<T> {
  return {
    store,
    init: async () => {
      store.setStatus("loading");
      let q = client.from(cfg.table as never).select(cfg.select);
      if (cfg.orderBy)
        q = q.order(cfg.orderBy.column, {
          ascending: cfg.orderBy.ascending ?? false,
        });
      const { data, error } = await q;
      if (error) {
        store.setStatus("error", error as Error);
        throw error;
      }
      store.setAll(((data ?? []) as Row[]).map(cfg.toDomain));
    },
    upsert: async (input) => {
      const row = cfg.toRow(input);
      const { data, error } = await (client.from(cfg.table as never) as any)
        .upsert(row)
        .select(cfg.select)
        .single();
      if (error) throw error;
      const item = cfg.toDomain(data as Row);
      store.upsert(item);
      return item;
    },
    remove: async (id) => {
      const { error } = await client
        .from(cfg.table as never)
        .delete()
        .eq("id", id as string);
      if (error) throw error;
      store.remove(id);
    },
  };
}

export async function createSupabaseSource(
  client: Client,
  userId: string,
): Promise<DataSource> {
  // 카테고리 캐시 선로딩 (transactions/subscriptions FK resolution용)
  await loadCategoryCache(client, userId);

  const txnStore = createStore<Txn>([]);
  const eventStore = createStore<CalendarEvent>([]);
  const memoStore = createStore<MemoDoc>([]);
  const stickyStore = createStore<StickyNote>([]);
  const checklistStore = createStore<ChecklistTask>([]);
  const subStore = createStore<Subscription>([]);
  const pinnedStore = createStore<PinnedInfo>([]);
  const dailyStore = createStore<DailyLog>([]);

  // transactions — async FK resolve가 필요하므로 별도 처리
  const transactions: Repository<Txn> = {
    store: txnStore,
    init: async () => {
      txnStore.setStatus("loading");
      const { data, error } = await client
        .from("transactions")
        .select("*, categories(name, color), accounts(name)")
        .order("occurred_at", { ascending: false });
      if (error) {
        txnStore.setStatus("error", error as Error);
        throw error;
      }
      txnStore.setAll(
        (data ?? []).map((r) => TxnMap.toDomain(r as TxnMap.TxnJoinedRow)),
      );
    },
    upsert: async (input) => {
      const kind: "income" | "expense" =
        input.type === "in" ? "income" : "expense";
      const categoryId = await resolveCategoryId(
        client,
        userId,
        input.cat,
        kind,
      );
      const row = TxnMap.toRow(input, { userId, categoryId });
      const { data, error } = await client
        .from("transactions")
        .upsert(row)
        .select("*, categories(name, color), accounts(name)")
        .single();
      if (error) throw error;
      const item = TxnMap.toDomain(data as TxnMap.TxnJoinedRow);
      txnStore.upsert(item);
      return item;
    },
    remove: async (id) => {
      const { error } = await client
        .from("transactions")
        .delete()
        .eq("id", id as string);
      if (error) throw error;
      txnStore.remove(id);
    },
  };

  // subscriptions — async FK resolve
  const subscriptions: Repository<Subscription> = {
    store: subStore,
    init: async () => {
      subStore.setStatus("loading");
      const { data, error } = await client
        .from("subscriptions")
        .select("*, categories(name, color)")
        .order("next_billing_at", { ascending: true });
      if (error) {
        subStore.setStatus("error", error as Error);
        throw error;
      }
      subStore.setAll(
        (data ?? []).map((r) => SubMap.toDomain(r as SubMap.SubJoinedRow)),
      );
    },
    upsert: async (input) => {
      const categoryId = await resolveCategoryId(
        client,
        userId,
        input.cat,
        "subscription",
      );
      const row = SubMap.toRow(input, { userId, categoryId });
      const { data, error } = await client
        .from("subscriptions")
        .upsert(row)
        .select("*, categories(name, color)")
        .single();
      if (error) throw error;
      const item = SubMap.toDomain(data as SubMap.SubJoinedRow);
      subStore.upsert(item);
      return item;
    },
    remove: async (id) => {
      const { error } = await client
        .from("subscriptions")
        .delete()
        .eq("id", id as string);
      if (error) throw error;
      subStore.remove(id);
    },
  };

  return {
    transactions,
    subscriptions,
    events: makeRepo<CalendarEvent, never>(client, eventStore, {
      table: "calendar_events",
      select: "*",
      toDomain: (r) => EventMap.toDomain(r as never),
      toRow: (input) =>
        EventMap.toRow(input, userId) as Record<string, unknown>,
      orderBy: { column: "starts_at", ascending: true },
    }),
    memos: makeRepo<MemoDoc, never>(client, memoStore, {
      table: "notes",
      select: "*",
      toDomain: (r) => MemoMap.toDomain(r as never),
      toRow: (input) => MemoMap.toRow(input, userId) as Record<string, unknown>,
      orderBy: { column: "created_at", ascending: false },
    }),
    stickyNotes: makeRepo<StickyNote, never>(client, stickyStore, {
      table: "sticky_notes",
      select: "*",
      toDomain: (r) => StickyMap.toDomain(r as never),
      toRow: (input) =>
        StickyMap.toRow(input, userId) as Record<string, unknown>,
      orderBy: { column: "created_at", ascending: true },
    }),
    checklist: makeRepo<ChecklistTask, never>(client, checklistStore, {
      table: "checklist_items",
      select: "*",
      toDomain: (r) => ChecklistMap.toDomain(r as never),
      toRow: (input) =>
        ChecklistMap.toRow(input, userId) as Record<string, unknown>,
      orderBy: { column: "position", ascending: true },
    }),
    pinnedInfo: makeRepo<PinnedInfo, never>(client, pinnedStore, {
      table: "pinned_info",
      select: "*",
      toDomain: (r) => PinnedMap.toDomain(r as never),
      toRow: (input) =>
        PinnedMap.toRow(input, userId) as Record<string, unknown>,
      orderBy: { column: "position", ascending: true },
    }),
    // dailyLog — 도메인 id 가 date 라서 onConflict(user_id,date) 로 upsert.
    // remove 는 도메인 id(date)로 들어와도 user_id+date 매칭으로 삭제.
    dailyLog: {
      store: dailyStore,
      init: async () => {
        dailyStore.setStatus("loading");
        const { data, error } = await client
          .from("daily_logs")
          .select("*")
          .order("date", { ascending: false });
        if (error) {
          dailyStore.setStatus("error", error as Error);
          throw error;
        }
        dailyStore.setAll((data ?? []).map((r) => DailyMap.toDomain(r)));
      },
      upsert: async (input) => {
        const row = DailyMap.toRow(input, userId);
        const { data, error } = await client
          .from("daily_logs")
          .upsert(row, { onConflict: "user_id,date" })
          .select("*")
          .single();
        if (error) throw error;
        const item = DailyMap.toDomain(data);
        dailyStore.upsert(item);
        return item;
      },
      remove: async (id) => {
        // domain id == date (YYYY-MM-DD)
        const { error } = await client
          .from("daily_logs")
          .delete()
          .eq("user_id", userId)
          .eq("date", id as string);
        if (error) throw error;
        dailyStore.remove(id);
      },
    },
  };
}

/** 모드/유저 전환 시 카테고리 캐시 정리. */
export function disposeSupabaseSource(): void {
  clearCategoryCache();
}
