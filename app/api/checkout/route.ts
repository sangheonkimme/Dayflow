// 결제 체크아웃 시작. 인증된 유저만 — user_id 를 결제사 custom_data 에 실어보낸다.
// LemonSqueezy 우선. 키 미설정 시 501(준비 중) → 클라가 안내 노출.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLemonSqueezyCheckout } from "@/lib/payments/lemonsqueezy";
import type { CheckoutBilling } from "@/lib/payments/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // billing 은 클라가 보낸 값이지만 화이트리스트로만 수용(variant 는 서버 env 로만 결정).
  let billing: CheckoutBilling = "year";
  try {
    const body = (await req.json()) as { billing?: unknown };
    if (body.billing === "month" || body.billing === "year") {
      billing = body.billing;
    }
  } catch {
    // 본문 없음/파싱 실패 → 기본(year).
  }

  const origin = new URL(req.url).origin;
  const result = await createLemonSqueezyCheckout({
    userId: user.id,
    email: user.email,
    billing,
    redirectUrl: `${origin}/dashboard?upgraded=1`,
  });

  if (!result.ok) {
    // not_configured → 501(준비 중), api_error → 502(결제사 오류).
    const status = result.reason === "not_configured" ? 501 : 502;
    return NextResponse.json({ error: result.reason }, { status });
  }
  return NextResponse.json({ url: result.url });
}
