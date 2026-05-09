import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Gaegu,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import "@/styles/styles.css";
import "@/styles/landing.css";
// pages.css 는 page-head/crumb/page-title 같은 공유 chrome — 모든 라우트가 사용.
import "@/styles/pages.css";
// 페이지·라우트별 CSS 는 각자 page.tsx / *Client.tsx 에서 직접 임포트
// (Phase 4b 분할 — 글로벌 번들 축소 + 라우트 단위 leak 격리).
import { Providers } from "@/lib/providers";

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
