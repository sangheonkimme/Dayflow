import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

const r = (p: string) => path.resolve(__dirname, p);

// Vitest 설정 — Next 앱 빌드와 무관. JSX 변환을 위해 @vitejs/plugin-react
// 만 의존. tsconfig 와 paths 동기화.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/screens", replacement: r("./src/screens") },
      { find: "@", replacement: r("./src") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
