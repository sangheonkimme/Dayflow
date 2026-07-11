import type { NextConfig } from "next";
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

export default nextConfig;
