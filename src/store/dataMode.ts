// ============================================================
// useDataModeStore — 데이터 소스 모드 (live | mock)
// ============================================================
//
// 'live'  — 실제 Supabase 연결 (인증된 사용자 데이터, 기본값)
// 'mock'  — 시드 기반 in-memory (시연/디자인 QA 전용, TweaksPanel에서 opt-in)
//
// persist 안 함 — 매 부팅 시 'live'로 시작 → 비로그인이면 인증 화면 진입.

import { create } from "zustand";

export type DataMode = "live" | "mock";

interface DataModeState {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  toggle: () => void;
}

export const useDataModeStore = create<DataModeState>((set) => ({
  mode: "live",
  setMode: (mode) => set({ mode }),
  toggle: () => set((s) => ({ mode: s.mode === "mock" ? "live" : "mock" })),
}));
