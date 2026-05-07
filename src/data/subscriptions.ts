// ============================================================
// Subscriptions — seeds + selectors + hook
// ============================================================

import { useMemo } from "react";
import type { Subscription, SubStatus } from "@/types";
import { SUBS_CATEGORIES } from "@/lib/categories";
import { getDataSource } from "@/data/source";
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from "@/data/useRepositoryQuery";

export interface SubscriptionUsage {
  /** Subscription.id */
  subscriptionId: number | string;
  /** Display string ("2025.08.12 (90일 전)" etc.) */
  lastUsed: string;
  /** 5 most recent months, oldest → newest */
  monthlyMinutes: number[];
  avgPerWeek: number;
  /** Names of overlapping subscriptions */
  overlap: string[];
}

export const SUBSCRIPTION_SEEDS: Subscription[] = [
  {
    id: 1,
    name: "Netflix",
    cat: "엔터테인먼트",
    price: 17000,
    cycle: "월",
    day: 7,
    color: "#e25c4d",
    initial: "N",
    status: "active",
    started: "2023.05",
  },
  {
    id: 2,
    name: "Spotify",
    cat: "음악",
    price: 13900,
    cycle: "월",
    day: 12,
    color: "#4a8d5a",
    initial: "S",
    status: "active",
    started: "2022.11",
  },
  {
    id: 3,
    name: "Adobe CC",
    cat: "업무 도구",
    price: 24000,
    cycle: "월",
    day: 15,
    color: "#ee5a3d",
    initial: "Ai",
    status: "active",
    started: "2024.01",
  },
  {
    id: 4,
    name: "Figma Pro",
    cat: "업무 도구",
    price: 18500,
    cycle: "월",
    day: 21,
    color: "#a259ff",
    initial: "F",
    status: "active",
    started: "2023.09",
  },
  {
    id: 5,
    name: "iCloud+ 200GB",
    cat: "클라우드",
    price: 3300,
    cycle: "월",
    day: 3,
    color: "#3a8dde",
    initial: "iC",
    status: "active",
    started: "2021.04",
  },
  {
    id: 6,
    name: "쿠팡 와우",
    cat: "쇼핑",
    price: 7890,
    cycle: "월",
    day: 8,
    color: "#e8c84a",
    initial: "쿠",
    status: "active",
    started: "2022.06",
  },
  {
    id: 7,
    name: "왓챠",
    cat: "엔터테인먼트",
    price: 12900,
    cycle: "월",
    day: 18,
    color: "#e89aac",
    initial: "W",
    status: "paused",
    started: "2024.06",
  },
  {
    id: 8,
    name: "ChatGPT Plus",
    cat: "업무 도구",
    price: 28000,
    cycle: "월",
    day: 25,
    color: "#1a1a1a",
    initial: "G",
    status: "active",
    started: "2024.03",
  },
  {
    id: 9,
    name: "노션 패밀리",
    cat: "업무 도구",
    price: 12000,
    cycle: "월",
    day: 6,
    color: "#000000",
    initial: "N",
    status: "active",
    started: "2023.02",
  },
  {
    id: 10,
    name: "교보문고 sam",
    cat: "독서",
    price: 9900,
    cycle: "월",
    day: 14,
    color: "#2c5e8b",
    initial: "사",
    status: "active",
    started: "2024.07",
  },
  {
    id: 11,
    name: "헬스장",
    cat: "건강",
    price: 89000,
    cycle: "월",
    day: 1,
    color: "#a8d09b",
    initial: "헬",
    status: "active",
    started: "2025.04",
  },
  {
    id: 12,
    name: "도메인 갱신",
    cat: "기타",
    price: 22000,
    cycle: "년",
    day: 4,
    color: "#c9bd9f",
    initial: "D",
    status: "active",
    started: "2020.04",
  },
];

export const SUBSCRIPTION_USAGE_SEEDS: SubscriptionUsage[] = [
  {
    subscriptionId: 7,
    lastUsed: "2025.08.12 (90일 전)",
    monthlyMinutes: [240, 180, 60, 0, 0],
    avgPerWeek: 0,
    overlap: ["Netflix"],
  },
  {
    subscriptionId: 3,
    lastUsed: "2025.11.04 (어제)",
    monthlyMinutes: [1820, 1640, 1500, 980, 760],
    avgPerWeek: 12,
    overlap: ["Figma Pro"],
  },
  {
    subscriptionId: 4,
    lastUsed: "2025.11.05 (오늘)",
    monthlyMinutes: [2200, 2400, 2600, 2800, 3000],
    avgPerWeek: 28,
    overlap: ["Adobe CC"],
  },
];

// ─────────────────────────────────────────────
// Derived display selectors
// ─────────────────────────────────────────────
const SUBS_COLOR_BY_CAT: Record<string, string> = Object.fromEntries(
  SUBS_CATEGORIES.map((c) => [c.id, c.color]),
);

export function subscriptionColor(
  sub: Pick<Subscription, "color" | "cat">,
): string {
  if (sub.color) return sub.color;
  if (sub.cat && SUBS_COLOR_BY_CAT[sub.cat]) return SUBS_COLOR_BY_CAT[sub.cat];
  return "var(--ink-soft)";
}

export function subscriptionInitial(
  sub: Pick<Subscription, "initial" | "name">,
): string {
  if (sub.initial) return sub.initial;
  return (sub.name?.[0] ?? "?").toUpperCase();
}

export function formatNextBilling(
  sub: Pick<Subscription, "next" | "day">,
  ref: Date = new Date(),
): string {
  if (sub.next) return sub.next;
  if (typeof sub.day === "number") {
    const month = ref.getMonth() + 1;
    return `${String(month).padStart(2, "0")}.${String(sub.day).padStart(2, "0")}`;
  }
  return "—";
}

export function formatStarted(sub: Pick<Subscription, "started">): string {
  return sub.started ?? "—";
}

// ─────────────────────────────────────────────
// Pure aggregation selectors
// ─────────────────────────────────────────────
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
  annualSavings: number;
  overlapWith: Subscription[];
  usage?: SubscriptionUsage;
}

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

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export interface SubscriptionsView extends RepositoryQueryView<Subscription> {
  all: readonly Subscription[];
  /** Static-for-now; supabase swap point. */
  usage: readonly SubscriptionUsage[];
}

export function useSubscriptions(status?: SubStatus): SubscriptionsView {
  const view = useRepositoryQuery(getDataSource().subscriptions, {
    queryKey: ["subscriptions"],
  });
  const { data: all } = view;
  const data = useMemo(() => {
    if (!status) return all;
    return all.filter((s) => s.status === status);
  }, [all, status]);
  return useMemo(
    () => ({ ...view, data, all, usage: SUBSCRIPTION_USAGE_SEEDS }),
    [view, data, all],
  );
}
