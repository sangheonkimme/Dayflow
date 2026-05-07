import {    useState , useMemo , useEffect , useRef } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";

export const UpgradeSheet = ({ open, onClose }: any) => {
  const [plan, setPlan] = useState("year"); // month | year
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setConfirmed(false);
        setPlan("year");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

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
        className={`dfm-sheet-scrim ${open ? "on" : ""}`}
        onClick={onClose}
      />
      <div
        className={`dfm-sheet ${open ? "on" : ""}`}
        style={{ height: "92vh", maxHeight: "92vh" }}
      >
        <div className="dfm-sheet-grip" />
        <div
          className="dfm-sheet-head"
          style={{ borderBottom: "none", paddingBottom: 4 }}
        >
          <div className="ttl" style={{ visibility: "hidden" }}>
            x
          </div>
          <button className="close" onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div
          className="dfm-sheet-body"
          style={{ padding: "0 18px 22px", overflowY: "auto" }}
        >
          {!confirmed && (
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
                className="dfm-card"
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
                      className="dfm-tool-ico"
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
                    onClick={() => setPlan(p.id)}
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
                onClick={() => setConfirmed(true)}
                style={{
                  width: "100%",
                  padding: "16px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "var(--ink)",
                  color: "#ffd84d",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(40,30,10,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Ico name="coin" size={16} />
                3일 무료 체험 시작
              </button>
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
          )}

          {confirmed && (
            <div style={{ padding: "22px 0", textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  margin: "0 auto 18px",
                  background: "var(--mint, #b9e7c9)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 8px 24px rgba(40,30,10,0.12)",
                }}
              >
                <Ico name="check" size={32} />
              </div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: "0 0 8px",
                  fontFamily: "var(--hand)",
                }}
              >
                Pro에 오신 것을 환영해요!
              </h2>
              <small
                style={{
                  fontSize: 12,
                  color: "var(--ink-mute)",
                  display: "block",
                  marginBottom: 22,
                }}
              >
                3일 무료 체험이 시작됐어요 · {plan === "year" ? "연간" : "월간"}{" "}
                플랜
              </small>

              <div
                className="dfm-card"
                style={{
                  padding: "14px 16px",
                  marginBottom: 18,
                  textAlign: "left",
                  background: "var(--yellow)",
                  borderColor: "var(--yellow-edge)",
                }}
              >
                <small
                  style={{
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    letterSpacing: 0.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  다음 결제일
                </small>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "var(--mono)",
                    margin: "4px 0 2px",
                  }}
                >
                  2026년 11월 9일
                </div>
                <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                  {plan === "year" ? "₩39,000 / 년 (연간)" : "₩3,900 / 월"} ·
                  Apple ID로 결제
                </small>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  background: "var(--ink)",
                  color: "var(--bg-paper)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Pro 기능 둘러보기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
