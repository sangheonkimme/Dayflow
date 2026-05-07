// @ts-nocheck
import { useState } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SubHeader } from "@/pages/mobile/shared/SubHeader";
import { DfmSwitch } from "@/pages/mobile/shared/DfmSwitch";
import { usePreferences } from "@/data/preferences";

export const ThemeScreen = ({ onBack }) => {
  const [mode, setMode] = useState("auto"); // light | dark | auto
  const [accent, setAccent] = useState("yellow");
  const [font, setFont] = useState("hand"); // hand | sans | serif
  const [size, setSize] = useState(2); // 1..4
  const [density, setDensity] = useState("comfy"); // cozy | comfy | compact
  const [paper, setPaper] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const accents = [
    { id: "yellow", name: "노랑", color: "#ffd84d" },
    { id: "pink", name: "핑크", color: "#ffb38a" },
    { id: "mint", name: "민트", color: "#b9e7c9" },
    { id: "blue", name: "블루", color: "#cfe7ff" },
    { id: "lilac", name: "라일락", color: "#d4c1f0" },
    { id: "ink", name: "잉크", color: "#3a3528" },
  ];
  const sizes = ["작게", "보통", "크게", "더 크게"];

  // ── PREVIEW ──
  const previewBg = mode === "dark" ? "#1f1d18" : "var(--bg-paper)";
  const previewInk = mode === "dark" ? "#ede8d8" : "var(--ink)";
  const accentColor = accents.find((a) => a.id === accent)?.color;
  const fontFamily =
    font === "hand"
      ? "var(--hand)"
      : font === "serif"
        ? "var(--serif, Georgia, serif)"
        : "var(--sans, system-ui)";
  const fontPx = [12, 14, 16, 18][size - 1];

  return (
    <div>
      <SubHeader title="테마 · 모양" onBack={onBack} />

      {/* live preview */}
      <div
        className="dfm-card"
        style={{
          background: previewBg,
          color: previewInk,
          border:
            "1px solid " +
            (mode === "dark" ? "rgba(255,255,255,0.08)" : "var(--line)"),
          marginBottom: 18,
          padding: 16,
          backgroundImage: paper
            ? "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)"
            : "none",
          backgroundSize: "10px 10px",
        }}
      >
        <small
          style={{
            fontSize: 10,
            color: mode === "dark" ? "#9b9484" : "var(--ink-mute)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          미리보기
        </small>
        <div
          style={{
            marginTop: 8,
            fontFamily,
            fontSize: fontPx + 6,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          오늘의 흐름
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily,
            fontSize: fontPx,
            color: mode === "dark" ? "#bdb7a6" : "var(--ink-mute)",
          }}
        >
          11월 14일 토요일 · 좋은 아침이에요
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              background: accentColor,
              color: accent === "ink" ? "#ffd84d" : "#3a3528",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            포인트
          </span>
          <span
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              border:
                "1px dashed " +
                (mode === "dark" ? "rgba(255,255,255,0.15)" : "var(--line)"),
              fontSize: 11,
              color: mode === "dark" ? "#bdb7a6" : "var(--ink-mute)",
            }}
          >
            보조
          </span>
        </div>
      </div>

      {/* mode */}
      <SectionHeader title="모드" />
      <div className="dfm-card" style={{ padding: 6, marginBottom: 14 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {[
            { id: "light", label: "라이트", ico: "sun" },
            { id: "dark", label: "다크", ico: "moon" },
            { id: "auto", label: "자동", ico: "refresh" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "12px 8px",
                borderRadius: 10,
                border: "none",
                background: mode === m.id ? "var(--ink)" : "transparent",
                color: mode === m.id ? "var(--bg-paper)" : "var(--ink)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ico name={m.ico} size={16} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* accent */}
      <SectionHeader title="포인트 컬러" />
      <div className="dfm-card" style={{ padding: 14, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              aria-pressed={accent === a.id}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: a.color,
                border:
                  accent === a.id
                    ? "2.5px solid var(--ink)"
                    : "1px solid rgba(0,0,0,0.12)",
                cursor: "pointer",
                padding: 0,
                position: "relative",
                boxShadow:
                  accent === a.id ? "0 0 0 3px var(--bg-paper) inset" : "none",
              }}
              aria-label={a.name}
            >
              {accent === a.id && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  style={{ position: "absolute", inset: 0, margin: "auto" }}
                >
                  <path
                    d="M3 7l3 3 5-6"
                    stroke={a.id === "ink" ? "#ffd84d" : "#3a3528"}
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--ink-mute)",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          선택:{" "}
          <b style={{ color: "var(--ink)" }}>
            {accents.find((a) => a.id === accent)?.name}
          </b>
        </div>
      </div>

      {/* font family */}
      <SectionHeader title="폰트" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {[
          {
            id: "hand",
            label: "핸드라이팅",
            sub: "기본 · 나만의 노트 느낌",
            style: { fontFamily: "var(--hand)" },
          },
          {
            id: "sans",
            label: "산세리프",
            sub: "깔끔하고 또렷한 본문",
            style: { fontFamily: "system-ui, -apple-system, sans-serif" },
          },
          {
            id: "serif",
            label: "세리프",
            sub: "차분하고 클래식",
            style: { fontFamily: "Georgia, 'Times New Roman', serif" },
          },
        ].map((f, i, arr) => (
          <div
            key={f.id}
            onClick={() => setFont(f.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 14px",
              borderBottom:
                i < arr.length - 1 ? "1px dashed var(--line)" : "none",
              cursor: "pointer",
            }}
          >
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 16, display: "block", ...f.style }}>
                오늘의 흐름
              </b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                {f.label} · {f.sub}
              </small>
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border:
                  "1.5px solid " +
                  (font === f.id ? "var(--ink)" : "var(--line)"),
                display: "grid",
                placeItems: "center",
              }}
            >
              {font === f.id && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--ink)",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* font size */}
      <SectionHeader title="글자 크기" />
      <div className="dfm-card" style={{ padding: 16, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700 }}>가</span>
          <div
            style={{
              flex: 1,
              position: "relative",
              height: 24,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "auto 0",
                height: 2,
                background: "var(--line)",
                borderRadius: 999,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: `${(1 - (size - 1) / 3) * 100}%`,
                height: 2,
                background: "var(--ink)",
                borderRadius: 999,
              }}
            />
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setSize(n)}
                style={{
                  position: "absolute",
                  left: `${((n - 1) / 3) * 100}%`,
                  transform: "translateX(-50%)",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "none",
                  background: size >= n ? "var(--ink)" : "var(--line)",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={sizes[n - 1]}
              />
            ))}
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>가</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--ink-mute)",
          }}
        >
          {sizes.map((s, i) => (
            <span
              key={i}
              style={{
                fontWeight: size === i + 1 ? 700 : 400,
                color: size === i + 1 ? "var(--ink)" : "var(--ink-mute)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* density */}
      <SectionHeader title="목록 간격" />
      <div className="dfm-card" style={{ padding: 6, marginBottom: 14 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {[
            { id: "cozy", label: "넉넉", bars: [16, 16, 16] },
            { id: "comfy", label: "보통", bars: [12, 12, 12] },
            { id: "compact", label: "압축", bars: [8, 8, 8] },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDensity(d.id)}
              style={{
                padding: "12px 8px",
                borderRadius: 10,
                border: "none",
                background: density === d.id ? "var(--ink)" : "transparent",
                color: density === d.id ? "var(--bg-paper)" : "var(--ink)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: density === d.id ? 3 : 2,
                  marginBottom: 2,
                }}
              >
                {d.bars.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      width: w,
                      height: 2,
                      background:
                        density === d.id ? "var(--bg-paper)" : "currentColor",
                      opacity: 0.7,
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* misc */}
      <SectionHeader title="기타" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 24 }}>
        <NotifToggleRow
          ico="doc"
          title="종이 질감 배경"
          sub="살짝 도트 무늬 표시"
          value={paper}
          onChange={setPaper}
        />
        <NotifToggleRow
          ico="bell"
          title="햅틱 피드백"
          sub="탭에 진동"
          value={haptics}
          onChange={setHaptics}
          last
        />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
