// @ts-nocheck
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

// ============================================================
// AUTH SCREENS — 모바일 위주, 모던 SaaS 톤
// 색상은 기존 디자인 시스템(yellow/ink/red)에서 유지
// ============================================================

const AUTH_TEXT = {
  ko: {
    brand: "Dayflow",
    tagline: "하루를 가볍게, 한 달을 단단하게",
    // login
    loginTitle: "다시 만나서 반가워요",
    loginSub: "이메일로 로그인하거나 구글 계정을 연결하세요",
    email: "이메일",
    password: "비밀번호",
    forgot: "비밀번호를 잊으셨나요?",
    signin: "로그인",
    google: "구글로 계속하기",
    or: "또는",
    noAccount: "아직 계정이 없으신가요?",
    signup: "가입하기",
    // signup
    signupTitle: "계정 만들기",
    signupSub: "30초면 충분해요. 이름과 이메일만 있으면 시작합니다",
    name: "이름",
    confirm: "비밀번호 확인",
    agree1: "이용약관 및 개인정보처리방침에 동의합니다",
    agree2: "마케팅 정보 수신에 동의합니다 (선택)",
    create: "계정 만들기",
    haveAccount: "이미 계정이 있으신가요?",
    login: "로그인",
    // pwd strength
    pwdWeak: "약함",
    pwdMid: "보통",
    pwdStrong: "강력함",
    // onboarding
    welcome: "환영합니다,",
    obStep: "단계",
    skip: "건너뛰기",
    next: "다음",
    back: "이전",
    done: "시작하기",
    // step 1
    ob1Title: "어떻게 쓸 계획이세요?",
    ob1Sub: "주된 용도를 알려주시면 화면을 맞춰드려요",
    purpose1: "가계부 위주",
    purpose1d: "지출 기록과 예산 관리",
    purpose2: "일정 위주",
    purpose2d: "캘린더와 할 일",
    purpose3: "둘 다 통합",
    purpose3d: "돈과 시간을 한곳에서",
    // step 2
    ob2Title: "월급일을 알려주세요",
    ob2Sub: "이 날을 기준으로 한 달의 예산을 계산해드려요",
    salaryDay: "매월 ",
    day: "일",
    skipDay: "월급이 일정하지 않아요",
    // step 3
    ob3Title: "관심 카테고리를 골라주세요",
    ob3Sub: "자주 쓰는 카테고리만 보여드릴게요. 나중에 바꿀 수 있어요",
    cats: [
      "식비",
      "교통",
      "카페",
      "쇼핑",
      "구독",
      "운동",
      "취미",
      "여행",
      "선물",
      "공과금",
      "병원",
      "기타",
    ],
    // step 4
    ob4Title: "준비됐어요!",
    ob4Sub: "Dayflow로 첫 한 달을 더 가볍게 보내보세요",
    feature1: "가계부와 캘린더를 한 화면에서",
    feature2: "영수증 사진으로 자동 입력",
    feature3: "월급일 기준 스마트 예산",
    // forgot password
    fpTitle: "비밀번호 찾기",
    fpSub: "가입한 이메일을 입력해주세요. 재설정 링크를 보내드릴게요",
    fpSend: "재설정 링크 보내기",
    fpSentTitle: "메일을 보냈어요",
    fpSentSub:
      "받은 편지함에서 이메일을 확인하고 링크를 눌러 비밀번호를 다시 만들어주세요",
    fpResend: "다시 보내기",
    fpCheckSpam: "메일이 안 보이면 스팸함을 확인해주세요",
    fpOpenMail: "메일 앱 열기",
    fpResetTitle: "새 비밀번호 만들기",
    fpResetSub: "8자 이상, 영문과 숫자를 섞어주세요",
    fpNewPwd: "새 비밀번호",
    fpNewPwd2: "비밀번호 확인",
    fpReset: "비밀번호 변경",
    fpResetDone: "변경 완료",
    fpResetDoneSub: "새 비밀번호로 로그인할 수 있어요",
    fpBackToLogin: "로그인으로 돌아가기",
    fpStep: "단계",
    fpEmailNotMatch: "비밀번호가 일치하지 않아요",
    fpSecurityTip: "보안을 위해 1시간 안에 변경해주세요",
  },
  en: {
    brand: "Dayflow",
    tagline: "Lighten your day, strengthen your month",
    loginTitle: "Welcome back",
    loginSub: "Sign in with email or continue with Google",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    signin: "Sign in",
    google: "Continue with Google",
    or: "or",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    signupTitle: "Create your account",
    signupSub: "Takes 30 seconds. Just your name and email to start",
    name: "Name",
    confirm: "Confirm password",
    agree1: "I agree to the Terms and Privacy Policy",
    agree2: "Send me product updates (optional)",
    create: "Create account",
    haveAccount: "Already have an account?",
    login: "Sign in",
    pwdWeak: "Weak",
    pwdMid: "OK",
    pwdStrong: "Strong",
    welcome: "Welcome,",
    obStep: "Step",
    skip: "Skip",
    next: "Continue",
    back: "Back",
    done: "Let's go",
    ob1Title: "How will you use it?",
    ob1Sub: "We'll tailor the experience to your main use",
    purpose1: "Mainly money",
    purpose1d: "Track expenses & budget",
    purpose2: "Mainly time",
    purpose2d: "Calendar & to-dos",
    purpose3: "Both, together",
    purpose3d: "Money & time, one place",
    ob2Title: "When do you get paid?",
    ob2Sub: "Your month resets on this day",
    salaryDay: "Day ",
    day: "",
    skipDay: "Pay isn't regular",
    ob3Title: "Pick categories you use",
    ob3Sub: "We'll surface these first. Change anytime",
    cats: [
      "Food",
      "Transit",
      "Café",
      "Shopping",
      "Subscriptions",
      "Fitness",
      "Hobbies",
      "Travel",
      "Gifts",
      "Bills",
      "Health",
      "Other",
    ],
    ob4Title: "All set!",
    ob4Sub: "Make your next month lighter with Dayflow",
    feature1: "Money and time in one view",
    feature2: "Snap a receipt to log it",
    feature3: "Smart budgets pegged to payday",
    fpTitle: "Forgot password?",
    fpSub: "Enter your email and we'll send a reset link",
    fpSend: "Send reset link",
    fpSentTitle: "Check your inbox",
    fpSentSub:
      "We sent a link to reset your password. Tap it from your email to continue",
    fpResend: "Resend email",
    fpCheckSpam: "Don't see it? Check your spam folder",
    fpOpenMail: "Open mail app",
    fpResetTitle: "Set a new password",
    fpResetSub: "At least 8 characters with letters and numbers",
    fpNewPwd: "New password",
    fpNewPwd2: "Confirm password",
    fpReset: "Update password",
    fpResetDone: "Password updated",
    fpResetDoneSub: "Sign in with your new password",
    fpBackToLogin: "Back to sign in",
    fpStep: "Step",
    fpEmailNotMatch: "Passwords don't match",
    fpSecurityTip: "For security, complete this within 1 hour",
  },
};

