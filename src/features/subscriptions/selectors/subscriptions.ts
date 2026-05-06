// ============================================================
// Pure subscription selectors
// ============================================================

import type { Subscription } from "@/types";
import type { SubscriptionUsage } from "@/features/subscriptions/seeds";

/** Active subscriptions monthly cost (월 cycle only). */
export function monthlyTotal(subs: readonly Subscription[]): number {
  let total = 0;
  for (const s of subs) {
    if (s.status !== "active") continue;
    if (s.cycle === "월") total += s.price;
  }
  return total;
}

export interface CategoryBucket {
  cat: string;
  total: number;
  count: number;
}

/** Group active subs by category (monthly equivalent total). */
export function byCategory(subs: readonly Subscription[]): CategoryBucket[] {
  const map = new Map<string, CategoryBucket>();
  for (const s of subs) {
    if (s.status !== "active") continue;
    const monthly = s.cycle === "월" ? s.price : Math.round(s.price / 12);
    const b = map.get(s.cat) ?? { cat: s.cat, total: 0, count: 0 };
    b.total += monthly;
    b.count += 1;
    map.set(s.cat, b);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export interface SavingsTip {
  /** 'cancel' (해지 추천) | 'overlap' (중복 정리) */
  kind: "cancel" | "overlap";
  sub: Subscription;
  /** 연 절약 예상액 */
  annualSavings: number;
  /** 중복 후보 (overlap kind일 때) */
  overlapWith: Subscription[];
  /** 사용량 데이터 — 없을 수 있음 */
  usage?: SubscriptionUsage;
}

/** Port of subs.tsx SaveTipModal core computation. */
export function savingsTipFor(
  sub: Subscription,
  usage: SubscriptionUsage | undefined,
  allSubs: readonly Subscription[],
  kind: "cancel" | "overlap" = "cancel",
): SavingsTip {
  const annualSavings = sub.cycle === "월" ? sub.price * 12 : sub.price;
  const overlapWith = (usage?.overlap ?? [])
    .map((name) => allSubs.find((s) => s.name === name))
    .filter((s): s is Subscription => Boolean(s));
  return { kind, sub, annualSavings, overlapWith, usage };
}

/** Subscriptions billing within `days` from `fromDate` (월 cycle). */
export function upcomingBilling(
  subs: readonly Subscription[],
  fromDate: Date,
  days = 14,
): Subscription[] {
  const todayDate = fromDate.getDate();
  const horizon = todayDate + days;
  return subs
    .filter((s) => s.status === "active" && s.cycle === "월" && s.day != null)
    .map((s) => ({ s, d: s.day! >= todayDate ? s.day! : s.day! + 31 }))
    .filter((x) => x.d <= horizon)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.s);
}
