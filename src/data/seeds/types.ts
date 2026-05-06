// ============================================================
// 보충 도메인 타입
// ============================================================
//
// `src/types.ts`에 이미 정의된 핵심 도메인(Txn, CalendarEvent, ...) 외에
// 시드 분리 과정에서 추가로 필요한 타입들. supabase-plan.md에 매핑이 있는 것과
// (PinnedInfo, DailyLog) 없는 것(Post, Challenge, Ranker)을 같이 둔다.

// ─────────────────────────────────────────────
// 자주 쓰는 정보 (plan: pinned_info)
// ─────────────────────────────────────────────
export interface PinnedInfo {
  id: number | string;
  label: string;
  value: string;
  /** wifi / account / password / etc */
  category?: string;
  isSecret?: boolean;
  position?: number;
}

// ─────────────────────────────────────────────
// 오늘의 한 줄 + 무드 (plan: daily_logs)
// ─────────────────────────────────────────────
export type Mood = 'calm' | 'happy' | 'sleepy' | 'fire' | 'tired' | 'sad';

export interface DailyLog {
  /** 1일 1행이라 date(YYYY-MM-DD)를 id로 사용 */
  id: string;
  date: string;
  mood: Mood;
  oneLine: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// 커뮤니티 — supabase-plan.md에 미정의 (notify 대상)
// ─────────────────────────────────────────────
export interface Post {
  id: number | string;
  author: string;
  avatar: string;
  /** 챌린지 ID 또는 카테고리 라벨 */
  tag: string;
  /** 게시 시간 표시용 (예: "2시간 전") — 추후 timestamp로 교체 */
  time: string;
  title: string;
  body: string;
  /** 카드 우상단에 표시되는 통계 라벨 (예: "12일 연속") */
  stat?: string;
  likes: number;
  comments: number;
  badge?: string;
  imageUrl?: string;
}

export interface Comment {
  id: number | string;
  postId: number | string;
  author: string;
  avatar: string;
  body: string;
  time: string;
  likes: number;
}

export interface Challenge {
  id: number | string;
  title: string;
  sub: string;
  members: number;
  /** 진행일 / 총일 */
  days: number;
  progress: number;
  color: string;
  emoji: string;
}

export interface Ranker {
  id: number | string;
  rank: number;
  name: string;
  avatar: string;
  /** 누적 절약 금액 (KRW) */
  saved: number;
  streak: number;
  medal?: 'gold' | 'silver' | 'bronze';
}
