"use client";

import { LedgerPage } from "@/screens/ledger/LedgerPage";
import { useModalStore } from "@/store/modal";

export default function Page() {
  const openTxn = useModalStore((s) => s.openTxn);
  return <LedgerPage onAdd={() => openTxn()} onEditTxn={openTxn} />;
}
