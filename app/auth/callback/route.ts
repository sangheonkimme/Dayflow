// Supabase OAuth (PKCE) 콜백. provider → Supabase → 여기로 code 가 돌아옴.
// exchangeCodeForSession 으로 쿠키 세션을 세팅하고 next 경로로 보낸다.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";
  // open redirect 방지 — 외부 URL/스킴 차단.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const msg = encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/login?error=oauth&msg=${msg}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
