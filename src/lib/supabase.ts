// ============================================================
// Supabase client (env-conditional)
// ============================================================
//
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (Phase 1+) 또는
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (레거시) 가 .env 에 채워져 있으면
// 실 클라이언트, 없으면 null 을 반환해서 호출부가 mock 으로 fallback.
//
// Phase 3 에서 lib/supabase/{client,server,middleware}.ts (@supabase/ssr)
// 로 일원화될 예정. 현 파일은 레거시 SPA 부트 경로용.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
