"use server";

// Auth Server Actions — Phase 5 도입.
// 클라이언트 useAuth().signOut() 도 그대로 동작하지만, Server Action 은
// progressive enhancement (JS off 환경) + revalidatePath 로 RSC 캐시
// 무효화를 한 번에 처리한다.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // 보호 라우트 캐시 비우고 로그인으로.
  revalidatePath("/", "layout");
  redirect("/login");
}
