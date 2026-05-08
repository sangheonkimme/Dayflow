"use client";

import { SettingsPage } from "@/screens/settings/SettingsPage";
import { usePreferences } from "@/data/preferences";

export default function Page() {
  const [tweaks, setTweak] = usePreferences();
  return <SettingsPage tweaks={tweaks} setTweak={setTweak} />;
}
