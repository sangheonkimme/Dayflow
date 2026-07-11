// Toss Payments webhook 씨앗. 실제 결제 처리는 다음 스프린트 — 여기선 서명 검증 +
// 이벤트 파싱/분기 스켈레톤만. proxy matcher(/dashboard/*)에 안 걸리므로 인증 불필요.
//
// 검증 테스트(curl 예시)는 README.md 참고.
import { NextResponse } from "next/server";
import { verifyHmacSha256 } from "@/lib/webhooks/verify";

// node:crypto(timingSafeEqual) 사용 — Edge 런타임 미지원 가능성 차단.
export const runtime = "nodejs";

// Toss webhook 서명 헤더. 대시보드 webhook 설정의 시크릿과 HMAC-SHA256 매칭.
const SIGNATURE_HEADER = "toss-signature";

interface TossWebhookEvent {
  eventType?: string;
  data?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const secret = process.env.TOSS_WEBHOOK_SECRET;
  if (!secret) {
    // 미설정은 클라 잘못이 아닌 서버 구성 오류 → 503(재시도 유도). 200 삼키면 이벤트 유실.
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

  let event: TossWebhookEvent;
  try {
    event = JSON.parse(rawBody) as TossWebhookEvent;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // 이벤트 타입 분기 — 실제 처리(profiles.plan 갱신)는 다음 스프린트 TODO.
  switch (event.eventType) {
    case "PAYMENT.DONE":
      // TODO(payments): 결제 완료 → 해당 사용자 profiles.plan = 'pro', plan_updated_at = now().
      break;
    case "PAYMENT.CANCELED":
    case "SUBSCRIPTION.CANCELED":
      // TODO(payments): 취소/환불 → profiles.plan = 'free'.
      break;
    default:
      // 미처리 이벤트도 200 으로 ack — 재전송 폭주 방지.
      break;
  }

  console.info(`[webhook:toss] received ${event.eventType ?? "unknown"}`);
  return NextResponse.json({ received: true });
}
