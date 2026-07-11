// LemonSqueezy webhook 씨앗. 실제 결제 처리는 다음 스프린트 — 서명 검증 +
// 이벤트 파싱/분기 스켈레톤만. proxy matcher(/dashboard/*)에 안 걸리므로 인증 불필요.
//
// LemonSqueezy 서명: X-Signature 헤더 = HMAC-SHA256(rawBody, signing_secret) 의 hex.
// 검증 테스트(curl 예시)는 README.md 참고.
import { NextResponse } from "next/server";
import { verifyHmacSha256 } from "@/lib/webhooks/verify";
import { setUserPlan } from "@/lib/payments/plan-sync";
import type { PlanTier } from "@/data/plan/types";

export const runtime = "nodejs";

const SIGNATURE_HEADER = "x-signature";

interface LemonSqueezyWebhookEvent {
  meta?: { event_name?: string; custom_data?: Record<string, unknown> };
  data?: { attributes?: { status?: string } };
}

// 구독 상태 → 플랜. active/on_trial/past_due 는 접근 유지(pro), 그 외(cancelled/
// expired/paused/unpaid)는 free 강등.
const ACTIVE_STATUSES = new Set(["active", "on_trial", "past_due"]);

/**
 * 이벤트 → 목표 플랜. null = 플랜 영향 없는 이벤트(무시).
 * 구독 이벤트는 이벤트명이 아니라 실제 status 로 판정(updated 가 다운그레이드일 수 있음).
 */
function planForEvent(event: LemonSqueezyWebhookEvent): PlanTier | null {
  const name = event.meta?.event_name;
  if (name === "order_created") return "pro";
  if (name?.startsWith("subscription_")) {
    const status = event.data?.attributes?.status;
    return status && ACTIVE_STATUSES.has(status) ? "pro" : "free";
  }
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "webhook not configured" },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER) ?? "";
  if (!verifyHmacSha256(rawBody, secret, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: LemonSqueezyWebhookEvent;
  try {
    event = JSON.parse(rawBody) as LemonSqueezyWebhookEvent;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventName = event.meta?.event_name ?? "unknown";
  const targetPlan = planForEvent(event);

  if (targetPlan) {
    // 체크아웃 생성 시 custom_data.user_id 로 실어보낸 Supabase user id (문자열).
    const userId = event.meta?.custom_data?.user_id;
    const result = await setUserPlan(
      typeof userId === "string" ? userId : null,
      targetPlan,
    );
    if (!result.ok) {
      // no_user/not_configured/db_error 모두 재전송으로 못 고치는 경우가 많으므로
      // 200 으로 ack 하되(폭주 방지) 원인을 로깅. db_error 만 재시도 유도(500).
      console.warn(
        `[webhook:lemonsqueezy] ${eventName} → plan ${targetPlan} skipped: ${result.reason}`,
      );
      if (result.reason === "db_error") {
        return NextResponse.json({ error: "db_error" }, { status: 500 });
      }
    } else {
      console.info(
        `[webhook:lemonsqueezy] ${eventName} → plan set ${targetPlan}`,
      );
    }
  } else {
    console.info(`[webhook:lemonsqueezy] received ${eventName} (no-op)`);
  }

  return NextResponse.json({ received: true });
}
