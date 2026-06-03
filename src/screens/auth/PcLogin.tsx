import { useState, type KeyboardEvent } from "react";
import { AUTH_TEXT } from "@/screens/auth/authText";
import { GoogleIcon } from "@/screens/auth/GoogleIcon";
import { EyeIcon } from "@/screens/auth/EyeIcon";
import { useAuth } from "@/data/auth";
import { PCField } from "@/screens/auth/PcField";
import { PCBtn } from "@/screens/auth/PcBtn";
import { BrandPanel } from "@/screens/auth/PcBrandPanel";

export const PCLogin = ({ lang = "ko", dark = false, onSwitch }: any) => {
  const t = AUTH_TEXT[lang];
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState(
    () =>
      (typeof window !== "undefined" &&
        window.localStorage.getItem("dayflow.rememberedEmail")) ||
      "",
  );
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("dayflow.rememberedEmail"),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const r = await signIn(email, pwd);
      if (r.ok) {
        if (remember)
          window.localStorage.setItem("dayflow.rememberedEmail", email);
        else window.localStorage.removeItem("dayflow.rememberedEmail");
      } else {
        setErrorMsg(r.message || "로그인에 실패했어요.");
      }
    } catch (e) {
      console.error("[login] signIn threw", e);
      setErrorMsg(
        e instanceof Error ? e.message : "로그인 처리 중 오류가 발생했어요.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email.includes("@") && pwd.length >= 1) handleSubmit();
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

          <PCBtn
            kind="google"
            dark={dark}
            size="lg"
            disabled={submitting}
            onClick={async () => {
              if (submitting) return;
              setErrorMsg(null);
              setSubmitting(true);
              const nextParam =
                typeof window !== "undefined"
                  ? new URLSearchParams(window.location.search).get("next") ||
                    undefined
                  : undefined;
              const r = await signInWithGoogle(nextParam);
              if (!r.ok) {
                setErrorMsg(r.message || "Google 로그인에 실패했어요.");
                setSubmitting(false);
              }
              // 성공 시 provider 로 리다이렉트되므로 로딩 상태 그대로 둠.
            }}
          >
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
              onKeyDown={onEnter}
              placeholder="you@example.com"
              dark={dark}
            />
            <PCField
              label={t.password}
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={onEnter}
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
              {lang === "ko" ? "아이디 기억하기" : "Remember email"}
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
