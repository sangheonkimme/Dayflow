import "server-only";
// service-role Supabase 클라이언트 — RLS 를 우회한다. webhook·서버 라우트 전용.
// ⚠️ 절대 클라이언트 번들로 유입 금지: "server-only" 임포트가 클라 import 시 빌드 에러를 낸다.
// SUPABASE_SERVICE_ROLE_KEY 는 NEXT_PUBLIC_ 접두어 없는 비공개 env.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * service-role 클라이언트를 반환한다. 미설정(키 없음)이면 null —
 * 호출부가 graceful 하게 처리(웹훅 503 / 체크아웃 501)하도록.
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  if (!cached) {
    cached = createClient(url, serviceKey, {
      // 서버 전용 — 세션 유지/자동갱신 불필요.
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
