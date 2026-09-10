// 결제 webhook 이벤트의 **발생 시각** 파싱. Toss·LemonSqueezy 두 라우트가 공유한다.
//
// 왜 필요한가: dedup(webhook_events)은 "같은 이벤트의 재전송"만 막는다.
// 서로 다른 이벤트가 순서를 바꿔 도착하는 경우(subscription_updated(active) 가
// subscription_updated(cancelled) 보다 늦게 도착) 는 여전히 늦게 온 쪽이 이긴다.
// 이를 막으려면 "이 이벤트가 결제사에서 언제 발생했는가" 가 필요하다 —
// 우리 서버의 수신 시각(now())은 순서를 뒤집힌 채로 그대로 반영하므로 쓸 수 없다.
//
// 파싱된 시각은 plan-sync 의 워터마크 비교(profiles.plan_updated_at)에 쓰인다.

/**
 * 결제사 payload 의 타임스탬프 문자열을 Date 로 변환한다.
 * 값이 없거나 문자열이 아니거나 파싱 불가면 null — 호출부는 null 을 받으면
 * 워터마크 없이(기존 latest-wins) 진행한다. 이벤트 유실보다 낫다.
 *
 * 허용 포맷: ISO 8601. LemonSqueezy 는 마이크로초 UTC("2021-08-11T13:54:19.000000Z"),
 * Toss 는 오프셋 포함("2022-01-01T00:00:00+09:00"). 둘 다 Date 가 처리한다.
 * ⚠️ 오프셋 없는 문자열("2022-01-01T00:00:00.000000")은 Date 가 로컬 시각으로
 *    해석하므로 서버 TZ 에 따라 어긋난다. 결제사 payload 가 그 형태라면
 *    호출부에서 오프셋을 보정해야 한다.
 */
export function parseEventTime(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
