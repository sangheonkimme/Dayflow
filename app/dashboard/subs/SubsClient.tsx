"use client";

import { SubsPage } from "@/screens/subs/SubsPage";
import { useModalStore } from "@/store/modal";

export default function Page() {
  const openTxn = useModalStore((s) => s.openTxn);
  return <SubsPage onAdd={() => openTxn()} />;
}
