import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { useMemos } from "@/data/memos";
import { FOLDERS, ALL_TAGS } from "@/data/memos";
import { memoExcerpt, memoWordCount, memoUpdatedLabel } from "@/data/memos";

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
  const updateBody = (body) => {
    if (active) upsert({ ...active, body });
  };
  const updateTitle = (title) => {
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

      <div className="memo-layout">
        {/* COLUMN 1 — Folders + tags */}
        <aside className="memo-folders">
          <div className="memo-side-h">폴더</div>
          <ul className="folder-list">
            {FOLDERS.map((f) => (
              <li
                key={f.id}
                className={"folder-item" + (folder === f.id ? " on" : "")}
                onClick={() => setFolder(f.id)}
              >
                <span
                  className="folder-ico"
                  style={f.color ? { color: f.color } : undefined}
                >
                  <Icon name={f.icon} size={15} />
                </span>
                <span className="folder-label">{f.label}</span>
                <span className="folder-count">{f.count}</span>
              </li>
            ))}
          </ul>

          <div className="memo-side-h" style={{ marginTop: 22 }}>
            태그
          </div>
          <div className="tag-cloud">
            {ALL_TAGS.map((t) => (
              <span key={t} className="tag-pill">
                #{t}
              </span>
            ))}
          </div>

          <div className="memo-quote">
            <span className="hand">"</span>
            <p>적어두지 않은 생각은 사라진다. 손이 기억보다 정직하다.</p>
          </div>
        </aside>

        {/* COLUMN 2 — Memo list */}
        <section className="memo-list-col">
          <div className="memo-list-head">
            <div className="memo-search">
              <Icon name="search" size={13} />
              <input
                placeholder="메모 검색…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="memo-sort">
              {[
                ["updated", "최근순"],
                ["title", "가나다"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  className={sort === k ? "on" : ""}
                  onClick={() => setSort(k)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="memo-list">
            {filtered.length === 0 && (
              <div className="memo-empty">
                <div className="hand" style={{ fontSize: 22, marginBottom: 6 }}>
                  비어있어요
                </div>
                <div>이 폴더엔 아직 메모가 없습니다.</div>
              </div>
            )}
            {filtered.map((m) => (
              <div
                key={m.id}
                className={"memo-card" + (activeId === m.id ? " on" : "")}
                onClick={() => setActiveId(m.id)}
              >
                <div className="memo-card-head">
                  {m.pinned && <Icon name="pin" size={12} />}
                  <h4>{m.title}</h4>
                  <button
                    className={"memo-star" + (m.starred ? " starred" : "")}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(m.id);
                    }}
                    title="즐겨찾기"
                  >
                    <Icon name="star" size={13} />
                  </button>
                </div>
                <p className="memo-excerpt">{memoExcerpt(m)}</p>
                <div className="memo-meta">
                  <span>{memoUpdatedLabel(m)}</span>
                  <span className="dot-sep">·</span>
                  <span>{memoWordCount(m)}자</span>
                  <span className="memo-tag-row">
                    {m.tags.slice(0, 2).map((t) => (
                      <span key={t} className="memo-mini-tag">
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
        <section className="memo-editor">
          {!active ? (
            <div className="memo-empty large">
              <div className="hand" style={{ fontSize: 28 }}>
                메모를 골라주세요 →
              </div>
            </div>
          ) : (
            <>
              <div className="memo-edit-head">
                <div className="memo-edit-meta">
                  <span
                    className="folder-chip"
                    style={{ background: folderColor(active.folder) }}
                  >
                    {folderLabel(active.folder)}
                  </span>
                  <span className="muted">
                    최종 편집 · {memoUpdatedLabel(active)}
                  </span>
                  <span className="muted">·</span>
                  <span className="muted">{memoWordCount(active)}자</span>
                </div>
                <div className="memo-edit-actions">
                  <button
                    className="icon-btn"
                    onClick={() => togglePin(active.id)}
                    title="고정"
                  >
                    <Icon name="pin" size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => toggleStar(active.id)}
                    title="즐겨찾기"
                  >
                    <Icon name="star" size={15} />
                  </button>
                  <button className="icon-btn" title="기록">
                    <Icon name="history" size={15} />
                  </button>
                  <button className="icon-btn" title="공유">
                    <Icon name="link" size={15} />
                  </button>
                  <button className="icon-btn" title="더보기">
                    <Icon name="more" size={15} />
                  </button>
                </div>
              </div>

              <div className="memo-toolbar">
                <button title="제목">
                  <Icon name="h1" size={14} />
                </button>
                <button title="굵게">
                  <Icon name="bold" size={14} />
                </button>
                <button title="기울임">
                  <Icon name="italic" size={14} />
                </button>
                <span className="tb-sep" />
                <button title="목록">
                  <Icon name="list" size={14} />
                </button>
                <button title="체크리스트">
                  <Icon name="check" size={14} />
                </button>
                <button title="인용">
                  <Icon name="quote" size={14} />
                </button>
                <span className="tb-sep" />
                <button title="이미지">
                  <Icon name="image" size={14} />
                </button>
                <button title="링크">
                  <Icon name="link" size={14} />
                </button>
                <span className="tb-sep" />
                <span className="tb-status">
                  <span className="save-dot" /> 자동 저장됨
                </span>
              </div>

              <div className="memo-paper">
                <input
                  className="memo-title-in"
                  value={active.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="제목을 입력하세요…"
                />
                <div className="memo-tag-edit">
                  {active.tags.map((t) => (
                    <span key={t} className="memo-tag-chip">
                      #{t}
                      <button>×</button>
                    </span>
                  ))}
                  <button className="memo-tag-add">+ 태그</button>
                </div>
                <textarea
                  className="memo-body"
                  value={active.body}
                  onChange={(e) => updateBody(e.target.value)}
                  placeholder="여기에 메모를 적어보세요. 마크다운을 지원합니다 — # 제목, **굵게**, - 목록…"
                  spellCheck={false}
                />
              </div>

              <div className="memo-foot">
                <span className="hand">손글씨처럼, 부담없이.</span>
                <div className="memo-foot-stats">
                  <span>
                    <b>{active.body.length}</b>자
                  </span>
                  <span className="dot-sep">·</span>
                  <span>
                    <b>{active.body.split(/\s+/).filter(Boolean).length}</b>단어
                  </span>
                  <span className="dot-sep">·</span>
                  <span>
                    읽는 시간{" "}
                    <b>{Math.max(1, Math.round(active.body.length / 400))}</b>분
                  </span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function folderColor(id) {
  return (
    { work: "#fde0e6", personal: "#dbecf5", study: "#dff0d2" }[id] ||
    "var(--bg-paper)"
  );
}
function folderLabel(id) {
  return { work: "업무", personal: "개인", study: "공부 · 독서" }[id] || id;
}

export { MemoPage };
