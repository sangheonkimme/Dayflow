"use client";
// useUserPlan — 클라 측 사용자 플랜 조회 훅 (React Query only, Zustand 캐시 없음).
// RSC fetcher(src/server/plan.ts)와 동일 query key·파서를 공유하므로,
// 추후 대시보드가 fetchUserPlan 을 prefetch 하면 이 훅이 hydrate 캐시를 그대로 인식한다.
//
// 이 스프린트에서는 UI 미적용 — 컬럼(0011)과 훅 스켈레톤만 준비.
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/server/keys";
import { DEFAULT_USER_PLAN, parsePlanRow, type UserPlan } from "./types";

// Supabase env 미설정(mock/guest) 시엔 네트워크 호출 없이 free 로 폴백.
const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function fetchUserPlanClient(): Promise<UserPlan> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEFAULT_USER_PLAN;

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, plan_updated_at")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return parsePlanRow(data);
}

export interface UseUserPlanResult {
  plan: UserPlan;
  isPro: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useUserPlan(): UseUserPlanResult {
  const query = useQuery({
    queryKey: queryKeys.userPlan,
    queryFn: fetchUserPlanClient,
    enabled: SUPABASE_CONFIGURED,
    staleTime: 5 * 60_000, // 플랜은 자주 안 바뀜 — 5분 신선.
  });

  const plan = query.data ?? DEFAULT_USER_PLAN;
  return {
    plan,
    isPro: plan.tier === "pro",
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
