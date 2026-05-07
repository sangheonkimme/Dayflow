/* global React, Icon */
const { useState, useMemo } = React;

// ============================================================
// MEMO PAGE — 장문 메모 detail page
// 3-column desk layout: folders | memo list | editor
// ============================================================

const SEED_MEMOS = [
  {
    id: 1,
    title: "디자인 시스템 v2 — 컬러 토큰 정리",
    folder: "work",
    tags: ["디자인", "토큰"],
    starred: true,
    pinned: true,
    updated: "오늘 오후 2:14",
    word: 612,
    excerpt: "primary / secondary / surface 3-tier로 재정리. 다크 모드 대응은 oklch로…",
    body: `# 디자인 시스템 v2 — 컬러 토큰 정리

오늘 회의에서 결정된 사항 정리.

## 토큰 구조
3단 구조로 간소화한다:
1. **Primitive** — 원시 색상 팔레트 (raw values)
2. **Semantic** — 의미 기반 별칭 (surface / ink / accent)
3. **Component** — 특정 컴포넌트 전용 (button-primary-bg 등)

## 다크 모드
- oklch 기반으로 명도(lightness)만 반전시키는 방식으로 통일.
- 채도(chroma)는 라이트보다 살짝 낮춤 — 눈 피로도 ↓.
- 이전엔 채도까지 같이 건드려서 색이 칙칙해졌었음.

> "토큰은 약속이지, 색상이 아니다."  — 어느 시니어 디자이너

## 다음 단계
- [ ] 피그마 변수 정리 (수요일까지)
- [x] 라이트 토큰 정의
- [ ] 다크 토큰 정의
- [ ] 개발팀에 핸드오프 문서 전달

연락: 민수 PM에게 컬러 시안 슬랙으로 공유 예정.`,
  },
  {
    id: 2,
    title: "이번 분기 회고",
    folder: "personal",
    tags: ["회고", "성장"],
    starred: true,
    pinned: false,
    updated: "어제",
    word: 384,
    excerpt: "잘한 것: 디자인 시스템 안정화, 신규 기능 3건 출시. 아쉬운 것…",
    body: `# 이번 분기 회고

## 잘한 것
- 디자인 시스템 v1 안정화
- 신규 기능 3건 출시
- 팀원 1명 멘토링 — 막내 디자이너 성장 도움

## 아쉬운 것
- 야근이 잦았음. 다음 분기엔 일정 조율 더 적극적으로.
- 책 읽는 시간 부족. 분기에 책 1권은 꼭.
- 운동 빈도가 떨어짐.

## 다음 분기 목표
1. 정시 퇴근 주 3회 이상
2. 디자인 책 2권 완독
3. 필라테스 주 2회`,
  },
  {
    id: 3,
    title: "주말에 갈 동네 카페 리스트",
    folder: "personal",
    tags: ["카페", "주말"],
    starred: false,
    pinned: false,
    updated: "그저께",
    word: 142,
    excerpt: "성수 — 어니언, 대림창고. 연남 — 카멜커피, 피어커피…",
    body: `# 주말 카페 리스트

## 성수
- 어니언 — 빵이 정말 맛있음
- 대림창고 — 사진 찍기 좋음
- 카페 할아버지공장 — 오래 앉아있기 좋은 공간

## 연남
- 카멜커피 — 라떼가 진함
- 피어커피 — 원두 종류가 다양

## 한남
- 콤마콤마 — 분위기 ◎
- 더 카페 1924`,
  },
  {
    id: 4,
    title: "신규 프로젝트 킥오프 — 아이디어 메모",
    folder: "work",
    tags: ["기획", "아이디어"],
    starred: false,
    pinned: false,
    updated: "월요일",
    word: 256,
    excerpt: "타겟: 20-30대 직장인. 핵심 가치: 일과 삶의 분리…",
    body: `# 신규 프로젝트 — 아이디어 노트

## 타겟
- 20-30대 직장인
- 출퇴근 1시간 이상

## 핵심 가치
> 일과 삶의 분리

- 퇴근 후 알림 자동 차단
- 주말엔 업무 데이터 안 보임
- 휴가 모드`,
  },
  {
    id: 5,
    title: "책 — 『생각의 탄생』 발췌",
    folder: "study",
    tags: ["독서", "발췌"],
    starred: false,
    pinned: false,
    updated: "지난주",
    word: 521,
    excerpt: "관찰, 형상화, 추상, 패턴인식… 13가지 생각도구.",
    body: `# 『생각의 탄생』 — 핵심 정리

## 13가지 생각도구
1. 관찰
2. 형상화
3. 추상
4. 패턴인식
5. 패턴형성
6. 유추
7. 몸으로 생각하기
8. 감정이입
9. 차원적 사고
10. 모형 만들기
11. 놀이
12. 변형
13. 통합`,
  },
  {
    id: 6,
    title: "엄마 생신 선물 아이디어",
    folder: "personal",
    tags: ["가족", "선물"],
    starred: false,
    pinned: false,
    updated: "11.20",
    word: 84,
    excerpt: "캐시미어 머플러? 안마의자는 부담스럽고…",
    body: `# 엄마 생신 (12월 14일)

## 후보
- 캐시미어 머플러 (베이지 / 카멜)
- 화분 — 다육이 좋아하심
- 백화점 상품권 (실용적이지만 정 없어 보일까)

## 결정
캐시미어 머플러 + 손편지 조합으로.`,
  },
  {
    id: 7,
    title: "인터뷰 준비 — 자주 받는 질문",
    folder: "study",
    tags: ["커리어"],
    starred: false,
    pinned: false,
    updated: "11.18",
    word: 402,
    excerpt: "본인 소개, 강점/약점, 갈등 해결 사례, 실패 경험…",
    body: `# 인터뷰 준비

## 자주 받는 질문
- 자기소개 (1분 / 3분 버전)
- 강점과 약점
- 갈등 해결 경험
- 실패 경험과 배운 점
- 5년 후 모습

## STAR 프레임워크
- **S**ituation — 상황
- **T**ask — 과제
- **A**ction — 행동
- **R**esult — 결과`,
  },
];

