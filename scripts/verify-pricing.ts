// ============================================================
// verify-pricing — 표시가(pricing.ts) vs 실청구액(LemonSqueezy) 대조
// ============================================================
//
// 왜 필요한가: src/lib/payments/pricing.ts 는 **표시용 단일 소스**일 뿐이고,
// 실제로 청구되는 금액은 LemonSqueezy variant 설정이 결정한다. 둘이 어긋나면
// "₩3,900 이라 적어놓고 ₩39,000 을 긁는" 결제 사고가 된다. 코드로는 잡히지
// 않는 종류의 드리프트라, 사람이 돌려서 확인할 수 있는 대조 장치를 둔다.
//
// ## 실행
//
//   pnpm verify:pricing
//
// .env 의 LEMONSQUEEZY_* 를 읽어 LemonSqueezy API 를 조회한다.
// **읽기 전용** — 아무것도 생성/변경하지 않고, 결제 시나리오를 트리거하지 않는다.
//
// ## 자동 실행하지 않는 이유
//
// pnpm verify(typecheck+lint+build) 에 넣지 않았다. 매 빌드마다 외부 API 를
// 때리면 LS 장애가 곧 우리 빌드 장애가 되고, 결제 API 키를 빌드 환경에 흘려야
// 한다. 가격을 바꿨을 때 · 배포 전에 사람이 한 번 돌리는 용도.
//
// ## 종료 코드
//
//   0  전부 일치
//   1  불일치 발견 (= 사고 위험. 고치기 전엔 배포 금지)
//   2  대조 자체를 못 함 (env 미설정 / API 오류)

import {
  BILLING_LABEL,
  CURRENCY,
  PRO_PRICE,
  TRIAL_DAYS,
  formatPrice,
} from "../src/lib/payments/pricing";
import type { CheckoutBilling } from "../src/lib/payments/types";

