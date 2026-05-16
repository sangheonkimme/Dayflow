// 사이드바/검색/홈에서 공유하는 라우팅 키 → href 매핑.
// crop/pdf 는 공개 도구 셸(/tools/*), 그 외는 /dashboard/* 하위.
export function navKeyToHref(key: string): string {
  if (key === "home") return "/dashboard";
  if (key === "crop" || key === "pdf") return `/tools/${key}`;
  return `/dashboard/${key}`;
}
