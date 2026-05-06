// ============================================================
// Seeds barrel — every domain mock surface in one place.
// `data/source/mock.ts` imports from here.
// ============================================================

export { TRANSACTION_SEEDS } from '@/features/transactions/seeds';
export { EVENT_SEEDS } from '@/features/events/seeds';
export { MEMO_SEEDS, FOLDERS, ALL_TAGS } from '@/features/memos/seeds';
export type { MemoFolder } from '@/features/memos/seeds';
export { STICKY_NOTE_SEEDS } from '@/features/sticky-notes/seeds';
export { CHECKLIST_SEEDS } from '@/features/checklist/seeds';
export {
  SUBSCRIPTION_SEEDS,
  SUBSCRIPTION_USAGE_SEEDS,
} from '@/features/subscriptions/seeds';
export type { SubscriptionUsage } from '@/features/subscriptions/seeds';
export { PINNED_INFO_SEEDS } from '@/features/pinned-info/seeds';
export { DAILY_LOG_SEEDS } from '@/features/daily-log/seeds';
// 커뮤니티(POST/CHALLENGE/RANKING) 시드는 archive/community/ 로 보관됨 — 추후 재도입 시 복원.
export {
  MOODS,
  emojiToMood,
  moodToEmoji,
  TIMER_PRESETS,
  ACCENT_OPTIONS,
  TWEAK_DEFAULTS,
} from '@/shared/data/seeds/lookups';
export type { MoodOption, AccentOption } from '@/shared/data/seeds/lookups';
