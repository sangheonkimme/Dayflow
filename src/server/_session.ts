// 한 RSC 렌더 안에서 auth.getUser() 를 한 번만 호출하도록 캐시.
// React 의 cache() 는 같은 request 내에서 동일 인자 호출을 dedup 한다.
// 결과적으로 dashboard prefetch 가 fetcher 6~8개를 병렬 실행해도
// Supabase 인증 왕복은 1회로 줄어든다.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});
