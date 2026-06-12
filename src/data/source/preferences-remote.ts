// ============================================================
// preferences-remote — profiles.preferences(jsonb) 동기화 repository
// ============================================================
//
// 환경설정(Tweaks)은 data mode(mock/live)와 무관하게 "로그인 사용자" 단위로
// Supabase profiles 테이블에 저장한다. 그래서 DataSource bag(mock|supabase)에
// 넣지 않고 별도 repository 로 분리. supabase 미설정/컬럼 부재 시엔 조용히
// 실패해 호출부가 localStorage 로 graceful fallback 하도록 한다.

import { supabase } from "@/lib/supabase";

type PrefBlob = Record<string, unknown>;

/** profiles.preferences 조회. 없거나 에러면 null → 로컬값 유지. */
export async function fetchRemotePreferences(
  userId: string,
): Promise<PrefBlob | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  const prefs = (data as { preferences?: unknown }).preferences;
  return prefs && typeof prefs === "object" && !Array.isArray(prefs)
    ? (prefs as PrefBlob)
    : null;
}

/** profiles.preferences 저장(덮어쓰기). 성공 여부 반환. */
export async function saveRemotePreferences(
  userId: string,
  prefs: PrefBlob,
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from("profiles")
    .update({ preferences: prefs })
    .eq("id", userId);
  return !error;
}
