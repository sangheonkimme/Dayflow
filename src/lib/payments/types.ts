// 결제 공용 타입 — 서버(LS 헬퍼)·클라(startCheckout) 양쪽에서 import (server-only 아님).

/** 결제 주기 선택. UpgradeSheet 월/년 토글과 매핑. */
export type CheckoutBilling = "month" | "year";
