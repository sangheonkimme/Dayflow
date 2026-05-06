/* global React, AUTH_TEXT, BrandMark, Field, Btn, GoogleIcon, EyeIcon, pwdScore */
const { useState: useStateS } = React;

// ============================================================
// SIGNUP
// ============================================================
function SignupScreen({ variant = "A", lang = "ko", dark = false, onSwitch }) {
  const t = AUTH_TEXT[lang];
  const [name, setName] = useStateS("");
  const [email, setEmail] = useStateS("");
  const [pwd, setPwd] = useStateS("");
  const [pwd2, setPwd2] = useStateS("");
  const [agree, setAgree] = useStateS(false);
  const [marketing, setMarketing] = useStateS(false);
  const [showPwd, setShowPwd] = useStateS(false);
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
        minHeight: "100%",
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

        <Btn kind="primary" dark={dark} disabled={!agree || !email || pwd.length < 8 || !name}>{t.create} →</Btn>

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
      <div style={{ minHeight: "100%", background: dark ? "#0e0d0a" : "#faf7f0", display: "flex", flexDirection: "column", color: ink }}>
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
  const [step, setStep] = useStateS(0);
  return (
    <div style={{ minHeight: "100%", background: dark ? "#0e0d0a" : "#faf7f0", padding: "44px 24px 28px", display: "flex", flexDirection: "column", gap: 22, color: ink }}>
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

window.SignupScreen = SignupScreen;


// ============================================================
// ONBOARDING — 4 steps
// ============================================================
function OnboardingScreen({ variant = "A", lang = "ko", dark = false, initialStep = 0 }) {
  const t = AUTH_TEXT[lang];
  const [step, setStep] = useStateS(initialStep);
  const [purpose, setPurpose] = useStateS(2);
  const [salary, setSalary] = useStateS(25);
  const [picks, setPicks] = useStateS([0, 1, 2, 4]);
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const yellow = "#ffd84d";
  const totalSteps = 4;

  const togglePick = (i) => setPicks(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  // ─────── Variant A · Stepper layout ───────
  if (variant === "A") {
    return (
      <div style={{ minHeight: "100%", background: dark ? "#0e0d0a" : "#faf7f0", display: "flex", flexDirection: "column", color: ink }}>
        <div style={{ padding: "44px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === step ? 24 : 6, height: 6, borderRadius: 99,
                background: i <= step ? ink : (dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
                transition: "all 0.2s",
              }} />
            ))}
          </div>
          <a style={{ fontSize: 12, fontWeight: 600, color: mute, cursor: "pointer", textDecoration: "none" }}>{t.skip}</a>
        </div>

        <div style={{ flex: 1, padding: "32px 24px 24px", display: "flex", flexDirection: "column" }}>
          {step === 0 && (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 8px", lineHeight: 1.2 }}>{t.ob1Title}</h1>
              <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.ob1Sub}</p>
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["💰", t.purpose1, t.purpose1d],
                  ["📅", t.purpose2, t.purpose2d],
                  ["✨", t.purpose3, t.purpose3d],
                ].map(([ico, ttl, sub], i) => (
                  <button key={i} onClick={() => setPurpose(i)} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 16px",
                    border: `1.5px solid ${purpose === i ? ink : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)")}`,
                    background: purpose === i ? (dark ? "rgba(255,255,255,0.05)" : "#fff") : "transparent",
                    borderRadius: 14, cursor: "pointer",
                    fontFamily: "inherit", textAlign: "left",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: yellow, display: "grid", placeItems: "center", fontSize: 22 }}>{ico}</div>
                    <div style={{ flex: 1 }}>
                      <b style={{ display: "block", fontSize: 15, fontWeight: 700, color: ink }}>{ttl}</b>
                      <small style={{ display: "block", fontSize: 12, color: mute, marginTop: 2 }}>{sub}</small>
                    </div>
                    {purpose === i && (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: ink, display: "grid", placeItems: "center" }}>
                        <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1.5" stroke={dark ? "#1a1814" : yellow} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 8px", lineHeight: 1.2 }}>{t.ob2Title}</h1>
              <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.ob2Sub}</p>
              <div style={{ marginTop: 36, textAlign: "center", padding: "24px 16px", background: dark ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: 18, border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 12, color: mute, fontWeight: 600 }}>{t.salaryDay}</div>
                <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, margin: "10px 0", color: ink }}>{salary}</div>
                <div style={{ fontSize: 14, color: mute, fontWeight: 500 }}>{t.day} · {lang === "ko" ? "매월" : "every month"}</div>
                <input type="range" min="1" max="31" value={salary} onChange={(e) => setSalary(+e.target.value)}
                  style={{ width: "100%", marginTop: 24, accentColor: yellow }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: mute, marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  <span>1</span><span>15</span><span>31</span>
                </div>
              </div>
              <a style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: mute, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>{t.skipDay}</a>
            </>
          )}

          {step === 2 && (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 8px", lineHeight: 1.2 }}>{t.ob3Title}</h1>
              <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>{t.ob3Sub}</p>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {t.cats.map((c, i) => {
                  const on = picks.includes(i);
                  return (
                    <button key={i} onClick={() => togglePick(i)} style={{
                      padding: "10px 16px",
                      border: `1.5px solid ${on ? ink : (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)")}`,
                      background: on ? ink : "transparent",
                      color: on ? (dark ? "#1a1814" : yellow) : ink,
                      borderRadius: 99, cursor: "pointer",
                      fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                      transition: "all 0.12s",
                    }}>{on ? "✓ " : "+ "}{c}</button>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, fontSize: 11, color: mute, fontFamily: "ui-monospace, monospace" }}>
                {picks.length} {lang === "ko" ? "개 선택됨" : "selected"}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: 16 }}>
                <div style={{ width: 110, height: 110, borderRadius: 32, background: yellow, display: "grid", placeItems: "center", marginBottom: 24, position: "relative", boxShadow: "0 12px 30px rgba(255,216,77,0.4)" }}>
                  <span style={{ fontSize: 56 }}>🎉</span>
                  <div style={{ position: "absolute", top: -6, right: -6, background: "#dc4c3e", color: "#fff", padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", transform: "rotate(8deg)" }}>READY</div>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 8px" }}>{t.ob4Title}</h1>
                <p style={{ fontSize: 14, color: mute, margin: "0 0 28px", lineHeight: 1.5, maxWidth: 280 }}>{t.ob4Sub}</p>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                  {[t.feature1, t.feature2, t.feature3].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: dark ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: 12, border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: yellow, display: "grid", placeItems: "center", color: "#1a1814", fontWeight: 800, fontSize: 13 }}>✓</div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", gap: 8 }}>
            {step > 0 && step < 3 && <Btn kind="ghost" dark={dark} full={false} onClick={() => setStep(step - 1)}>← {t.back}</Btn>}
            <Btn kind="primary" dark={dark} onClick={() => setStep(Math.min(3, step + 1))}>
              {step === 3 ? t.done : t.next} {step === 3 ? "🚀" : "→"}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ─────── Variant B · Big illustrated card ───────
  if (variant === "B") {
    const heroBg = ["#ffd84d", "#c8e8d2", "#ffd5dc", "#1a1814"];
    return (
      <div style={{ minHeight: "100%", background: dark ? "#0e0d0a" : "#faf7f0", display: "flex", flexDirection: "column", color: ink }}>
        <div style={{ padding: "44px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: mute, fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em" }}>{step + 1} / {totalSteps}</span>
          <a style={{ fontSize: 12, fontWeight: 600, color: mute, cursor: "pointer", textDecoration: "none" }}>{t.skip}</a>
        </div>

        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{
            background: heroBg[step],
            color: step === 3 ? "#fff" : "#1a1814",
            borderRadius: 24, padding: "36px 22px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.08, fontSize: 220, lineHeight: 1, fontWeight: 800, color: "#000", display: "grid", placeItems: "center" }}>
              {["💰", "📅", "🏷️", "🎉"][step]}
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.65, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.obStep} {step + 1}</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.025em", margin: "10px 0 6px", lineHeight: 1.2 }}>
                {[t.ob1Title, t.ob2Title, t.ob3Title, t.ob4Title][step]}
              </h1>
              <p style={{ fontSize: 13, margin: 0, opacity: 0.7, lineHeight: 1.5 }}>
                {[t.ob1Sub, t.ob2Sub, t.ob3Sub, t.ob4Sub][step]}
              </p>
            </div>
          </div>

          <div style={{ flex: 1, paddingTop: 22 }}>
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[t.purpose1, t.purpose2, t.purpose3].map((p, i) => (
                  <button key={i} onClick={() => setPurpose(i)} style={{
                    padding: "14px 16px",
                    border: `1.5px solid ${purpose === i ? ink : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)")}`,
                    background: purpose === i ? (dark ? "rgba(255,255,255,0.05)" : "#fff") : "transparent",
                    borderRadius: 12, cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                    color: ink,
                  }}>{p}</button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <div style={{ fontSize: 56, fontWeight: 800, textAlign: "center", margin: "8px 0 16px", color: ink }}>{salary}{lang === "ko" ? "일" : ""}</div>
                <input type="range" min="1" max="31" value={salary} onChange={(e) => setSalary(+e.target.value)} style={{ width: "100%", accentColor: yellow }} />
              </div>
            )}
            {step === 2 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {t.cats.slice(0, 9).map((c, i) => {
                  const on = picks.includes(i);
                  return (
                    <button key={i} onClick={() => togglePick(i)} style={{
                      padding: "9px 14px",
                      border: `1.5px solid ${on ? ink : (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)")}`,
                      background: on ? ink : "transparent",
                      color: on ? yellow : ink,
                      borderRadius: 99, fontWeight: 600, fontSize: 13,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>{c}</button>
                  );
                })}
              </div>
            )}
            {step === 3 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[t.feature1, t.feature2, t.feature3].map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: ink }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: yellow, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {step > 0 && step < 3 && <Btn kind="ghost" dark={dark} full={false} onClick={() => setStep(step - 1)}>←</Btn>}
            <Btn kind="primary" dark={dark} onClick={() => setStep(Math.min(3, step + 1))}>
              {step === 3 ? t.done : t.next}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ─────── Variant C · Conversational, no progress bar ───────
  return (
    <div style={{ minHeight: "100%", background: dark ? "#0e0d0a" : "#faf7f0", padding: "44px 24px 24px", display: "flex", flexDirection: "column", color: ink }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <BrandMark dark={dark} size={24} />
        <a style={{ fontSize: 12, fontWeight: 600, color: mute, cursor: "pointer", textDecoration: "none" }}>{t.skip}</a>
      </div>

      <div style={{ flex: 1, paddingTop: 36 }}>
        {step < 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: yellow, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 14 }}>👋</div>
              <div style={{ background: dark ? "rgba(255,255,255,0.06)" : "#fff", padding: "12px 14px", borderRadius: "16px 16px 16px 4px", maxWidth: "85%", border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: ink, lineHeight: 1.4 }}>
                  {[t.ob1Title, t.ob2Title, t.ob3Title][step]}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: mute, lineHeight: 1.4 }}>
                  {[t.ob1Sub, t.ob2Sub, t.ob3Sub][step]}
                </p>
              </div>
            </div>

            <div style={{ paddingLeft: 42, marginTop: 8 }}>
              {step === 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
                  {[t.purpose1, t.purpose2, t.purpose3].map((p, i) => (
                    <button key={i} onClick={() => { setPurpose(i); setTimeout(() => setStep(1), 200); }} style={{
                      padding: "10px 16px",
                      border: `1.5px solid ${purpose === i ? ink : (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)")}`,
                      background: purpose === i ? ink : "transparent",
                      color: purpose === i ? yellow : ink,
                      borderRadius: 99, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                    }}>{p}</button>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div style={{ background: ink, color: yellow, padding: "16px 18px", borderRadius: "16px 16px 4px 16px", marginLeft: "auto", maxWidth: "85%", textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>{t.salaryDay}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>{salary}{lang === "ko" ? "일" : ""}</div>
                  <input type="range" min="1" max="31" value={salary} onChange={(e) => setSalary(+e.target.value)} style={{ width: "100%", marginTop: 10, accentColor: yellow }} />
                </div>
              )}
              {step === 2 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                  {t.cats.map((c, i) => {
                    const on = picks.includes(i);
                    return (
                      <button key={i} onClick={() => togglePick(i)} style={{
                        padding: "7px 12px",
                        border: `1.5px solid ${on ? ink : (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)")}`,
                        background: on ? ink : "transparent",
                        color: on ? yellow : ink,
                        borderRadius: 99, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit",
                      }}>{c}</button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", paddingTop: 30 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 10px" }}>{t.ob4Title}</h1>
            <p style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}>{t.ob4Sub}</p>
          </div>
        )}
      </div>

      <Btn kind="primary" dark={dark} onClick={() => setStep(Math.min(3, step + 1))}>
        {step === 3 ? t.done : (step === 0 ? t.skip : t.next)} {step === 3 ? "🚀" : "→"}
      </Btn>
    </div>
  );
}

window.OnboardingScreen = OnboardingScreen;
