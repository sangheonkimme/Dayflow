import {    useState , useMemo , useEffect , useRef } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";

export const ChallengeDetailSheet = ({
  challenge,
  onClose,
  onJoin,
  onLeave,
}: any) => {
  const open = !!challenge;
  const [justJoined, setJustJoined] = useState(false);
  useEffect(() => {
    if (open) setJustJoined(false);
  }, [open, challenge && challenge.id]);

  if (!challenge)
    return (
      <>
        <div className="dfm-sheet-scrim" />
        <div className="dfm-sheet" />
      </>
    );

  const c = challenge;
  const joined = justJoined || c.joined;

  // detail content per challenge
  const meta = {
    c1: {
      reward: "₩30,000 \uc808\uc57d \ubaa9\ud45c",
      rules: [
        "\ub9e4\uc77c \uc2dd\ube44 \uc678 \uc81c\ub85c \uc9c0\ucd9c \uc778\uc99d",
        "\uc8fc 1\ud68c \ub9e4\uc7a5/\ubc30\ub2ec \ud5c8\uc6a9",
        "\ucd5c\uc18c 2\uc8fc \uc774\uc0c1 \ucc38\uc5ec",
      ],
      duration: "11\uc6d4 1\uc77c ~ 11\uc6d4 30\uc77c",
    },
    c2: {
      reward: "\ucee4\ud53c\uac12 \u00d7 \uc77c\uc218",
      rules: [
        "\ub9e4\uc77c \ud65c\ub3d9 \uc11c\ud0dd\uc5d0 \ucee4\ud53c\uac12\uc744 \uc785\uae08",
        "\ud14d\uc2a4\ud2b8 \uc99d\ube59\uc73c\ub85c \uc778\uc99d",
        "30\uc77c \ub3d9\uc548 \uc9c4\ud589",
      ],
      duration: "30\uc77c \ub808\uc774\uc2a4",
    },
    c3: {
      reward: "\uc6d4 \uad6c\ub3c5\ub8cc \uc808\uac10",
      rules: [
        "\uc548 \uc4f0\ub294 \uad6c\ub3c5 1\uac1c \uc774\uc0c1 \ud574\uc9c0",
        "\ud574\uc9c0 \uc99d\uba85 \uc2a4\ud06c\ub9b0\uc0f7 \uc5c5\ub85c\ub4dc",
        "30\uc77c \uc720\uc9c0",
      ],
      duration: "11\uc6d4 1\uc77c ~ 11\uc6d4 30\uc77c",
    },
  }[c.id] || {
    reward: "\uc808\uc57d\uae08",
    rules: ["\ub9e4\uc77c \uc778\uc99d \uc11c\ud0dd"],
    duration: c.days,
  };

  return (
    <>
      <div
        className={`dfm-sheet-scrim ${open ? "on" : ""}`}
        onClick={onClose}
      />
      <div
        className={`dfm-sheet ${open ? "on" : ""}`}
        style={{ maxHeight: "86vh" }}
      >
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head" style={{ paddingBottom: 8 }}>
          <div className="ttl">
            챌린지<small>{joined ? "참여 중" : "참여 가능"}</small>
          </div>
          <button className="close" onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div
          className="dfm-sheet-body"
          style={{
            padding: "0 18px 22px",
            overflow: "auto",
            maxHeight: "calc(86vh - 60px)",
          }}
        >
          {/* HERO */}
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              padding: "18px 16px",
              background: c.color,
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 10 }}>
                {c.emoji}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 4,
                  color: "var(--ink)",
                }}
              >
                {c.title}
              </div>
              <small
                style={{ fontSize: 12, color: "var(--ink)", opacity: 0.7 }}
              >
                {c.sub}
              </small>
            </div>
          </div>

          {/* stat row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              className="dfm-card"
              style={{ padding: 12, textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--ink-mute)",
                }}
              >
                참여자
              </div>
              <b
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 16,
                  display: "block",
                  marginTop: 2,
                }}
              >
                {c.members.toLocaleString()}
              </b>
            </div>
            <div
              className="dfm-card"
              style={{ padding: 12, textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--ink-mute)",
                }}
              >
                달성률
              </div>
              <b
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 16,
                  display: "block",
                  marginTop: 2,
                }}
              >
                {Math.round(c.progress * 100)}%
              </b>
            </div>
            <div
              className="dfm-card"
              style={{ padding: 12, textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--ink-mute)",
                }}
              >
                기간
              </div>
              <b
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  display: "block",
                  marginTop: 4,
                }}
              >
                {c.days}
              </b>
            </div>
          </div>

          {/* 참여중일 때만 my progress */}
          {joined && (
            <div
              className="dfm-card"
              style={{
                padding: 14,
                marginBottom: 14,
                background: "var(--ink)",
                color: "var(--bg-paper)",
                border: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    color: "var(--yellow)",
                  }}
                >
                  나의 진행
                </span>
                <small
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {justJoined ? "0 / 30일" : "12 / 30일"}
                </small>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.15)",
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: justJoined ? "0%" : "40%",
                    height: "100%",
                    background: "var(--yellow)",
                    borderRadius: 99,
                    transition: "width .3s",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <small style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                  {justJoined ? "오늘부터 시작!" : "5일 연속 인증중 🔥"}
                </small>
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    background: "var(--yellow)",
                    color: "var(--ink)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 11.5,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  오늘 인증하기
                </button>
              </div>
            </div>
          )}

          {/* 보상 */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px dashed var(--line-strong)",
              marginBottom: 14,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--yellow)",
                border: "1px solid var(--yellow-edge)",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
              }}
            >
              🏆
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--ink-mute)",
                }}
              >
                달성 보상
              </div>
              <b style={{ fontSize: 13 }}>{meta.reward}</b>
            </div>
          </div>

          {/* 규칙 */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "var(--ink-mute)",
                marginBottom: 8,
              }}
            >
              참여 규칙
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meta.rules.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      color: "var(--ink-mute)",
                      flexShrink: 0,
                      width: 14,
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.45 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 친구 미리보기 */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--bg-paper)",
              border: "1px solid var(--line)",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ display: "flex" }}>
              {["🦊", "🐰", "🐻", "🐯"].map((e, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--bg)",
                    border: "2px solid var(--bg-paper)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
            <small style={{ fontSize: 11, color: "var(--ink-mute)", flex: 1 }}>
              친구 4명을 포함해 {c.members.toLocaleString()}명이 함께해요
            </small>
          </div>

          {/* CTA */}
          {!joined ? (
            <button
              onClick={() => {
                onJoin(c.id);
                setJustJoined(true);
              }}
              style={{
                width: "100%",
                padding: "16px 0",
                borderRadius: 14,
                border: "none",
                background: "var(--ink)",
                color: "var(--yellow)",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              참여하기
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  onLeave(c.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "1px solid var(--line)",
                  background: "transparent",
                  color: "var(--ink-mute)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                그만두기
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 2,
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  background: "var(--ink)",
                  color: "var(--yellow)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {justJoined ? "확인" : "친구에게 공유"}
              </button>
            </div>
          )}

          {/* 참여 직후 토스트성 안내 */}
          {justJoined && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--yellow)",
                border: "1px solid var(--yellow-edge)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>🎉</span>
              <small
                style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}
              >
                참여 완료! 매일 오후 9시에 인증 알림을 보내드려요
              </small>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
