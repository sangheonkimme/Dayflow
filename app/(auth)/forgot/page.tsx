"use client";

import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PCForgot } from "@/screens/auth/PcForgot";
import { ForgotScreen } from "@/screens/auth/MobileForgot";
import { usePreferences } from "@/data/preferences";

type AuthView = "login" | "signup" | "onboarding" | "forgot";
const ROUTE: Record<AuthView, string> = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  forgot: "/forgot",
};

export default function ForgotPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tweaks] = usePreferences();
  const dark = !!tweaks.dark;

  const onSwitch = (v: AuthView) => router.push(ROUTE[v]);

  if (isMobile) {
    return (
      <ForgotScreen
        variant="A"
        lang="ko"
        dark={dark}
        onSwitch={onSwitch}
        onBackToLogin={() => router.push("/login")}
      />
    );
  }
  return <PCForgot lang="ko" dark={dark} onSwitch={onSwitch} />;
}
