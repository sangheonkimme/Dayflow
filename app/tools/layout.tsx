"use client";

import "@/styles/image-tools.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

// 공개 도구 셸 — 헤더(브랜드 + 탭 + CTA) + 내용 영역. 로그인 없이 접근.
// Phase 4b: CSS Module 도입 (.public-tool-* 글로벌 → ./layout.module.css 격리).
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCrop = pathname?.startsWith("/tools/crop");
  const isPdf = pathname?.startsWith("/tools/pdf");

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Dayflow 홈">
          <span className={styles.mark}>D</span>
          <span className={styles.name}>Dayflow</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/tools/crop" className={isCrop ? "on" : ""}>
            이미지 자르기
          </Link>
          <Link href="/tools/pdf" className={isPdf ? "on" : ""}>
            이미지 → PDF
          </Link>
        </nav>
        <Link href="/" className={styles.cta}>
          전체 앱 둘러보기 →
        </Link>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
