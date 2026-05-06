// ============================================================
// Seeds barrel — every domain mock surface in one place.
// `data/source/mock.ts` imports from here.
// ============================================================

export { TRANSACTION_SEEDS } from '@/data/seeds/transactions';
export { EVENT_SEEDS } from '@/data/seeds/events';
export { MEMO_SEEDS, FOLDERS, ALL_TAGS } from '@/data/seeds/memos';
export type { MemoFolder } from '@/data/seeds/memos';
export { STICKY_NOTE_SEEDS } from '@/data/seeds/sticky-notes';
export { CHECKLIST_SEEDS } from '@/data/seeds/checklist';
export {
  SUBSCRIPTION_SEEDS,
  SUBSCRIPTION_USAGE_SEEDS,
} from '@/data/seeds/subscriptions';
export type { SubscriptionUsage } from '@/data/seeds/subscriptions';
export { PINNED_INFO_SEEDS } from '@/data/seeds/pinned-info';
export { DAILY_LOG_SEEDS } from '@/data/seeds/daily-log';
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
