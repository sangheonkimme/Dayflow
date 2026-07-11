import { useState, useEffect } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";
import styles from "@/screens/mobile/mobile.module.css";
import { useCheckout } from "@/lib/payments/useCheckout";
import type { CheckoutBilling } from "@/lib/payments/types";

export const UpgradeSheet = ({ open, onClose }: any) => {
  const [plan, setPlan] = useState<CheckoutBilling>("year"); // month | year
  const { busy, notice, start, reset } = useCheckout();
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPlan("year");
        reset();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  const features = [
    {
      ico: "tag",
      title: "광고 없는 깔끔한 화면",
      sub: "무료 플랜의 모든 광고 제거",
    },
    {
      ico: "wallet",
      title: "무제한 기록",
      sub: "거래 · 일정 · 메모 · 할 일 한도 없이",
    },
    {
      ico: "cloud",
      title: "iCloud 자동 동기화",
      sub: "모든 기기에서 실시간 백업",
    },
    {
      ico: "moon",
      title: "테마 · 위젯 모두 잠금 해제",
      sub: "다크 모드 · 잠금화면 위젯 6종",
    },
    { ico: "doc", title: "월간 PDF 리포트", sub: "매월 1일 자동 발송" },
    { ico: "bell", title: "우선 고객 지원", sub: "24시간 내 답변 · 1:1 채팅" },
  ];

  const plans = [
    {
      id: "month",
      label: "월간",
      price: "₩3,900",
      sub: "매월 결제",
      badge: null,
    },
    {
      id: "year",
      label: "연간",
      price: "₩39,000",
      sub: "월 ₩3,250 · 17% 할인",
      badge: "BEST",
    },
  ];

  return (
    <>
      <div
        role="presentation"
        className={`${styles.dfmSheetScrim} ${open ? styles.on : ""}`}
        onClick={onClose}
      />
      <div
        className={`${styles.dfmSheet} ${open ? styles.on : ""}`}
        style={{ height: "92vh", maxHeight: "92vh" }}
      >
        <div className={styles.dfmSheetGrip} />
        <div
          className={styles.dfmSheetHead}
          style={{ borderBottom: "none", paddingBottom: 4 }}
        >
          <div className={styles.ttl} style={{ visibility: "hidden" }}>
            x
          </div>
          <button className={styles.close} onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div
          className={styles.dfmSheetBody}
          style={{ padding: "0 18px 22px", overflowY: "auto" }}
        >
          <>
              {/* hero */}
              <div style={{ textAlign: "center", padding: "8px 0 22px" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    margin: "0 auto 14px",
                    background: "var(--ink)",
                    color: "#ffd84d",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 8px 24px rgba(40,30,10,0.18)",
                  }}
                >
                  <Ico name="coin" size={28} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Dayflow Pro
                </div>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    margin: "0 0 6px",
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--hand)",
                  }}
                >
                  하루의 흐름,
                  <br />더 깊게 기록해요
                </h2>
                <small style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                  기록을 멈추지 않게 도와드릴게요 ✨
                </small>
              </div>

              {/* features */}
              <div
                className={styles.dfmCard}
                style={{ padding: 0, marginBottom: 18 }}
              >
                {features.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 14px",
                      borderBottom:
                        i < features.length - 1
                          ? "1px dashed var(--line)"
                          : "none",
                    }}
                  >
                    <div
                      className={styles.dfmToolIco}
                      style={{
                        width: 32,
                        height: 32,
                        background: "var(--yellow)",
                        borderColor: "var(--yellow-edge)",
                        flexShrink: 0,
                      }}
                    >
                      <Ico name={f.ico} size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: 13, display: "block" }}>
                        {f.title}
                      </b>
                      <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                        {f.sub}
                      </small>
                    </div>
                    <div style={{ color: "var(--ink-mute)", fontSize: 14 }}>
                      ✓
                    </div>
                  </div>
                ))}
              </div>

              {/* plan picker */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id as CheckoutBilling)}
                    style={{
                      position: "relative",
                      padding: "16px 14px",
                      borderRadius: 14,
                      border:
                        "2px solid " +
                        (plan === p.id ? "var(--ink)" : "var(--line)"),
                      background:
                        plan === p.id ? "var(--bg)" : "var(--bg-paper)",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "var(--ink)",
                    }}
                  >
                    {p.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: -8,
                          right: 10,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: "var(--ink)",
                          color: "#ffd84d",
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {p.badge}
                      </span>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border:
                            "2px solid " +
                            (plan === p.id ? "var(--ink)" : "var(--line)"),
                          background:
                            plan === p.id ? "var(--ink)" : "transparent",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        {plan === p.id && (
                          <span
                            style={{
                              position: "absolute",
                              inset: 3,
                              background: "var(--bg-paper)",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </div>
                      <b style={{ fontSize: 13 }}>{p.label}</b>
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--mono)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.price}
                    </div>
                    <small
                      style={{
                        fontSize: 10,
                        color: "var(--ink-mute)",
                        display: "block",
                        marginTop: 2,
                      }}
                    >
                      {p.sub}
                    </small>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => start(plan)}
                disabled={busy}
                style={{
                  width: "100%",
                  padding: "16px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "var(--ink)",
                  color: "#ffd84d",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(40,30,10,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Ico name="coin" size={16} />
                {busy ? "이동 중…" : "3일 무료 체험 시작"}
              </button>
              {notice && (
                <div
                  role="status"
                  style={{
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 12,
                    color: "var(--ink)",
                    background: "var(--yellow)",
                    border: "1px solid var(--yellow-edge)",
                    borderRadius: 10,
                    padding: "8px 10px",
                  }}
                >
                  {notice}
                </div>
              )}
              <small
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                3일 후 {plan === "year" ? "₩39,000 / 년" : "₩3,900 / 월"} 자동
                결제 · 언제든 해지
                <br />
                약관 · 개인정보처리방침 · 환불정책
              </small>
            </>
        </div>
      </div>
    </>
  );
};
