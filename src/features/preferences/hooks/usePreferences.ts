// ============================================================
// usePreferences — replaces the EDITMODE-protocol useTweaks for app state.
// Backed by localStorage today; the Supabase swap point is the persist
// function (drop in a profile-row write instead).
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import type { Tweaks } from '@/types';
import { TWEAK_DEFAULTS } from '@/shared/data/seeds';

const KEY = 'dayflow.preferences';

function load(): Tweaks {
  if (typeof window === 'undefined') return { ...TWEAK_DEFAULTS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...TWEAK_DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Tweaks>;
    return { ...TWEAK_DEFAULTS, ...parsed };
  } catch {
    return { ...TWEAK_DEFAULTS };
  }
}

function persist(t: Tweaks) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(t));
  } catch {
    /* quota / private mode — silent */
  }
  // EDITMODE host bridge — preserves the existing prototype-host workflow
  // until Supabase replaces persistence entirely.
  try {
    window.parent?.postMessage(
      { type: '__edit_mode_set_keys', edits: t },
      '*',
    );
  } catch {
    /* not in iframe */
  }
}

export type SetPreference = <K extends keyof Tweaks>(
  key: K,
  value: Tweaks[K],
) => void;

export function usePreferences(): [Tweaks, SetPreference] {
  const [tweaks, setTweaks] = useState<Tweaks>(() => load());

  // Sync once on mount (in case the host pushed defaults via postMessage
  // before the component mounted).
  useEffect(() => {
    persist(tweaks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTweak = useCallback<SetPreference>((key, value) => {
    setTweaks((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }, []);

  return [tweaks, setTweak];
}
