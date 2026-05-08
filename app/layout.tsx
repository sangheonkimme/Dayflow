import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Gaegu,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import "@/styles/styles.css";
import "@/styles/landing.css";
// 페이지별 글로벌 스타일 — Vite SPA 시절 main.tsx 가 임포트하던 항목들.
// Phase 1 마이그레이션 시 누락 → 페이지가 무스타일로 렌더되던 버그 (2026-05-09 발견·복원).
// Phase 4b 에서 페이지별 CSS Module 로 점진 이전 예정.
import "@/styles/pages.css";
import "@/styles/memo.css";
import "@/styles/subs.css";
import "@/styles/image-tools.css";
import "@/styles/txns.css";
import "@/styles/salary.css";
import "@/styles/loan-search.css";
import "@/styles/flows.css";
import "@/styles/flows-extra.css";
import "@/styles/mobile.css";
import "@/styles/mobile-app.css";
import { Providers } from "@/shared/query/providers";

// Phase 4: Google Fonts 를 next/font 로 직렬화. @import 위치 사고 영구 차단.
// 변수로 노출 → CSS 의 var(--font-sans) 등이 그대로 참조.
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const fontHand = Gaegu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hand",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dayflow — 하루를, 종이에 적던 그대로",
    template: "%s · Dayflow",
  },
  description:
    "디지털로 옮긴 종이 책상. 가계부·달력·메모·체크리스트를 한 화면에서.",
  openGraph: {
    title: "Dayflow",
    description: "하루를, 종이에 적던 그대로.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${fontSans.variable} ${fontHand.variable} ${fontMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
