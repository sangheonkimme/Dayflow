/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";

export const ComposePostSheet = ({ open, onClose, onSubmit }: any) => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]); // chosen tag strings
  const [hasStat, setHasStat] = useState(false);
  const [statLabel, setStatLabel] = useState("오늘 지출");
  const [statValue, setStatValue] = useState("₩0");
  const [statTag, setStatTag] = useState("무지출");

  useEffect(() => {
    if (!open) {
      setText("");
      setTags([]);
      setHasStat(false);
      setStatLabel("오늘 지출");
      setStatValue("₩0");
      setStatTag("무지출");
    }
  }, [open]);

  const TAG_PRESETS = [
    "#무지출",
    "#커피값아끼기",
    "#편의점단호박",
    "#배달끊기",
    "#장보기",
    "#구독다이어트",
    "#대중교통",
    "#홈카페",
  ];
  const STAT_PRESETS = [
    { label: "오늘 지출", value: "₩0", tag: "무지출" },
    { label: "절약액", value: "₩4,500", tag: "커피값" },
    { label: "연속 일수", value: "5일", tag: "스트릭" },
  ];
  const toggleTag = (t) =>
    setTags((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t],
    );
  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      text: text.trim(),
      tags: tags.length ? tags : ["#절약기록"],
      stat: hasStat
        ? { label: statLabel, value: statValue, tag: statTag }
        : null,
      likes: 0,
      comments: 0,
    });
  };

  return (
    <>
      <div
        className={`dfm-sheet-scrim ${open ? "on" : ""}`}
        onClick={onClose}
      />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">
            절약 인증<small>오늘의 기록을 남겨보세요</small>
          </div>
          <button className="close" onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 0 14px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--yellow)",
                border: "1px solid var(--yellow-edge)",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
              }}
            >
              🦋
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>나비</div>
              <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                전체 공개 · 익명 표시 가능
              </small>
            </div>
          </div>

          {/* text */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="오늘 어떻게 절약했나요? &#10;예: 커피값 4,500원 아끼고 텀블러 챙겼어요 ☕"
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                color: "var(--ink)",
                fontSize: 14,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <small
                style={{
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  fontFamily: "var(--mono)",
                }}
              >
                {text.length} / 280
              </small>
            </div>
          </div>

          {/* tags */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              태그 (선택)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TAG_PRESETS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 600,
                    border:
                      "1px solid " +
                      (tags.includes(t) ? "var(--ink)" : "var(--line)"),
                    background: tags.includes(t) ? "var(--ink)" : "transparent",
                    color: tags.includes(t) ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* stat highlight */}
          <div style={{ padding: "14px 0 4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                인증 수치 강조
              </span>
              <button
                onClick={() => setHasStat(!hasStat)}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 999,
                  border:
                    "1px solid " + (hasStat ? "var(--ink)" : "var(--line)"),
                  background: hasStat ? "var(--ink)" : "transparent",
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: hasStat ? 20 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: hasStat ? "var(--bg-paper)" : "var(--ink-mute)",
                    transition: "left .15s",
                  }}
                />
              </button>
            </div>

            {hasStat && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  {STAT_PRESETS.map((p) => {
                    const active =
                      statLabel === p.label && statValue === p.value;
                    return (
                      <button
                        key={p.label}
                        onClick={() => {
                          setStatLabel(p.label);
                          setStatValue(p.value);
                          setStatTag(p.tag);
                        }}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 600,
                          border:
                            "1px solid " +
                            (active ? "var(--ink)" : "var(--line)"),
                          background: active
                            ? "var(--bg-paper)"
                            : "transparent",
                          color: "var(--ink)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {p.label} · {p.value}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="dfm-card"
                  style={{
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--bg-paper)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        color: "var(--ink-mute)",
                      }}
                    >
                      {statLabel.toUpperCase()}
                    </div>
                    <b
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 22,
                        color: "var(--ink)",
                      }}
                    >
                      {statValue}
                    </b>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "var(--yellow)",
                      color: "var(--ink)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {statTag}
                  </span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--ink)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              취소
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              style={{
                flex: 2,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: canSubmit ? "var(--ink)" : "var(--line)",
                color: canSubmit ? "var(--yellow)" : "var(--ink-mute)",
                fontWeight: 700,
                fontSize: 13,
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              인증 올리기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── 댓글 시트
