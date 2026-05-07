// ============================================================
// useModalStore — 글로벌 모달 상태 (tx/event)
// ============================================================
//
// 기존엔 App.tsx의 useState로 관리되어 콜백을 props drilling 해야 했다.
// Zustand로 올리면 어떤 컴포넌트에서도 직접 openTxn/openEvent 호출 가능.
// (현 단계는 인프라만 — App.tsx 수정. 페이지별 직접 호출은 점진 이전)

import { create } from "zustand";
import type { ModalState, TxnDraft, EventDraft } from "@/types";

interface ModalStoreState {
  modal: ModalState;
  openTxn: (editing?: TxnDraft) => void;
  openEvent: (editing?: EventDraft) => void;
  close: () => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  modal: null,
  openTxn: (editing) => set({ modal: { type: "txn", editing } }),
  openEvent: (editing) => set({ modal: { type: "event", editing } }),
  close: () => set({ modal: null }),
}));
