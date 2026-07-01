import { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@/components/Icon";
import { useMemos, useMemoFacets } from "@/data/memos";
import { FOLDERS } from "@/data/memos";
import {
  memoExcerpt,
  memoWordCount,
  memoUpdatedLabel,
  memoPlainText,
} from "@/data/memos";
import { useDraftField } from "@/lib/useDraftField";
import { pressable } from "@/lib/a11y";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Markdown } from "tiptap-markdown";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import styles from "./MemoPage.module.css";

// ============================================================
// MEMO PAGE — 장문 메모 detail page
// 3-column desk layout: folders | memo list | editor
// ============================================================

function MemoPage() {
  const [folder, setFolder] = useState("all");
  const [activeId, setActiveId] = useState(1);
  const { all: memos, upsert, remove } = useMemos();
  const facets = useMemoFacets();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated"); // updated | title | created
  const [quickOpen, setQuickOpen] = useState(false);

  // Cmd/Ctrl+K — 빠른 검색 토글.
  // dashboard/layout 도 같은 단축키로 전역 SearchOverlay 를 띄우기 때문에
  // capture phase + stopImmediatePropagation 으로 메모 페이지에 있을 동안엔
  // 메모 빠른 검색만 동작하도록 가로챈다.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setQuickOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, []);

  const openMemoFromQuick = (id: number) => {
    setActiveId(id);
    setFolder("all"); // 다른 폴더에 있던 메모도 리스트에 보이도록
    setSearch("");
    setQuickOpen(false);
  };

  const folderCount = (id: string): number => {
    if (id === "all") return facets.totalCount;
    if (id === "starred") return facets.starredCount;
    if (id === "trash") return 0;
    return facets.folderCount[id] ?? 0;
  };

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
  const updateTags = (tags: string[]) => {
    if (active) upsert({ ...active, tags });
  };

  const removeMemo = async (id: number) => {
    await remove(id);
    setActiveId((prev) => (prev === id ? 0 : prev));
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
          <button
            className="timer-btn"
            onClick={() => setQuickOpen(true)}
            title="빠른 검색 (⌘K)"
          >
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
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- ul>li 리스트 시맨틱 유지가 우선 (li 에 role="button" 은 no-noninteractive-element-to-interactive-role 위반). 키보드 접근은 내부 button 전환 리팩토링에서 처리 예정.
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
                <span className={styles.folderCount}>{folderCount(f.id)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.memoSideH} style={{ marginTop: 22 }}>
            태그
          </div>
          <div className={styles.tagCloud}>
            {facets.tags.length === 0 && (
              <span className={styles.tagEmpty}>아직 태그가 없어요</span>
            )}
            {facets.tags.map((t) => (
              <span
                key={t}
                className={styles.tagPill}
                {...pressable(() => setSearch(`#${t}`))}
              >
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
                {...pressable(() => setActiveId(m.id))}
              >
                <div className={styles.memoCardHead}>
                  {m.pinned && <Icon name="pinFilled" size={12} />}
                  <h4>{m.title}</h4>
                  <button
                    className={`${styles.memoStar}${m.starred ? ` ${styles.starred}` : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(m.id);
                    }}
                    title="즐겨찾기"
                  >
                    <Icon name={m.starred ? "starFilled" : "star"} size={13} />
                  </button>
                  <button
                    className={styles.memoTrash}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`"${m.title}" 메모를 삭제할까요?`)) {
                        removeMemo(m.id);
                      }
                    }}
                    title="삭제"
                    aria-label={`${m.title} 메모 삭제`}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
                <p className={styles.memoExcerpt}>{memoExcerpt(m)}</p>
                <div className={styles.memoMeta}>
                  <span>{memoUpdatedLabel(m)}</span>
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
              onUpdateTags={updateTags}
              onTogglePin={() => togglePin(active.id)}
              onToggleStar={() => toggleStar(active.id)}
              onDelete={() => removeMemo(active.id)}
            />
          )}
        </section>
      </div>

      {quickOpen && (
        <MemoQuickSearch
          memos={memos}
          onClose={() => setQuickOpen(false)}
          onPick={openMemoFromQuick}
        />
      )}
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
  onUpdateTags: (tags: string[]) => void;
  onTogglePin: () => void;
  onToggleStar: () => void;
  onDelete: () => Promise<void>;
}

function MemoEditor({
  active,
  onUpdateTitle,
  onUpdateBody,
  onUpdateTags,
  onTogglePin,
  onToggleStar,
  onDelete,
}: MemoEditorProps) {
  const titleField = useDraftField<string>({
    value: active.title,
    onCommit: onUpdateTitle,
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  const commitTag = () => {
    const next = tagDraft.trim().replace(/^#+/, "");
    setTagDraft("");
    setTagInputOpen(false);
    if (!next) return;
    if (active.tags.includes(next)) return;
    onUpdateTags([...active.tags, next]);
  };
  const removeTag = (t: string) => {
    onUpdateTags(active.tags.filter((x) => x !== t));
  };
  const openTagInput = () => {
    setTagInputOpen(true);
    setTagDraft("");
    requestAnimationFrame(() => tagInputRef.current?.focus());
  };

  // 본문 편집은 Tiptap (ProseMirror) — 한국어 IME 는 ProseMirror 가 자체 처리.
  // 자동 저장은 update 이벤트 + 디바운스(800ms) 로 onUpdateBody(markdown) 호출.
  // active.id 가 바뀌면 부모(MemoPage) 가 key prop 으로 컴포넌트를 remount 한다.

  const onUpdateBodyRef = useRef(onUpdateBody);
  useEffect(() => {
    onUpdateBodyRef.current = onUpdateBody;
  }, [onUpdateBody]);

  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBodyRef = useRef<string | null>(null);

  const flushBody = () => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    if (pendingBodyRef.current !== null) {
      onUpdateBodyRef.current(pendingBodyRef.current);
      pendingBodyRef.current = null;
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      // 본문은 HTML 로 저장한다(getHTML). 이전엔 markdown(getMarkdown)으로 저장했는데,
      // markdown 은 빈 문단(연속 빈 줄·후행 빈 줄)을 표현할 수 없어 자동저장 왕복에서
      // 사용자가 Enter 로 만든 빈 줄이 사라지는 문제가 있었다. HTML 은 <p></p> 로
      // 빈 문단을 그대로 보존한다.
      // html:true → 기존에 markdown 으로 저장된 레거시 본문도 그대로 로드되고
      // (markdown-it 이 파싱), 이후 첫 저장 때 HTML 로 자연 마이그레이션된다.
      // breaks:true → 레거시 markdown 의 단일 개행을 <br> 로 렌더(기존 표시 유지).
      Markdown.configure({ html: true, breaks: true }),
      CharacterCount,
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? "제목을 입력하세요…"
            : "여기에 적어보세요. 떠오르는 대로, 부담없이.",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: active.body,
    editorProps: {
      attributes: {
        class: styles.memoBody,
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor: ed }) => {
      // HTML 로 저장 — 빈 문단(빈 줄) 보존을 위해 markdown 대신 getHTML 사용.
      pendingBodyRef.current = ed.getHTML();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = setTimeout(() => {
        flushBody();
      }, 800);
    },
  });

  // 메모 전환 / 언마운트 시 강제 flush. 단 이 컴포넌트는 부모에서 key 로 remount
  // 되므로 사실상 언마운트 시점에만 호출된다.
  useEffect(() => {
    return () => {
      flushBody();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 툴바 active state 트리거용 — editor selection 변경 시 리렌더.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => setTick((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  const cmdHeading = () =>
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const cmdBold = () => editor?.chain().focus().toggleBold().run();
  const cmdItalic = () => editor?.chain().focus().toggleItalic().run();
  const cmdBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const cmdTaskList = () => editor?.chain().focus().toggleTaskList().run();
  const cmdBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const cmdImage = () => {
    if (!editor) return;
    const src = window.prompt("이미지 URL을 입력하세요");
    if (!src) return;
    editor.chain().focus().setImage({ src }).run();
  };
  const cmdLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("링크 URL을 입력하세요", previous ?? "https://");
    if (href === null) return;
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run();
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor ? editor.isActive(name, attrs) : false;

  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyShareLink = async () => {
    const url = `${window.location.origin}/dashboard/memo?id=${active.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("아래 링크를 복사하세요", url);
      return;
    }
    setCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 1800);
  };
  useEffect(
    () => () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    },
    [],
  );

  // body 통계는 editor 의 plain text 기준으로 계산 (마크다운 토큰 제외).
  // CharacterCount 가 ProseMirror 트리를 순회해 visible text 만 카운트.
  // 줄바꿈 / 마크다운 토큰 / 들여쓰기 영향 없음 — getText().length 보다 정확.
  const ccStorage = editor?.storage as
    | { characterCount?: { characters: () => number; words: () => number } }
    | undefined;
  const charCount = ccStorage?.characterCount?.characters() ?? 0;
  const wordCount = ccStorage?.characterCount?.words() ?? 0;

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
            <Icon name={active.pinned ? "pinFilled" : "pin"} size={15} />
          </button>
          <button
            type="button"
            className={"icon-btn" + (active.starred ? " on" : "")}
            onClick={onToggleStar}
            title={active.starred ? "즐겨찾기 해제" : "즐겨찾기"}
            aria-pressed={active.starred}
          >
            <Icon name={active.starred ? "starFilled" : "star"} size={15} />
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
            className={"icon-btn" + (copied ? " on" : "")}
            onClick={copyShareLink}
            title={copied ? "복사됨" : "공유 링크 복사"}
            aria-live="polite"
          >
            <Icon name={copied ? "check" : "link"} size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={async () => {
              if (!confirm(`"${active.title}" 메모를 삭제할까요?`)) return;
              flushBody();
              await onDelete();
            }}
            title="삭제"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>

      <div className={styles.memoToolbar}>
        <button
          type="button"
          title="제목"
          className={isActive("heading", { level: 2 }) ? styles.on : ""}
          onClick={cmdHeading}
        >
          <Icon name="h1" size={14} />
        </button>
        <button
          type="button"
          title="굵게"
          className={isActive("bold") ? styles.on : ""}
          onClick={cmdBold}
        >
          <Icon name="bold" size={14} />
        </button>
        <button
          type="button"
          title="기울임"
          className={isActive("italic") ? styles.on : ""}
          onClick={cmdItalic}
        >
          <Icon name="italic" size={14} />
        </button>
        <span className={styles.tbSep} />
        <button
          type="button"
          title="목록"
          className={isActive("bulletList") ? styles.on : ""}
          onClick={cmdBulletList}
        >
          <Icon name="list" size={14} />
        </button>
        <button
          type="button"
          title="체크리스트"
          className={isActive("taskList") ? styles.on : ""}
          onClick={cmdTaskList}
        >
          <Icon name="check" size={14} />
        </button>
        <button
          type="button"
          title="인용"
          className={isActive("blockquote") ? styles.on : ""}
          onClick={cmdBlockquote}
        >
          <Icon name="quote" size={14} />
        </button>
        <span className={styles.tbSep} />
        <button type="button" title="이미지" onClick={cmdImage}>
          <Icon name="image" size={14} />
        </button>
        <button
          type="button"
          title="링크"
          className={isActive("link") ? styles.on : ""}
          onClick={cmdLink}
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
              <button
                type="button"
                onClick={() => removeTag(t)}
                aria-label={`${t} 태그 제거`}
              >
                ×
              </button>
            </span>
          ))}
          {tagInputOpen ? (
            <input
              ref={tagInputRef}
              className={styles.memoTagInput}
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onBlur={commitTag}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  commitTag();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setTagDraft("");
                  setTagInputOpen(false);
                } else if (
                  e.key === "Backspace" &&
                  tagDraft === "" &&
                  active.tags.length > 0
                ) {
                  e.preventDefault();
                  removeTag(active.tags[active.tags.length - 1]);
                }
              }}
              placeholder="태그 입력 후 Enter"
            />
          ) : (
            <button
              type="button"
              className={styles.memoTagAdd}
              onClick={openTagInput}
            >
              + 태그
            </button>
          )}
        </div>
        <EditorContent editor={editor} className={styles.memoBodyHost} />
      </div>

      <div className={styles.memoFoot}>
        <span className="hand">손글씨처럼, 부담없이.</span>
        <div className={styles.memoFootStats}>
          <span>
            <b>{charCount}</b>자
          </span>
          <span className={styles.dotSep}>·</span>
          <span>
            <b>{wordCount}</b>단어
          </span>
          <span className={styles.dotSep}>·</span>
          <span>
            읽는 시간 <b>{Math.max(1, Math.round(charCount / 400))}</b>분
          </span>
        </div>
      </div>

      {historyOpen && (
        <div
          role="presentation"
          style={{ position: "fixed", inset: 0, zIndex: 100 }}
          onClick={() => setHistoryOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 80,
              right: 24,
              background: "var(--card-elev)",
              borderRadius: 10,
              boxShadow: "var(--shadow-md)",
              padding: 14,
              fontSize: 13,
              minWidth: 240,
            }}
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, marginBottom: 10 }}>이 메모 정보</div>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "6px 14px",
                margin: 0,
              }}
            >
              <dt style={{ color: "var(--ink-mute)" }}>마지막 편집</dt>
              <dd style={{ margin: 0 }}>{memoUpdatedLabel(active)}</dd>
              <dt style={{ color: "var(--ink-mute)" }}>분량</dt>
              <dd style={{ margin: 0 }}>
                {charCount}자 · {wordCount}단어
              </dd>
              <dt style={{ color: "var(--ink-mute)" }}>읽는 시간</dt>
              <dd style={{ margin: 0 }}>
                약 {Math.max(1, Math.round(charCount / 400))}분
              </dd>
              <dt style={{ color: "var(--ink-mute)" }}>폴더</dt>
              <dd style={{ margin: 0 }}>{folderLabel(active.folder)}</dd>
              <dt style={{ color: "var(--ink-mute)" }}>태그</dt>
              <dd style={{ margin: 0 }}>
                {active.tags.length === 0
                  ? "—"
                  : active.tags.map((t) => `#${t}`).join(" ")}
              </dd>
            </dl>
          </div>
        </div>
      )}

    </>
  );
}

