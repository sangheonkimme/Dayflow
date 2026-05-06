import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const r = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/app", replacement: r("./src/app") },
      { find: "@/pages", replacement: r("./src/pages") },
      { find: "@/widgets", replacement: r("./src/widgets") },
      { find: "@/features", replacement: r("./src/features") },
      { find: "@/shared", replacement: r("./src/shared") },
      { find: "@", replacement: r("./src") },
    ],
  },
  server: { port: 5173 },
});
