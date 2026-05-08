import type { Config } from "tailwindcss";

// 토큰은 :root CSS 변수와 1:1 매핑. styles.css 의 --bg 등을 단일 진실 원천으로
// 두고 Tailwind 가 var() 로 참조하면 다크모드/액센트 토글이 그대로 동작.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "!./src/screens/mobile/community/**", // 시안 잔재 — 점진 정리
  ],
  darkMode: "class", // body.dark 토글과 호환
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-paper": "var(--bg-paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-mute": "var(--ink-mute)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        card: "var(--card)",
        "card-elev": "var(--card-elev)",
        accent: "var(--accent)",
        yellow: "var(--yellow)",
        "yellow-edge": "var(--yellow-edge)",
        pink: "var(--pink)",
        "pink-edge": "var(--pink-edge)",
        blue: "var(--blue)",
        "blue-edge": "var(--blue-edge)",
        green: "var(--green)",
        red: "var(--red)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        paper: "var(--shadow-paper)",
        lift: "var(--shadow-lift)",
      },
    },
  },
  // 기존 글로벌 CSS 와 공존 단계 — preflight(reset) 켜면 기존 스타일과 충돌.
  // Phase 5 에서 글로벌 CSS 를 모듈로 옮긴 뒤 corePlugins.preflight 활성화.
  corePlugins: {
    preflight: false,
  },
};

export default config;
