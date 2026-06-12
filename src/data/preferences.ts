// ============================================================
// usePreferences — Zustand store 어댑터
// 기존 [tweaks, setTweak] 튜플 API 유지하여 호출부 무변경.
// 실 저장소는 shared/state/preferences.ts (persist middleware).
// ============================================================

import { useEffect, useRef } from "react";
import type { Tweaks } from "@/types";
import { usePreferencesStore, type SetPreference } from "@/store/preferences";
import {
  fetchRemotePreferences,
  saveRemotePreferences,
} from "@/data/source/preferences-remote";

export type { SetPreference };

export function usePreferences(): [Tweaks, SetPreference] {
  const tweaks = usePreferencesStore((s) => s.tweaks);
  const setTweak = usePreferencesStore((s) => s.setTweak);
  return [tweaks, setTweak];
}

// ─────────────────────────────────────────────
// Supabase 동기화
// ─────────────────────────────────────────────
//
// 기기 종속/개발용 키는 서버에 저장하지 않는다(ephemeral). 다른 기기에
// 전파되면 안 되는 상태들.
const EPHEMERAL_KEYS = new Set(["authed", "forceMobile", "authPreview"]);

/** 서버에 push 할 syncable 부분만 추려낸다. */
function syncablePart(tweaks: Tweaks): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(tweaks)) {
    if (!EPHEMERAL_KEYS.has(k)) out[k] = v;
  }
  return out;
}

/** 서버에서 받은 blob 중 ephemeral 키는 제외하고 머지용으로 정리. */
function mergeableRemote(remote: Record<string, unknown>): Partial<Tweaks> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(remote)) {
    if (!EPHEMERAL_KEYS.has(k)) out[k] = v;
  }
  return out as Partial<Tweaks>;
}

const PUSH_DEBOUNCE_MS = 600;

/**
 * 로그인 사용자의 환경설정을 Supabase 와 동기화한다.
 * - 로그인 시: 서버 → 로컬 머지(서버 우선). 서버가 비어있으면 로컬 → 서버 1회 push
 *   (localStorage 사용자 마이그레이션 경로).
 * - 이후 로컬 변경: debounce 후 서버 push(optimistic — 로컬은 이미 갱신됨).
 * - 비로그인/Supabase 미설정: no-op → localStorage 단독 동작 유지.
 */
export function usePreferencesSync(
  userId: string | null,
  authed: boolean,
): void {
  const hydratedFor = useRef<string | null>(null);

  // 1) 서버 → 로컬 (서버 우선) / 첫 로그인 시 로컬 → 서버
  useEffect(() => {
    if (!authed || !userId) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === userId) return;
    let cancelled = false;
    (async () => {
      const remote = await fetchRemotePreferences(userId);
      if (cancelled) return;
      const store = usePreferencesStore.getState();
      if (remote && Object.keys(remote).length > 0) {
        store.mergeTweaks(mergeableRemote(remote));
      } else {
        await saveRemotePreferences(userId, syncablePart(store.tweaks));
      }
      if (!cancelled) hydratedFor.current = userId;
    })();
    return () => {
      cancelled = true;
    };
  }, [authed, userId]);

  // 2) 로컬 변경 → 서버 push (debounce)
  useEffect(() => {
    if (!authed || !userId) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsub = usePreferencesStore.subscribe((state, prev) => {
      if (state.tweaks === prev.tweaks) return;
      if (hydratedFor.current !== userId) return; // 하이드레이션 전 echo 방지
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void saveRemotePreferences(userId, syncablePart(state.tweaks));
      }, PUSH_DEBOUNCE_MS);
    });
    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, [authed, userId]);
}
