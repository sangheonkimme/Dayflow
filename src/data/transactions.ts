// ============================================================
// Transactions — seeds + selectors + hook
// ============================================================

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Txn, TxnType } from "@/types";
import { MONTHS } from "@/lib/date";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";
import { getDataSource } from "@/data/source";
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from "@/data/useRepositoryQuery";

// ─────────────────────────────────────────────
// Seeds — 12개월 합성 데이터 (2025-06 ~ 2026-05)
// ─────────────────────────────────────────────
let _id = 0;
const nextId = () => `seed-${++_id}`;

const out = (
  date: string,
  time: string,
  label: string,
  amount: number,
  cat: string,
  pay = "신한카드",
  note = "",
): Txn => ({
  id: nextId(),
  date,
  time,
  label,
  note,
  amount: -Math.abs(amount),
  type: "out",
  cat,
  pay,
});

const inn = (
  date: string,
  time: string,
  label: string,
  amount: number,
  cat: string,
  pay = "신한 입금",
  note = "",
  payday = false,
): Txn => ({
  id: nextId(),
  date,
  time,
  label,
  note,
  amount: Math.abs(amount),
  type: "in",
  cat,
  pay,
  ...(payday ? { payday: true } : {}),
});

const months: Array<[number, number]> = [
  [2025, 6],
  [2025, 7],
  [2025, 8],
  [2025, 9],
  [2025, 10],
  [2025, 11],
  [2025, 12],
  [2026, 1],
  [2026, 2],
  [2026, 3],
  [2026, 4],
  [2026, 5],
];

const ymd = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const seeds: Txn[] = [];

for (const [y, m] of months) {
  // 매월 고정
  seeds.push(
    inn(
      ymd(y, m, 25),
      "09:00",
      "월급 입금",
      3650000,
      "급여",
      "신한 입금",
      "(주)디자인하우스",
      true,
    ),
  );
  seeds.push(
    out(ymd(y, m, 1), "10:00", "월세", 850000, "주거", "자동이체", `${m}월분`),
  );
  seeds.push(
    out(ymd(y, m, 1), "08:00", "헬스장", 89000, "건강", "자동이체", "월 정기"),
  );
  seeds.push(
    out(
      ymd(y, m, 5),
      "09:00",
      "넷플릭스",
      17000,
      "구독",
      "신한카드",
      "프리미엄",
    ),
  );
  seeds.push(
    out(ymd(y, m, 7), "10:00", "ChatGPT Plus", 28000, "구독", "현대카드", ""),
  );
  seeds.push(
    out(ymd(y, m, 12), "10:00", "스포티파이", 11000, "구독", "신한카드", ""),
  );

  // 식비/외식
  const day = (d: number) => ymd(y, m, Math.min(d, 28));
  seeds.push(out(day(3), "12:30", "GS25", 4800, "식비", "현대카드", "간식"));
  seeds.push(out(day(4), "13:00", "김밥천국", 8500, "식비", "현금", "점심"));
  seeds.push(
    out(day(8), "14:32", "스타벅스", 6300, "식비", "신한카드", "카페"),
  );
  seeds.push(
    out(
      day(10),
      "20:00",
      "한식주점 도담",
      42000,
      "외식",
      "신한카드",
      "팀 회식",
    ),
  );
  seeds.push(
    out(day(11), "12:10", "이마트", 78400, "식비", "현대카드", "주말 장보기"),
  );
  seeds.push(out(day(15), "13:20", "버거킹", 12500, "식비", "현대카드", ""));
  seeds.push(out(day(18), "19:30", "피자스쿨", 18900, "외식", "신한카드", ""));
  seeds.push(
    out(day(20), "08:30", "스타벅스", 4900, "식비", "신한카드", "아메리카노"),
  );
  seeds.push(
    out(day(22), "12:00", "쿠우쿠우", 16800, "외식", "현대카드", "점심"),
  );

  // 교통
  seeds.push(
    out(day(2), "08:00", "지하철", 50000, "교통", "신한카드", "교통카드 충전"),
  );
  seeds.push(
    out(day(14), "23:14", "택시", 18400, "교통", "신한카드", "심야할증"),
  );

  // 쇼핑
  seeds.push(
    out(day(6), "18:22", "올리브영", 56700, "쇼핑", "신한카드", "스킨케어"),
  );
  seeds.push(
    out(day(13), "12:00", "무신사", 64000, "쇼핑", "현대카드", "셔츠"),
  );
  seeds.push(
    out(day(16), "21:08", "쿠팡", 34500, "쇼핑", "신한카드", "생필품"),
  );

  // 여가/도서
  seeds.push(out(day(19), "20:00", "CGV", 28000, "여가", "현대카드", "영화"));
  seeds.push(
    out(day(24), "19:18", "교보문고", 32400, "도서", "신한카드", "책 2권"),
  );

  if (m % 3 === 0) {
    seeds.push(
      inn(
        day(15),
        "15:32",
        "프리랜서 수익",
        450000,
        "부수입",
        "토스 입금",
        "디자인 프로젝트",
      ),
    );
  }
}

