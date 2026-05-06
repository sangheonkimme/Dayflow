// ============================================================
// Supabase client (env-conditional)
// ============================================================
//
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 .env 에 채워져 있으면 실 클라이언트,
// 없으면 null 을 반환해서 호출부가 mock 으로 fallback 한다.
//
// 추후 generated 타입 도입 시:
//   import type { Database } from '@/data/source/db.types';
//   createClient<Database>(url, key, ...)
// 로 교체.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

/**
 * 호출부가 client 가 반드시 있다고 단언하고 싶을 때 사용.
 * 예: SupabaseSource adapter 내부.
 */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    );
  }
  return supabase;
}
