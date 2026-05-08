// ============================================================
// useDraftField — IME-safe controlled-input draft state
// ============================================================
//
// 매 keystroke마다 store/네트워크에 commit하면 한글 IME composition이
// 깨지고(controlled value 재기록 → composition buffer reset),
// Supabase 모드에선 키 입력당 round-trip이 발생한다.
//
// 이 훅은 입력 동안 로컬 draft만 갱신하고, blur 시점에만 1회 commit한다.
// 외부(다른 탭/realtime 등)에서 값이 바뀐 경우에는 사용자가 편집 중이지
// 않을 때 draft를 동기화해 stale view가 남지 않도록 한다.

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDraftFieldOptions<T> {
  /** 외부 value (store, props 등) */
  value: T;
  /** blur 시점에 호출되는 commit 콜백. 값이 바뀐 경우에만 호출된다. */
  onCommit: (next: T) => void;
}

export interface DraftFieldBindings<T> {
  /** input/textarea의 value */
  value: T;
  /** input/textarea onChange 핸들러용 setter */
  setDraft: (next: T) => void;
  /** input/textarea onBlur에 그대로 연결 */
  commit: () => void;
}

export function useDraftField<T>({
  value,
  onCommit,
}: UseDraftFieldOptions<T>): DraftFieldBindings<T> {
  const [draft, setDraft] = useState<T>(value);
  // 마지막으로 외부와 동기화된 값을 기억해 두 가지를 구분한다.
  // (1) 외부에서 새로 들어온 값 → draft 갱신
  // (2) 내가 commit해서 외부가 바뀐 값 → 무시 (이미 draft에 반영됨)
  const lastSyncedRef = useRef<T>(value);

  useEffect(() => {
    if (value !== lastSyncedRef.current) {
      lastSyncedRef.current = value;
      setDraft(value);
    }
  }, [value]);

  const commit = useCallback(() => {
    if (draft !== lastSyncedRef.current) {
      lastSyncedRef.current = draft;
      onCommit(draft);
    }
  }, [draft, onCommit]);

  return { value: draft, setDraft, commit };
}
