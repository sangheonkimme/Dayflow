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
  // Phase 4b 마무리 후 활성화 (2026-05-09).
  // Tailwind reset(margin/padding/heading 0, border-box, button default 등) 적용.
  // 기존 styles.css 의 reset 과 일부 중복되지만 cascade 는 Tailwind 가 우선.
  // 시각 회귀 가능성 — h1~h6/p/button/ul 의 unstyled 사용처는 별도 클래스로 명시 필요.
};

export default config;
