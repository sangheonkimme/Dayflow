// RSC prefetch 헬퍼 — 라우트 page.tsx 에서 사용.
// 사용 패턴:
//   const dehydrated = await prefetch([
//     { key: queryKeys.transactions, fn: fetchTransactions },
//     ...
//   ]);
//   return <HydrationBoundary state={dehydrated}>...</HydrationBoundary>;

import { dehydrate, QueryClient } from "@tanstack/react-query";

interface PrefetchEntry<T> {
  key: readonly unknown[];
  fn: () => Promise<T>;
}

export async function prefetch(entries: PrefetchEntry<unknown>[]) {
  const qc = new QueryClient();
  await Promise.all(
    entries.map((e) =>
      qc.prefetchQuery({ queryKey: [...e.key], queryFn: e.fn }),
    ),
  );
  return dehydrate(qc);
}
