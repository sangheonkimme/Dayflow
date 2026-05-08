import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

const r = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/app", replacement: r("./src/app") },
      { find: "@/screens", replacement: r("./src/screens") },
      { find: "@/widgets", replacement: r("./src/widgets") },
      { find: "@/features", replacement: r("./src/features") },
      { find: "@/shared", replacement: r("./src/shared") },
      { find: "@", replacement: r("./src") },
    ],
  },
  server: { port: 5173 },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
