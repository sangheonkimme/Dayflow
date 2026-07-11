// LemonSqueezy webhook 씨앗. 실제 결제 처리는 다음 스프린트 — 서명 검증 +
// 이벤트 파싱/분기 스켈레톤만. proxy matcher(/dashboard/*)에 안 걸리므로 인증 불필요.
//
// LemonSqueezy 서명: X-Signature 헤더 = HMAC-SHA256(rawBody, signing_secret) 의 hex.
// 검증 테스트(curl 예시)는 README.md 참고.
import { NextResponse } from "next/server";
import { verifyHmacSha256 } from "@/lib/webhooks/verify";

export const runtime = "nodejs";

const SIGNATURE_HEADER = "x-signature";

interface LemonSqueezyWebhookEvent {
  meta?: { event_name?: string; custom_data?: Record<string, unknown> };
  data?: Record<string, unknown>;
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

  // 이벤트 타입 분기 — 실제 처리(profiles.plan 갱신)는 다음 스프린트 TODO.
  switch (event.meta?.event_name) {
    case "order_created":
      // TODO(payments): 주문 완료(checkout) → profiles.plan = 'pro'.
      break;
    case "subscription_created":
    case "subscription_updated":
    case "subscription_resumed":
      // TODO(payments): 구독 활성 → profiles.plan = 'pro', plan_updated_at = now().
      break;
    case "subscription_cancelled":
    case "subscription_expired":
      // TODO(payments): 구독 종료 → profiles.plan = 'free'.
      break;
    default:
      break;
  }

  console.info(
    `[webhook:lemonsqueezy] received ${event.meta?.event_name ?? "unknown"}`,
  );
  return NextResponse.json({ received: true });
}
