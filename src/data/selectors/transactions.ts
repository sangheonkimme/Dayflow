// ============================================================
// Pure transaction selectors
// ============================================================
//
// 모든 함수는 순수해야 한다 — react import 금지. UI hook은 useMemo로 호출만 한다.

import type { Txn } from "@/types";
import { MONTHS } from "@/lib/date";

const MAN = 10_000; // 만원 단위 (chart axis)

export interface MonthlyTotals {
  /** 만원 단위 수입 (차트 표시용) */
  in: number[];
  /** 만원 단위 지출 */
  out: number[];
  /** 차트 axis 라벨 ("1월", ..., "11월") */
  months: string[];
}

/** Last 11 months (current month last) — values in 만원. */
export function monthlyTotals(txns: readonly Txn[]): MonthlyTotals {
  const now = new Date();
  const buckets: { in: number; out: number; key: string; label: string }[] = [];
  for (let i = 10; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      in: 0,
      out: 0,
      key,
      label: MONTHS[d.getMonth()] ?? String(d.getMonth() + 1),
    });
  }
  for (const t of txns) {
    const key = t.date.slice(0, 7);
    const b = buckets.find((x) => x.key === key);
    if (!b) continue;
    if (t.type === "in") b.in += t.amount;
    else b.out += Math.abs(t.amount);
  }
  return {
    in: buckets.map((b) => Math.round(b.in / MAN)),
    out: buckets.map((b) => Math.round(b.out / MAN)),
    months: buckets.map((b) => b.label),
  };
}

export interface MonthSummary {
  income: number;
  expense: number;
  net: number;
  /** 월 키 ("2026-05") */
  key: string;
}

/** Current calendar-month income, expense, net (in 원). */
export function currentMonthSummary(txns: readonly Txn[]): MonthSummary {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let income = 0;
  let expense = 0;
  for (const t of txns) {
    if (!t.date.startsWith(key)) continue;
    if (t.type === "in") income += t.amount;
    else expense += Math.abs(t.amount);
  }
  return { income, expense, net: income - expense, key };
}

export interface CategoryShare {
  cat: string;
  amount: number;
  pct: number;
}

/** Group by category for either income or expense — current month only. */
export function categoryShare(
  txns: readonly Txn[],
  kind: "income" | "expense" = "expense",
): CategoryShare[] {
  const wantType = kind === "income" ? "in" : "out";
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const byCat: Record<string, number> = {};
  let total = 0;
  for (const t of txns) {
    if (t.type !== wantType) continue;
    if (!t.date.startsWith(key)) continue;
    const c = t.cat || "기타";
    const amt = Math.abs(t.amount);
    byCat[c] = (byCat[c] ?? 0) + amt;
    total += amt;
  }
  return Object.entries(byCat)
    .map(([cat, amount]) => ({
      cat,
      amount,
      pct: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/** Top N most recent (by date desc, time desc). */
export function recent(txns: readonly Txn[], limit = 4): Txn[] {
  return [...txns]
    .sort((a, b) => {
      const d = b.date.localeCompare(a.date);
      if (d !== 0) return d;
      return (b.time ?? "").localeCompare(a.time ?? "");
    })
    .slice(0, limit);
}

/** Map keyed by YYYY-MM-DD → that day's transactions (date desc). */
export function groupByDay(txns: readonly Txn[]): Map<string, Txn[]> {
  const map = new Map<string, Txn[]>();
  for (const t of txns) {
    const arr = map.get(t.date);
    if (arr) arr.push(t);
    else map.set(t.date, [t]);
  }
  // sort entries by date desc by reconstructing
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}
