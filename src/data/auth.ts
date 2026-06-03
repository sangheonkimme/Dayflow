// ============================================================
// useAuth — Supabase 우선, 미설정 시 localStorage mock fallback
// ============================================================
//
// - VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 채워지면 실 인증.
// - 비어있으면 dev mock (localStorage) — 디자인/스타일 QA 용도.
// 두 모드 모두 동일한 AuthView 인터페이스를 노출하므로 호출부 변경 불필요.

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export type AuthStatus = "unknown" | "authed" | "guest";

export interface AuthView {
  user: AuthUser | null;
  status: AuthStatus;
  /** 사용자 행동 결과: 다음 화면을 어디로 보낼지 알려준다. */
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<AuthResult>;
  /** OAuth (Google). 성공 시 provider 로 리다이렉트되므로 호출 시점엔 return 후 화면 떠남.
   *  실패면 AuthResult 로 반환. */
  signInWithGoogle: (next?: string) => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<AuthResult>;
}

export interface AuthResult {
  ok: boolean;
  /** 실패 시 사용자 메시지(한국어). */
  message?: string;
  /** 가입 시 이메일 확인 필요한 경우. */
  needsEmailConfirmation?: boolean;
}

// ─────────────────────────────────────────────
// localStorage mock (dev fallback)
// ─────────────────────────────────────────────
const MOCK_KEY = "dayflow.auth.mock";

function loadMock(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function saveMock(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(MOCK_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(MOCK_KEY);
  } catch {
    /* quota / private mode */
  }
}

// ─────────────────────────────────────────────
// 한국어 에러 메시지 매핑
// ─────────────────────────────────────────────
function translateError(rawMessage: string): string {
  const m = rawMessage.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  if (m.includes("email not confirmed"))
    return "이메일 인증을 먼저 완료해주세요.";
  if (m.includes("user already registered")) return "이미 가입된 이메일이에요.";
  if (m.includes("password should be"))
    return "비밀번호가 너무 짧아요. 6자 이상으로 설정해주세요.";
  if (m.includes("rate limit")) return "잠시 후 다시 시도해주세요.";
  if (m.includes("network")) return "네트워크 연결을 확인해주세요.";
  return rawMessage || "알 수 없는 오류가 발생했어요.";
}

export function useAuth(): AuthView {
  const [user, setUser] = useState<AuthUser | null>(() =>
    isSupabaseConfigured ? null : loadMock(),
  );
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? "unknown" : loadMock() ? "authed" : "guest",
  );

  // 같은 supabase auth 이벤트에 여러 hook 인스턴스가 동시에 반응하지 않도록 가드
  const mounted = useRef(true);

  // 초기 세션 복원 + onAuthStateChange 구독
  useEffect(() => {
    mounted.current = true;
    if (!supabase) return;

    const toAuthUser = (u: {
      id: string;
      email: string;
      user_metadata?: Record<string, unknown> | null;
    }): AuthUser => {
      const meta = u.user_metadata ?? {};
      const pick = (k: string) =>
        typeof meta[k] === "string" && meta[k] ? (meta[k] as string) : undefined;
      // 이름: 가입 폼 입력값(display_name) → Google(full_name/name)
      const dn = pick("display_name") ?? pick("full_name") ?? pick("name");
      // 아바타: Supabase 가 정규화한 avatar_url → Google 원본 picture
      const av = pick("avatar_url") ?? pick("picture");
      return { id: u.id, email: u.email, displayName: dn, avatarUrl: av };
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted.current) return;
      const u = data.session?.user;
      if (u && u.email) {
        setUser(toAuthUser({ id: u.id, email: u.email, user_metadata: u.user_metadata }));
        setStatus("authed");
      } else {
        setStatus("guest");
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted.current) return;
      const u = session?.user;
      if (u && u.email) {
        setUser(toAuthUser({ id: u.id, email: u.email, user_metadata: u.user_metadata }));
        setStatus("authed");
      } else {
        setUser(null);
        setStatus("guest");
      }
    });

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ── signIn ──
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { ok: false, message: translateError(error.message) };
        return { ok: true };
      }
      // mock fallback
      const next: AuthUser = { id: "mock-user", email };
      saveMock(next);
      setUser(next);
      setStatus("authed");
      return { ok: true };
    },
    [],
  );

  // ── signUp ──
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName?: string,
    ): Promise<AuthResult> => {
      const dn = displayName?.trim() || undefined;
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: dn ? { data: { display_name: dn } } : undefined,
        });
        if (error) return { ok: false, message: translateError(error.message) };
        // confirm 이메일이 필요한 경우 session 이 null
        if (!data.session) {
          return { ok: true, needsEmailConfirmation: true };
        }
        return { ok: true };
      }
      // mock: 즉시 로그인 처리
      const next: AuthUser = { id: "mock-user", email, displayName: dn };
      saveMock(next);
      setUser(next);
      setStatus("authed");
      return { ok: true };
    },
    [],
  );

  // ── sendPasswordReset ──
  const sendPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (supabase) {
        const redirectTo =
          typeof window !== "undefined" ? window.location.origin : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) return { ok: false, message: translateError(error.message) };
        return { ok: true };
      }
      // mock: 항상 성공
      return { ok: true };
    },
    [],
  );

  // ── updateDisplayName ──
  const updateDisplayName = useCallback(
    async (name: string): Promise<AuthResult> => {
      const dn = name.trim();
      if (!dn) return { ok: false, message: "이름을 입력해 주세요." };
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          data: { display_name: dn },
        });
        if (error) return { ok: false, message: translateError(error.message) };
        // onAuthStateChange(USER_UPDATED) 가 setUser 처리.
        // profiles 테이블은 클라가 직접 sync (트리거는 INSERT 전용).
        const { data } = await supabase.auth.getUser();
        const uid = data.user?.id;
        if (uid) {
          await supabase
            .from("profiles")
            .update({ display_name: dn })
            .eq("id", uid);
        }
        return { ok: true };
      }
      // mock
      if (!user) return { ok: false, message: "로그인 정보를 찾을 수 없어요." };
      const next: AuthUser = { ...user, displayName: dn };
      saveMock(next);
      setUser(next);
      return { ok: true };
    },
    [user],
  );

  // ── signInWithGoogle ──
  // OAuth 는 브라우저를 리다이렉트시키므로 성공 시 코드 흐름은 여기서 멈춤.
  // 실패(설정 미비, 네트워크)면 AuthResult 로 반환해 호출부가 토스트 띄울 수 있게.
  const signInWithGoogle = useCallback(
    async (next?: string): Promise<AuthResult> => {
      if (!supabase) {
        return {
          ok: false,
          message: "Supabase 가 설정되지 않았어요. (.env 확인)",
        };
      }
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const nextQs = next ? `?next=${encodeURIComponent(next)}` : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback${nextQs}`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) return { ok: false, message: translateError(error.message) };
      return { ok: true };
    },
    [],
  );

  // ── signOut ──
  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
      // onAuthStateChange 가 나머지 처리
      return;
    }
    saveMock(null);
    setUser(null);
    setStatus("guest");
  }, []);

  return {
    user,
    status,
    signIn,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    signOut,
    updateDisplayName,
  };
}
