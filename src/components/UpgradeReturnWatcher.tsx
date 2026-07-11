"use client";
// 결제 후 /dashboard?upgraded=1 로 복귀하면 plan 캐시를 무효화해 최신 상태를 반영한다.
// plan 갱신은 webhook 비동기라 즉시 반영이 아닐 수 있음 — 무효화 후 재조회로 곧 수렴.
// window.location 사용(useSearchParams 의 Suspense 요구 회피). 렌더 없음(null).
import { useEffect } from "react";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/server/keys";

export function UpgradeReturnWatcher() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") !== "1") return;

    queryClient.invalidateQueries({ queryKey: queryKeys.userPlan });

    // 파라미터 제거 — 새로고침/공유 시 재트리거 방지.
    params.delete("upgraded");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : ""),
    );
  }, []);

  return null;
}
