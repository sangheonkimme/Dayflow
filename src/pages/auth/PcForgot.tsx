// @ts-nocheck
import { BrandMark } from "@/pages/auth/BrandMark";
import { pwdScore } from "@/pages/auth/pwdScore";
import { useState } from "react";
import { useAuth } from "@/data/auth";
import { AUTH_TEXT } from "@/pages/auth/authText";
import { EyeIcon } from "@/pages/auth/EyeIcon";
import { PCField } from "@/pages/auth/PcField";
import { PCBtn } from "@/pages/auth/PcBtn";
import { BrandPanel } from "@/pages/auth/PcBrandPanel";

export const PCForgot = ({ lang = "ko", dark = false, initialStep = 0 }) => {
  const t = AUTH_TEXT[lang];
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState("nabi@dayflow.app");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const yellow = "#ffd84d";
  const bg = dark ? "#0e0d0a" : "#faf7f0";
  const panelBg = dark ? "#1a1814" : "#1a1814";

  const score = pwdScore(pwd);
  const pwdLabels = [t.pwdWeak, t.pwdWeak, t.pwdMid, t.pwdStrong];
  const pwdColors = ["#dc4c3e", "#dc4c3e", "#e8a93a", "#4a8d5a"];
  const mismatch = pwd2.length > 0 && pwd !== pwd2;

  const Strength = pwd.length > 0 && (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}
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
      <span style={{ fontSize: 11, fontWeight: 700, color: pwdColors[score] }}>
        {pwdLabels[score]}
      </span>
    </div>
  );

  const stepTitles =
    lang === "ko"
      ? ["이메일 입력", "메일 확인", "새 비밀번호", "완료"]
      : ["Enter email", "Check inbox", "New password", "Done"];

  const StepDot = ({ i }) => {
    const isCurrent = i === step;
    const isDone = i < step;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isDone
              ? "#4a8d5a"
              : isCurrent
                ? yellow
                : dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.12)",
            color: isDone
              ? "#fff"
              : isCurrent
                ? "#1a1814"
                : "rgba(255,255,255,0.5)",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 800,
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {isDone ? "✓" : i + 1}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: isCurrent ? 700 : 600,
            color: isCurrent
              ? "#fff"
              : isDone
                ? "rgba(255,255,255,0.85)"
                : "rgba(255,255,255,0.4)",
          }}
        >
          {stepTitles[i]}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ height: "100%", display: "flex", background: bg, color: ink }}
    >
      {/* Left brand panel · dark */}
      <div
        style={{
          width: 440,
          background: panelBg,
          color: "#fff",
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,216,77,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,216,77,0.05)",
          }}
        />

        <div style={{ position: "relative" }}>
          <BrandMark size={28} dark={true} />
        </div>

        <div style={{ marginTop: 56, position: "relative" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {lang === "ko" ? "비밀번호 재설정" : "Reset password"}
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {lang === "ko"
              ? "괜찮아요,\n금방 다시 들어가실 거예요"
              : "No worries,\nyou'll be back in soon"}
          </h2>
          <p
            style={{
              fontSize: 13,
              margin: 0,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
            }}
          >
            {lang === "ko"
              ? "이메일 인증으로 안전하게 비밀번호를 새로 만드실 수 있어요"
              : "Verify by email and set a new password securely"}
          </p>
        </div>

        {/* Step indicators */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            position: "relative",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <StepDot key={i} i={i} />
          ))}
        </div>

        <div
          style={{ marginTop: "auto", paddingTop: 32, position: "relative" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: yellow,
                color: "#1a1814",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              🛡️
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                {lang === "ko" ? "보안 안내" : "Security note"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {t.fpSecurityTip}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px 64px 32px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 24,
          }}
        >
          <a
            style={{
              fontSize: 13,
              color: mute,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            ← {t.fpBackToLogin}
          </a>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 440,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {step === 0 && (
            <>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: yellow,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 24,
                  fontSize: 26,
                }}
              >
                🔑
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  margin: "0 0 8px",
                  lineHeight: 1.15,
                }}
              >
                {t.fpTitle}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: mute,
                  margin: "0 0 32px",
                  lineHeight: 1.5,
                }}
              >
                {t.fpSub}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Field
                  label={t.email}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  dark={dark}
                  autoFocus
                />
                <Btn
                  kind="primary"
                  dark={dark}
                  disabled={!email.includes("@")}
                  onClick={() => setStep(1)}
                >
                  {t.fpSend} →
                </Btn>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div
                style={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 22,
                    background: yellow,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 38,
                    boxShadow: "0 12px 30px rgba(255,216,77,0.35)",
                  }}
                >
                  📬
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -10,
                    background: "#4a8d5a",
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    transform: "rotate(8deg)",
                  }}
                >
                  SENT
                </div>
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  margin: "0 0 8px",
                  lineHeight: 1.15,
                }}
              >
                {t.fpSentTitle}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: mute,
                  margin: "0 0 20px",
                  lineHeight: 1.6,
                }}
              >
                {t.fpSentSub}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  padding: "10px 16px",
                  background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                  border: dark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 99,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  color: ink,
                  marginBottom: 32,
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4a8d5a",
                  }}
                />
                {email}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Btn kind="primary" dark={dark} onClick={() => setStep(2)}>
                  {t.fpOpenMail} 📧
                </Btn>
                <Btn kind="ghost" dark={dark} full={false} onClick={() => {}}>
                  {t.fpResend}
                </Btn>
              </div>

              <div
                style={{
                  marginTop: 24,
                  background: dark
                    ? "rgba(255,216,77,0.08)"
                    : "rgba(255,216,77,0.18)",
                  border: dark
                    ? "1px solid rgba(255,216,77,0.18)"
                    : "1px solid rgba(255,216,77,0.4)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 12,
                  color: ink,
                }}
              >
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ lineHeight: 1.4 }}>{t.fpCheckSpam}</span>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: ink,
                  color: yellow,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 24,
                  fontSize: 24,
                }}
              >
                🔒
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  margin: "0 0 8px",
                  lineHeight: 1.15,
                }}
              >
                {t.fpResetTitle}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: mute,
                  margin: "0 0 28px",
                  lineHeight: 1.5,
                }}
              >
                {t.fpResetSub}
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <Field
                    label={t.fpNewPwd}
                    type={showPwd ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="8+ chars"
                    dark={dark}
                    autoFocus
                    rightSlot={
                      <div onClick={() => setShowPwd((s) => !s)}>
                        <EyeIcon on={showPwd} dark={dark} />
                      </div>
                    }
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
                <Btn
                  kind="primary"
                  dark={dark}
                  disabled={pwd.length < 8 || pwd !== pwd2}
                  onClick={() => setStep(3)}
                >
                  {t.fpReset}
                </Btn>
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "#4a8d5a",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 24px",
                  boxShadow: "0 12px 30px rgba(74,141,90,0.35)",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  margin: "0 0 8px",
                }}
              >
                {t.fpResetDone}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: mute,
                  margin: "0 0 32px",
                  lineHeight: 1.5,
                }}
              >
                {t.fpResetDoneSub}
              </p>
              <div style={{ maxWidth: 320, margin: "0 auto" }}>
                <Btn kind="primary" dark={dark}>
                  {t.fpBackToLogin} →
                </Btn>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: mute,
            paddingTop: 16,
          }}
        >
          {lang === "ko" ? "도움이 필요하신가요?" : "Need help?"}{" "}
          <a
            style={{
              color: ink,
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {lang === "ko" ? "지원팀에 문의" : "Contact support"}
          </a>
        </div>
      </div>
    </div>
  );
};
