import type { Metadata } from "next";
import "@/styles/styles.css";
import "@/styles/landing.css";

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
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
