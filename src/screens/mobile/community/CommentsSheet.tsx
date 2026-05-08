/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {    useState , useMemo , useEffect , useRef } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";

export const CommentsSheet = ({ post, onClose }: any) => {
  const open = !!post;
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (open) {
      setDraft("");
    }
  }, [open, post && post.id]);

  // Comments backed by usePostComments hook (seed + session-local extras).
  const { comments, add } = usePostComments(post?.id);
  // Adapt canonical Comment shape → render shape used below.
  const allComments = useMemo(
    () =>
      comments.map((c) => ({
        who: c.author,
        emoji: c.avatar,
        time: c.time,
        text: c.body,
        likes: c.likes,
        mine: c.author === "나비",
      })),
    [comments],
  );

  const submit = () => {
    if (!draft.trim()) return;
    add(draft.trim());
    setDraft("");
  };

  return (
    <>
      <div
        className={`dfm-sheet-scrim ${open ? "on" : ""}`}
        onClick={onClose}
      />
      <div
        className={`dfm-sheet ${open ? "on" : ""}`}
        style={{ maxHeight: "82vh" }}
      >
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">
            댓글
            <small>
              {open ? `${allComments.length}개 · @${post.author}` : ""}
            </small>
          </div>
          <button className="close" onClick={onClose}>
            <Ico name="plus" size={18} />
          </button>
        </div>

        <div
          className="dfm-sheet-body"
          style={{ padding: "4px 18px 0", overflow: "auto", maxHeight: "52vh" }}
        >
          {/* original post excerpt */}
          {open && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--bg-paper)",
                border: "1px solid var(--line)",
                marginBottom: 14,
                display: "flex",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--yellow)",
                  border: "1px solid var(--yellow-edge)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {post.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <b style={{ fontSize: 12 }}>{post.author}</b>
                  <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                    · {post.time}
                  </small>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-mute)",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.text}
                </div>
              </div>
            </div>
          )}

          {/* comments list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingBottom: 8,
            }}
          >
            {allComments.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c.mine ? "var(--yellow)" : "var(--bg-paper)",
                    border:
                      "1px solid " +
                      (c.mine ? "var(--yellow-edge)" : "var(--line)"),
                    display: "grid",
                    placeItems: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {c.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <b style={{ fontSize: 12 }}>{c.who}</b>
                    <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                      · {c.time}
                    </small>
                    {c.mine && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: 99,
                          background: "var(--ink)",
                          color: "var(--yellow)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink)",
                      lineHeight: 1.45,
                    }}
                  >
                    {c.text}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--ink-mute)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ico name="heart" size={11} /> {c.likes}
                    </button>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--ink-mute)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        fontFamily: "inherit",
                      }}
                    >
                      답글
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {allComments.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 12px",
                  color: "var(--ink-mute)",
                  fontSize: 13,
                }}
              >
                <Ico name="msg" size={22} />
                <div style={{ marginTop: 6 }}>첫 댓글을 남겨보세요</div>
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div
          style={{
            padding: "10px 14px 18px",
            borderTop: "1px solid var(--line)",
            background: "var(--bg)",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--yellow)",
                border: "1px solid var(--yellow-edge)",
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              🦋
            </div>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="댓글을 남겨보세요"
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid var(--line)",
                borderRadius: 99,
                background: "var(--bg-paper)",
                fontSize: 13,
                color: "var(--ink)",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              style={{
                padding: "10px 14px",
                borderRadius: 99,
                border: "none",
                background: draft.trim() ? "var(--ink)" : "var(--line)",
                color: draft.trim() ? "var(--yellow)" : "var(--ink-mute)",
                fontWeight: 700,
                fontSize: 12,
                cursor: draft.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── 챌린지 상세 / 참여 시트
