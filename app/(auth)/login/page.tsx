"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PCLogin } from "@/screens/auth/PcLogin";
import { LoginScreen } from "@/screens/auth/MobileLogin";
import { usePreferences } from "@/data/preferences";
import { useAuth } from "@/data/auth";

type AuthView = "login" | "signup" | "onboarding" | "forgot";
const ROUTE: Record<AuthView, string> = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  forgot: "/forgot",
};

export default function LoginPage() {
  // useSearchParams 가 prerender 시 CSR bailout 을 트리거하므로 Suspense 로 감쌈.
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tweaks] = usePreferences();
  const dark = !!tweaks.dark;
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "authed") {
      const next = searchParams.get("next") || "/dashboard";
      router.replace(next);
    }
  }, [auth.status, router, searchParams]);

  const onSwitch = (v: AuthView) => router.push(ROUTE[v]);

  if (isMobile) {
    return (
      <LoginScreen
        variant="A"
        lang="ko"
        dark={dark}
        onSwitch={onSwitch}
        onBackToLogin={() => router.push("/login")}
      />
    );
  }
  return <PCLogin lang="ko" dark={dark} onSwitch={onSwitch} />;
}
