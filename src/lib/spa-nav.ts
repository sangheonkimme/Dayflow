// History API 기반 SPA 내비게이션 헬퍼.
// react-router-dom 도입 전 임시. Next.js 마이그레이션 시 next/link + router.push 로 1:1 대체 가능.
//
// - navigateSpa(path) : history.pushState + 'spa-navigate' 커스텀 이벤트
// - useSpaPath()      : 현재 pathname 을 구독 (popstate + spa-navigate 모두 반응)

import { useEffect, useState } from "react";

const NAV_EVENT = "spa-navigate";

export function navigateSpa(path: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === path) return;
  window.history.pushState(null, "", path);
  window.dispatchEvent(new Event(NAV_EVENT));
}

export function useSpaPath(): string {
  const [path, setPath] = useState<string>(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  );
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);
  return path;
}

// 앵커 클릭을 가로채 SPA 네비게이션으로 전환. 외부 링크 / 새 탭 / 키 조합은 그대로 둠.
export function spaLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  path: string,
) {
  if (e.defaultPrevented) return;
  if (e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigateSpa(path);
}
