// Client (브라우저) 측 Supabase. RSC 가 아닌 'use client' 컴포넌트에서만 사용.
// Phase 1 부트스트랩 — 실제 호출부 와이어업은 Phase 3 에서 RSC + 클라 캐시 hydrate.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
