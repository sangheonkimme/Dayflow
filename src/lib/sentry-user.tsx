"use client";
// 로그인 사용자 컨텍스트를 Sentry 에 연결한다.
// sendDefaultPii=false 이므로 자동 PII 수집은 없고, 여기서 id/email 만 명시적으로 붙인다.
// (지원팀이 사용자 문의를 에러 세션과 매칭하기 위한 최소 식별자.)
// DSN 미설정이면 Sentry.setUser 는 no-op 이라 안전.
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useAuth } from "@/data/auth";

export function SentryUser() {
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "authed" && user) {
      Sentry.setUser({ id: user.id, email: user.email });
    } else if (status === "guest") {
      Sentry.setUser(null);
    }
    // status === "unknown" 은 판정 전 — 유지.
  }, [status, user]);

  return null;
}
