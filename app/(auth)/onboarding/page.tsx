"use client";

import "@/styles/flows.css";
import "@/styles/flows-extra.css";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PCOnboarding } from "@/screens/auth/PcOnboarding";
import { OnboardingScreen } from "@/screens/auth/MobileOnboarding";
import { usePreferences } from "@/data/preferences";

type AuthView = "login" | "signup" | "onboarding" | "forgot";
const ROUTE: Record<AuthView, string> = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  forgot: "/forgot",
};

export default function OnboardingPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tweaks] = usePreferences();
  const dark = !!tweaks.dark;

  const onSwitch = (v: AuthView) => router.push(ROUTE[v]);

  if (isMobile) {
    return (
      <OnboardingScreen
        variant="A"
        lang="ko"
        dark={dark}
        onSwitch={onSwitch}
        onBackToLogin={() => router.push("/login")}
      />
    );
  }
  return <PCOnboarding lang="ko" dark={dark} onSwitch={onSwitch} />;
}
