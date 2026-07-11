// Sentry 서버(Node.js 런타임) 초기화. instrumentation.ts 의 register() 가 로드.
// DSN 미설정 시 enabled:false → 완전 no-op (네트워크 전송 없음).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  // Vercel(preview/production/development) 우선, 로컬은 NODE_ENV.
  // dev 에러가 프로덕션 이슈로 섞이지 않도록 environment 로 분리.
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  // dev 100% / prod 10% — 트래픽 볼륨에 맞춰 조정.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  // PII 자동수집 차단. 사용자 컨텍스트는 SentryUser 에서 최소 식별자만 명시 설정.
  sendDefaultPii: false,
});