const FOLDERS = [
  { id: "all",      label: "전체 메모",   icon: "note",   count: 7 },
  { id: "starred",  label: "즐겨찾기",    icon: "star",   count: 2 },
  { id: "work",     label: "업무",        icon: "folder", count: 2, color: "#e89aac" },
  { id: "personal", label: "개인",        icon: "folder", count: 3, color: "#8ec0d6" },
  { id: "study",    label: "공부 · 독서", icon: "folder", count: 2, color: "#a8d09b" },
  { id: "trash",    label: "휴지통",      icon: "trash",  count: 0 },
];

const ALL_TAGS = ["디자인", "토큰", "회고", "성장", "카페", "주말", "기획", "아이디어", "독서", "가족", "커리어"];

function MemoPage() {
  const [folder, setFolder] = useState("all");
  const [activeId, setActiveId] = useState(1);
  const [memos, setMemos] = useState(SEED_MEMOS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated"); // updated | title | created
  const [toast, setToast] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [linkDialog, setLinkDialog] = useState(null); // null | "link" | "image"
  const [moveDialog, setMoveDialog] = useState(false);
  const editorRef = React.useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    let list = memos;
    if (folder === "starred") list = list.filter(m => m.starred);
    else if (folder !== "all" && folder !== "trash") list = list.filter(m => m.folder === folder);
    else if (folder === "trash") list = [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => (m.title + m.excerpt).toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "ko");
      // pinned first, then by 'updated' string ordering (seed order)
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
  }, [memos, folder, search, sort]);

  const active = memos.find(m => m.id === activeId) || filtered[0];

  const toggleStar = (id) => {
    const m = memos.find(x => x.id === id);
    setMemos(memos.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    if (m) showToast(m.starred ? "즐겨찾기에서 해제" : "⭐ 즐겨찾기에 추가");
  };
  const togglePin = (id) => {
    const m = memos.find(x => x.id === id);
    setMemos(memos.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m));
    if (m) showToast(m.pinned ? "고정 해제" : "📌 상단에 고정됨");
  };
  const updateBody = (body) => setMemos(memos.map(m => m.id === active.id ? { ...m, body } : m));
  const updateTitle = (title) => setMemos(memos.map(m => m.id === active.id ? { ...m, title } : m));

  // ---------- markdown insert helpers ----------
  const wrapSelection = (before, after = before, placeholder = "") => {
    const ta = editorRef.current;
    if (!ta || !active) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel = ta.value.slice(start, end) || placeholder;
    const next = ta.value.slice(0, start) + before + sel + after + ta.value.slice(end);
    updateBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    });
  };
  const prefixLines = (prefix) => {
    const ta = editorRef.current;
    if (!ta || !active) return;
    const v = ta.value;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const lineStart = v.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = v.indexOf("\n", end);
    const block = v.slice(lineStart, lineEnd === -1 ? v.length : lineEnd);
    const transformed = block.split("\n").map(l => prefix + l).join("\n");
    const next = v.slice(0, lineStart) + transformed + v.slice(lineEnd === -1 ? v.length : lineEnd);
    updateBody(next);
    requestAnimationFrame(() => ta.focus());
  };
  const insertAt = (text) => {
    const ta = editorRef.current;
    if (!ta || !active) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const next = ta.value.slice(0, start) + text + ta.value.slice(end);
    updateBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  };
  const handleHeading = () => prefixLines("# ");
  const handleBold = () => wrapSelection("**", "**", "굵게");
  const handleItalic = () => wrapSelection("*", "*", "기울임");
  const handleList = () => prefixLines("- ");
  const handleCheck = () => prefixLines("- [ ] ");
  const handleQuote = () => prefixLines("> ");

  // ---------- more menu actions ----------
  const duplicateMemo = () => {
    const id = Date.now();
    setMemos([{ ...active, id, title: active.title + " (복사본)", updated: "방금", pinned: false }, ...memos]);
    setActiveId(id);
    setMoreOpen(false);
    showToast("📋 메모가 복제되었습니다");
  };
  const deleteMemo = () => {
    if (!confirm(`"${active.title}" 메모를 삭제할까요?`)) return;
    const next = memos.filter(m => m.id !== active.id);
    setMemos(next);
    setActiveId(next[0]?.id);
    setMoreOpen(false);
    showToast("🗑 휴지통으로 이동됨");
  };
  const moveToFolder = (id) => {
    setMemos(memos.map(m => m.id === active.id ? { ...m, folder: id } : m));
    setMoveDialog(false);
    setMoreOpen(false);
    showToast(`📁 "${folderLabel(id)}" 폴더로 이동`);
  };
  const exportMd = () => {
    showToast("⬇️ Markdown 파일로 내보내기 완료");
    setMoreOpen(false);
  };

  // ---------- share actions ----------
  const copyShareLink = () => {
    showToast("🔗 공유 링크가 복사되었습니다");
    setShareOpen(false);
  };

  // ---------- link / image insert ----------
  const submitLink = (url, label) => {
    if (!url) { setLinkDialog(null); return; }
    if (linkDialog === "link") insertAt(`[${label || url}](${url})`);
    else insertAt(`![${label || "이미지"}](${url})\n`);
    setLinkDialog(null);
    showToast(linkDialog === "link" ? "🔗 링크 삽입됨" : "🖼 이미지 삽입됨");
  };

  const newMemo = () => {
    const id = Date.now();
    const m = {
      id, title: "제목 없는 메모",
      folder: folder === "all" || folder === "starred" || folder === "trash" ? "personal" : folder,
      tags: [], starred: false, pinned: false,
      updated: "방금", word: 0,
      excerpt: "", body: "# 제목 없는 메모\n\n",
    };
    setMemos([m, ...memos]);
    setActiveId(id);
  };

  return (
    <div data-screen-label="05 메모">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 메모</div>
          <h1 className="page-title">메모 <span className="hand-sub">— 떠오를 때 곧바로 적어두세요</span></h1>
          <div className="page-sub">{memos.length}개의 장문 메모 · 마지막 편집 {active?.updated || "—"}</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn"><Icon name="search" size={14} />빠른 검색</button>
          <button className="timer-btn primary" onClick={newMemo}>+ 새 메모</button>
        </div>
      </div>

      <div className="memo-layout">
        {/* COLUMN 1 — Folders + tags */}
        <aside className="memo-folders">
          <div className="memo-side-h">폴더</div>
          <ul className="folder-list">
            {FOLDERS.map(f => (
              <li
                key={f.id}
                className={"folder-item" + (folder === f.id ? " on" : "")}
                onClick={() => setFolder(f.id)}
              >
                <span className="folder-ico" style={f.color ? { color: f.color } : null}>
                  <Icon name={f.icon} size={15} />
                </span>
                <span className="folder-label">{f.label}</span>
                <span className="folder-count">{f.count}</span>
              </li>
            ))}
          </ul>

          <div className="memo-side-h" style={{ marginTop: 22 }}>태그</div>
          <div className="tag-cloud">
            {ALL_TAGS.map(t => (
              <span key={t} className="tag-pill">#{t}</span>
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
              {[["updated","최근순"],["title","가나다"]].map(([k,l]) => (
                <button key={k} className={sort === k ? "on" : ""} onClick={() => setSort(k)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="memo-list">
            {filtered.length === 0 && (
              <div className="memo-empty">
                <div className="hand" style={{ fontSize: 22, marginBottom: 6 }}>비어있어요</div>
                <div>이 폴더엔 아직 메모가 없습니다.</div>
              </div>
            )}
            {filtered.map(m => (
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
                    onClick={(e) => { e.stopPropagation(); toggleStar(m.id); }}
                    title="즐겨찾기"
                  >
                    <Icon name="star" size={13} />
                  </button>
                </div>
                <p className="memo-excerpt">{m.excerpt}</p>
                <div className="memo-meta">
                  <span>{m.updated}</span>
                  <span className="dot-sep">·</span>
                  <span>{m.word}자</span>
                  <span className="memo-tag-row">
                    {m.tags.slice(0, 2).map(t => <span key={t} className="memo-mini-tag">#{t}</span>)}
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
              <div className="hand" style={{ fontSize: 28 }}>메모를 골라주세요 →</div>
            </div>
          ) : (
            <>
              <div className="memo-edit-head">
                <div className="memo-edit-meta">
                  <span className="folder-chip" style={{ background: folderColor(active.folder) }}>
                    {folderLabel(active.folder)}
                  </span>
                  <span className="muted">최종 편집 · {active.updated}</span>
                  <span className="muted">·</span>
                  <span className="muted">{active.word}자</span>
                </div>
                <div className="memo-edit-actions" style={{ position: "relative" }}>
                  <button className={"icon-btn" + (active.pinned ? " on-yellow" : "")} onClick={() => togglePin(active.id)} title="고정">
                    <Icon name="pin" size={15} />
                  </button>
                  <button className={"icon-btn" + (active.starred ? " on-yellow" : "")} onClick={() => toggleStar(active.id)} title="즐겨찾기">
                    <Icon name="star" size={15} />
                  </button>
                  <button className={"icon-btn" + (historyOpen ? " on-ink" : "")} onClick={() => { setHistoryOpen(!historyOpen); setShareOpen(false); setMoreOpen(false); }} title="기록"><Icon name="history" size={15} /></button>
                  <button className={"icon-btn" + (shareOpen ? " on-ink" : "")} onClick={() => { setShareOpen(!shareOpen); setMoreOpen(false); setHistoryOpen(false); }} title="공유"><Icon name="link" size={15} /></button>
                  <button className={"icon-btn" + (moreOpen ? " on-ink" : "")} onClick={() => { setMoreOpen(!moreOpen); setShareOpen(false); setHistoryOpen(false); }} title="더보기"><Icon name="more" size={15} /></button>

                  {shareOpen && (
                    <div className="memo-pop share-pop">
                      <div className="pop-h">이 메모 공유</div>
                      <button className="pop-row" onClick={copyShareLink}>
                        <span className="pop-ico">🔗</span>
                        <div><b>링크 복사</b><small>읽기 전용 · 누구나 열람</small></div>
                      </button>
                      <button className="pop-row" onClick={copyShareLink}>
                        <span className="pop-ico">✏️</span>
                        <div><b>편집 가능 링크</b><small>로그인한 사용자만</small></div>
                      </button>
                      <div className="pop-sep" />
                      <button className="pop-row" onClick={() => { showToast("📄 PDF로 내보내기"); setShareOpen(false); }}>
                        <span className="pop-ico">📄</span>
                        <div><b>PDF로 내보내기</b><small>인쇄용 레이아웃</small></div>
                      </button>
                      <button className="pop-row" onClick={() => { showToast("📧 메일 초안 생성됨"); setShareOpen(false); }}>
                        <span className="pop-ico">✉️</span>
                        <div><b>메일로 보내기</b><small>제목+본문 자동 입력</small></div>
                      </button>
                      <div className="pop-sep" />
                      <div className="pop-perm">
                        <span>🌐 권한</span>
                        <select defaultValue="read"><option value="read">읽기 전용</option><option value="comment">댓글 가능</option><option value="edit">편집 가능</option></select>
                      </div>
                    </div>
                  )}

                  {moreOpen && (
                    <div className="memo-pop more-pop">
                      <button className="pop-row sm" onClick={() => { setMoreOpen(false); editorRef.current?.querySelector?.('.memo-title-in')?.focus?.(); document.querySelector('.memo-title-in')?.focus(); }}>
                        <span className="pop-ico">✏️</span><div><b>이름 변경</b></div>
                      </button>
                      <button className="pop-row sm" onClick={() => setMoveDialog(true)}>
                        <span className="pop-ico">📁</span><div><b>폴더 이동…</b></div>
                      </button>
                      <button className="pop-row sm" onClick={duplicateMemo}>
                        <span className="pop-ico">📋</span><div><b>복제</b></div>
                      </button>
                      <button className="pop-row sm" onClick={exportMd}>
                        <span className="pop-ico">⬇️</span><div><b>Markdown 내보내기</b></div>
                      </button>
                      <div className="pop-sep" />
                      <button className="pop-row sm" onClick={() => { showToast("🖨 인쇄 미리보기"); setMoreOpen(false); }}>
                        <span className="pop-ico">🖨</span><div><b>인쇄</b><kbd>⌘P</kbd></div>
                      </button>
                      <button className="pop-row sm" onClick={() => { showToast("📌 잠금 설정됨"); setMoreOpen(false); }}>
                        <span className="pop-ico">🔒</span><div><b>잠금</b></div>
                      </button>
                      <div className="pop-sep" />
                      <button className="pop-row sm danger" onClick={deleteMemo}>
                        <span className="pop-ico">🗑</span><div><b>삭제</b><kbd>⌫</kbd></div>
                      </button>
                    </div>
                  )}

                  {historyOpen && (
                    <div className="memo-pop history-pop">
                      <div className="pop-h">버전 기록 <span className="pop-h-sub">자동 저장 · 30일 보관</span></div>
                      {[
                        { t: "오늘 오후 2:14", n: "현재 버전", w: "+12자 · 다음 단계 섹션 추가", cur: true },
                        { t: "오늘 오전 11:02", n: "v3", w: "+45자 · 다크 모드 단락 보강" },
                        { t: "어제 오후 6:31", n: "v2", w: "−8자 · 토큰 구조 정리" },
                        { t: "어제 오전 9:18", n: "v1 · 초안", w: "최초 작성 · 487자" },
                      ].map((h, i) => (
                        <div key={i} className={"hist-item" + (h.cur ? " cur" : "")}>
                          <div className="hist-dot" />
                          <div className="hist-body">
                            <div className="hist-row1">
                              <b>{h.n}</b>
                              <span className="hist-time">{h.t}</span>
                            </div>
                            <div className="hist-msg">{h.w}</div>
                            {!h.cur && (
                              <div className="hist-actions">
                                <button onClick={() => { showToast("⏮ 이 버전으로 되돌렸습니다"); setHistoryOpen(false); }}>이 버전으로 복원</button>
                                <button className="ghost" onClick={() => showToast("🔍 미리보기")}>미리보기</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="memo-toolbar">
                <ToolbarBtn label="H" tip="제목 (⌘1)" onClick={handleHeading}><Icon name="h1" size={14} /></ToolbarBtn>
                <ToolbarBtn label="B" tip="굵게 (⌘B)" onClick={handleBold}><Icon name="bold" size={14} /></ToolbarBtn>
                <ToolbarBtn label="I" tip="기울임 (⌘I)" onClick={handleItalic}><Icon name="italic" size={14} /></ToolbarBtn>
                <span className="tb-sep" />
                <ToolbarBtn tip="목록" onClick={handleList}><Icon name="list" size={14} /></ToolbarBtn>
                <ToolbarBtn tip="체크리스트" onClick={handleCheck}><Icon name="check" size={14} /></ToolbarBtn>
                <ToolbarBtn tip="인용" onClick={handleQuote}><Icon name="quote" size={14} /></ToolbarBtn>
                <span className="tb-sep" />
                <ToolbarBtn tip="이미지 삽입" onClick={() => setLinkDialog("image")}><Icon name="image" size={14} /></ToolbarBtn>
                <ToolbarBtn tip="링크 삽입" onClick={() => setLinkDialog("link")}><Icon name="link" size={14} /></ToolbarBtn>
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
                  {active.tags.map(t => (
                    <span key={t} className="memo-tag-chip">#{t}<button>×</button></span>
                  ))}
                  <button className="memo-tag-add">+ 태그</button>
                </div>
                <textarea
                  ref={editorRef}
                  className="memo-body"
                  value={active.body}
                  onChange={(e) => updateBody(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); handleBold(); }
                    else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") { e.preventDefault(); handleItalic(); }
                    else if ((e.metaKey || e.ctrlKey) && e.key === "1") { e.preventDefault(); handleHeading(); }
                  }}
                  placeholder="여기에 메모를 적어보세요. 마크다운을 지원합니다 — # 제목, **굵게**, - 목록…"
                  spellCheck={false}
                />
              </div>

              <div className="memo-foot">
                <span className="hand">손글씨처럼, 부담없이.</span>
                <div className="memo-foot-stats">
                  <span><b>{active.body.length}</b>자</span>
                  <span className="dot-sep">·</span>
                  <span><b>{active.body.split(/\s+/).filter(Boolean).length}</b>단어</span>
                  <span className="dot-sep">·</span>
                  <span>읽는 시간 <b>{Math.max(1, Math.round(active.body.length / 400))}</b>분</span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {linkDialog && (
        <LinkDialog kind={linkDialog} onClose={() => setLinkDialog(null)} onSubmit={submitLink} />
      )}
      {moveDialog && (
        <div className="memo-modal-bg" onClick={() => setMoveDialog(false)}>
          <div className="memo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-h">📁 폴더로 이동</div>
            <div className="move-list">
              {FOLDERS.filter(f => !["all","starred","trash"].includes(f.id)).map(f => (
                <button key={f.id} className={"move-item" + (active?.folder === f.id ? " cur" : "")} onClick={() => moveToFolder(f.id)}>
                  <span className="move-ico" style={{ background: folderColor(f.id) }}><Icon name={f.icon} size={14} /></span>
                  <span className="move-label">{f.label}</span>
                  {active?.folder === f.id && <span className="move-cur">현재</span>}
                </button>
              ))}
            </div>
            <button className="modal-cancel" onClick={() => setMoveDialog(false)}>취소</button>
          </div>
        </div>
      )}
      {toast && <div className="memo-toast">{toast}</div>}
    </div>
  );
}

function ToolbarBtn({ children, tip, label, onClick }) {
  const [flash, setFlash] = React.useState(false);
  const handle = (e) => {
    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    onClick?.(e);
  };
  return (
    <button
      className={"tb-btn" + (flash ? " flash" : "")}
      onClick={handle}
      data-label={label}
    >
      {children}
      {tip && <span className="tb-tip">{tip}</span>}
    </button>
  );
}

function LinkDialog({ kind, onClose, onSubmit }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  return (
    <div className="memo-modal-bg" onClick={onClose}>
      <div className="memo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">{kind === "link" ? "🔗 링크 삽입" : "🖼 이미지 삽입"}</div>
        <label className="modal-field">
          <span>URL</span>
          <input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder={kind === "link" ? "https://example.com" : "https://…/image.png"} />
        </label>
        <label className="modal-field">
          <span>{kind === "link" ? "표시 텍스트" : "대체 텍스트"}</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={kind === "link" ? "여기를 클릭" : "이미지 설명"} />
        </label>
        {kind === "image" && url && (
          <div className="modal-preview"><img src={url} alt="preview" /></div>
        )}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>취소</button>
          <button className="modal-ok" onClick={() => onSubmit(url, label)} disabled={!url}>삽입</button>
        </div>
      </div>
    </div>
  );
}

function folderColor(id) {
  return { work: "#fde0e6", personal: "#dbecf5", study: "#dff0d2" }[id] || "var(--bg-paper)";
}
function folderLabel(id) {
  return { work: "업무", personal: "개인", study: "공부 · 독서" }[id] || id;
}

window.MemoPage = MemoPage;
