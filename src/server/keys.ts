// 도메인 query key 모음. RSC prefetch 와 클라 useQuery 가 동일 키를 써야
// HydrationBoundary 가 클라 캐시를 인식한다.

export const queryKeys = {
  transactions: ["transactions"] as const,
  events: ["events"] as const,
  memos: ["memos"] as const,
  stickyNotes: ["stickyNotes"] as const,
  checklist: ["checklist"] as const,
  subscriptions: ["subscriptions"] as const,
  pinnedInfo: ["pinnedInfo"] as const,
  dailyLog: ["dailyLog"] as const,
};
