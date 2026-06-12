import { HydrationBoundary } from "@tanstack/react-query";
import { prefetch } from "@/server/prefetch";
import SettingsClient from "./SettingsClient";

// Settings 는 서버에서 prefetch 할 도메인 데이터가 거의 없어(프로필은 auth 클라
// 구독, preferences 는 localStorage/Supabase 동기화) 다른 도메인처럼 무거운 3단
// 강제는 과하다. 대신 표준 컨벤션(RSC page → *Client 경계 → HydrationBoundary)
// 형태만 맞춰 정렬한다. 추후 서버 prefetch 가 생기면 entries 만 채우면 된다.
export default async function Page() {
  const dehydrated = await prefetch([]);
  return (
    <HydrationBoundary state={dehydrated}>
      <SettingsClient />
    </HydrationBoundary>
  );
}
