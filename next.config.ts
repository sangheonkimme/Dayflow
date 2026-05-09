import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16: next lint 제거. lint 는 npm run lint 가 담당.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