// ============================================================
// MemoQuickSearch — Cmd/Ctrl+K command-palette 스타일 빠른 검색
// 제목/태그/본문에서 매칭. ↑↓ 이동, Enter 선택, Esc 닫기.
// ============================================================
interface MemoQuickSearchProps {
  memos: readonly import("@/types").MemoDoc[];
  onClose: () => void;
  onPick: (id: number) => void;
}

function MemoQuickSearch({ memos, onClose, onPick }: MemoQuickSearchProps) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      // 비어 있을 땐 최근/즐겨찾기 우선 8개 노출
      return [...memos]
        .sort((a, b) => {
          if (a.starred !== b.starred) return a.starred ? -1 : 1;
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return 0;
        })
        .slice(0, 8);
    }
    // 매칭 점수: 제목 hit > 태그 hit > 본문 hit
    const scored = memos
      .map((m) => {
        const title = m.title.toLowerCase();
        const body = memoPlainText(m.body).toLowerCase();
        const tagHit = m.tags.some((t) => t.toLowerCase().includes(query));
        let score = 0;
        if (title.includes(query)) score += title.startsWith(query) ? 30 : 20;
        if (tagHit) score += 10;
        if (body.includes(query)) score += 5;
        return { m, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.m);
    return scored;
  }, [memos, q]);

  // 결과 갱신 시 cursor reset
  useEffect(() => {
    setCursor(0);
  }, [q]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = results[cursor];
      if (picked) onPick(picked.id);
    }
  };

  return (
    <div
      className={styles.quickBackdrop}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.quickPanel} role="dialog" aria-label="빠른 검색">
        <div className={styles.quickInputRow}>
          <Icon name="search" size={14} />
          <input
            ref={inputRef}
            className={styles.quickInput}
            placeholder="제목·태그·본문 검색…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className={styles.quickKbd}>Esc</kbd>
        </div>
        <div className={styles.quickResults}>
          {results.length === 0 && (
            <div className={styles.quickEmpty}>일치하는 메모가 없어요.</div>
          )}
          {results.map((m, i) => (
            <button
              key={m.id}
              type="button"
              className={`${styles.quickItem}${i === cursor ? ` ${styles.on}` : ""}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => onPick(m.id)}
            >
              <span className={styles.quickItemTitle}>{m.title}</span>
              <span className={styles.quickItemMeta}>
                {folderLabel(m.folder)}
                {m.tags.length > 0 && (
                  <>
                    <span className={styles.dotSep}>·</span>
                    {m.tags.slice(0, 3).map((t) => (
                      <span key={t} className={styles.quickItemTag}>
                        #{t}
                      </span>
                    ))}
                  </>
                )}
              </span>
              <span className={styles.quickItemExcerpt}>{memoExcerpt(m, 80)}</span>
            </button>
          ))}
        </div>
        <div className={styles.quickFoot}>
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> 이동
          </span>
          <span>
            <kbd>Enter</kbd> 열기
          </span>
          <span>
            <kbd>⌘K</kbd> 토글
          </span>
        </div>
      </div>
    </div>
  );
}

export { MemoPage };
