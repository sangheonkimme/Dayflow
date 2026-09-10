// profiles.plan 파생 도메인 타입 + 파서.
// 마이그레이션 0011 이 추가한 plan / plan_updated_at 컬럼을 앱 타입으로 변환한다.
// RSC fetcher(src/server/plan.ts)와 클라 훅(useUserPlan)이 동일 파서를 공유해
// 서버·클라 파싱 규칙이 어긋나지 않도록 한다.

export const PLAN_TIERS = ["free", "pro"] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];

export interface UserPlan {
  tier: PlanTier;
  /**
   * 현재 플랜을 만든 **이벤트의 발생 시각**(ISO). 미변경/비로그인이면 null.
   *
   * 결제 webhook 의 순서 뒤바뀐 전달을 막는 워터마크로도 쓰인다(plan-sync).
   * 결제사가 시각을 안 주는 이벤트에 한해 처리 시각(now)이 들어간다.
   * ⚠️ DB 컬럼 코멘트(마이그레이션 0011)는 "처리 시각" 이라 적혀 있어 낡았다 —
   *    다음 마이그레이션에서 갱신할 것.
   */
  updatedAt: string | null;
}

/** 비로그인·미설정·미인식 값의 기본 플랜 — 항상 free. */
export const DEFAULT_USER_PLAN: UserPlan = { tier: "free", updatedAt: null };

/** profiles 행(부분)을 UserPlan 으로 변환. 알 수 없는 값은 free 로 폴백. */
export function parsePlanRow(
  row: { plan?: string | null; plan_updated_at?: string | null } | null,
): UserPlan {
  const raw = row?.plan ?? "";
  const tier: PlanTier = (PLAN_TIERS as readonly string[]).includes(raw)
    ? (raw as PlanTier)
    : "free";
  return { tier, updatedAt: row?.plan_updated_at ?? null };
}
