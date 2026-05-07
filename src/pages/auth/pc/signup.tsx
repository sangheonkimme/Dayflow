// @ts-nocheck
import { useState } from "react";
import { AUTH_TEXT, GoogleIcon, pwdScore } from "@/components/auth-login";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PCField } from "@/pages/auth/pc/field";
import { PCBtn } from "@/pages/auth/pc/btn";
import { BrandPanel } from "@/pages/auth/pc/brand-panel";

export const PCSignup = ({ lang = "ko", dark = false, onSwitch }) => {
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
        setConfirmMsg(
          "이메일 확인하세요. 받은 편지함의 인증 링크를 눌러 가입을 완료해주세요.",
        );
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
    <label
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: "pointer",
        fontSize: 13,
        color: mute,
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          flexShrink: 0,
          border: `1.5px solid ${on ? ink : dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}`,
          background: on ? ink : "transparent",
          display: "grid",
          placeItems: "center",
          marginTop: 1,
        }}
      >
        {on && (
          <svg width="11" height="9" viewBox="0 0 11 9">
            <path
              d="M1 4.5L4 7.5L10 1.5"
              stroke={dark ? "#1a1814" : "#ffd84d"}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>
        {label} {required && <span style={{ color: "#dc4c3e" }}>*</span>}
      </span>
    </label>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: dark ? "#0e0d0a" : "#faf7f0",
      }}
    >
      <BrandPanel dark={dark} lang={lang} />
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          color: ink,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: mute,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {lang === "ko" ? "회원가입" : "Sign up"}
            </div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: "10px 0 8px",
                lineHeight: 1.15,
              }}
            >
              {t.signupTitle}
            </h1>
            <p
              style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}
            >
              {t.signupSub}
            </p>
          </div>

          <PCBtn kind="google" dark={dark} size="lg" disabled>
            <GoogleIcon /> {t.google}
          </PCBtn>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: subtle,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {t.or}
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PCField
              label={t.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "ko" ? "홍길동" : "Jane Doe"}
              dark={dark}
            />
            <PCField
              label={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              dark={dark}
            />
            <div>
              <PCField
                label={t.password}
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="8+ chars"
                dark={dark}
                rightSlot={
                  <div onClick={() => setShowPwd((s) => !s)}>
                    <EyeIcon on={showPwd} dark={dark} />
                  </div>
                }
              />
              {pwd.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 4, flex: 1 }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background:
                            i < score
                              ? pwdColors[score]
                              : dark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: pwdColors[score],
                    }}
                  >
                    {pwdLabels[score]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "14px 16px",
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)",
              borderRadius: 10,
            }}
          >
            <Check
              on={agree}
              onClick={() => setAgree(!agree)}
              label={t.agree1}
              required
            />
            <Check
              on={marketing}
              onClick={() => setMarketing(!marketing)}
              label={t.agree2}
            />
          </div>

          {errorMsg && (
            <div
              style={{
                fontSize: 12,
                color: "#dc4c3e",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {errorMsg}
            </div>
          )}
          {confirmMsg && (
            <div
              style={{
                fontSize: 12,
                color: "#4a8d5a",
                textAlign: "center",
                marginBottom: 4,
                lineHeight: 1.5,
              }}
            >
              {confirmMsg}
            </div>
          )}
          <PCBtn
            kind="primary"
            dark={dark}
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || !agree || !email || pwd.length < 8 || !name}
          >
            {t.create} →
          </PCBtn>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 14, color: mute }}>
              {t.haveAccount}{" "}
              <a
                onClick={() => onSwitch && onSwitch("login")}
                style={{
                  color: ink,
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                  borderBottom: `1.5px solid ${ink}`,
                }}
              >
                {t.login}
              </a>
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
