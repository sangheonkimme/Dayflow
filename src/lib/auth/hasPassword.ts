// ============================================================
// hasPassword — Supabase identities 로 인증 수단 판별
// ============================================================
//
// Supabase 는 유저가 연결한 인증 수단을 `user.identities` 에 담아준다.
// - provider === "email"  → 이메일/비밀번호 가입 (비번 재인증 가능)
// - provider === "google" → OAuth 전용 (비번이 없어 재인증 불가)
//
// 비번 재인증을 게이트로 쓰는 화면(회원 탈퇴 등)이 OAuth 전용 유저를
// 막아버리지 않도록, 사전에 이 헬퍼로 인증 수단을 확인한다.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** 이메일/비밀번호 identity 의 provider 이름. */
const EMAIL_PROVIDER = "email";

export interface AuthMethods {
  /** 이메일/비밀번호 identity 보유 여부. false = OAuth 전용. */
  hasPassword: boolean;
  /** 연결된 provider 목록 (예: ["google"]). */
  providers: string[];
}

/** identities 배열에서 인증 수단을 추려낸다. (순수 함수 — 테스트 용이) */
export function toAuthMethods(
  identities: ReadonlyArray<{ provider?: string | null }> | null | undefined,
): AuthMethods {
  const providers = (identities ?? [])
    .map((i) => i.provider)
    .filter((p): p is string => Boolean(p));
  return {
    hasPassword: providers.includes(EMAIL_PROVIDER),
    providers,
  };
}

/**
 * 현재 로그인 유저의 인증 수단을 조회한다.
 * Supabase 미설정(mock 모드)이면 기존 동작 유지를 위해 hasPassword: true.
 */
export async function fetchAuthMethods(): Promise<AuthMethods> {
  if (!supabase) return { hasPassword: true, providers: [EMAIL_PROVIDER] };
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    // 조회 실패 시엔 보수적으로 비번 재인증을 요구한다.
    return { hasPassword: true, providers: [] };
  }
  return toAuthMethods(data.user.identities);
}

export interface AuthMethodsView extends AuthMethods {
  /** 조회 중 — UI 는 이때 제출 버튼을 잠가야 한다. */
  loading: boolean;
}

/** fetchAuthMethods 의 React 래퍼. 마운트 시 1회 조회. */
export function useAuthMethods(): AuthMethodsView {
  const [state, setState] = useState<AuthMethods>({
    hasPassword: true,
    providers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchAuthMethods().then((next) => {
      if (!alive) return;
      setState(next);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { ...state, loading };
}

/** "Google" 처럼 사용자에게 보여줄 provider 라벨. */
export function formatProviderLabel(provider: string): string {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "kakao":
      return "카카오";
    case "apple":
      return "Apple";
    case EMAIL_PROVIDER:
      return "이메일";
    default:
      return provider;
  }
}
