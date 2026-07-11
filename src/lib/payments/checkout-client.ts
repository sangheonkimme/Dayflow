"use client";
// 클라 측 체크아웃 시작. UpgradeSheet(모바일)·Account(설정)에서 공용으로 호출.
// 성공 시 결제사 hosted checkout URL 반환 → 호출부가 redirect.
import type { CheckoutBilling } from "./types";

export type StartCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; reason: string };

export async function startCheckout(
  billing: CheckoutBilling,
): Promise<StartCheckoutResult> {
  let res: Response;
  try {
    res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billing }),
    });
  } catch {
    return { ok: false, status: 0, reason: "network" };
  }

  if (!res.ok) {
    const reason = await res
      .json()
      .then((j) => (j as { error?: string }).error)
      .catch(() => undefined);
    return { ok: false, status: res.status, reason: reason ?? "error" };
  }

  const json = (await res.json()) as { url?: string };
  if (!json.url) return { ok: false, status: res.status, reason: "no_url" };
  return { ok: true, url: json.url };
}
