"use client";

import { TxnsPage } from "@/screens/txns/TxnsPage";
import { useModalStore } from "@/store/modal";
import type { TxnDraft } from "@/types";

export default function Page() {
  const openTxn = useModalStore((s) => s.openTxn);
  return (
    <TxnsPage
      onAdd={(prefill?: TxnDraft) => openTxn(prefill)}
      onEditTxn={openTxn}
    />
  );
}
