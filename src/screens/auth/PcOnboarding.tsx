import { BrandMark } from "@/screens/auth/BrandMark";
import { useState } from "react";
import { AUTH_TEXT } from "@/screens/auth/authText";
import { PCBtn } from "@/screens/auth/PcBtn";

export const PCOnboarding = ({
  lang = "ko",
  dark = false,
  initialStep = 0,
}: any) => {
  const t = AUTH_TEXT[lang];
  const [step, setStep] = useState(initialStep);
  const [purpose, setPurpose] = useState(2);
  const [salary, setSalary] = useState(25);
  const [picks, setPicks] = useState([0, 1, 2, 4]);
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.6)" : "rgba(26,24,20,0.6)";
  const yellow = "#ffd84d";

  const togglePick = (i) =>
    setPicks((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const stepTitles =
    lang === "ko"
      ? ["용도", "월급일", "카테고리", "준비 완료"]
      : ["Purpose", "Payday", "Categories", "Ready"];

  return (
    <div
      style={{
        height: "100%",
        background: dark ? "#0e0d0a" : "#faf7f0",
        color: ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: dark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <BrandMark dark={dark} size={26} />
        <button
          type="button"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: mute,
            cursor: "pointer",
            textDecoration: "none",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {t.skip} →
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left rail · steps */}
        <aside
          style={{
            width: 280,
            padding: "40px 32px",
            borderRight: dark
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.06)",
            background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: mute,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {lang === "ko" ? "시작하기" : "Get started"}
          </div>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {stepTitles.map((s, i) => {
              const done = i < step,
                on = i === step;
              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: on
                      ? dark
                        ? "rgba(255,216,77,0.1)"
                        : "#fff"
                      : "transparent",
                    border: on
                      ? `1px solid ${yellow}`
                      : "1px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: done ? ink : on ? yellow : "transparent",
                      border:
                        done || on
                          ? "none"
                          : `1.5px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
                      color: done ? yellow : "#1a1814",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: on || done ? ink : mute,
                      }}
                    >
                      {s}
                    </div>
                    <div style={{ fontSize: 11, color: mute, marginTop: 1 }}>
                      {
                        [
                          lang === "ko"
                            ? "주된 용도 선택"
                            : "How you'll use it",
                          lang === "ko" ? "월급일 입력" : "When you get paid",
                          lang === "ko" ? "관심 카테고리" : "Pick categories",
                          lang === "ko" ? "마지막 점검" : "Final check",
                        ][i]
                      }
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div
            style={{
              marginTop: 32,
              padding: 16,
              background: dark ? "rgba(255,255,255,0.04)" : "#fff",
              borderRadius: 10,
              border: dark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 11, color: mute, fontWeight: 600 }}>
              💡 {lang === "ko" ? "팁" : "Tip"}
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                color: ink,
              }}
            >
              {lang === "ko"
                ? "지금 설정한 내용은 언제든 환경설정에서 바꿀 수 있어요."
                : "You can change any of these later in Settings."}
            </p>
          </div>
        </aside>

        {/* Right content */}
        <main
          style={{
            flex: 1,
            padding: "48px 64px",
            display: "flex",
            flexDirection: "column",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: yellow,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {t.obStep} {step + 1} / 4
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: "10px 0 10px",
                lineHeight: 1.2,
              }}
            >
              {[t.ob1Title, t.ob2Title, t.ob3Title, t.ob4Title][step]}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: mute,
                margin: "0 0 36px",
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              {[t.ob1Sub, t.ob2Sub, t.ob3Sub, t.ob4Sub][step]}
            </p>

            {step === 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {[
                  ["💰", t.purpose1, t.purpose1d],
                  ["📅", t.purpose2, t.purpose2d],
                  ["✨", t.purpose3, t.purpose3d],
                ].map(([ico, ttl, sub], i) => (
                  <button
                    key={i}
                    onClick={() => setPurpose(i)}
                    style={{
                      padding: "20px 18px",
                      textAlign: "left",
                      border: `1.5px solid ${purpose === i ? ink : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                      background:
                        purpose === i
                          ? dark
                            ? "rgba(255,216,77,0.06)"
                            : "#fff"
                          : "transparent",
                      borderRadius: 14,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      minHeight: 140,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: yellow,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 22,
                      }}
                    >
                      {ico}
                    </div>
                    <div>
                      <b
                        style={{
                          display: "block",
                          fontSize: 15,
                          fontWeight: 700,
                          color: ink,
                        }}
                      >
                        {ttl}
                      </b>
                      <small
                        style={{
                          display: "block",
                          fontSize: 12,
                          color: mute,
                          marginTop: 4,
                          lineHeight: 1.5,
                        }}
                      >
                        {sub}
                      </small>
                    </div>
                    {purpose === i && (
                      <div
                        style={{
                          marginTop: "auto",
                          fontSize: 12,
                          fontWeight: 700,
                          color: ink,
                        }}
                      >
                        ✓ {lang === "ko" ? "선택됨" : "Selected"}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div
                style={{
                  maxWidth: 480,
                  padding: "32px 36px",
                  background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                  borderRadius: 18,
                  border: dark
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: mute, fontWeight: 600 }}>
                    {t.salaryDay}
                  </div>
                  <div
                    style={{
                      fontSize: 96,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      margin: "12px 0",
                    }}
                  >
                    {salary}
                  </div>
                  <div style={{ fontSize: 14, color: mute, fontWeight: 500 }}>
                    {t.day} · {lang === "ko" ? "매월" : "every month"}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="31"
                  value={salary}
                  onChange={(e) => setSalary(+e.target.value)}
                  style={{ width: "100%", marginTop: 24, accentColor: yellow }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: mute,
                    marginTop: 6,
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  <span>1</span>
                  <span>10</span>
                  <span>20</span>
                  <span>31</span>
                </div>
                <button
                  type="button"
                  style={{
                    display: "block",
                    marginTop: 18,
                    textAlign: "center",
                    fontSize: 13,
                    color: mute,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    padding: 0,
                    width: "100%",
                  }}
                >
                  {t.skipDay}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {t.cats.map((c, i) => {
                    const on = picks.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => togglePick(i)}
                        style={{
                          padding: "10px 18px",
                          border: `1.5px solid ${on ? ink : dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)"}`,
                          background: on ? ink : "transparent",
                          color: on ? yellow : ink,
                          borderRadius: 99,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontWeight: 600,
                          fontSize: 14,
                          transition: "all 0.12s",
                        }}
                      >
                        {on ? "✓ " : "+ "}
                        {c}
                      </button>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 12,
                    color: mute,
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {picks.length} {lang === "ko" ? "개 선택됨" : "selected"}
                </div>
              </div>
            )}

            {step === 3 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: yellow,
                    borderRadius: 24,
                    padding: "60px 32px",
                    textAlign: "center",
                    color: "#1a1814",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      fontSize: 120,
                      opacity: 0.15,
                    }}
                  >
                    🎉
                  </div>
                  <div style={{ fontSize: 72, position: "relative" }}>🚀</div>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      position: "relative",
                    }}
                  >
                    {t.ob4Title}
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[t.feature1, t.feature2, t.feature3].map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 16px",
                        background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                        borderRadius: 12,
                        border: dark
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: yellow,
                          display: "grid",
                          placeItems: "center",
                          color: "#1a1814",
                          fontWeight: 800,
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              paddingTop: 24,
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              borderTop: dark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.06)",
              marginTop: 24,
            }}
          >
            {step > 0 && step < 3 && (
              <PCBtn
                kind="ghost"
                dark={dark}
                full={false}
                size="lg"
                onClick={() => setStep(step - 1)}
              >
                ← {t.back}
              </PCBtn>
            )}
            <PCBtn
              kind="primary"
              dark={dark}
              full={false}
              size="lg"
              onClick={() => setStep(Math.min(3, step + 1))}
            >
              {step === 3 ? `${t.done} 🚀` : `${t.next} →`}
            </PCBtn>
          </div>
        </main>
      </div>
    </div>
  );
};
