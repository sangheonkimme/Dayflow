// ============================================================
// Pinned info — types + seeds + hook
// ============================================================

import { getDataSource } from "@/data/source";
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from "@/data/useRepositoryQuery";

// ─────────────────────────────────────────────
// Types (matches supabase-plan: pinned_info)
// ─────────────────────────────────────────────
export interface PinnedInfo {
  id: number | string;
  label: string;
  value: string;
  /** wifi / account / password / etc */
  category?: string;
  isSecret?: boolean;
  position?: number;
}

// ─────────────────────────────────────────────
// Seeds
// ─────────────────────────────────────────────
export const PINNED_INFO_SEEDS: PinnedInfo[] = [
  { id: 1, label: "사무실 wifi", value: "WL_office / coffee2024" },
  { id: 2, label: "회사 계좌", value: "신한 110-***-****" },
  { id: 3, label: "택배함 비번", value: "#1204" },
  { id: 4, label: "주차 자리", value: "B2 — 47번" },
];

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function usePinnedInfo(): RepositoryQueryView<PinnedInfo> {
  return useRepositoryQuery(getDataSource().pinnedInfo, {
    queryKey: ["pinnedInfo"],
  });
}
