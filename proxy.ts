// 보호 라우트 Edge proxy. /dashboard/* 진입 전 세션 갱신 + 미인증 시 /login 리다이렉트.
// Next 16: middleware 컨벤션이 proxy 로 리네임됨. 동작은 동일.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // env 미설정 시 통과 — dev/guest 워크플로 보존.
  if (!url || !anon) return response;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith(PROTECTED_PREFIX) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    // getUser() 도중 토큰이 rotate 됐다면 갱신 쿠키를 redirect 에도 실어야 함.
    // 누락 시 브라우저에 폐기된 refresh token 이 남아 다음 갱신에서 강제 로그아웃됨.
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  }

  return response;
}

export const config = {
  // /dashboard/* 만 보호. 나머지(/, /login, /tools/* 등)는 proxy 를 통과시켜
  // 매 요청마다 Supabase auth 왕복이 붙는 비용을 제거.
  matcher: ["/dashboard/:path*"],
};
