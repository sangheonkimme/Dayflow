// ============================================================
// usePreferences — Zustand store 어댑터
// 기존 [tweaks, setTweak] 튜플 API 유지하여 호출부 무변경.
// 실 저장소는 shared/state/preferences.ts (persist middleware).
// ============================================================

import type { Tweaks } from '@/types';
import { usePreferencesStore, type SetPreference } from '@/store/preferences';

export type { SetPreference };

export function usePreferences(): [Tweaks, SetPreference] {
  const tweaks = usePreferencesStore((s) => s.tweaks);
  const setTweak = usePreferencesStore((s) => s.setTweak);
  return [tweaks, setTweak];
}
