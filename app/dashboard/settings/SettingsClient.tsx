"use client";

import { SettingsPage } from "@/screens/settings/SettingsPage";
import { usePreferences } from "@/data/preferences";

// Settings 의 클라이언트 경계. preferences(Zustand)·auth 등 클라 상태는 모두
// 여기서부터. 다른 dashboard 도메인(memo/subs 등)의 *Client.tsx 컨벤션 정렬용.
export default function SettingsClient() {
  const [tweaks, setTweak] = usePreferences();
  return <SettingsPage tweaks={tweaks} setTweak={setTweak} />;
}
