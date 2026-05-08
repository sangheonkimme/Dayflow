"use client";

import { useRouter } from "next/navigation";
import { HomePage } from "@/screens/home/HomePage";
import { usePreferences } from "@/data/preferences";
import { useModalStore } from "@/store/modal";

export default function DashboardHome() {
  const router = useRouter();
  const [tweaks, setTweak] = usePreferences();
  const openTxn = useModalStore((s) => s.openTxn);
  const openEvent = useModalStore((s) => s.openEvent);

  return (
    <HomePage
      tweaks={tweaks}
      setTweak={setTweak}
      setActive={(key) =>
        router.push(key === "home" ? "/dashboard" : `/dashboard/${key}`)
      }
      setSearchOpen={() => {
        // ⌘K 가 layout 에서 처리. 검색 토글은 Phase 5 에서 통합.
      }}
      openTxn={() => openTxn()}
      openEvent={openEvent}
      onEditTxn={openTxn}
    />
  );
}