const API = "https://api.lemonsqueezy.com/v1";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[90m";
const RESET = "\x1b[0m";

/**
 * 소수점 없는 통화. LS 는 금액을 "cents" 정수로 주는데 이 통화들은 최소 단위가
 * 곧 1 이라 100 으로 나누면 안 된다(Stripe 계열 공통 규약).
 * ⚠️ 출력에 raw unit_price 를 항상 같이 찍으므로, 환산이 이상하면 눈으로 잡힌다.
 */
const ZERO_DECIMAL = new Set(["KRW", "JPY", "VND", "CLP"]);

/** billing 별 variant env. lemonsqueezy.ts 의 variantFor() 와 같은 규칙. */
const VARIANT_ENV: Record<CheckoutBilling, string> = {
  month: "LEMONSQUEEZY_VARIANT_ID",
  year: "LEMONSQUEEZY_VARIANT_ID_YEARLY",
};

/** billing 이 기대하는 LS 갱신 주기 단위. */
const EXPECTED_INTERVAL: Record<CheckoutBilling, string> = {
  month: "month",
  year: "year",
};

interface LsResource<A> {
  id?: string;
  attributes?: A;
}

interface VariantAttrs {
  name?: string;
  status?: string;
}

interface PriceAttrs {
  category?: string;
  unit_price?: number;
  unit_price_decimal?: string | null;
  renewal_interval_unit?: string | null;
  renewal_interval_quantity?: number | null;
  trial_interval_unit?: string | null;
  trial_interval_quantity?: number | null;
}

interface StoreAttrs {
  name?: string;
  currency?: string;
}

let failures = 0;

function pass(line: string): void {
  console.log(`  ${GREEN}OK${RESET}   ${line}`);
}

function fail(line: string): void {
  failures += 1;
  console.log(`  ${RED}FAIL${RESET} ${line}`);
}

function note(line: string): void {
  console.log(`  ${DIM}·    ${line}${RESET}`);
}

function bail(message: string): never {
  console.error(`\n${RED}대조 불가${RESET} — ${message}\n`);
  process.exit(2);
}

async function lsGet<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) bail(`GET ${path} → ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/** LS 의 정수 cents → 표시 금액. */
function toDisplayAmount(unitPrice: number, currency: string): number {
  return ZERO_DECIMAL.has(currency) ? unitPrice : unitPrice / 100;
}

/** variant 의 **현재** 가격. /v1/prices 는 created_at desc 라 첫 항목이 최신. */
async function currentPrice(
  variantId: string,
  apiKey: string,
): Promise<PriceAttrs | null> {
  const body = await lsGet<{ data?: LsResource<PriceAttrs>[] }>(
    `/prices?filter[variant_id]=${encodeURIComponent(variantId)}`,
    apiKey,
  );
  return body.data?.[0]?.attributes ?? null;
}

async function checkBilling(
  billing: CheckoutBilling,
  apiKey: string,
  currency: string,
): Promise<void> {
  const envName = VARIANT_ENV[billing];
  const variantId = process.env[envName];

  console.log(`\n[${BILLING_LABEL[billing]}] ${envName}`);

  if (!variantId) {
    // 미설정은 "틀렸다" 가 아니라 "아직 안 붙였다". 사고는 아니지만 표시가는
    // 이미 노출되고 있으므로 눈에 띄게 남긴다.
    fail(
      `${envName} 미설정 — ${formatPrice(PRO_PRICE[billing])} 를 표시 중인데 대조 대상이 없다`,
    );
    return;
  }

  const variant = await lsGet<{ data?: LsResource<VariantAttrs> }>(
    `/variants/${encodeURIComponent(variantId)}`,
    apiKey,
  );
  const variantAttrs = variant.data?.attributes;
  note(`variant #${variantId} "${variantAttrs?.name ?? "?"}"`);

  if (variantAttrs?.status === "published") {
    pass("variant published");
  } else {
    fail(
      `variant status=${variantAttrs?.status ?? "?"} — published 가 아니면 체크아웃이 열리지 않는다`,
    );
  }

  const price = await currentPrice(variantId, apiKey);
  if (!price) {
    fail(`variant #${variantId} 에 price 가 없다`);
    return;
  }

  // 1) 금액
  const expected = PRO_PRICE[billing];
  if (typeof price.unit_price === "number") {
    const actual = toDisplayAmount(price.unit_price, currency);
    const detail = `표시 ${formatPrice(expected)} / 실청구 ${formatPrice(actual)} (unit_price=${price.unit_price})`;
    if (actual === expected) pass(`금액 일치 — ${detail}`);
    else fail(`금액 불일치 — ${detail}`);
  } else {
    fail(`unit_price 를 읽을 수 없다 (${JSON.stringify(price.unit_price)})`);
  }

  if (price.unit_price_decimal) {
    // 소수점 단가는 우리 표시 모델(정수 원)이 표현할 수 없다.
    fail(
      `unit_price_decimal=${price.unit_price_decimal} — pricing.ts 는 정수 금액만 표현한다`,
    );
  }

  // 2) 구독인지, 주기가 맞는지
  if (price.category === "subscription") {
    const unit = price.renewal_interval_unit;
    const qty = price.renewal_interval_quantity;
    const want = EXPECTED_INTERVAL[billing];
    if (unit === want && qty === 1) pass(`갱신 주기 일치 — ${qty} ${unit}`);
    else
      fail(
        `갱신 주기 불일치 — 기대 1 ${want}, 실제 ${qty ?? "?"} ${unit ?? "?"}`,
      );
  } else {
    fail(`category=${price.category ?? "?"} — 구독이 아니다`);
  }

  // 3) 무료 체험
  const trialUnit = price.trial_interval_unit;
  const trialQty = price.trial_interval_quantity ?? 0;
  const trialDays = trialUnit === "day" ? trialQty : null;
  if (TRIAL_DAYS === 0) {
    if (trialQty === 0) pass("체험 없음 — 표시와 일치");
    else
      fail(
        `LS 에 체험 ${trialQty} ${trialUnit} 가 걸려 있는데 표시는 "체험 없음"`,
      );
  } else if (trialDays === TRIAL_DAYS) {
    pass(`무료 체험 일치 — ${TRIAL_DAYS}일`);
  } else {
    fail(
      `무료 체험 불일치 — 표시 ${TRIAL_DAYS}일 / 실제 ${trialQty} ${trialUnit ?? "(없음)"}`,
    );
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!apiKey) bail("LEMONSQUEEZY_API_KEY 가 없다. .env 를 확인할 것.");
  if (!storeId) bail("LEMONSQUEEZY_STORE_ID 가 없다. .env 를 확인할 것.");

  console.log("표시가(pricing.ts) <-> 실청구액(LemonSqueezy) 대조");

  const store = await lsGet<{ data?: LsResource<StoreAttrs> }>(
    `/stores/${encodeURIComponent(storeId)}`,
    apiKey,
  );
  const storeAttrs = store.data?.attributes;
  const currency = storeAttrs?.currency ?? "";

  console.log(`\n[스토어] #${storeId} "${storeAttrs?.name ?? "?"}"`);
  if (currency === CURRENCY) {
    pass(`통화 일치 — ${currency}`);
  } else {
    // 통화가 다르면 아래 금액 비교는 애초에 의미가 없다. 가장 큰 사고.
    fail(`통화 불일치 — 표시 ${CURRENCY} / 스토어 ${currency || "?"}`);
  }

  for (const billing of Object.keys(VARIANT_ENV) as CheckoutBilling[]) {
    await checkBilling(billing, apiKey, currency);
  }

  if (failures > 0) {
    console.log(
      `\n${RED}불일치 ${failures}건.${RESET} pricing.ts 또는 LS variant 설정을 맞추기 전엔 배포하지 말 것.\n`,
    );
    process.exit(1);
  }
  console.log(`\n${GREEN}전부 일치.${RESET}\n`);
}

main().catch((err: unknown) => {
  bail(err instanceof Error ? err.message : String(err));
});
