// @ts-nocheck
import { useState } from 'react';
import { AUTH_TEXT, BrandMark, GoogleIcon, EyeIcon, pwdScore } from '@/components/auth-login';
import { useAuth } from '@/data/hooks/useAuth';

// ============================================================
// PC / DESKTOP AUTH SCREENS
// 좌측 브랜드 패널 + 우측 폼 (split layout)
// ============================================================

// ─────────── PC Field ───────────
function PCField({ label, type = "text", value, onChange, dark, rightSlot, autoFocus, placeholder, error }) {
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.55)" : "rgba(26,24,20,0.55)";
  const bg = dark ? "rgba(255,255,255,0.04)" : "#fff";
  const line = error ? "#dc4c3e" : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%" }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: mute, letterSpacing: "0.01em" }}>{label}</label>}
      <div style={{
        position: "relative",
        background: bg,
        border: `1px solid ${line}`,
        borderRadius: 10,
        transition: "border-color 0.15s",
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 14px",
            paddingRight: rightSlot ? 44 : 14,
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontFamily: "inherit",
            color: ink,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {rightSlot && <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>{rightSlot}</div>}
      </div>
      {error && <span style={{ fontSize: 12, color: "#dc4c3e", fontWeight: 500 }}>{error}</span>}
    </div>
  );
}

// ─────────── PC Button ───────────
function PCBtn({ children, kind = "primary", onClick, dark, disabled, full = true, size = "md" }) {
  const styles = {
    primary: { background: dark ? "#fff" : "#1a1814", color: dark ? "#1a1814" : "#fff", border: "1px solid transparent" },
    google: { background: dark ? "rgba(255,255,255,0.04)" : "#fff", color: dark ? "#fff" : "#1a1814", border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(0,0,0,0.1)" },
    ghost: { background: "transparent", color: dark ? "#fff" : "#1a1814", border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(0,0,0,0.1)" },
    yellow: { background: "#ffd84d", color: "#1a1814", border: "1px solid transparent" },
  };
  const sizes = {
    md: { padding: "12px 20px", fontSize: 14 },
    lg: { padding: "14px 22px", fontSize: 15 },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[kind], ...sizes[size],
      width: full ? "100%" : "auto",
      borderRadius: 10,
      fontWeight: 700,
      fontFamily: "inherit",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      letterSpacing: "-0.01em",
      transition: "all 0.1s",
    }}>{children}</button>
  );
}

// ─────────── Brand panel (left side, big visual) ───────────
function BrandPanel({ dark, lang }) {
  const t = AUTH_TEXT[lang];
  return (
    <div style={{
      flex: 1, height: "100%",
      background: "#1a1814",
      color: "#fff",
      padding: "48px 56px",
      display: "flex", flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* decorative shapes */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "#ffd84d", opacity: 0.15 }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "#dc4c3e", opacity: 0.12 }} />
      <div style={{ position: "absolute", top: "30%", left: "30%", width: 80, height: 80, borderRadius: "50%", background: "#ffd84d", opacity: 0.06 }} />

      {/* top: brand */}
      <div style={{ position: "relative" }}>
        <BrandMark size={32} dark={true} />
      </div>

      {/* center: marketing */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ffd84d", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
          {lang === "ko" ? "돈과 시간, 한 화면에서" : "Money & time, one place"}
        </div>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 18px", lineHeight: 1.15 }}>
          {lang === "ko" ? <>하루는 가볍게<br/>한 달은 단단하게.</> : <>Lighter days,<br/>stronger months.</>}
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6, maxWidth: 380 }}>
          {lang === "ko"
            ? "가계부와 캘린더를 한 곳에서 관리하세요. 영수증 사진 한 장이면 자동으로 입력됩니다."
            : "Track expenses and your calendar in one view. Snap a receipt and it logs itself."}
        </p>

        {/* mini preview card */}
        <div style={{
          marginTop: 36,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 14, padding: 20,
          display: "flex", gap: 14, alignItems: "center",
          maxWidth: 380,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ffd84d", display: "grid", placeItems: "center", fontSize: 22, color: "#1a1814" }}>💰</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{lang === "ko" ? "이번 달 예산" : "This month"}</div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 18, fontWeight: 800, marginTop: 2 }}>₩ 1,847,200<span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: 6 }}>/ 2.4M</span></div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: "77%", height: "100%", background: "#ffd84d" }} />
            </div>
          </div>
        </div>
      </div>

      {/* bottom: testimonial */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
        <div style={{ display: "flex" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: ["#ffd84d", "#dc4c3e", "#a8d4c0", "#e89aac"][i],
              border: "2px solid #1a1814",
              marginLeft: i === 0 ? 0 : -8,
            }} />
          ))}
        </div>
        <span>{lang === "ko" ? "10,000+ 직장인이 사용 중" : "10,000+ pros using it"}</span>
      </div>
    </div>
  );
}

