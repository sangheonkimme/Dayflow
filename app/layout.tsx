import type { Metadata } from "next";
import "@/styles/styles.css";
import "@/styles/landing.css";

export const metadata: Metadata = {
  title: "Dayflow",
  description: "하루를, 종이에 적던 그대로. — Dayflow",
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
