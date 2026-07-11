// Toss Payments webhook 씨앗. 실제 결제 처리는 다음 스프린트 — 여기선 서명 검증 +
// 이벤트 파싱/분기 스켈레톤만. proxy matcher(/dashboard/*)에 안 걸리므로 인증 불필요.
//
// 검증 테스트(curl 예시)는 README.md 참고.
import { NextResponse } from "next/server";
import { verifyHmacSha256 } from "@/lib/webhooks/verify";
import { setUserPlan } from "@/lib/payments/plan-sync";
import type { PlanTier } from "@/data/plan/types";

// node:crypto(timingSafeEqual) 사용 — Edge 런타임 미지원 가능성 차단.
export const runtime = "nodejs";

// Toss webhook 서명 헤더. 대시보드 webhook 설정의 시크릿과 HMAC-SHA256 매칭.
const SIGNATURE_HEADER = "toss-signature";

interface TossWebhookEvent {
  eventType?: string;
  data?: { metadata?: { user_id?: string } };
}

// Toss 이벤트 → 목표 플랜. null = 플랜 영향 없는 이벤트.
// ⚠️ 발신부(체크아웃 생성)는 아직 LemonSqueezy 만 구현 — Toss 는 stub.
//    실 연동 시 Toss 결제 요청의 metadata 에 Supabase user_id 를 실어야 아래가 동작.
function planForEvent(eventType: string | undefined): PlanTier | null {
  switch (eventType) {
    case "PAYMENT.DONE":
      return "pro";
    case "PAYMENT.CANCELED":
    case "SUBSCRIPTION.CANCELED":
      return "free";
    default:
      return null;
  }
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

  const eventType = event.eventType ?? "unknown";
  const targetPlan = planForEvent(event.eventType);

  if (targetPlan) {
    const userId = event.data?.metadata?.user_id;
    const result = await setUserPlan(
      typeof userId === "string" ? userId : null,
      targetPlan,
    );
    if (!result.ok) {
      console.warn(
        `[webhook:toss] ${eventType} → plan ${targetPlan} skipped: ${result.reason}`,
      );
      if (result.reason === "db_error") {
        return NextResponse.json({ error: "db_error" }, { status: 500 });
      }
    } else {
      console.info(`[webhook:toss] ${eventType} → plan set ${targetPlan}`);
    }
  } else {
    console.info(`[webhook:toss] received ${eventType} (no-op)`);
  }

  return NextResponse.json({ received: true });
}
