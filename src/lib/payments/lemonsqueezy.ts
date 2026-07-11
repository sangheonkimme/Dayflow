import "server-only";
// LemonSqueezy 체크아웃 세션 생성. 서버 전용(API 키 비공개).
// custom.user_id 로 Supabase user id 를 실어보내면, 결제 완료 webhook 의
// meta.custom_data.user_id 로 회수해 plan 을 갱신한다(plan-sync).
import type { CheckoutBilling } from "./types";

export type CreateCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not_configured" | "api_error" };

// 월/년 variant. 연간 전용 env 가 없으면 기본 variant 로 폴백.
function variantFor(billing: CheckoutBilling): string | undefined {
  const monthly = process.env.LEMONSQUEEZY_VARIANT_ID;
  const yearly = process.env.LEMONSQUEEZY_VARIANT_ID_YEARLY;
  return billing === "year" ? yearly || monthly : monthly;
}

export async function createLemonSqueezyCheckout(opts: {
  userId: string;
  email?: string;
  billing: CheckoutBilling;
  redirectUrl: string;
}): Promise<CreateCheckoutResult> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = variantFor(opts.billing);
  if (!apiKey || !storeId || !variantId) {
    return { ok: false, reason: "not_configured" };
  }

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: opts.email,
            // LS custom 값은 문자열로 전달 → webhook 에서 문자열로 회수.
            custom: { user_id: opts.userId },
          },
          product_options: { redirect_url: opts.redirectUrl },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!res.ok) return { ok: false, reason: "api_error" };

  const json = (await res.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url;
  if (typeof url !== "string") return { ok: false, reason: "api_error" };
  return { ok: true, url };
}
