// 보호 라우트 미들웨어. /dashboard/* 진입 전 세션 갱신 + 미인증 시 /login 리다이렉트.
// Phase 1 부트스트랩 — 실제 보호 라우트는 Phase 2 에서 추가됨.

import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Phase 2 에서 인증 게이트 활성화. 지금은 세션 갱신만.
  // const { pathname } = request.nextUrl;
  // const protectedPaths = ["/dashboard", "/ledger", "/calendar", ...];
  // if (protectedPaths.some((p) => pathname.startsWith(p)) && !user) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return response;
}

export const config = {
  matcher: [
    // _next, _vercel, 정적 파일은 제외
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// NextResponse 미사용 경고 회피 — 향후 인증 게이트 활성화시 사용 예정.
void NextResponse;
