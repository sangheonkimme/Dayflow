"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 공개 도구 셸 — 헤더(브랜드 + 탭 + CTA) + 내용 영역. 로그인 없이 접근.
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCrop = pathname?.startsWith("/tools/crop");
  const isPdf = pathname?.startsWith("/tools/pdf");

  return (
    <div className="public-tool-shell">
      <header className="public-tool-bar">
        <Link href="/" className="public-tool-brand" aria-label="Dayflow 홈">
          <span className="public-tool-mark">D</span>
          <span className="public-tool-name">Dayflow</span>
        </Link>
        <nav className="public-tool-nav">
          <Link href="/tools/crop" className={isCrop ? "on" : ""}>
            이미지 자르기
          </Link>
          <Link href="/tools/pdf" className={isPdf ? "on" : ""}>
            이미지 → PDF
          </Link>
        </nav>
        <Link href="/" className="public-tool-cta">
          전체 앱 둘러보기 →
        </Link>
      </header>
      <div className="public-tool-body">{children}</div>
    </div>
  );
}