// ============================================================
// PC LOGIN
// ============================================================
function PCLogin({ lang = "ko", dark = false, onSwitch }) {
  const t = AUTH_TEXT[lang];
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const r = await signIn(email, pwd);
      if (!r.ok) setErrorMsg(r.message || "로그인에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const subtle = dark ? "rgba(255,255,255,0.4)" : "rgba(26,24,20,0.42)";

  return (
    <div style={{ display: "flex", height: "100%", background: dark ? "#0e0d0a" : "#faf7f0" }}>
      <BrandPanel dark={dark} lang={lang} />
      <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: ink }}>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang === "ko" ? "로그인" : "Sign in"}</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", margin: "10px 0 8px", lineHeight: 1.15 }}>{t.loginTitle}</h1>
            <p style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}>{t.loginSub}</p>
          </div>

          <PCBtn kind="google" dark={dark} size="lg" disabled><GoogleIcon /> {t.google}</PCBtn>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: 11, color: subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.or}</span>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PCField label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark} />
            <PCField
              label={t.password}
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              dark={dark}
              rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: mute }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: dark ? "#ffd84d" : "#1a1814" }} />
              {lang === "ko" ? "로그인 상태 유지" : "Keep me signed in"}
            </label>
            <a onClick={() => onSwitch && onSwitch("forgot")} style={{ fontSize: 13, fontWeight: 600, color: ink, textDecoration: "none", cursor: "pointer" }}>{t.forgot}</a>
          </div>

          {errorMsg && (
            <div style={{ fontSize: 12, color: '#dc4c3e', textAlign: 'center', marginBottom: 4 }}>{errorMsg}</div>
          )}
          <PCBtn kind="primary" dark={dark} size="lg" onClick={handleSubmit} disabled={submitting || !email.includes("@") || pwd.length < 1}>{t.signin} →</PCBtn>

          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <span style={{ fontSize: 14, color: mute }}>
              {t.noAccount}{" "}
              <a onClick={() => onSwitch && onSwitch("signup")} style={{ color: ink, fontWeight: 700, textDecoration: "none", cursor: "pointer", borderBottom: `1.5px solid ${ink}` }}>{t.signup}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



// ============================================================
// PC SIGNUP
// ============================================================
function PCSignup({ lang = "ko", dark = false, onSwitch }) {
  const t = AUTH_TEXT[lang];
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
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
  const subtle = dark ? "rgba(255,255,255,0.4)" : "rgba(26,24,20,0.42)";
  const score = pwdScore(pwd);
  const pwdLabels = [t.pwdWeak, t.pwdWeak, t.pwdMid, t.pwdStrong];
  const pwdColors = ["#dc4c3e", "#dc4c3e", "#e8a93a", "#4a8d5a"];

  const Check = ({ on, onClick, label, required }) => (
    <label onClick={onClick} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: mute, lineHeight: 1.5 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${on ? ink : (dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)")}`,
        background: on ? ink : "transparent",
        display: "grid", placeItems: "center",
        marginTop: 1,
      }}>
        {on && <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1.5" stroke={dark ? "#1a1814" : "#ffd84d"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span>{label} {required && <span style={{ color: "#dc4c3e" }}>*</span>}</span>
    </label>
  );

  return (
    <div style={{ display: "flex", height: "100%", background: dark ? "#0e0d0a" : "#faf7f0" }}>
      <BrandPanel dark={dark} lang={lang} />
      <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: ink, overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang === "ko" ? "회원가입" : "Sign up"}</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", margin: "10px 0 8px", lineHeight: 1.15 }}>{t.signupTitle}</h1>
            <p style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}>{t.signupSub}</p>
          </div>

          <PCBtn kind="google" dark={dark} size="lg" disabled><GoogleIcon /> {t.google}</PCBtn>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: 11, color: subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.or}</span>
            <div style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PCField label={t.name} value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "ko" ? "홍길동" : "Jane Doe"} dark={dark} />
            <PCField label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark} />
            <div>
              <PCField
                label={t.password}
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="8+ chars"
                dark={dark}
                rightSlot={<div onClick={() => setShowPwd(s => !s)}><EyeIcon on={showPwd} dark={dark} /></div>}
              />
              {pwd.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <div style={{ display: "flex", gap: 4, flex: 1 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? pwdColors[score] : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pwdColors[score] }}>{pwdLabels[score]}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 16px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)", borderRadius: 10 }}>
            <Check on={agree} onClick={() => setAgree(!agree)} label={t.agree1} required />
            <Check on={marketing} onClick={() => setMarketing(!marketing)} label={t.agree2} />
          </div>

          {errorMsg && (
            <div style={{ fontSize: 12, color: '#dc4c3e', textAlign: 'center', marginBottom: 4 }}>{errorMsg}</div>
          )}
          {confirmMsg && (
            <div style={{ fontSize: 12, color: '#4a8d5a', textAlign: 'center', marginBottom: 4, lineHeight: 1.5 }}>{confirmMsg}</div>
          )}
          <PCBtn kind="primary" dark={dark} size="lg" onClick={handleSubmit} disabled={submitting || !agree || !email || pwd.length < 8 || !name}>{t.create} →</PCBtn>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 14, color: mute }}>
              {t.haveAccount}{" "}
              <a onClick={() => onSwitch && onSwitch("login")} style={{ color: ink, fontWeight: 700, textDecoration: "none", cursor: "pointer", borderBottom: `1.5px solid ${ink}` }}>{t.login}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



