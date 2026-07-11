import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16: next lint 제거. lint 는 npm run lint 가 담당.
  typescript: { ignoreBuildErrors: false },
  // package.json version 을 클라이언트에 build-time 주입 (앱 정보 표시용).
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

// DSN 미설정 시 Sentry 빌드 래핑을 건너뛴다 — dev/CI 빌드 오버헤드·소스맵 업로드 시도 제거.
// 런타임 SDK(instrumentation*) 는 enabled:false 로 이미 no-op 이라 안전.
const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN, // 미설정 시 소스맵 업로드만 스킵.
      silent: !process.env.CI, // 소스맵 업로드 로그는 CI 에서만.
      widenClientFileUpload: true,
      // v10: 소스맵은 업로드 후 자동 삭제(기본) — 배포 번들에 노출 안 됨.
      // (disableLogger 는 Turbopack 미지원이라 생략 — Next 16 기본 빌더가 Turbopack.)
    })
  : nextConfig;
