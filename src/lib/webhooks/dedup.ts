import "server-only";
// 결제 webhook 강멱등(dedup). Toss·LemonSqueezy 두 라우트가 공유한다.
//
// 동작: 처리 직전에 webhook_events 에 (provider, event_id) 를 insert 해서 선점한다.
//   - insert 성공        → 이 전달이 최초. 계속 처리.
//   - unique violation   → 이미 처리한 이벤트. 스킵하고 200 ack.
//   - 저장소 사용 불가   → 멱등 없이 진행(기존 latest-wins 동작). 이벤트 유실보다 낫다.
//
// "사용 불가" 에는 service-role 미설정과 **마이그레이션 0012 미적용**이 포함된다.
// 코드가 마이그레이션보다 먼저 배포돼도 webhook 이 죽지 않도록 한 안전장치.

import { createHash } from "node:crypto";
import { getAdminClient } from "@/lib/supabase/admin";

export type WebhookProvider = "lemonsqueezy" | "toss";

/** PostgreSQL unique_violation. 이미 선점된 이벤트. */
const UNIQUE_VIOLATION = "23505";
/** undefined_table — 마이그레이션 0012 미적용. PostgREST 는 PGRST205 로도 준다. */
const MISSING_TABLE = new Set(["42P01", "PGRST205"]);

export type ClaimStatus =
  /** 최초 전달. 계속 처리해도 된다. */
  | "claimed"
  /** 이미 처리한 이벤트. 스킵. */
  | "duplicate"
  /** 멱등 저장소를 못 썼다. 멱등 보장 없이 진행. */
  | "unavailable";

/**
 * 결제사가 이벤트 id 를 안 주는 경우가 있어(LemonSqueezy 등) raw body 해시로 대체한다.
 * 동일 payload 재전송은 동일 해시가 되므로 재전송 dedup 목적에는 충분하다.
 */
export function eventIdFrom(
  explicitId: string | null | undefined,
  rawBody: string,
): string {
  const id = explicitId?.trim();
  if (id) return id;
  return `sha256:${createHash("sha256").update(rawBody).digest("hex")}`;
}

/** 이벤트를 선점한다. 반환값에 따라 호출부가 처리/스킵을 결정. */
export async function claimWebhookEvent(params: {
  provider: WebhookProvider;
  eventId: string;
  eventType?: string;
}): Promise<ClaimStatus> {
  const admin = getAdminClient();
  if (!admin) return "unavailable";

  const { error } = await admin.from("webhook_events").insert({
    provider: params.provider,
    event_id: params.eventId,
    event_type: params.eventType ?? null,
  });

  if (!error) return "claimed";
  if (error.code === UNIQUE_VIOLATION) return "duplicate";
  if (error.code && MISSING_TABLE.has(error.code)) {
    console.warn(
      `[webhook:${params.provider}] dedup 미적용 — webhook_events 테이블 없음(migration 0012). 멱등 없이 진행.`,
    );
    return "unavailable";
  }
  console.warn(
    `[webhook:${params.provider}] dedup claim 실패(${error.code ?? "unknown"}). 멱등 없이 진행.`,
  );
  return "unavailable";
}

/**
 * 선점을 해제한다. 처리 도중 재시도 가능한 실패(500)가 났을 때만 호출 —
 * 안 그러면 선점만 남아 재전송이 영원히 스킵되고 플랜이 반영되지 않는다.
 */
export async function releaseWebhookEvent(params: {
  provider: WebhookProvider;
  eventId: string;
}): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;

  const { error } = await admin
    .from("webhook_events")
    .delete()
    .eq("provider", params.provider)
    .eq("event_id", params.eventId);

  if (error) {
    // 해제 실패는 재전송이 스킵된다는 뜻 — 수동 개입이 필요할 수 있어 크게 남긴다.
    console.error(
      `[webhook:${params.provider}] dedup 선점 해제 실패 (event_id=${params.eventId}): ${error.message}`,
    );
  }
}
