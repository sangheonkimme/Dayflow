// RSC 용 사용자 플랜 fetcher. 대시보드 prefetch 파이프라인에서 재사용 가능.
// 비로그인/미설정 시 free 기본값. cache() 로 요청당 1회 (getCurrentUser 와 dedup).
import { cache } from "react";
import { getCurrentUser } from "./_session";
import {
  DEFAULT_USER_PLAN,
  parsePlanRow,
  type UserPlan,
} from "@/data/plan/types";

export const fetchUserPlan = cache(async (): Promise<UserPlan> => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return DEFAULT_USER_PLAN;

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, plan_updated_at")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return parsePlanRow(data);
});