// ─────────── shared brand mark ───────────
function BrandMark({ size = 28, dark = false }) {
  const ink = dark ? "#fff" : "#1a1814";
  const yellow = "#ffd84d";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: yellow,
          position: "relative",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: "50%",
            background: ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: size * 0.18,
            right: size * 0.2,
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: "50%",
            background: ink,
          }}
        />
      </div>
      <b
        style={{
          fontSize: size * 0.55,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: ink,
        }}
      >
        Dayflow
      </b>
    </div>
  );
}

// ─────────── Input field ───────────
function Field({
  label,
  type = "text",
  value,
  onChange,
  dark,
  rightSlot,
  autoFocus,
  placeholder,
  error,
}) {
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.55)" : "rgba(26,24,20,0.55)";
  const bg = dark ? "rgba(255,255,255,0.06)" : "#fff";
  const line = error
    ? "#dc4c3e"
    : dark
      ? "rgba(255,255,255,0.14)"
      : "rgba(0,0,0,0.1)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: mute,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          background: bg,
          border: `1px solid ${line}`,
          borderRadius: 12,
          transition: "border-color 0.15s",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "13px 14px",
            paddingRight: rightSlot ? 44 : 14,
            border: "none",
            background: "transparent",
            fontSize: 15,
            fontFamily: "inherit",
            color: ink,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 11, color: "#dc4c3e", fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─────────── Button (primary / google / ghost) ───────────
function Btn({
  children,
  kind = "primary",
  onClick,
  dark,
  disabled,
  full = true,
}) {
  const styles = {
    primary: {
      background: dark ? "#fff" : "#1a1814",
      color: dark ? "#1a1814" : "#fff",
      border: "1px solid transparent",
    },
    google: {
      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(0,0,0,0.12)",
    },
    ghost: {
      background: "transparent",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(0,0,0,0.12)",
    },
    yellow: {
      background: "#ffd84d",
      color: "#1a1814",
      border: "1px solid transparent",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[kind],
        width: full ? "100%" : "auto",
        padding: "13px 20px",
        borderRadius: 12,
        fontSize: 14.5,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        letterSpacing: "-0.01em",
        transition: "transform 0.1s, opacity 0.15s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {children}
    </button>
  );
}

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC04"
      d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96L3.97 7.3C4.68 5.18 6.66 3.58 9 3.58z"
    />
  </svg>
);

const EyeIcon = ({ on, dark }) => (
  <button
    type="button"
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 6,
      color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)",
    }}
  >
    {on ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 3l18 18M10.6 6.1A11 11 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.3 3.9M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.8" />
      </svg>
    )}
  </button>
);

// pwd strength 0-3
function pwdScore(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

// ============================================================
// SCREEN: LOGIN
// ============================================================
function LoginScreen({ variant = "A", lang = "ko", dark = false, onSwitch }) {
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
            placeholder="you@example.com"
            dark={dark}
          />
          <Field
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
              placeholder="you@example.com"
              dark={dark}
            />
            <Field
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
          placeholder="you@example.com"
          dark={dark}
        />
        <Field
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
}

export {
  LoginScreen,
  AUTH_TEXT,
  BrandMark,
  Field,
  Btn,
  GoogleIcon,
  EyeIcon,
  pwdScore,
};
