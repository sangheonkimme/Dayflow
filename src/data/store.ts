// ============================================================
// Generic reactive store (useSyncExternalStore-compatible)
// ============================================================
//
// 각 도메인(transactions, events, memos, ...)이 공유하는 store 팩토리.
// CRUD 연산마다 새 배열을 반환해 referential equality가 깨지도록 하고,
// React 18의 useSyncExternalStore가 그대로 구독할 수 있게 subscribe/getSnapshot을 노출한다.
//
// Supabase 도입 시: Repository 어댑터가 초기 fetch 결과를 setAll로 채우고,
// realtime 이벤트를 upsert / remove로 흘리기만 하면 hook 레이어는 변경 불필요.

export type Status = "idle" | "loading" | "success" | "error";

export interface Identifiable {
  id: string | number;
}

export interface Store<T extends Identifiable> {
  /** 현재 스냅샷 — 매 변경 시 새 참조. */
  getSnapshot: () => readonly T[];
  getStatus: () => Status;
  getError: () => Error | null;
  subscribe: (listener: () => void) => () => void;

  // ── Repository 구현체 전용 명령형 API ──
  setAll: (items: T[]) => void;
  setStatus: (status: Status, error?: Error | null) => void;
  upsert: (item: T) => void;
  remove: (id: T["id"]) => void;
  reset: () => void;
}

export function createStore<T extends Identifiable>(
  initial: T[] = [],
): Store<T> {
  let items: readonly T[] = Object.freeze([...initial]);
  let status: Status = initial.length > 0 ? "success" : "idle";
  let error: Error | null = null;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  return {
    getSnapshot: () => items,
    getStatus: () => status,
    getError: () => error,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setAll: (next) => {
      items = Object.freeze([...next]);
      status = "success";
      error = null;
      emit();
    },
    setStatus: (next, err = null) => {
      status = next;
      error = err;
      emit();
    },
    upsert: (item) => {
      const idx = items.findIndex((x) => x.id === item.id);
      const next = [...items];
      if (idx >= 0) next[idx] = item;
      else next.push(item);
      items = Object.freeze(next);
      emit();
    },
    remove: (id) => {
      items = Object.freeze(items.filter((x) => x.id !== id));
      emit();
    },
    reset: () => {
      items = Object.freeze([...initial]);
      status = initial.length > 0 ? "success" : "idle";
      error = null;
      emit();
    },
  };
}
