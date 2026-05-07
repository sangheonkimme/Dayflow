// @ts-nocheck
import { pwdScore } from "@/pages/auth/shared/PwdScore";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AUTH_TEXT } from "@/pages/auth/shared/AuthText";
import { EyeIcon } from "@/pages/auth/shared/EyeIcon";
import { BrandMark } from "@/pages/auth/shared/BrandMark";
import { Field } from "@/pages/auth/shared/Field";
import { Btn } from "@/pages/auth/shared/Btn";

export const ForgotScreen = ({ lang = "ko", dark = false, initialStep = 0, onBackToLogin }) => {
  const t = AUTH_TEXT[lang];
  const { sendPasswordReset } = useAuth();
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendReset = async () => {
    if (submitting) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const r = await sendPasswordReset(email);
      if (!r.ok) setErrorMsg(r.message || "메일 전송에 실패했어요.");
      else setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const yellow = "#ffd84d";
  const bg = dark ? "#0e0d0a" : "#faf7f0";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "#fff";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)";

  const score = pwdScore(pwd);
  const pwdLabels = [t.pwdWeak, t.pwdWeak, t.pwdMid, t.pwdStrong];
  const pwdColors = ["#dc4c3e", "#dc4c3e", "#e8a93a", "#4a8d5a"];
  const mismatch = pwd2.length > 0 && pwd !== pwd2;

  const Strength = pwd.length > 0 && (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? pwdColors[score] : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: pwdColors[score] }}>{pwdLabels[score]}</span>
    </div>
  );

  // Top progress (3 dots)
  const Progress = () => (
    <div style={{ display: "flex", gap: 6 }}>
      {[0,1,2].map(i => {
        const active = (step === 0 && i === 0) || (step === 1 && i === 1) || (step >= 2 && i === 2);
        const done = (step === 1 && i === 0) || (step >= 2 && i <= 1);
        return (
          <div key={i} style={{
            width: active ? 24 : 6, height: 6, borderRadius: 99,
            background: active || done ? ink : (dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
            transition: "all 0.2s",
          }} />
        );
      })}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "44px 24px 28px", display: "flex", flexDirection: "column", color: ink, gap: 22 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBackToLogin} style={{
          width: 36, height: 36, borderRadius: 12,
          background: "transparent", border: "none",
          display: "grid", placeItems: "center", cursor: "pointer",
          color: ink,
        }} aria-label="back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <Progress />
        <div style={{ width: 36 }} />
      </div>

      {/* STEP 0 · Email entry */}
      {step === 0 && (
        <>
          <div style={{ marginTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: yellow, display: "grid", placeItems: "center", marginBottom: 22, fontSize: 30 }}>🔑</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.fpStep} 1/3</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 6px", lineHeight: 1.2 }}>{t.fpTitle}</h1>
            <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.fpSub}</p>
          </div>
          <Field label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark} autoFocus />
          {errorMsg && (
            <div style={{ fontSize: 12, color: '#dc4c3e', textAlign: 'center', marginBottom: 4 }}>{errorMsg}</div>
          )}
          <Btn kind="primary" dark={dark} disabled={submitting || !email.includes("@")} onClick={handleSendReset}>{t.fpSend} →</Btn>
          <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 8 }}>
            <a onClick={onBackToLogin} style={{ fontSize: 13, color: ink, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>← {t.fpBackToLogin}</a>
          </div>
        </>
      )}

      {/* STEP 1 · Email sent */}
      {step === 1 && (
        <>
          <div style={{ marginTop: 16, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div style={{ width: 110, height: 110, borderRadius: 28, background: yellow, display: "grid", placeItems: "center", fontSize: 52, boxShadow: "0 12px 30px rgba(255,216,77,0.4)" }}>📬</div>
              <div style={{ position: "absolute", top: -6, right: -6, background: "#4a8d5a", color: "#fff", padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", transform: "rotate(8deg)" }}>SENT</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.fpStep} 2/3</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 8px", lineHeight: 1.2 }}>{t.fpSentTitle}</h1>
            <p style={{ fontSize: 13, color: mute, margin: "0 0 6px", lineHeight: 1.5, maxWidth: 280 }}>{t.fpSentSub}</p>
            <div style={{ marginTop: 18, padding: "10px 16px", background: cardBg, border: cardBorder, borderRadius: 99, fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 600, color: ink }}>{email}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn kind="primary" dark={dark} onClick={() => setStep(2)}>{t.fpOpenMail} 📧</Btn>
            <button onClick={handleSendReset} disabled={submitting} style={{
              padding: "12px", border: "none", background: "transparent",
              color: mute, fontSize: 13, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: submitting ? 0.5 : 1,
            }}>{t.fpResend}</button>
          </div>

          <div style={{
            background: dark ? "rgba(255,216,77,0.08)" : "rgba(255,216,77,0.18)",
            border: dark ? "1px solid rgba(255,216,77,0.18)" : "1px solid rgba(255,216,77,0.4)",
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 12, color: ink,
          }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <span style={{ lineHeight: 1.4 }}>{t.fpCheckSpam}</span>
          </div>
        </>
      )}

      {/* STEP 2 · Set new password */}
      {step === 2 && (
        <>
          <div style={{ marginTop: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: ink, color: yellow, display: "grid", placeItems: "center", marginBottom: 22, fontSize: 28 }}>🔒</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.fpStep} 3/3</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 6px", lineHeight: 1.2 }}>{t.fpResetTitle}</h1>
            <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.fpResetSub}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <Field
                label={t.fpNewPwd}
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="8+ chars"
                dark={dark}
                autoFocus
                rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>}
              />
              {Strength}
            </div>
            <Field
              label={t.fpNewPwd2}
              type={showPwd ? "text" : "password"}
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              placeholder=""
              dark={dark}
              error={mismatch ? t.fpEmailNotMatch : null}
            />
          </div>

          <div style={{
            background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)",
            borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 12, color: mute,
          }}>
            <span style={{ fontSize: 13 }}>⏱</span>
            <span style={{ lineHeight: 1.4 }}>{t.fpSecurityTip}</span>
          </div>

          <Btn kind="primary" dark={dark} disabled={pwd.length < 8 || pwd !== pwd2} onClick={() => setStep(3)}>{t.fpReset}</Btn>
        </>
      )}

      {/* STEP 3 · Done */}
      {step === 3 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: 16 }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#4a8d5a", display: "grid", placeItems: "center", marginBottom: 24, boxShadow: "0 12px 30px rgba(74,141,90,0.35)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 8px" }}>{t.fpResetDone}</h1>
          <p style={{ fontSize: 14, color: mute, margin: "0 0 28px", lineHeight: 1.5, maxWidth: 280 }}>{t.fpResetDoneSub}</p>
          <div style={{ width: "100%" }}>
            <Btn kind="primary" dark={dark} onClick={onBackToLogin}>{t.fpBackToLogin} →</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
