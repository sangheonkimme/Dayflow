"use client";
// 체크아웃 시작 + 진행/오류 상태 관리 훅. UpgradeSheet(모바일)·Account(설정) 공용.
import { useCallback, useState } from "react";
import { startCheckout } from "./checkout-client";
import type { CheckoutBilling } from "./types";

function messageFor(status: number): string {
  if (status === 401) return "로그인 후 이용할 수 있어요.";
  if (status === 501) return "결제 준비 중이에요. 곧 열릴 예정이에요.";
  return "잠시 후 다시 시도해 주세요.";
}

export function useCheckout() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const start = useCallback(
    async (billing: CheckoutBilling) => {
      if (busy) return;
      setBusy(true);
      setNotice(null);
      const result = await startCheckout(billing);
      if (result.ok) {
        // 결제사 hosted checkout 로 이동 — busy 유지한 채 페이지 떠남.
        window.location.href = result.url;
        return;
      }
      setBusy(false);
      setNotice(messageFor(result.status));
    },
    [busy],
  );

  const reset = useCallback(() => {
    setBusy(false);
    setNotice(null);
  }, []);

  return { busy, notice, start, reset };
}
