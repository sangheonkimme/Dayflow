// Next 16 클라이언트 instrumentation. 브라우저 런타임 Sentry 초기화 + 라우터 전환 트레이싱.
// DSN 미설정 시 enabled:false → 완전 no-op.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  // 클라에서는 Vercel 시스템 변수를 NEXT_PUBLIC_ 로 노출해야 읽힘. 로컬은 NODE_ENV.
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  sendDefaultPii: false,
  // 이 스프린트에선 Session Replay 미포함 (replaysSessionSampleRate 미설정 = 0).
});

// App Router 클라 네비게이션을 트레이싱에 연결.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
