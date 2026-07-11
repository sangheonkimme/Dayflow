"use client";
// 루트 에러 바운더리. 루트 레이아웃까지 터진 최상위 에러를 잡아 Sentry 로 보고하고
// 최소 폴백 UI 를 렌더한다. 레이아웃을 대체하므로 자체 html/body 필요 + 글로벌 CSS 의존 X.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#faf9f6",
          color: "#2b2b2b",
        }}
      >
        <main style={{ textAlign: "center", padding: "24px", maxWidth: 360 }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>
            문제가 발생했어요
          </h1>
          <p style={{ fontSize: 14, color: "#6b6b6b", margin: "0 0 20px" }}>
            일시적인 오류일 수 있어요. 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              background: "#ffd54a",
              color: "#2b2b2b",
            }}
          >
            다시 시도
          </button>
        </main>
      </body>
    </html>
  );
}
