"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/screens/landing/LandingPage";
import { useAuth } from "@/data/auth";
import { useDataModeStore } from "@/store/dataMode";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  const mode = useDataModeStore((s) => s.mode);

  // 인증된 사용자(또는 mock 모드)는 / 가 아닌 /dashboard 가 홈.
  useEffect(() => {
    if (auth.status === "authed" || mode === "mock") {
      router.replace("/dashboard");
    }
  }, [auth.status, mode, router]);

  return <LandingPage onGoToAuth={() => router.push("/login")} />;
}
