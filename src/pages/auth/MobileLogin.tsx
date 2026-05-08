import { useState, type KeyboardEvent } from "react";
import { useAuth } from "@/data/auth";
import { AUTH_TEXT } from "@/pages/auth/authText";
import { EyeIcon } from "@/pages/auth/EyeIcon";
import { BrandMark } from "@/pages/auth/BrandMark";
import { Field } from "@/pages/auth/Field";
import { Btn } from "@/pages/auth/Btn";
import { GoogleIcon } from "@/pages/auth/GoogleIcon";

export const LoginScreen = ({
  variant = "A",
  lang = "ko",
  dark = false,
  onSwitch,
}: any) => {
  const t = AUTH_TEXT[lang];
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const subtle = dark ? "rgba(255,255,255,0.45)" : "rgba(26,24,20,0.45)";

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
  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email.includes("@") && pwd.length >= 1) handleSubmit();
    }
  };

  // ─────── A · Classic centered ───────
  if (variant === "A") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: dark ? "#0e0d0a" : "#faf7f0",
          padding: "48px 24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          color: ink,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 12 }}
        >
          <BrandMark dark={dark} size={32} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "8px 0 8px",
            }}
          >
            {t.loginTitle}
          </h1>
          <p style={{ fontSize: 13, color: mute, margin: 0, lineHeight: 1.5 }}>
            {t.loginSub}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field
            label={t.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onEnter}
            placeholder="you@example.com"
            dark={dark}
          />
          <Field
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
          <div style={{ textAlign: "right", marginTop: -4 }}>
            <a
              onClick={() => onSwitch && onSwitch("forgot")}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: mute,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {t.forgot}
            </a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
          <Btn
            kind="primary"
            dark={dark}
            onClick={handleSubmit}
            disabled={submitting || !email.includes("@") || pwd.length < 1}
          >
            {t.signin}
          </Btn>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "4px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
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
                background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              }}
            />
          </div>
          <Btn kind="google" dark={dark} disabled>
            <GoogleIcon /> {t.google}
          </Btn>
        </div>

        <div style={{ marginTop: "auto", textAlign: "center", paddingTop: 24 }}>
          <span style={{ fontSize: 13, color: mute }}>
            {t.noAccount}{" "}
            <a
              onClick={() => onSwitch && onSwitch("signup")}
              style={{
                color: ink,
                fontWeight: 700,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {t.signup} →
            </a>
          </span>
        </div>
      </div>
    );
  }

  // ─────── B · Bold yellow hero header ───────
  if (variant === "B") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: dark ? "#0e0d0a" : "#faf7f0",
          display: "flex",
          flexDirection: "column",
          color: ink,
        }}
      >
        <div
          style={{
            background: "#ffd84d",
            padding: "56px 24px 36px",
            color: "#1a1814",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
            }}
          />
          <div style={{ position: "relative" }}>
            <BrandMark size={28} />
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: "28px 0 8px",
                lineHeight: 1.1,
              }}
            >
              {t.loginTitle}
            </h1>
            <p
              style={{ fontSize: 13, margin: 0, opacity: 0.7, lineHeight: 1.5 }}
            >
              {t.tagline}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "28px 24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field
              label={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onEnter}
              placeholder="you@example.com"
              dark={dark}
            />
            <Field
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
            <div style={{ textAlign: "right" }}>
              <a
                href="#"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: mute,
                  textDecoration: "none",
                }}
              >
                {t.forgot}
              </a>
            </div>
          </div>
          <Btn kind="primary" dark={dark}>
            {t.signin}
          </Btn>
          <Btn kind="google" dark={dark}>
            <GoogleIcon /> {t.google}
          </Btn>

          <div
            style={{ marginTop: "auto", textAlign: "center", paddingTop: 18 }}
          >
            <span style={{ fontSize: 13, color: mute }}>
              {t.noAccount}{" "}
              <a
                onClick={() => onSwitch && onSwitch("signup")}
                style={{
                  color: ink,
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {t.signup}
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─────── C · Minimal — google first ───────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark ? "#0e0d0a" : "#faf7f0",
        padding: "60px 24px 32px",
        display: "flex",
        flexDirection: "column",
        color: ink,
      }}
    >
      <BrandMark dark={dark} size={26} />
      <div style={{ marginTop: 56 }}>
        <div
          style={{
            fontSize: 11,
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
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "8px 0 12px",
            lineHeight: 1.1,
          }}
        >
          {t.loginTitle}
        </h1>
        <p style={{ fontSize: 14, color: mute, margin: 0, lineHeight: 1.5 }}>
          {t.loginSub}
        </p>
      </div>

      <div
        style={{
          marginTop: 36,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Btn kind="google" dark={dark}>
          <GoogleIcon /> {t.google}
        </Btn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "10px 0 4px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
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
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            }}
          />
        </div>
        <Field
          label={t.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onEnter}
          placeholder="you@example.com"
          dark={dark}
        />
        <Field
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
        <Btn kind="primary" dark={dark}>
          {t.signin} →
        </Btn>
      </div>

      <div
        style={{
          marginTop: "auto",
          textAlign: "center",
          paddingTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <a
          href="#"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: mute,
            textDecoration: "none",
          }}
        >
          {t.forgot}
        </a>
        <span style={{ fontSize: 13, color: mute }}>
          {t.noAccount}{" "}
          <a
            onClick={() => onSwitch && onSwitch("signup")}
            style={{
              color: ink,
              fontWeight: 700,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {t.signup}
          </a>
        </span>
      </div>
    </div>
  );
};
