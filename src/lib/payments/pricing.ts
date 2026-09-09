// ============================================================
// Pro 플랜 가격 — 단일 소스 오브 트루스
// ============================================================
//
// 표시 가격이 Account(설정) · UpgradeSheet(모바일) · docs/monetization-plan.md
// 세 곳에 하드코딩돼 있어 드리프트 위험이 있었다. 여기 한 곳만 고치면
// 모든 표시가 따라오도록 통합한다.
//
// ⚠️ 여기 값은 **표시용**이다. 실제 청구 금액은 결제사(LemonSqueezy variant)
//    설정이 결정한다. variant 가격을 바꿨다면 여기도 같이 갱신할 것.

import type { CheckoutBilling } from "./types";

export const CURRENCY = "KRW" as const;
export const CURRENCY_SYMBOL = "₩";

/** 무료 체험 기간(일). 0 이면 체험 없음. */
export const TRIAL_DAYS = 3;

/** 주기별 청구 금액(원). */
export const PRO_PRICE: Record<CheckoutBilling, number> = {
  month: 3900,
  year: 39000,
};

/** 주기 라벨. "월간" / "연간". */
export const BILLING_LABEL: Record<CheckoutBilling, string> = {
  month: "월간",
  year: "연간",
};

/** 주기 단위. "월" / "년". */
export const BILLING_UNIT: Record<CheckoutBilling, string> = {
  month: "월",
  year: "년",
};

/** 12345 → "₩12,345" */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("ko-KR")}`;
}

/** "₩3,900" — 금액만. */
export function priceLabel(billing: CheckoutBilling): string {
  return formatPrice(PRO_PRICE[billing]);
}

/** "₩3,900 / 월" — 주기까지 붙인 표기. */
export function pricePerPeriodLabel(billing: CheckoutBilling): string {
  return `${priceLabel(billing)} / ${BILLING_UNIT[billing]}`;
}

/** "₩39,000/년" — 버튼처럼 좁은 자리에 쓰는 압축 표기. */
export function priceCompactLabel(billing: CheckoutBilling): string {
  return `${priceLabel(billing)}/${BILLING_UNIT[billing]}`;
}

/** 연간 결제 시 월 환산 금액(원). 39,000 / 12 = 3,250. */
export const YEARLY_MONTHLY_EQUIVALENT = Math.round(PRO_PRICE.year / 12);

/** 연간 결제 할인율(%). 월간 12개월 대비. 3,900×12=46,800 → 39,000 은 17%. */
export const YEARLY_DISCOUNT_PERCENT = Math.round(
  (1 - PRO_PRICE.year / (PRO_PRICE.month * 12)) * 100,
);

/** "월 ₩3,250 · 17% 할인" — 연간 플랜 카드의 보조 문구. */
export function yearlySavingsLabel(): string {
  return `월 ${formatPrice(YEARLY_MONTHLY_EQUIVALENT)} · ${YEARLY_DISCOUNT_PERCENT}% 할인`;
}

/** "매월 결제" / "매년 결제" — 플랜 카드 보조 문구. */
export function billingCadenceLabel(billing: CheckoutBilling): string {
  return billing === "year" ? "매년 결제" : "매월 결제";
}
