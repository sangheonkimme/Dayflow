"use client";
import styles from "@/screens/settings/SettingsPage.module.css";
import { useUserPlan } from "@/data/plan/useUserPlan";
import { useCheckout } from "@/lib/payments/useCheckout";

export const AccountSection = () => {
  const { isPro } = useUserPlan();
  const { busy, notice, start } = useCheckout();

  return (
    <div className={styles.group}>
      <h3>현재 플랜</h3>

      {isPro ? (
        <div className={`${styles.planCard} ${styles.pro}`}>
          <div>
            <b style={{ fontSize: 18 }}>Pro 플랜</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              무제한 기록 · 광고 제거 · 우선 지원
            </div>
          </div>
          <span className="tag">이용 중</span>
        </div>
      ) : (
        <div className={styles.planCard}>
          <div>
            <b style={{ fontSize: 18 }}>무료 플랜</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              스티커 3개 · 기본 도구
            </div>
          </div>
          <button
            className="timer-btn primary"
            onClick={() => start("year")}
            disabled={busy}
          >
            {busy ? "이동 중…" : "Pro로 업그레이드 — ₩39,000/년"}
          </button>
        </div>
      )}

      {notice && (
        <div
          className="muted"
          role="status"
          style={{ fontSize: 12, marginTop: 8 }}
        >
          {notice}
        </div>
      )}
    </div>
  );
};
