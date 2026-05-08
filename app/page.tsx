"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@/screens/landing/LandingPage";

export default function Page() {
  const router = useRouter();
  return <LandingPage onGoToAuth={() => router.push("/login")} />;
}
