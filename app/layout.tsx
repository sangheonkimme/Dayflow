import type { Metadata, Viewport } from "next";
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
import { getSiteUrl } from "@/lib/site-url";

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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Dayflow — 하루를, 종이에 적던 그대로",
    template: "%s · Dayflow",
  },
  description:
    "디지털로 옮긴 종이 책상. 가계부·달력·메모·체크리스트를 한 화면에서.",
  applicationName: "Dayflow",
  // app/manifest.ts 존재 시 Next 가 <link rel="manifest"> 를 자동 주입.
  // iOS 홈화면 추가 시 standalone 웹앱으로 동작. apple-touch-icon 은
  // app/apple-icon.tsx 가 자동 주입. statusBarStyle "default" — 밝은 종이
  // 테마라 불투명 상태바(검은 글자)가 안전 (black-translucent 는 흰 글자라
  // 밝은 헤더 위에서 안 보임).
  appleWebApp: {
    capable: true,
    title: "Dayflow",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Dayflow",
    description: "하루를, 종이에 적던 그대로.",
    type: "website",
    locale: "ko_KR",
    siteName: "Dayflow",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dayflow",
    description: "하루를, 종이에 적던 그대로.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f1e3",
  // iOS 가상 키보드가 뜰 때 뷰포트(=100dvh) 를 실제로 줄여 바텀 시트/입력이
  // 키보드에 가리지 않게 한다.
  interactiveWidget: "resizes-content",
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
