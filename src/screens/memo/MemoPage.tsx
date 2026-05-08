import { useState, useMemo, useRef } from "react";
import { Icon } from "@/components/Icon";
import { useMemos } from "@/data/memos";
import { FOLDERS, ALL_TAGS } from "@/data/memos";
import { memoExcerpt, memoWordCount, memoUpdatedLabel } from "@/data/memos";
import { useDraftField } from "@/lib/useDraftField";
import styles from "./MemoPage.module.css";

// ============================================================
// MEMO PAGE — 장문 메모 detail page
// 3-column desk layout: folders | memo list | editor
// ============================================================

function MemoPage() {
  const [folder, setFolder] = useState("all");
  const [activeId, setActiveId] = useState(1);
  const { all: memos, upsert } = useMemos();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated"); // updated | title | created

  const filtered = useMemo(() => {
    let list = memos;
    if (folder === "starred") list = list.filter((m) => m.starred);
    else if (folder !== "all" && folder !== "trash")
      list = list.filter((m) => m.folder === folder);
    else if (folder === "trash") list = [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) =>
        (m.title + memoExcerpt(m)).toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "ko");
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
  }, [memos, folder, search, sort]);

  const active = memos.find((m) => m.id === activeId) || filtered[0];

  const toggleStar = (id) => {
    const m = memos.find((x) => x.id === id);
    if (m) upsert({ ...m, starred: !m.starred });
  };
  const togglePin = (id) => {
    const m = memos.find((x) => x.id === id);
    if (m) upsert({ ...m, pinned: !m.pinned });
  };
  // commit-only update (IME 깨짐 방지) — onBlur 시점에만 store 갱신.
  const updateBody = (body: string) => {
    if (active) upsert({ ...active, body });
  };
  const updateTitle = (title: string) => {
    if (active) upsert({ ...active, title });
  };

  const newMemo = () => {
    const id = Date.now();
    const m = {
      id,
      title: "제목 없는 메모",
      folder:
        folder === "all" || folder === "starred" || folder === "trash"
          ? "personal"
          : folder,
      tags: [],
      starred: false,
      pinned: false,
      updated: "방금",
      word: 0,
      excerpt: "",
      body: "# 제목 없는 메모\n\n",
    };
    upsert(m);
    setActiveId(id);
  };

  return (
    <div data-screen-label="05 메모">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 메모</div>
          <h1 className="page-title">
            메모 <span className="hand-sub">— 떠오를 때 곧바로 적어두세요</span>
          </h1>
          <div className="page-sub">
            {memos.length}개의 장문 메모 · 마지막 편집{" "}
            {active ? memoUpdatedLabel(active) : "—"}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">
            <Icon name="search" size={14} />
            빠른 검색
          </button>
          <button className="timer-btn primary" onClick={newMemo}>
            + 새 메모
          </button>
        </div>
      </div>

      <div className={styles.memoLayout}>
        {/* COLUMN 1 — Folders + tags */}
        <aside className={styles.memoFolders}>
          <div className={styles.memoSideH}>폴더</div>
          <ul className={styles.folderList}>
            {FOLDERS.map((f) => (
              <li
                key={f.id}
                className={`${styles.folderItem}${folder === f.id ? ` ${styles.on}` : ""}`}
                onClick={() => setFolder(f.id)}
              >
                <span
                  className={styles.folderIco}
                  style={f.color ? { color: f.color } : undefined}
                >
                  <Icon name={f.icon} size={15} />
                </span>
                <span className={styles.folderLabel}>{f.label}</span>
                <span className={styles.folderCount}>{f.count}</span>
              </li>
            ))}
          </ul>

          <div className={styles.memoSideH} style={{ marginTop: 22 }}>
            태그
          </div>
          <div className={styles.tagCloud}>
            {ALL_TAGS.map((t) => (
              <span key={t} className={styles.tagPill}>
                #{t}
              </span>
            ))}
          </div>

          <div className={styles.memoQuote}>
            <span className="hand">"</span>
            <p>적어두지 않은 생각은 사라진다. 손이 기억보다 정직하다.</p>
          </div>
        </aside>

        {/* COLUMN 2 — Memo list */}
        <section className={styles.memoListCol}>
          <div className={styles.memoListHead}>
            <div className={styles.memoSearch}>
              <Icon name="search" size={13} />
              <input
                placeholder="메모 검색…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.memoSort}>
              {[
                ["updated", "최근순"],
                ["title", "가나다"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  className={sort === k ? styles.on : ""}
                  onClick={() => setSort(k)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.memoList}>
            {filtered.length === 0 && (
              <div className={styles.memoEmpty}>
                <div className="hand" style={{ fontSize: 22, marginBottom: 6 }}>
                  비어있어요
                </div>
                <div>이 폴더엔 아직 메모가 없습니다.</div>
              </div>
            )}
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`${styles.memoCard}${activeId === m.id ? ` ${styles.on}` : ""}`}
                onClick={() => setActiveId(m.id)}
              >
                <div className={styles.memoCardHead}>
                  {m.pinned && <Icon name="pin" size={12} />}
                  <h4>{m.title}</h4>
                  <button
                    className={`${styles.memoStar}${m.starred ? ` ${styles.starred}` : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(m.id);
                    }}
                    title="즐겨찾기"
                  >
                    <Icon name="star" size={13} />
                  </button>
                </div>
                <p className={styles.memoExcerpt}>{memoExcerpt(m)}</p>
                <div className={styles.memoMeta}>
                  <span>{memoUpdatedLabel(m)}</span>
                  <span className={styles.dotSep}>·</span>
                  <span>{memoWordCount(m)}자</span>
                  <span className={styles.memoTagRow}>
                    {m.tags.slice(0, 2).map((t) => (
                      <span key={t} className={styles.memoMiniTag}>
                        #{t}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMN 3 — Editor */}
        <section className={styles.memoEditor}>
          {!active ? (
            <div className={`${styles.memoEmpty} ${styles.large}`}>
              <div className="hand" style={{ fontSize: 28 }}>
                메모를 골라주세요 →
              </div>
            </div>
          ) : (
            <MemoEditor
              key={active.id}
              active={active}
              onUpdateTitle={updateTitle}
              onUpdateBody={updateBody}
              onTogglePin={() => togglePin(active.id)}
              onToggleStar={() => toggleStar(active.id)}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function folderColor(id: string) {
  return (
    (
      { work: "#fde0e6", personal: "#dbecf5", study: "#dff0d2" } as Record<
        string,
        string
      >
    )[id] || "var(--bg-paper)"
  );
}
function folderLabel(id: string) {
  return (
    (
      { work: "업무", personal: "개인", study: "공부 · 독서" } as Record<
        string,
        string
      >
    )[id] || id
  );
}

// ============================================================
// MemoEditor — IME-safe 본문 편집 + 툴바 + 헤더 액션
// active 가 바뀌면 key prop 으로 강제 remount → useDraftField 가 새 메모로 초기화.
// ============================================================
interface MemoEditorProps {
  active: import("@/types").MemoDoc;
  onUpdateTitle: (title: string) => void;
  onUpdateBody: (body: string) => void;
  onTogglePin: () => void;
  onToggleStar: () => void;
}

function MemoEditor({
  active,
  onUpdateTitle,
  onUpdateBody,
  onTogglePin,
  onToggleStar,
}: MemoEditorProps) {
  const titleField = useDraftField<string>({
    value: active.title,
    onCommit: onUpdateTitle,
  });
  const bodyField = useDraftField<string>({
    value: active.body,
    onCommit: onUpdateBody,
  });
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // 마크다운 토큰을 현재 커서 위치에 삽입.
  const insert = (
    before: string,
    after: string = "",
    placeholder: string = "",
  ) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const current = bodyField.value;
    const selected = current.slice(start, end) || placeholder;
    const next =
      current.slice(0, start) + before + selected + after + current.slice(end);
    bodyField.setDraft(next);
    // 다음 tick 에 커서 이동
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + before.length + selected.length;
      ta.setSelectionRange(cursor, cursor);
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const current = bodyField.value;
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;
    const next =
      current.slice(0, lineStart) + prefix + current.slice(lineStart);
    bodyField.setDraft(next);
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + prefix.length;
      ta.setSelectionRange(cursor, cursor);
    });
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/dashboard/memo?id=${active.id}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <>
      <div className={styles.memoEditHead}>
        <div className={styles.memoEditMeta}>
          <span
            className={styles.folderChip}
            style={{ background: folderColor(active.folder) }}
          >
            {folderLabel(active.folder)}
          </span>
          <span className="muted">최종 편집 · {memoUpdatedLabel(active)}</span>
          <span className="muted">·</span>
          <span className="muted">{memoWordCount(active)}자</span>
        </div>
        <div className={styles.memoEditActions}>
          <button
            type="button"
            className={"icon-btn" + (active.pinned ? " on" : "")}
            onClick={onTogglePin}
            title={active.pinned ? "고정 해제" : "고정"}
            aria-pressed={active.pinned}
          >
            <Icon name="pin" size={15} />
          </button>
          <button
            type="button"
            className={"icon-btn" + (active.starred ? " on" : "")}
            onClick={onToggleStar}
            title={active.starred ? "즐겨찾기 해제" : "즐겨찾기"}
            aria-pressed={active.starred}
          >
            <Icon name="star" size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setHistoryOpen((v) => !v)}
            title="기록"
          >
            <Icon name="history" size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={copyShareLink}
            title="공유 링크 복사"
          >
            <Icon name="link" size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setMoreOpen((v) => !v)}
            title="더보기"
          >
            <Icon name="more" size={15} />
          </button>
        </div>
      </div>

      <div className={styles.memoToolbar}>
        <button
          type="button"
          title="제목"
          onClick={() => insertLinePrefix("# ")}
        >
          <Icon name="h1" size={14} />
        </button>
        <button
          type="button"
          title="굵게"
          onClick={() => insert("**", "**", "굵게")}
        >
          <Icon name="bold" size={14} />
        </button>
        <button
          type="button"
          title="기울임"
          onClick={() => insert("*", "*", "기울임")}
        >
          <Icon name="italic" size={14} />
        </button>
        <span className={styles.tbSep} />
        <button
          type="button"
          title="목록"
          onClick={() => insertLinePrefix("- ")}
        >
          <Icon name="list" size={14} />
        </button>
        <button
          type="button"
          title="체크리스트"
          onClick={() => insertLinePrefix("- [ ] ")}
        >
          <Icon name="check" size={14} />
        </button>
        <button
          type="button"
          title="인용"
          onClick={() => insertLinePrefix("> ")}
        >
          <Icon name="quote" size={14} />
        </button>
        <span className={styles.tbSep} />
        <button
          type="button"
          title="이미지"
          onClick={() => insert("![", "](URL)", "alt")}
        >
          <Icon name="image" size={14} />
        </button>
        <button
          type="button"
          title="링크"
          onClick={() => insert("[", "](URL)", "텍스트")}
        >
          <Icon name="link" size={14} />
        </button>
        <span className={styles.tbSep} />
        <span className={styles.tbStatus}>
          <span className={styles.saveDot} /> 자동 저장됨
        </span>
      </div>

      <div className={styles.memoPaper}>
        <input
          className={styles.memoTitleIn}
          value={titleField.value}
          onChange={(e) => titleField.setDraft(e.target.value)}
          onBlur={titleField.commit}
          placeholder="제목을 입력하세요…"
        />
        <div className={styles.memoTagEdit}>
          {active.tags.map((t) => (
            <span key={t} className={styles.memoTagChip}>
              #{t}
              <button>×</button>
            </span>
          ))}
          <button className={styles.memoTagAdd}>+ 태그</button>
        </div>
        <textarea
          ref={bodyRef}
          className={styles.memoBody}
          value={bodyField.value}
          onChange={(e) => bodyField.setDraft(e.target.value)}
          onBlur={bodyField.commit}
          placeholder="여기에 메모를 적어보세요. 마크다운을 지원합니다 — # 제목, **굵게**, - 목록…"
          spellCheck={false}
        />
      </div>

      <div className={styles.memoFoot}>
        <span className="hand">손글씨처럼, 부담없이.</span>
        <div className={styles.memoFootStats}>
          <span>
            <b>{bodyField.value.length}</b>자
          </span>
          <span className={styles.dotSep}>·</span>
          <span>
            <b>{bodyField.value.split(/\s+/).filter(Boolean).length}</b>단어
          </span>
          <span className={styles.dotSep}>·</span>
          <span>
            읽는 시간{" "}
            <b>{Math.max(1, Math.round(bodyField.value.length / 400))}</b>분
          </span>
        </div>
      </div>

      {historyOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
          }}
          onClick={() => setHistoryOpen(false)}
        >
          <div
            style={{
              background: "var(--card-elev)",
              padding: 24,
              borderRadius: 12,
              maxWidth: 360,
              fontSize: 13,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>편집 기록</div>
            <div style={{ color: "var(--ink-mute)" }}>
              버전 기록은 곧 추가될 예정이에요. 현재는 마지막 편집 시각만
              표시됩니다 — {memoUpdatedLabel(active)}.
            </div>
          </div>
        </div>
      )}

      {moreOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
          }}
          onClick={() => setMoreOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 80,
              right: 24,
              background: "var(--card-elev)",
              borderRadius: 10,
              boxShadow: "var(--shadow-md)",
              padding: 6,
              fontSize: 13,
              minWidth: 160,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: 6,
                color: "var(--red)",
              }}
              onClick={() => {
                if (confirm(`"${active.title}" 메모를 휴지통으로 보낼까요?`)) {
                  onUpdateBody(active.body); // ensure latest body before delete
                  // 실제 삭제는 useMemos.remove — props 위임이 없어 placeholder.
                  alert(
                    "삭제 기능은 곧 추가됩니다. 임시로 폴더를 'trash' 로 옮기세요.",
                  );
                }
                setMoreOpen(false);
              }}
            >
              휴지통으로 이동
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export { MemoPage };