// 이번 달 최근 1주일 — 디테일하게
seeds.push(
  out(
    "2026-05-07",
    "08:30",
    "스타벅스 강남R점",
    5900,
    "식비",
    "신한카드",
    "아침",
  ),
);
seeds.push(
  out("2026-05-07", "12:40", "샐러디", 11500, "식비", "현대카드", "점심"),
);
seeds.push(
  out(
    "2026-05-06",
    "14:32",
    "스타벅스",
    12300,
    "식비",
    "신한카드",
    "팀원과 1:1",
  ),
);
seeds.push(
  out("2026-05-06", "21:20", "배달의민족", 23800, "외식", "현대카드", "저녁"),
);
seeds.push(
  out(
    "2026-05-05",
    "11:00",
    "이마트",
    62400,
    "식비",
    "현대카드",
    "주말 장보기",
  ),
);
seeds.push(
  out("2026-05-04", "18:00", "올리브영", 38900, "쇼핑", "신한카드", ""),
);
seeds.push(out("2026-05-03", "13:50", "김밥천국", 8500, "식비", "현금", ""));
seeds.push(
  inn(
    "2026-05-02",
    "14:00",
    "환불 — 무신사",
    32000,
    "환불",
    "신한 입금",
    "사이즈 교환",
  ),
);

export const TRANSACTION_SEEDS: Txn[] = seeds;

// ─────────────────────────────────────────────
// Derived display selectors
// ─────────────────────────────────────────────
const ICON_BY_CAT: Record<string, string> = {
  식비: "wallet",
  외식: "wallet",
  주거: "home",
  교통: "zap",
  쇼핑: "wallet",
  여가: "sparkle",
  구독: "repeat",
  건강: "repeat",
  도서: "wallet",
  급여: "cash",
  부수입: "sparkle",
  환불: "repeat",
  기타: "cash",
};

const ICON_BY_LABEL: Array<{ test: RegExp; icon: string }> = [
  { test: /스타벅스|커피|카페/i, icon: "coffee" },
  { test: /택시|지하철|버스/i, icon: "zap" },
  { test: /월세|관리비|전기|가스|수도/i, icon: "home" },
  { test: /월급|급여|입금/i, icon: "cash" },
  { test: /넷플릭스|스포티파이|노션|chatgpt|구독/i, icon: "repeat" },
  { test: /CGV|영화|콘서트/i, icon: "sparkle" },
];

export function inferIcon(txn: Pick<Txn, "icon" | "cat" | "label">): string {
  if (txn.icon) return txn.icon;
  for (const r of ICON_BY_LABEL)
    if (txn.label && r.test.test(txn.label)) return r.icon;
  if (txn.cat && ICON_BY_CAT[txn.cat]) return ICON_BY_CAT[txn.cat];
  return "wallet";
}

export function inferPayday(
  txn: Pick<Txn, "payday" | "type" | "label" | "cat">,
): boolean {
  if (typeof txn.payday === "boolean") return txn.payday;
  if (txn.type !== "in") return false;
  return /월급|급여/.test(txn.label ?? "") || txn.cat === "급여";
}

void TRANSACTION_CATEGORIES; // 향후 카테고리 색상 derive 용도 reserve

// ─────────────────────────────────────────────
// Pure aggregation selectors
// ─────────────────────────────────────────────
const MAN = 10_000;

export interface MonthlyTotals {
  in: number[];
  out: number[];
  months: string[];
}

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
  key: string;
}

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

export function recent(txns: readonly Txn[], limit = 4): Txn[] {
  return [...txns]
    .sort((a, b) => {
      const d = b.date.localeCompare(a.date);
      if (d !== 0) return d;
      return (b.time ?? "").localeCompare(a.time ?? "");
    })
    .slice(0, limit);
}

export function groupByDay(txns: readonly Txn[]): Map<string, Txn[]> {
  const map = new Map<string, Txn[]>();
  for (const t of txns) {
    const arr = map.get(t.date);
    if (arr) arr.push(t);
    else map.set(t.date, [t]);
  }
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
const QUERY_KEY = ["transactions"] as const;

export interface TransactionsFilter {
  /** "YYYY-MM" prefix */
  month?: string;
  type?: TxnType;
  cat?: string;
}

export interface TransactionsView extends Omit<
  RepositoryQueryView<Txn>,
  "data"
> {
  data: readonly Txn[];
  all: readonly Txn[];
}

export function useTransactions(filter?: TransactionsFilter): TransactionsView {
  const qc = useQueryClient();
  const repo = getDataSource().transactions;
  const view = useRepositoryQuery(repo, {
    queryKey: QUERY_KEY,
    upsertOptions: {
      onMutate: async (input) => {
        if (!input.id) return undefined;
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        const existing = prev.find((t) => t.id === input.id);
        if (existing) repo.store.upsert({ ...existing, ...input } as Txn);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        const prev = (ctx as { prev?: readonly Txn[] } | undefined)?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
    removeOptions: {
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        repo.store.remove(id);
        return { prev };
      },
      onError: (_err, _id, ctx) => {
        const prev = (ctx as { prev?: readonly Txn[] } | undefined)?.prev;
        if (prev) repo.store.setAll(Array.from(prev));
      },
    },
  });
  const { data: all } = view;

  const data = useMemo(() => {
    if (!filter) return all;
    return all.filter((t) => {
      if (filter.month && !t.date.startsWith(filter.month)) return false;
      if (filter.type && t.type !== filter.type) return false;
      if (filter.cat && t.cat !== filter.cat) return false;
      return true;
    });
  }, [all, filter?.month, filter?.type, filter?.cat]);

  return useMemo(() => ({ ...view, data, all }), [view, data, all]);
}

