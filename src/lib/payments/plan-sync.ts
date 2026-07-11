import "server-only";
// 결제 webhook 이 사용자 플랜을 갱신하는 공용 진입점. Toss·LemonSqueezy 두 라우트가 공유.
// service-role 로 RLS 우회하므로, userId 는 반드시 검증된 결제사 payload 의 custom_data 에서만 온다.
import { getAdminClient } from "@/lib/supabase/admin";
import type { PlanTier } from "@/data/plan/types";

export type PlanSyncResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "no_user" | "db_error" };

/**
 * userId 의 profiles.plan 을 tier 로 설정한다.
 * - 멱등: 동일 상태로 여러 번 호출돼도 결과가 수렴(update 는 자연 멱등, latest-wins).
 * - userId 없으면 no_user (호출부는 200 ack + 로깅으로 처리 — 재전송해도 못 고침).
 * - service-role 미설정이면 not_configured.
 */
export async function setUserPlan(
  userId: string | null | undefined,
  tier: PlanTier,
): Promise<PlanSyncResult> {
  if (!userId) return { ok: false, reason: "no_user" };

  const admin = getAdminClient();
  if (!admin) return { ok: false, reason: "not_configured" };

  const { error } = await admin
    .from("profiles")
    .update({ plan: tier, plan_updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) return { ok: false, reason: "db_error" };
  return { ok: true };
}
