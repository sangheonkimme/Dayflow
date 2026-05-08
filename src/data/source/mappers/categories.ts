// ============================================================
// Categories — lazy-create 헬퍼 (FK resolution)
// ============================================================
//
// 도메인 데이터엔 카테고리가 한국어 이름(`'식비'`)으로 들어있는데,
// DB는 categories.id (uuid) 를 요구한다.
// 이 헬퍼는:
//   1) 사용자의 categories를 한 번 fetch해서 메모리에 캐시
//   2) 거래/구독 insert 시 이름 → id로 변환
//   3) 없는 이름이면 lazy insert 후 캐시에 추가
//
// SupabaseSource가 mutation 직전에 호출한다.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/data/source/db.types";

export type CategoryKind = "income" | "expense" | "subscription";
export type Category = Tables<"categories">;

interface CategoryCache {
  byId: Map<string, Category>;
  byKey: Map<string, Category>; // key: `${kind}:${name}`
}

const _cacheByUser = new Map<string, CategoryCache>();

function key(kind: CategoryKind, name: string) {
  return `${kind}:${name}`;
}

/** 사용자별 카테고리를 한 번 로드해서 캐시. SupabaseSource init에서 호출. */
export async function loadCategoryCache(
  client: SupabaseClient<Database>,
  userId: string,
): Promise<CategoryCache> {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  const cache: CategoryCache = { byId: new Map(), byKey: new Map() };
  for (const row of data ?? []) {
    cache.byId.set(row.id, row);
    cache.byKey.set(key(row.kind as CategoryKind, row.name), row);
  }
  _cacheByUser.set(userId, cache);
  return cache;
}

/**
 * 이름 → category id. 캐시 미스 시 insert 후 캐시 갱신.
 * Returns null when name is undefined/empty.
 */
export async function resolveCategoryId(
  client: SupabaseClient<Database>,
  userId: string,
  name: string | undefined,
  kind: CategoryKind,
): Promise<string | null> {
  if (!name) return null;
  const cache =
    _cacheByUser.get(userId) ?? (await loadCategoryCache(client, userId));
  const hit = cache.byKey.get(key(kind, name));
  if (hit) return hit.id;
  // lazy create
  const { data, error } = await client
    .from("categories")
    .insert({ user_id: userId, name, kind, position: cache.byKey.size })
    .select()
    .single();
  if (error) throw error;
  cache.byId.set(data.id, data);
  cache.byKey.set(key(kind, name), data);
  return data.id;
}

/** 캐시 무효화 (모드 전환, 로그아웃 시). */
export function clearCategoryCache(userId?: string): void {
  if (userId) _cacheByUser.delete(userId);
  else _cacheByUser.clear();
}
