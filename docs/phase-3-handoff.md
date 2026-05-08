# Phase 3 — 데이터 레이어 RSC 통합 (핸드오프)

> Phase 2 완료 시점: 모든 라우트가 `app/` 으로 이식됐지만, 데이터는 여전히 클라이언트에서 fetch (TanStack Query + `getDataSource()` 싱글톤). RSC 의 prefetch / hydration 이 안 들어감.
>
> Phase 3 목표: RSC 가 진입 시점에 초기 데이터를 prefetch → `HydrationBoundary` 로 클라 TanStack Query 캐시에 hydrate. 후속 mutation 은 클라에서 처리.

## 핵심 원칙

1. **DataSource 추상은 그대로 유지.** `getDataSource()` 시그니처, `Repository<T>` 인터페이스는 마이그레이션의 핵심 자산. 깨면 안 됨.
2. **서버 호출은 직접 Supabase, 클라이언트는 TanStack Query.** 서버가 fetch 한 결과를 직렬화해 클라가 hydrate.
3. **mock 모드는 클라 전용.** RSC 에선 항상 live (Supabase). 비로그인 시 빈 결과.

## 작업 단계

### 1. 서버측 도메인 fetcher 추가 (`src/server/queries/`)

각 도메인마다 RSC 에서 호출 가능한 함수. 패턴:

```ts
// src/server/queries/transactions.ts
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { TxnMap } from "@/data/source/mappers/transactions";

export const fetchTransactions = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) throw error;
  return data?.map(TxnMap.toDomain) ?? [];
});
```

도메인별 작성 대상:
- [ ] `transactions` — `src/data/transactions.ts` 의 쿼리 패턴 참고
- [ ] `events`
- [ ] `memos`
- [ ] `stickyNotes`
- [ ] `checklist`
- [ ] `subscriptions`
- [ ] `pinnedInfo`
- [ ] `dailyLog`

### 2. RSC prefetch + HydrationBoundary

각 보호 라우트 page.tsx 에서:

```tsx
// app/(app)/ledger/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchTransactions } from "@/server/queries/transactions";
import { LedgerClient } from "./LedgerClient";

export default async function LedgerPage() {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <LedgerClient />
    </HydrationBoundary>
  );
}
```

`LedgerClient` 는 `'use client'` 컴포넌트로, 기존 `useTransactions()` 훅 그대로 사용.

### 3. 클라 훅을 TanStack Query 로 통일

현재 `useTransactions()` 등은 자체 store + repository 패턴. 일부는 이미 TanStack Query 를 쓰고 있고(`useRepositoryQuery`), 일부는 `useSyncExternalStore` 직접 사용.

- [ ] 모든 도메인 훅을 `useQuery({ queryKey, queryFn })` 패턴으로 통일.
- [ ] `queryFn` 은 클라 측에서 mock | live 분기 — `getDataSource()` 그대로 사용.
- [ ] mutation 훅 (`useMutation`) 으로 upsert/remove 통일. `onMutate` 로 낙관적 업데이트.

### 4. mock 모드 처리

- 클라에서만 토글 가능 (TweaksPanel).
- mock 활성 시 `queryFn` 이 mock DataSource 호출 → seed 데이터 반환.
- live 시 `queryFn` 이 Supabase 호출 → 클라에서 fetch (RSC prefetch 와 별개).
- **결정 필요**: mock 모드에서 RSC prefetch 결과를 무시할지, 아니면 RSC 진입 자체를 클라 redirect 로 우회할지.

### 5. 인증 가드

- `app/(app)/layout.tsx` 에서 `createClient().auth.getUser()` → 미인증시 `redirect('/login')`.
- `middleware.ts` 의 보호 라우트 매처 활성화.
- 로그아웃 후 캐시 무효화: `queryClient.clear()` (Server Action 에서 redirect + revalidatePath).

## 변경 영향이 큰 파일

- `src/data/transactions.ts`, `src/data/events.ts`, ... (8개 도메인 훅 모두)
- `src/data/source/index.ts` — `_instance` 싱글톤, `configureDataSource()` 가 클라 전용으로 한정됨
- `src/lib/supabase.ts` — Phase 5 에서 제거 (`lib/supabase/{client,server}.ts` 로 일원화)
- `src/App.tsx`, `src/screens/*` — RSC 가 초기 데이터 채워주므로 useEffect 기반 fetch 가드 단순화

## Phase 3 종료 기준

- [ ] 8개 도메인 훅 모두 TanStack Query + `useQuery` 패턴
- [ ] 보호 라우트 8개 모두 RSC prefetch → HydrationBoundary
- [ ] mock 모드 클라 전용 동작 확인
- [ ] 인증 후 첫 진입 시 데이터 fetch waterfall 없음 (RSC 가 미리 가져옴)
- [ ] 로그아웃·로그인 사이 캐시 cross-talk 없음 (queryClient.clear)
- [ ] `src/data/store.ts`, `src/data/source/index.ts` 의 자체 store 패턴 제거 (선택)

## 결정 필요

- RSC fetcher 위치: `src/server/queries/` vs `lib/queries/` vs `app/_queries/`
- 캐시 전략: `cache()` (request-scoped) vs `unstable_cache` (지속) — 로그인 사용자별이라 request-scoped 권장
- realtime: Supabase realtime 구독은 클라 전용. RSC 가 초기값만 채우고 클라가 채널 열어 갱신.
- `revalidateTag` 사용처: mutation 후 RSC 캐시 무효화 필요한 경우 (Server Action 에서 호출)
