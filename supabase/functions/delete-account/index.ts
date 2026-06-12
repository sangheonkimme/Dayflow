// ============================================================
// delete-account — 회원 탈퇴 Edge Function (Deno)
// ============================================================
//
// 호출자의 JWT 로 신원을 확인한 뒤, service_role 키로 auth.users 에서
// 본인 계정을 삭제한다. profiles 및 도메인 테이블(transactions/notes/...)은
// 모두 `... references auth.users(id) on delete cascade` 라 함께 정리된다.
//
// 클라이언트는 호출 전에 비밀번호 재인증(reauthenticate)을 마쳐야 한다.
// 이 함수는 토큰 유효성만 검증하며, 추가 비밀번호 확인은 하지 않는다.
//
// 배포: supabase/functions/delete-account/README.md 참고 (수동 deploy).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "missing authorization" }, 401);
    }
    const token = authHeader.slice("Bearer ".length);

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) {
      return json({ error: "server not configured" }, 500);
    }

    // 1) 호출자 토큰으로 본인 신원 확인
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "invalid token" }, 401);

    // 2) service_role 로 계정 삭제 → FK cascade 로 전체 데이터 정리
    const admin = createClient(url, serviceKey);
    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) return json({ error: delErr.message }, 500);

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
