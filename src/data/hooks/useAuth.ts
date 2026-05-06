// ============================================================
// useAuth — mock auth backed by localStorage flag.
// Supabase swap point: replace `signIn` / `signOut` with supabase.auth.*
// and seed `user` from supabase.auth.getSession().
// ============================================================

import { useCallback, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
}

export type AuthStatus = 'unknown' | 'authed' | 'guest';

export interface AuthView {
  user: AuthUser | null;
  status: AuthStatus;
  signIn: (email?: string) => void;
  signOut: () => void;
}

const KEY = 'dayflow.auth.mock';

function load(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function save(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) window.localStorage.setItem(KEY, JSON.stringify(user));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* quota / private mode */
  }
}

export function useAuth(): AuthView {
  const [user, setUser] = useState<AuthUser | null>(() => load());
  const [status, setStatus] = useState<AuthStatus>('unknown');

  useEffect(() => {
    setStatus(user ? 'authed' : 'guest');
  }, [user]);

  const signIn = useCallback((email?: string) => {
    const next: AuthUser = {
      id: 'mock-user',
      email: email ?? 'nabi@dayflow.app',
    };
    save(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    save(null);
    setUser(null);
  }, []);

  return { user, status, signIn, signOut };
}
