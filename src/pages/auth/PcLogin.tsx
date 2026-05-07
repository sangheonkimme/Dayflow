// @ts-nocheck
import { useState } from "react";
import { AUTH_TEXT } from "@/pages/auth/authText";
import { GoogleIcon } from "@/pages/auth/GoogleIcon";
import { EyeIcon } from "@/pages/auth/EyeIcon";
import { useAuth } from "@/data/auth";
import { PCField } from "@/pages/auth/PcField";
import { PCBtn } from "@/pages/auth/PcBtn";
import { BrandPanel } from "@/pages/auth/PcBrandPanel";

export const PCLogin = ({ lang = "ko", dark = false, onSwitch }) => {
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
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 24,
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
              {lang === "ko" ? "로그인" : "Sign in"}
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
              {t.loginTitle}
            </h1>
            <p
              style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}
            >
              {t.loginSub}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PCField
              label={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              dark={dark}
            />
            <PCField
              label={t.password}
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              dark={dark}
              rightSlot={
                <div onClick={() => setShowPwd((s) => !s)}>
                  <EyeIcon on={showPwd} dark={dark} />
                </div>
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                color: mute,
              }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: dark ? "#ffd84d" : "#1a1814",
                }}
              />
              {lang === "ko" ? "로그인 상태 유지" : "Keep me signed in"}
            </label>
            <a
              onClick={() => onSwitch && onSwitch("forgot")}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: ink,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {t.forgot}
            </a>
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
          <PCBtn
            kind="primary"
            dark={dark}
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || !email.includes("@") || pwd.length < 1}
          >
            {t.signin} →
          </PCBtn>

          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <span style={{ fontSize: 14, color: mute }}>
              {t.noAccount}{" "}
              <a
                onClick={() => onSwitch && onSwitch("signup")}
                style={{
                  color: ink,
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                  borderBottom: `1.5px solid ${ink}`,
                }}
              >
                {t.signup}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PC SIGNUP
// ============================================================
