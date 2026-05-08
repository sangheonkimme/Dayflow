"use server";

// Auth Server Actions — Phase 5 도입.
// 클라이언트 useAuth().signIn/signUp/signOut 도 그대로 동작하지만, Server
// Action 은 progressive enhancement (JS off 환경) + revalidatePath 로 RSC
// 캐시 무효화를 한 번에 처리한다.
//
// 호출 패턴:
//   <form action={signInAction}>...</form>
//   const [state, action] = useActionState(signInAction, null);

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  ok: boolean;
  message?: string;
}

export async function signInAction(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@") || password.length < 1) {
    return { ok: false, message: "이메일/비밀번호를 확인해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  const next = String(formData.get("next") ?? "/dashboard");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signUpAction(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@") || password.length < 6) {
    return {
      ok: false,
      message: "이메일과 6자 이상 비밀번호를 입력해 주세요.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "확인 메일을 보냈어요. 메일함을 확인해 주세요." };
}

export async function sendPasswordResetAction(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    return { ok: false, message: "이메일 형식을 확인해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: "재설정 안내 메일을 보냈어요." };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // 보호 라우트 캐시 비우고 로그인으로.
  revalidatePath("/", "layout");
  redirect("/login");
}
