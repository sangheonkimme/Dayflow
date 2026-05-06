// ============================================================
// DataSource — Repository pattern abstraction
// ============================================================
//
// 컴포넌트는 hooks를 통해서만 데이터를 만지고, hooks는 이 인터페이스를 통해서만
// 저장소와 통신한다. 현재 구현체는 in-memory mock(MockSource), 추후 SupabaseSource로
// 교체될 자리.

import type { Store } from "@/data/store";
import type {
  Txn,
  CalendarEvent,
  MemoDoc,
  StickyNote,
  ChecklistTask,
  Subscription,
} from "@/types";
import type { PinnedInfo, DailyLog } from "@/data/seeds/types";

export interface Repository<T extends { id: string | number }> {
  /** 도메인 store를 노출 — hook이 useSyncExternalStore로 구독한다. */
  readonly store: Store<T>;
  /** 초기 로드 (mock은 즉시 시드 채움, supabase는 fetch 후 setAll). */
  init(): Promise<void>;
  /** 새 항목 추가/갱신. id가 없으면 구현체가 생성. */
  upsert(item: Partial<T> & { id?: T["id"] }): Promise<T>;
  /** id로 삭제. */
  remove(id: T["id"]): Promise<void>;
}

export interface DataSource {
  transactions: Repository<Txn>;
  events: Repository<CalendarEvent>;
  memos: Repository<MemoDoc>;
  stickyNotes: Repository<StickyNote>;
  checklist: Repository<ChecklistTask>;
  subscriptions: Repository<Subscription>;
  pinnedInfo: Repository<PinnedInfo>;
  dailyLog: Repository<DailyLog>;
  // NOTE: posts / challenges / ranking — 모바일 커뮤니티 기능 보류.
  // 시드 파일은 src/data/seeds/_archive/ 에 보존 (재도입 시 사용).
}
