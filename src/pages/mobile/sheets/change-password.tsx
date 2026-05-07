// @ts-nocheck
import { useState } from "react";
import { Ico } from "@/pages/mobile/shared/ico";

export const ChangePasswordSheet = ({ open, onClose, email = "nabi@dayflow.app" }) => {
  // 0 · confirm send  ·  1 · sent (waiting)
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [resentAt, setResentAt] = useState(0);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setStep(0); setSending(false); setResentAt(0); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSend = () => {
    if (sending) return;
    setSending(true);
    setTimeout(() => { setSending(false); setStep(1); }, 600);
  };

  const handleResend = () => {
    setResentAt(Date.now());
    setTimeout(() => setResentAt(0), 2400);
  };

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">비밀번호 변경<small>이메일로 안전하게 재설정해요</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {step === 0 && (
            <div style={{ padding: "8px 0 4px" }}>
              {/* hero */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "12px 0 18px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20, marginBottom: 16,
                  background: "var(--yellow, #ffd84d)", display: "grid", placeItems: "center",
                  fontSize: 28,
                }}>🔑</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                  이메일로 재설정 링크를 보내드려요
                </h2>
                <small style={{ fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.55, maxWidth: 260, display: "block" }}>
                  아래 이메일 주소로 재설정 링크가 전송됩니다.<br />링크를 눌러 새 비밀번호를 설정해주세요.
                </small>
              </div>

              {/* email pill */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 12,
                background: "var(--bg-paper)", border: "1px solid var(--line)",
                marginBottom: 14,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--ink)", color: "var(--bg-paper)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Ico name="bell" size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-mute)", fontWeight: 600, marginBottom: 2 }}>가입한 이메일</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
                </div>
              </div>

              {/* security tip */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,216,77,0.18)", border: "1px solid rgba(255,216,77,0.4)",
                marginBottom: 18,
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>🛡️</span>
                <small style={{ fontSize: 11, color: "var(--ink)", lineHeight: 1.5 }}>
                  보안을 위해 링크는 <b>1시간</b> 동안만 유효해요. 본인이 요청한 게 아니면 무시해도 됩니다.
                </small>
              </div>

              {/* actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>취소</button>
                <button onClick={handleSend} disabled={sending}
                  style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
                    background: "var(--ink)", color: "var(--bg-paper)",
                    fontWeight: 700, fontSize: 13, cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}>
                  {sending ? "보내는 중…" : "재설정 링크 보내기"}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ padding: "12px 0 4px", textAlign: "center" }}>
              {/* mailbox icon */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 18 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: 26,
                  background: "var(--yellow, #ffd84d)",
                  display: "grid", placeItems: "center", fontSize: 44,
                  boxShadow: "0 12px 28px rgba(255,216,77,0.4)",
                }}>📬</div>
                <div style={{
                  position: "absolute", top: -6, right: -10,
                  background: "#4a8d5a", color: "#fff",
                  padding: "4px 10px", borderRadius: 99,
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                  transform: "rotate(8deg)",
                }}>SENT</div>
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                메일을 보냈어요
              </h2>
              <small style={{ fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.55, display: "block", maxWidth: 280, margin: "0 auto 14px" }}>
                받은 편지함에서 이메일을 확인하고<br />링크를 눌러 비밀번호를 다시 만들어주세요
              </small>

              {/* email pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 99,
                background: "var(--bg-paper)", border: "1px solid var(--line)",
                fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
                marginBottom: 18,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4a8d5a" }} />
                {email}
              </div>

              {/* tip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,216,77,0.18)", border: "1px solid rgba(255,216,77,0.4)",
                fontSize: 11, color: "var(--ink)", textAlign: "left",
                marginBottom: 18,
              }}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{ lineHeight: 1.4 }}>메일이 안 보이면 스팸함을 확인해주세요</span>
              </div>

              {/* actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={onClose}
                  style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                    background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  확인
                </button>
                <button onClick={handleResend}
                  style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                    background: "transparent", color: "var(--ink-mute)",
                    fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  {resentAt ? "✓ 다시 보냈어요" : "다시 보내기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

