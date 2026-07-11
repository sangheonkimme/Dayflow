// ============================================================
// Static lookup data — emoji mood palette, timer presets, accent colors
// ============================================================

import type { Mood } from "@/data/daily-log";
import type { AccentColor, NotificationPrefs, Tweaks } from "@/types";

export interface MoodOption {
  emoji: string;
  label: string;
  /** Canonical Mood enum value matching DailyLog.mood */
  value: Mood;
}

export const MOODS: MoodOption[] = [
  { emoji: "😌", label: "차분", value: "calm" },
  { emoji: "😊", label: "좋음", value: "happy" },
  { emoji: "😴", label: "피곤", value: "sleepy" },
  { emoji: "🔥", label: "집중", value: "fire" },
  { emoji: "😵", label: "혼란", value: "tired" },
  { emoji: "🥲", label: "복잡", value: "sad" },
];

/** Convert a 🔥-style emoji to Mood enum (tolerant). */
export function emojiToMood(emoji: string): Mood {
  return MOODS.find((m) => m.emoji === emoji)?.value ?? "calm";
}
export function moodToEmoji(mood: Mood): string {
  return MOODS.find((m) => m.value === mood)?.emoji ?? "😌";
}

/** Pomodoro / GeneralTimer preset minutes. */
export const TIMER_PRESETS = [1, 5, 10, 15, 25] as const;

export interface AccentOption {
  id: AccentColor;
  c: string;
  label: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: "yellow", c: "#ffe27a", label: "노랑" },
  { id: "coral", c: "#ffb38a", label: "코랄" },
  { id: "mint", c: "#b9e7c9", label: "민트" },
  { id: "lilac", c: "#d4c1f0", label: "라일락" },
];

/** App.tsx default Tweaks block (moved from App.tsx). */
export const TWEAK_DEFAULTS: Tweaks = {
  dark: false,
  accent: "yellow",
  noteStyle: "tilted",
  density: "comfy",
  showCalendar: true,
  authed: true,
  forceMobile: false,
  authPreview: "login",
  // 모바일 테마 화면 기본값
  font: "hand",
  fontSize: 2,
  listDensity: "comfy",
  paperTexture: true,
  haptics: true,
};

/** 알림 설정 기본값 — 사용자가 건드리기 전엔 blob 에 넣지 않고 이 값으로 표시. */
export const NOTIFICATION_DEFAULTS: NotificationPrefs = {
  push: true,
  daily: true,
  weekly: true,
  budget: true,
  bigSpend: true,
  subRenew: true,
  cal30: true,
  cal1d: false,
  quietOn: true,
  quietStart: "22:00",
  quietEnd: "08:00",
  sound: "기본",
};
