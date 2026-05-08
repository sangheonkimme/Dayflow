import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Phase 1 부트스트랩 — Next 빌드시 ESLint/타입체크는 별도 npm 스크립트가 담당.
  // 기존 코드의 a11y 경고 등을 빌드 차단으로 끌어올리지 않음.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
