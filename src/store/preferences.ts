// ============================================================
// usePreferencesStore — Zustand + persist (localStorage)
// ============================================================
//
// 기존 usePreferences(React state + 수동 localStorage)에서 이전.
// EDITMODE postMessage 브릿지는 별도 subscribe로 유지 (호스트 환경 호환).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tweaks } from '@/types';
import { TWEAK_DEFAULTS } from "@/data/lookups";

export type SetPreference = <K extends keyof Tweaks>(
  key: K,
  value: Tweaks[K],
) => void;

interface PreferencesState {
  tweaks: Tweaks;
  setTweak: SetPreference;
  resetTweaks: () => void;
}

const KEY = 'dayflow.preferences';

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      tweaks: { ...TWEAK_DEFAULTS },
      setTweak: (key, value) =>
        set((s) => ({ tweaks: { ...s.tweaks, [key]: value } })),
      resetTweaks: () => set({ tweaks: { ...TWEAK_DEFAULTS } }),
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ tweaks: s.tweaks }),
      // 저장 형태 호환: 기존 raw shape({...TWEAKS}) → 신규 { state: { tweaks: {...} } }
      // 사용자 첫 마이그레이션 시 한 번 빈 default로 초기화될 수 있음(허용 범위).
    },
  ),
);

// EDITMODE postMessage 브릿지 — tweaks가 바뀔 때마다 부모 iframe에 알림
if (typeof window !== 'undefined') {
  usePreferencesStore.subscribe((state, prev) => {
    if (state.tweaks === prev.tweaks) return;
    try {
      window.parent?.postMessage(
        { type: '__edit_mode_set_keys', edits: state.tweaks },
        '*',
      );
    } catch {
      /* not in iframe — silent */
    }
  });
}
