// ============================================================
// useDataModeStore — 데이터 소스 모드 (live | mock)
// ============================================================
//
// 'live'  — 실제 Supabase 연결 (인증된 사용자 데이터)
// 'mock'  — 시드 기반 in-memory (온보딩/시안 시연/데모용)
//
// persist 안 함 — 매 부팅 시 mock으로 시작 (비로그인 첫 방문 = 데모 화면)

import { create } from 'zustand';

export type DataMode = 'live' | 'mock';

interface DataModeState {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  toggle: () => void;
}

export const useDataModeStore = create<DataModeState>((set) => ({
  mode: 'mock',
  setMode: (mode) => set({ mode }),
  toggle: () => set((s) => ({ mode: s.mode === 'mock' ? 'live' : 'mock' })),
}));
