// @ts-nocheck
import { useState } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SwipeRow } from "@/pages/mobile/shared/SwipeRow";
import { ComposePostSheet } from "@/pages/mobile/community/ComposePostSheet";
import { CommentsSheet } from "@/pages/mobile/community/CommentsSheet";
import { ChallengeDetailSheet } from "@/pages/mobile/community/ChallengeDetailSheet";

export const MobileCommunity = () => {
  const [tab, setTab] = useState("feed"); // feed | challenges | ranking
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [composeOpen, setComposeOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]); // posts the user creates
  const [openChallenge, setOpenChallenge] = useState(null);

  const toggleLike = (id) => setLiked((s) => ({ ...s, [id]: !s[id] }));
  const toggleSave = (id) => setSaved((s) => ({ ...s, [id]: !s[id] }));

  const handleSubmit = (post) => {
    const newPost = {
      id: "u" + Date.now(),
      author: "나비",
      avatar: "🦋",
      time: "방금",
      mine: true,
      ...post,
    };
    setUserPosts((p) => [newPost, ...p]);
    setComposeOpen(false);
  };

  // ── Data via hooks. The community feed render expects:
  //   - challenges: { id, title, sub, members, days: "X/30일", progress, color, emoji }
  //   - posts:      { id, author, avatar, tag, time, title, body, likes, comments, badge?, stat: {label, val, color} }
  //   - ranking:    { rank, name, saved, avatar, streak, medal: "🥇" | "🥈" | "🥉" | undefined }
  // Canonical types differ slightly (Post.stat is string; Challenge.days is number;
  // Ranker.medal is "gold"/"silver"/"bronze") — adapt at this seam so we don't
  // touch the render below.
  const challengesRaw = useChallenges().data;
  const challenges = useMemo(
    () => challengesRaw.map((c) => ({ ...c, days: `${c.days}/30일` })),
    [challengesRaw],
  );

  const postsRaw = usePosts().data;
  const parseStat = (statStr) => {
    // "오늘 지출 ₩0" → { label: "오늘 지출", val: "₩0", color: derived }
    if (!statStr) return { label: "", val: "", color: "var(--ink)" };
    const m = String(statStr).match(/^(.+?)\s+([+\-]?₩?[\d,.]+\S*)\s*$/);
    if (!m) return { label: statStr, val: "", color: "var(--ink)" };
    const [, label, val] = m;
    let color = "#1f1d18";
    if (val.startsWith("+")) color = "#4a8d5a";
    else if (val.startsWith("-")) color = "#dc4c3e";
    else if (val === "₩0") color = "#4a8d5a";
    return { label, val, color };
  };
  const posts = useMemo(
    () => postsRaw.map((p) => ({ ...p, stat: parseStat(p.stat) })),
    [postsRaw],
  );

  const rankingRaw = useRanking().data;
  const ranking = useMemo(
    () =>
      rankingRaw.map((r) => ({
        ...r,
        medal:
          r.medal === "gold"
            ? "🥇"
            : r.medal === "silver"
              ? "🥈"
              : r.medal === "bronze"
                ? "🥉"
                : undefined,
      })),
    [rankingRaw],
  );

  return (
    <div>
      {/* ── HERO 카드: 이번 주 커뮤니티 요약 */}
      <div
        className="dfm-card"
        style={{
          padding: "16px 18px",
          background: "linear-gradient(135deg, #fff5d6 0%, #ffe8b8 100%)",
          border: "1px solid var(--yellow-edge)",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -10,
            fontSize: 90,
            opacity: 0.18,
            transform: "rotate(-12deg)",
          }}
        >
          💰
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            marginBottom: 6,
          }}
        >
          <Ico name="users" size={11} /> 이번 주 커뮤니티
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <b
            style={{
              fontSize: 26,
              fontFamily: "var(--mono)",
              letterSpacing: "-0.02em",
            }}
          >
            2,743명
          </b>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
            이 함께 절약 중
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 12,
            fontSize: 11,
            position: "relative",
          }}
        >
          <div>
            <b
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                display: "block",
              }}
            >
              ₩42.8M
            </b>
            <span style={{ color: "var(--ink-mute)" }}>이번 주 절약</span>
          </div>
          <div>
            <b
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                display: "block",
              }}
            >
              1,284
            </b>
            <span style={{ color: "var(--ink-mute)" }}>오늘 인증</span>
          </div>
          <div>
            <b
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                display: "block",
              }}
            >
              {challenges.length}
            </b>
            <span style={{ color: "var(--ink-mute)" }}>진행 챌린지</span>
          </div>
        </div>
      </div>

      {/* ── 세그먼트 탭 */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--bg-paper)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          marginBottom: 14,
        }}
      >
        {[
          { id: "feed", label: "피드" },
          { id: "challenges", label: "챌린지" },
          { id: "ranking", label: "랭킹" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 9,
              border: "none",
              background: tab === t.id ? "var(--ink)" : "transparent",
              color: tab === t.id ? "var(--yellow)" : "var(--ink-mute)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.14s, color 0.14s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 피드 */}
      {tab === "feed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 인증 작성 prompt */}
          <button
            onClick={() => setComposeOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              border: "1px dashed var(--line-strong)",
              borderRadius: 12,
              background: "transparent",
              color: "var(--ink-mute)",
              fontFamily: "inherit",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.14s, background 0.14s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--ink)";
              e.currentTarget.style.background = "rgba(255,226,122,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line-strong)";
              e.currentTarget.style.background = "transparent";
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
            <span style={{ flex: 1, fontSize: 13 }}>
              오늘의 절약 인증을 공유해보세요
            </span>
            <Ico name="plus" size={16} />
          </button>

          {[...userPosts, ...posts].map((p) => {
            const isLiked = !!liked[p.id];
            const isSaved = !!saved[p.id];
            const lc = isLiked ? p.likes + 1 : p.likes;
            return (
              <div key={p.id} className="dfm-card" style={{ padding: 14 }}>
                {/* author row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--bg-paper)",
                      border: "1px solid var(--line)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {p.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <b style={{ fontSize: 13 }}>{p.author}</b>
                      {p.badge && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 99,
                            background: "var(--ink)",
                            color: "var(--yellow)",
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                      {p.tag} · {p.time}
                    </small>
                  </div>
                  <button
                    onClick={() => toggleSave(p.id)}
                    style={{
                      width: 32,
                      height: 32,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: isSaved ? "var(--ink)" : "var(--ink-mute)",
                      display: "grid",
                      placeItems: "center",
                    }}
                    aria-label="저장"
                  >
                    <Ico name="bookmark" size={16} />
                  </button>
                </div>

                {/* content */}
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </h4>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 12.5,
                    color: "var(--ink-soft)",
                    lineHeight: 1.55,
                  }}
                >
                  {p.body}
                </p>

                {/* stat strip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "var(--bg-paper)",
                    border: "1px dashed var(--line)",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--ink-mute)",
                      fontWeight: 600,
                    }}
                  >
                    {p.stat.label}
                  </span>
                  <b
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 16,
                      fontWeight: 800,
                      color: p.stat.color,
                    }}
                  >
                    {p.stat.val}
                  </b>
                </div>

                {/* actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 6,
                    borderTop: "1px dashed var(--line)",
                  }}
                >
                  <button
                    onClick={() => toggleLike(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 99,
                      background: isLiked
                        ? "rgba(220,76,62,0.1)"
                        : "transparent",
                      border: "none",
                      color: isLiked ? "#dc4c3e" : "var(--ink-mute)",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.14s",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        transform: isLiked ? "scale(1.1)" : "scale(1)",
                        transition: "transform 0.18s",
                      }}
                    >
                      {isLiked ? (
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path
                            d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"
                            fill="#dc4c3e"
                          />
                        </svg>
                      ) : (
                        <Ico name="heart" size={14} />
                      )}
                    </span>
                    {lc.toLocaleString()}
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 99,
                      background: "transparent",
                      border: "none",
                      color: "var(--ink-mute)",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <Ico name="msg" size={14} /> {p.comments}
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--ink-mute)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    공유
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 챌린지 */}
      {tab === "challenges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {challenges.map((c) => (
            <div
              key={c.id}
              className="dfm-card"
              style={{ padding: 14, position: "relative", overflow: "hidden" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: c.color,
                  opacity: 0.5,
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: c.color,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: 15, display: "block" }}>{c.title}</b>
                    <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                      {c.sub}
                    </small>
                  </div>
                </div>

                {/* progress */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    marginBottom: 6,
                    fontFamily: "var(--mono)",
                  }}
                >
                  <span>{c.days}</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                    {Math.round(c.progress * 100)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 99,
                    background: "var(--bg-paper)",
                    border: "1px solid var(--line)",
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: `${c.progress * 100}%`,
                      height: "100%",
                      background: "var(--ink)",
                      borderRadius: 99,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                    <Ico name="users" size={11} /> {c.members.toLocaleString()}
                    명 참여 중
                  </small>
                  <button
                    style={{
                      padding: "7px 14px",
                      borderRadius: 99,
                      background: "var(--ink)",
                      color: "var(--yellow)",
                      border: "none",
                      fontWeight: 700,
                      fontSize: 11.5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    참여하기
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 새 챌린지 만들기 */}
          <button
            style={{
              padding: "16px 14px",
              border: "1px dashed var(--line-strong)",
              borderRadius: 14,
              background: "transparent",
              color: "var(--ink-mute)",
              fontFamily: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Ico name="plus" size={14} /> 나만의 챌린지 만들기
          </button>
        </div>
      )}

      {/* ── 랭킹 */}
      {tab === "ranking" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 4px 10px",
              fontSize: 11,
              color: "var(--ink-mute)",
            }}
          >
            <Ico name="trophy" size={12} /> 이번 주 절약왕 · 11월 9일~15일
          </div>
          <div className="dfm-card" style={{ padding: 0 }}>
            {ranking.map((r, i) => (
              <div
                key={r.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom:
                    i < ranking.length - 1 ? "1px dashed var(--line)" : "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--mono)",
                    fontSize: 13,
                    fontWeight: 800,
                    color: r.rank <= 3 ? "var(--ink)" : "var(--ink-mute)",
                  }}
                >
                  {r.medal || `${r.rank}`}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--bg-paper)",
                    border: "1px solid var(--line)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {r.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13, display: "block" }}>{r.name}</b>
                  <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                    <Ico name="fire" size={10} /> {r.streak}일 연속
                  </small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      color: "#4a8d5a",
                      display: "block",
                    }}
                  >
                    +₩{r.saved.toLocaleString()}
                  </b>
                  <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                    이번 주
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* 내 순위 */}
          <div
            style={{
              marginTop: 14,
              padding: "14px",
              borderRadius: 14,
              background: "var(--ink)",
              color: "var(--yellow)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              42
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--yellow)",
                color: "var(--ink)",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              🦋
            </div>
            <div style={{ flex: 1 }}>
              <b
                style={{
                  fontSize: 13,
                  display: "block",
                  color: "var(--yellow)",
                }}
              >
                나비님 (나)
              </b>
              <small style={{ fontSize: 11, color: "rgba(255,226,122,0.65)" }}>
                5일 연속 · 상위 12%
              </small>
            </div>
            <b
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: "var(--yellow)",
              }}
            >
              +₩86,400
            </b>
          </div>
        </>
      )}

      <div style={{ height: 16 }} />

      <ComposePostSheet
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSubmit={handleSubmit}
      />
      <CommentsSheet post={commentPost} onClose={() => setCommentPost(null)} />
      <ChallengeDetailSheet
        challenge={openChallenge}
        onClose={() => setOpenChallenge(null)}
        onJoin={(cid) => {
          setJoinedIds((s) => ({ ...s, [cid]: true }));
        }}
        onLeave={(cid) => {
          setJoinedIds((s) => {
            const n = { ...s };
            delete n[cid];
            return n;
          });
        }}
      />
    </div>
  );
};

// ─── 인증 글 작성 시트
