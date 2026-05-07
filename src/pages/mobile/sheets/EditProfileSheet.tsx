// @ts-nocheck
import { useState, useEffect } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";

export const EditProfileSheet = ({
  open,
  onClose,
  initialName,
  email,
  onSave,
}) => {
  const [name, setName] = useState(initialName || "");
  const [handle, setHandle] = useState("nabi.flow");
  const [bio, setBio] = useState("매일의 흐름을 기록 중 ☁️");
  const [emoji, setEmoji] = useState("나");
  useEffect(() => {
    if (open) setName(initialName || "");
  }, [open, initialName]);

  const presets = ["나", "🦋", "✨", "☁️", "🌸", "🌙", "🍵", "🐱"];

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
            프로필 수정<small>이름 · 아바타 · 소개</small>
          </div>
          <button className="close" onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* avatar preview */}
          <div
            style={{
              textAlign: "center",
              padding: "8px 0 18px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                margin: "0 auto",
                borderRadius: 26,
                background: "var(--yellow)",
                border: "2px solid var(--ink)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--hand)",
                fontWeight: 700,
                fontSize: emoji.length > 1 ? 38 : 42,
              }}
            >
              {emoji}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 12,
              }}
            >
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setEmoji(p)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    border:
                      "1.5px solid " +
                      (emoji === p ? "var(--ink)" : "var(--line)"),
                    background: emoji === p ? "var(--bg)" : "var(--bg-paper)",
                    fontSize: p.length > 1 ? 16 : 18,
                    fontFamily: "var(--hand)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* name */}
          <div
            style={{
              padding: "16px 0 14px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              이름
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* handle */}
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
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              사용자명
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
              }}
            >
              <span
                style={{
                  color: "var(--ink-mute)",
                  fontSize: 14,
                  fontFamily: "var(--mono)",
                }}
              >
                @
              </span>
              <input
                value={handle}
                onChange={(e) =>
                  setHandle(
                    e.target.value.replace(/[^a-z0-9._]/gi, "").toLowerCase(),
                  )
                }
                style={{
                  flex: 1,
                  padding: "11px 6px",
                  border: "none",
                  background: "transparent",
                  fontSize: 14,
                  fontFamily: "var(--mono)",
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* email (read-only) */}
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
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              이메일
            </div>
            <div
              style={{
                padding: "11px 12px",
                border: "1px dashed var(--line)",
                borderRadius: 10,
                background: "var(--bg)",
                fontSize: 13,
                color: "var(--ink-mute)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{email}</span>
              <small style={{ fontSize: 10 }}>변경 불가</small>
            </div>
          </div>

          {/* bio */}
          <div style={{ padding: "14px 0 4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--ink-mute)",
                  fontWeight: 600,
                }}
              >
                한 줄 소개
              </span>
              <small
                style={{
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  fontFamily: "var(--mono)",
                }}
              >
                {bio.length}/40
              </small>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 40))}
              rows={2}
              placeholder="자신을 소개해주세요"
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
                fontSize: 13,
                color: "var(--ink)",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
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
              }}
            >
              취소
            </button>
            <button
              onClick={() => onSave?.(name.trim() || initialName)}
              style={{
                flex: 2,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--ink)",
                color: "var(--bg-paper)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
