import "server-only";
// 결제 webhook 이 사용자 플랜을 갱신하는 공용 진입점. Toss·LemonSqueezy 두 라우트가 공유.
// service-role 로 RLS 우회하므로, userId 는 반드시 검증된 결제사 payload 의 custom_data 에서만 온다.
import { getAdminClient } from "@/lib/supabase/admin";
import type { PlanTier } from "@/data/plan/types";

export type PlanSyncResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not_configured" | "no_user" | "db_error" | "stale";
    };

/**
 * userId 의 profiles.plan 을 tier 로 설정한다.
 *
 * - 멱등: 동일 상태로 여러 번 호출돼도 결과가 수렴.
 * - userId 없으면 no_user (호출부는 200 ack + 로깅 — 재전송해도 못 고침).
 * - service-role 미설정이면 not_configured.
 *
 * ## eventAt — 순서 뒤바뀐 전달 방어(워터마크)
 *
 * eventAt 을 주면 profiles.plan_updated_at 을 워터마크로 써서
 * **이벤트 발생 시각이 현재 저장된 워터마크보다 이전이면 갱신하지 않는다**(stale).
 * dedup 은 같은 이벤트의 재전송만 막으므로, 서로 다른 이벤트가 순서를 바꿔
 * 도착하는 경우(cancelled 가 처리된 뒤 먼저 발생한 active 가 도착)는 이 가드가 막는다.
 *
 * 비교와 갱신은 **한 번의 조건부 UPDATE** 로 처리한다(read → write 사이의 경쟁 제거).
 * 동시각(=)은 통과시킨다 — 같은 이벤트를 다시 적용해도 결과가 같도록.
 *
 * eventAt 이 null/undefined 면 워터마크 없이 기존 latest-wins 로 동작하고
 * plan_updated_at 에는 처리 시각(now)을 남긴다. 결제사가 시각을 안 주는 경우
 * 이벤트를 버리는 것보다 반영하는 쪽이 낫다.
 *
 * ⚠️ eventAt 을 주면 plan_updated_at 의 의미가 "처리 시각" 이 아니라
 *    "현재 플랜을 만든 이벤트의 발생 시각" 이 된다. 워터마크로 쓰려면 필연적이다.
 */
export async function setUserPlan(
  userId: string | null | undefined,
  tier: PlanTier,
  eventAt?: Date | null,
): Promise<PlanSyncResult> {
  if (!userId) return { ok: false, reason: "no_user" };

  const admin = getAdminClient();
  if (!admin) return { ok: false, reason: "not_configured" };

  const stamp = (eventAt ?? new Date()).toISOString();

  let query = admin
    .from("profiles")
    .update({ plan: tier, plan_updated_at: stamp })
    .eq("id", userId);

  if (eventAt) {
    // 워터마크가 없거나(첫 결제) 이벤트 발생 시각 이하일 때만 갱신.
    query = query.or(`plan_updated_at.is.null,plan_updated_at.lte.${stamp}`);
  }

  const { data, error } = await query.select("id");
  if (error) return { ok: false, reason: "db_error" };

  // 워터마크 가드가 걸린 경우에만 0행이 의미를 갖는다. stale(정상 동작)과
  // 존재하지 않는 user(알람 대상)는 대응이 다르므로 한 번 더 조회해 구분한다.
  // 0행 경로는 드물어 추가 왕복 비용이 문제되지 않는다.
  if (eventAt && data?.length === 0) {
    const { data: profile, error: lookupError } = await admin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (lookupError) return { ok: false, reason: "db_error" };
    return { ok: false, reason: profile ? "stale" : "no_user" };
  }

  return { ok: true };
}