// ============================================================
// PC ONBOARDING — wider, two-column step layout
// ============================================================
function PCOnboarding({ lang = "ko", dark = false, initialStep = 0 }) {
  const t = AUTH_TEXT[lang];
  const [step, setStep] = useState(initialStep);
  const [purpose, setPurpose] = useState(2);
  const [salary, setSalary] = useState(25);
  const [picks, setPicks] = useState([0, 1, 2, 4]);
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const yellow = "#ffd84d";

  const togglePick = (i) => setPicks(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const stepTitles = lang === "ko"
    ? ["용도", "월급일", "카테고리", "준비 완료"]
    : ["Purpose", "Payday", "Categories", "Ready"];

  return (
    <div style={{ height: "100%", background: dark ? "#0e0d0a" : "#faf7f0", color: ink, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
        <BrandMark dark={dark} size={26} />
        <a style={{ fontSize: 13, fontWeight: 600, color: mute, cursor: "pointer", textDecoration: "none" }}>{t.skip} →</a>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left rail · steps */}
        <aside style={{
          width: 280, padding: "40px 32px",
          borderRight: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: mute, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            {lang === "ko" ? "시작하기" : "Get started"}
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {stepTitles.map((s, i) => {
              const done = i < step, on = i === step;
              return (
                <li key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: on ? (dark ? "rgba(255,216,77,0.1)" : "#fff") : "transparent",
                  border: on ? `1px solid ${yellow}` : "1px solid transparent",
                  transition: "all 0.15s",
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: done ? ink : (on ? yellow : "transparent"),
                    border: done || on ? "none" : `1.5px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
                    color: done ? yellow : "#1a1814",
                    display: "grid", placeItems: "center",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 12, fontWeight: 800,
                    flexShrink: 0,
                  }}>{done ? "✓" : (i + 1)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: on || done ? ink : mute }}>{s}</div>
                    <div style={{ fontSize: 11, color: mute, marginTop: 1 }}>
                      {[
                        lang === "ko" ? "주된 용도 선택" : "How you'll use it",
                        lang === "ko" ? "월급일 입력" : "When you get paid",
                        lang === "ko" ? "관심 카테고리" : "Pick categories",
                        lang === "ko" ? "마지막 점검" : "Final check",
                      ][i]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div style={{ marginTop: 32, padding: 16, background: dark ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: 10, border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, color: mute, fontWeight: 600 }}>💡 {lang === "ko" ? "팁" : "Tip"}</div>
            <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.5, color: ink }}>
              {lang === "ko" ? "지금 설정한 내용은 언제든 환경설정에서 바꿀 수 있어요." : "You can change any of these later in Settings."}
            </p>
          </div>
        </aside>

        {/* Right content */}
        <main style={{ flex: 1, padding: "48px 64px", display: "flex", flexDirection: "column", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: yellow, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t.obStep} {step + 1} / 4
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", margin: "10px 0 10px", lineHeight: 1.2 }}>
              {[t.ob1Title, t.ob2Title, t.ob3Title, t.ob4Title][step]}
            </h1>
            <p style={{ fontSize: 14, color: mute, margin: "0 0 36px", lineHeight: 1.5, maxWidth: 480 }}>
              {[t.ob1Sub, t.ob2Sub, t.ob3Sub, t.ob4Sub][step]}
            </p>

            {step === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  ["💰", t.purpose1, t.purpose1d],
                  ["📅", t.purpose2, t.purpose2d],
                  ["✨", t.purpose3, t.purpose3d],
                ].map(([ico, ttl, sub], i) => (
                  <button key={i} onClick={() => setPurpose(i)} style={{
                    padding: "20px 18px", textAlign: "left",
                    border: `1.5px solid ${purpose === i ? ink : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                    background: purpose === i ? (dark ? "rgba(255,216,77,0.06)" : "#fff") : "transparent",
                    borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                    display: "flex", flexDirection: "column", gap: 12,
                    minHeight: 140,
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: yellow, display: "grid", placeItems: "center", fontSize: 22 }}>{ico}</div>
                    <div>
                      <b style={{ display: "block", fontSize: 15, fontWeight: 700, color: ink }}>{ttl}</b>
                      <small style={{ display: "block", fontSize: 12, color: mute, marginTop: 4, lineHeight: 1.5 }}>{sub}</small>
                    </div>
                    {purpose === i && <div style={{ marginTop: "auto", fontSize: 12, fontWeight: 700, color: ink }}>✓ {lang === "ko" ? "선택됨" : "Selected"}</div>}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div style={{ maxWidth: 480, padding: "32px 36px", background: dark ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: 18, border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: mute, fontWeight: 600 }}>{t.salaryDay}</div>
                  <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, margin: "12px 0" }}>{salary}</div>
                  <div style={{ fontSize: 14, color: mute, fontWeight: 500 }}>{t.day} · {lang === "ko" ? "매월" : "every month"}</div>
                </div>
                <input type="range" min="1" max="31" value={salary} onChange={(e) => setSalary(+e.target.value)}
                  style={{ width: "100%", marginTop: 24, accentColor: yellow }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: mute, marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  <span>1</span><span>10</span><span>20</span><span>31</span>
                </div>
                <a style={{ display: "block", marginTop: 18, textAlign: "center", fontSize: 13, color: mute, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>{t.skipDay}</a>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {t.cats.map((c, i) => {
                    const on = picks.includes(i);
                    return (
                      <button key={i} onClick={() => togglePick(i)} style={{
                        padding: "10px 18px",
                        border: `1.5px solid ${on ? ink : (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)")}`,
                        background: on ? ink : "transparent",
                        color: on ? yellow : ink,
                        borderRadius: 99, cursor: "pointer",
                        fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                        transition: "all 0.12s",
                      }}>{on ? "✓ " : "+ "}{c}</button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: mute, fontFamily: "ui-monospace, monospace" }}>
                  {picks.length} {lang === "ko" ? "개 선택됨" : "selected"}
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
                <div style={{ background: yellow, borderRadius: 24, padding: "60px 32px", textAlign: "center", color: "#1a1814", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.15 }}>🎉</div>
                  <div style={{ fontSize: 72, position: "relative" }}>🚀</div>
                  <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", position: "relative" }}>{t.ob4Title}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[t.feature1, t.feature2, t.feature3].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: dark ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: 12, border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: yellow, display: "grid", placeItems: "center", color: "#1a1814", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>✓</div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ paddingTop: 24, display: "flex", gap: 10, justifyContent: "flex-end", borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)", marginTop: 24 }}>
            {step > 0 && step < 3 && <PCBtn kind="ghost" dark={dark} full={false} size="lg" onClick={() => setStep(step - 1)}>← {t.back}</PCBtn>}
            <PCBtn kind="primary" dark={dark} full={false} size="lg" onClick={() => setStep(Math.min(3, step + 1))}>
              {step === 3 ? `${t.done} 🚀` : `${t.next} →`}
            </PCBtn>
          </div>
        </main>
      </div>
    </div>
  );
}

export { PCLogin, PCSignup, PCOnboarding };