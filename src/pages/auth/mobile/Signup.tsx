// @ts-nocheck
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AUTH_TEXT } from "@/pages/auth/shared/AuthText";
import { EyeIcon } from "@/pages/auth/shared/EyeIcon";
import { BrandMark } from "@/pages/auth/shared/BrandMark";
import { Field } from "@/pages/auth/shared/Field";
import { Btn } from "@/pages/auth/shared/Btn";
import { GoogleIcon } from "@/pages/auth/shared/GoogleIcon";
import { pwdScore } from "@/pages/auth/shared/PwdScore";

export const SignupScreen = ({ variant = "A", lang = "ko", dark = false, onSwitch }) => {
  const t = AUTH_TEXT[lang];
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    setErrorMsg(null);
    setConfirmMsg(null);
    setSubmitting(true);
    try {
      const r = await signUp(email, pwd);
      if (!r.ok) {
        setErrorMsg(r.message || "가입에 실패했어요.");
      } else if (r.needsEmailConfirmation) {
        setConfirmMsg("이메일 확인하세요. 받은 편지함의 인증 링크를 눌러 가입을 완료해주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const score = pwdScore(pwd);
  const pwdLabels = [t.pwdWeak, t.pwdWeak, t.pwdMid, t.pwdStrong];
  const pwdColors = ["#dc4c3e", "#dc4c3e", "#e8a93a", "#4a8d5a"];

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

  const Check = ({ on, onClick, label, required }) => (
    <label onClick={onClick} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: mute, lineHeight: 1.5 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${on ? (dark ? "#fff" : "#1a1814") : (dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)")}`,
        background: on ? (dark ? "#fff" : "#1a1814") : "transparent",
        display: "grid", placeItems: "center",
        marginTop: 1,
      }}>
        {on && <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1.5" stroke={dark ? "#1a1814" : "#ffd84d"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span>{label} {required && <span style={{ color: "#dc4c3e" }}>*</span>}</span>
    </label>
  );

  // ─────── A · Single page form ───────
  if (variant === "A") {
    return (
      <div style={{
        minHeight: "100vh",
        background: dark ? "#0e0d0a" : "#faf7f0",
        padding: "44px 24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        color: ink,
      }}>
        <div>
          <BrandMark dark={dark} size={28} />
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "24px 0 8px", lineHeight: 1.15 }}>{t.signupTitle}</h1>
          <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.signupSub}</p>
        </div>

        <Btn kind="google" dark={dark}><GoogleIcon /> {t.google}</Btn>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 11, color: mute, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.or}</span>
          <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label={t.name} value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "ko" ? "홍길동" : "Jane Doe"} dark={dark} />
          <Field label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark} />
          <div>
            <Field
              label={t.password}
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="8+ chars"
              dark={dark}
              rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>}
            />
            {Strength}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 14px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", borderRadius: 12 }}>
          <Check on={agree} onClick={() => setAgree(!agree)} label={t.agree1} required />
          <Check on={marketing} onClick={() => setMarketing(!marketing)} label={t.agree2} />
        </div>

        {errorMsg && (
          <div style={{ fontSize: 12, color: '#dc4c3e', textAlign: 'center', marginBottom: 4 }}>{errorMsg}</div>
        )}
        {confirmMsg && (
          <div style={{ fontSize: 12, color: '#4a8d5a', textAlign: 'center', marginBottom: 4, lineHeight: 1.5 }}>{confirmMsg}</div>
        )}
        <Btn kind="primary" dark={dark} onClick={handleSubmit} disabled={submitting || !agree || !email || pwd.length < 8 || !name}>{t.create} →</Btn>

        <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 8 }}>
          <span style={{ fontSize: 13, color: mute }}>
            {t.haveAccount}{" "}
            <a onClick={() => onSwitch && onSwitch("login")} style={{ color: ink, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>{t.login}</a>
          </span>
        </div>
      </div>
    );
  }

  // ─────── B · Yellow hero (matches login B) ───────
  if (variant === "B") {
    return (
      <div style={{ minHeight: "100vh", background: dark ? "#0e0d0a" : "#faf7f0", display: "flex", flexDirection: "column", color: ink }}>
        <div style={{ background: "#1a1814", color: "#fff", padding: "52px 24px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 30, right: -10, fontSize: 80, opacity: 0.08, fontWeight: 800 }}>👋</div>
          <BrandMark size={28} dark={true} />
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "24px 0 6px", lineHeight: 1.15 }}>{t.signupTitle}</h1>
          <p style={{ fontSize: 13, margin: 0, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{t.signupSub}</p>
        </div>

        <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <Btn kind="google" dark={dark}><GoogleIcon /> {t.google}</Btn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: 11, color: mute, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.or}</span>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          </div>
          <Field label={t.name} value={name} onChange={(e) => setName(e.target.value)} dark={dark} placeholder={lang === "ko" ? "홍길동" : "Jane Doe"} />
          <Field label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} dark={dark} placeholder="you@example.com" />
          <div>
            <Field label={t.password} type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} dark={dark} placeholder="8+"
              rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>} />
            {Strength}
          </div>
          <Check on={agree} onClick={() => setAgree(!agree)} label={t.agree1} required />
          <Btn kind="yellow" disabled={!agree || !email || pwd.length < 8 || !name}>{t.create} →</Btn>
          <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 12 }}>
            <span style={{ fontSize: 13, color: mute }}>
              {t.haveAccount}{" "}
              <a onClick={() => onSwitch && onSwitch("login")} style={{ color: ink, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>{t.login}</a>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─────── C · Two-step (email first, then details) ───────
  const [step, setStep] = useState(0);
  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0e0d0a" : "#faf7f0", padding: "44px 24px 28px", display: "flex", flexDirection: "column", gap: 22, color: ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BrandMark dark={dark} size={26} />
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 24, height: 4, borderRadius: 2, background: ink }} />
          <div style={{ width: 24, height: 4, borderRadius: 2, background: step === 1 ? ink : (dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)") }} />
        </div>
      </div>

      {step === 0 ? (
        <>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang === "ko" ? "1/2 · 시작" : "1/2 · Start"}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 8px" }}>{lang === "ko" ? "어떤 이메일로 시작할까요?" : "What email should we use?"}</h1>
            <p style={{ fontSize: 13, color: mute, margin: 0 }}>{t.signupSub}</p>
          </div>
          <Field label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark} autoFocus />
          <Btn kind="primary" dark={dark} disabled={!email.includes("@")} onClick={() => setStep(1)}>{t.next} →</Btn>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: 11, color: mute, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.or}</span>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          </div>
          <Btn kind="google" dark={dark}><GoogleIcon /> {t.google}</Btn>
        </>
      ) : (
        <>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang === "ko" ? "2/2 · 마무리" : "2/2 · Finish"}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 8px" }}>{lang === "ko" ? "거의 다 왔어요" : "Almost there"}</h1>
            <p style={{ fontSize: 13, color: mute, margin: 0 }}>{email}</p>
          </div>
          <Field label={t.name} value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "ko" ? "어떻게 불러드릴까요?" : "What should we call you?"} dark={dark} autoFocus />
          <div>
            <Field label={t.password} type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="8+" dark={dark}
              rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>} />
            {Strength}
          </div>
          <Check on={agree} onClick={() => setAgree(!agree)} label={t.agree1} required />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="ghost" dark={dark} full={false} onClick={() => setStep(0)}>← {t.back}</Btn>
            <Btn kind="primary" dark={dark} disabled={!agree || !name || pwd.length < 8}>{t.create}</Btn>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 8 }}>
        <span style={{ fontSize: 13, color: mute }}>
          {t.haveAccount}{" "}
          <a onClick={() => onSwitch && onSwitch("login")} style={{ color: ink, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>{t.login}</a>
        </span>
      </div>
    </div>
  );
}
