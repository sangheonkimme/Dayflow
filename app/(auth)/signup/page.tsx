"use client";

import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PCSignup } from "@/screens/auth/PcSignup";
import { SignupScreen } from "@/screens/auth/MobileSignup";
import { usePreferences } from "@/data/preferences";

type AuthView = "login" | "signup" | "onboarding" | "forgot";
const ROUTE: Record<AuthView, string> = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  forgot: "/forgot",
};

export default function SignupPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tweaks] = usePreferences();
  const dark = !!tweaks.dark;

  const onSwitch = (v: AuthView) => router.push(ROUTE[v]);

  if (isMobile) {
    return (
      <SignupScreen
        variant="A"
        lang="ko"
        dark={dark}
        onSwitch={onSwitch}
        onBackToLogin={() => router.push("/login")}
      />
    );
  }
  return <PCSignup lang="ko" dark={dark} onSwitch={onSwitch} />;
}
