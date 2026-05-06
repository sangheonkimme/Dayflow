/* global React */
const { useState: useStateM } = React;

// ============================================================
// Dayflow Mobile · Adaptive layout
// 메인 홈은 완성도 높게, 그 외 탭은 placeholder
// ============================================================

// ───────── icon set (24×24, line, currentColor) ─────────
function Ico({ name, size = 22 }) {
  const s = { width: size, height: size };
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...stroke} /><path d="M10 21a2 2 0 0 0 4 0" {...stroke} /></>,
    sun: <><circle cx="12" cy="12" r="4" {...stroke} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" {...stroke} /></>,
    edit: <><path d="M3 17.5V21h3.5L17 10.5 13.5 7zM14.5 5.5l4 4" {...stroke} /></>,
    search: <><circle cx="11" cy="11" r="7" {...stroke} /><path d="m21 21-4.3-4.3" {...stroke} /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" {...stroke} />,
    home: <><path d="M3 11l9-8 9 8" {...stroke} /><path d="M5 10v10h14V10" {...stroke} /></>,
    wallet: <><rect x="3" y="6" width="18" height="14" rx="2" {...stroke} /><path d="M3 10h14a2 2 0 0 0 0-4H6" {...stroke} /><circle cx="17" cy="13" r="1.5" fill="currentColor" /></>,
    plus: <><path d="M12 5v14M5 12h14" {...stroke} /></>,
    cal: <><rect x="3" y="5" width="18" height="16" rx="2" {...stroke} /><path d="M3 10h18M8 3v4M16 3v4" {...stroke} /></>,
    menu: <><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></>,
    coin: <><circle cx="12" cy="12" r="9" {...stroke} /><path d="M9 9.5c.8-1 2-1.5 3-1.5s3 .5 3 2-1.5 2-3 2-3 .5-3 2 1.5 2 3 2 2.5-.5 3-1.5M12 6v2M12 16v2" {...stroke} /></>,
    crop: <><path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" {...stroke} /></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...stroke} /><path d="M14 2v6h6M8 13h2M8 17h6M14 13h2" {...stroke} /></>,
    play: <path d="M6 4l14 8-14 8z" fill="currentColor" />,
    pause: <><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" /><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" {...stroke} /></>,
    chevL: <path d="m15 6-6 6 6 6" {...stroke} />,
    chevR: <path d="m9 6 6 6-6 6" {...stroke} />,
    bag: <><path d="M3 8h18l-2 12H5z" {...stroke} /><path d="M9 8a3 3 0 0 1 6 0" {...stroke} /></>,
    bus: <><rect x="4" y="4" width="16" height="14" rx="2" {...stroke} /><path d="M4 12h16M8 18v2M16 18v2" {...stroke} /><circle cx="8" cy="15" r="1" fill="currentColor" /><circle cx="16" cy="15" r="1" fill="currentColor" /></>,
    cup: <><path d="M3 8h13v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" {...stroke} /><path d="M16 10h2a2 2 0 0 1 0 4h-2" {...stroke} /></>,
    tag: <><path d="M2 12V4a2 2 0 0 1 2-2h8l10 10-10 10z" {...stroke} /><circle cx="7" cy="7" r="1.5" fill="currentColor" /></>,
    music: <><path d="M9 18V5l11-2v13" {...stroke} /><circle cx="6" cy="18" r="3" {...stroke} /><circle cx="17" cy="16" r="3" {...stroke} /></>,
    cloud: <><path d="M7 18a4 4 0 0 1-1-7.9 6 6 0 0 1 11.6-1A4.5 4.5 0 0 1 17 18z" {...stroke} /></>,
    check: <path d="m4 12 5 5L20 6" {...stroke} />,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...stroke} /><path d="M14 2v6h6M8 13h8M8 17h6" {...stroke} /></>,
    heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" {...stroke} />,
    msg: <><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1.4 3.5A8 8 0 0 1 21 12z" {...stroke} /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="13" cy="12" r="1" fill="currentColor" /><circle cx="17" cy="12" r="1" fill="currentColor" /></>,
    users: <><circle cx="9" cy="8" r="3.5" {...stroke} /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" {...stroke} /><circle cx="17" cy="9" r="2.5" {...stroke} /><path d="M16 14a5 5 0 0 1 5.5 5" {...stroke} /></>,
    fire: <path d="M12 22a6 6 0 0 0 6-6c0-3-2-5-3-6.5-.5 1.5-1.5 2-2.5 1.5C13 9 14 7 13 4c-1.5 1-3 2.5-4 4.5-1 2-3 4-3 7a6 6 0 0 0 6 6.5z" {...stroke} />,
    spark: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6" {...stroke} /><path d="M5.5 5.5l3.5 3.5M15 15l3.5 3.5M5.5 18.5l3.5-3.5M15 9l3.5-3.5" {...stroke} /></>,
    bookmark: <path d="M5 3h14v18l-7-4-7 4z" {...stroke} />,
    trophy: <><path d="M7 4h10v4a5 5 0 1 1-10 0z" {...stroke} /><path d="M7 6H4a2 2 0 0 0 3 4M17 6h3a2 2 0 0 1-3 4M9 14h6l1 6H8z" {...stroke} /></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name]}</svg>;
}

// ───────── small primitives ─────────
function SectionHeader({ title, action, onAction }) {
  return (
    <div className="dfm-section-h">
      <h3>{title}</h3>
      {action && (
        <span
          className={"more" + (onAction ? " clickable" : "")}
          onClick={onAction}
          style={onAction ? { cursor: "pointer" } : undefined}
        >{action} →</span>
      )}
    </div>
  );
}

// ───────── Swipe-actions row (iOS pattern) ─────────
function SwipeIcon({ name }) {
  if (name === "edit") return (
    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 11l1-3 6-6 2 2-6 6-3 1zM8 4l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
  );
  // default: trash
  return (
    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 5h8M5 5V3.5A1 1 0 016 2.5h2a1 1 0 011 1V5M11 5l-.6 6.5A1 1 0 019.4 12.5H4.6a1 1 0 01-1-.9L3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
  );
}

// Drag horizontally to reveal one or more actions; release past threshold to fire the last action.
// Pass either `onDelete` (single action) OR `actions=[{label, color, onClick, icon}]`.
function SwipeRow({ children, onDelete, actions, actionLabel = "삭제", revealWidth }) {
  // build actions array
  const acts = actions && actions.length
    ? actions
    : (onDelete ? [{ label: actionLabel, color: "delete", onClick: onDelete, icon: "trash" }] : []);
  const perWidth = 76;
  const totalWidth = revealWidth ?? perWidth * acts.length;

  const [dx, setDx] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const startX = React.useRef(0);
  const startDx = React.useRef(0);
  const dragging = React.useRef(false);
  const moved = React.useRef(false);

  const onStart = (clientX) => {
    startX.current = clientX;
    startDx.current = dx;
    dragging.current = true;
    moved.current = false;
    setAnimating(false);
  };
  const onMove = (clientX) => {
    if (!dragging.current) return;
    const delta = clientX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    let next = startDx.current + delta;
    // only allow swipe-left (negative); rubber band on right
    if (next > 0) next = next * 0.25;
    // sticky stop at the reveal width — needs extra pull to go further into full-swipe territory
    if (acts.length && next < -totalWidth) {
      const over = -next - totalWidth;
      next = -totalWidth - over * 0.45;
    }
    if (next < -totalWidth * 1.8) next = -totalWidth * 1.8 + (next + totalWidth * 1.8) * 0.2;
    setDx(next);
  };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (!acts.length) { setAnimating(true); setDx(0); return; }
    setAnimating(true);
    // far-swipe → fire last action (usually delete)
    if (dx < -totalWidth * 1.8) {
      const last = acts[acts.length - 1];
      if (last.color === "delete") {
        setRemoving(true);
        setDx(-600);
        setTimeout(() => last.onClick?.(), 220);
      } else {
        setDx(0); setOpen(false);
        last.onClick?.();
      }
      return;
    }
    // sticky reveal: open as soon as user pulls past ~25% of reveal width, snap to fully open
    if (dx < -totalWidth * 0.25) { setDx(-totalWidth); setOpen(true); }
    else { setDx(0); setOpen(false); }
  };

  // touch handlers
  const onTouchStart = (e) => onStart(e.touches[0].clientX);
  const onTouchMove  = (e) => onMove(e.touches[0].clientX);
  const onTouchEnd   = () => onEnd();
  // mouse handlers (for desktop preview)
  const onMouseDown = (e) => {
    onStart(e.clientX);
    const move = (ev) => onMove(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      onEnd();
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // suppress click if we actually swiped
  const onClickCapture = (e) => {
    if (moved.current || open) {
      e.stopPropagation();
      e.preventDefault();
      moved.current = false;
      // tap outside on open row → close
      if (open) { setAnimating(true); setDx(0); setOpen(false); }
    }
  };

  const handleAction = (e, a) => {
    e.stopPropagation();
    if (a.color === "delete") {
      setAnimating(true);
      setRemoving(true);
      setDx(-600);
      setTimeout(() => a.onClick?.(), 220);
    } else {
      setAnimating(true);
      setDx(0); setOpen(false);
      a.onClick?.();
    }
  };

  return (
    <div className={"dfm-swipe" + (removing ? " removing" : "")}>
      {acts.length > 0 && (
        <div className="dfm-swipe-actions" style={{ width: totalWidth }}>
          {acts.map((a, i) => (
            <button
              key={i}
              className={`dfm-swipe-action act-${a.color || "neutral"}`}
              onClick={(e) => handleAction(e, a)}
              aria-label={a.label}
            >
              <SwipeIcon name={a.icon} />
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
      <div
        className={"dfm-swipe-content" + (animating ? " anim" : "")}
        style={{ transform: `translateX(${dx}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────
// HOME — fully designed
// ────────────────────────────────────────────────
function MobileHome({ onNavigate, onAddTxn, onAddEvent }) {
  const [todos, setTodos] = useStateM([
    { text: "오전 11시 디자인 리뷰 자료 보내기", tag: "업무", done: true },
    { text: "월말 카드 명세서 정리", tag: "가계부", done: false },
    { text: "헬스장 가는 길에 우유 사기", tag: "할 일", done: true },
    { text: "독서 30분", tag: "루틴", done: false },
    { text: "수요일 회의실 예약", tag: "업무", done: false },
  ]);
  const [txns, setTxns] = useStateM([
    { ico: "cup", name: "스타벅스 강남점", sub: "오늘 오전 9:42",  amount: -6500,    cat: "식비" },
    { ico: "bus", name: "교통카드 충전",     sub: "어제 오후 6:12", amount: -50000,   cat: "교통" },
    { ico: "bag", name: "11월 월급",         sub: "11월 25일 (목)", amount: 3200000,  cat: "수입" },
  ]);
  const removeTxn = (i) => setTxns(xs => xs.filter((_, ix) => ix !== i));
  const editTxn   = (i) => { _openTxnRef && _openTxnRef(txns[i]); };
  const [newTodo, setNewTodo] = useStateM("");
  const toggle = (i) => setTodos(ts => ts.map((t, ix) => ix === i ? { ...t, done: !t.done } : t));
  const removeTodo = (i) => setTodos(ts => ts.filter((_, ix) => ix !== i));
  const addTodo = () => {
    const v = newTodo.trim();
    if (!v) return;
    setTodos(ts => [...ts, { text: v, tag: "할 일", done: false }]);
    setNewTodo("");
  };
  const doneCount = todos.filter(t => t.done).length;

  // calendar grid (사실상 정적 데모)
  const today = 14;
  const eventDays = [3, 7, 14, 18, 22, 27];
  const cells = [];
  // 1일이 수요일이라 가정 → 앞에 muted 2칸
  for (let i = 0; i < 2; i++) cells.push({ d: 28 + i, muted: true });
  for (let i = 1; i <= 31; i++) cells.push({ d: i });
  while (cells.length < 35) cells.push({ d: cells.length - 31, muted: true });

  return (
    <>
      <SectionHeader title="오늘의 메모" action="전체" />
      <div className="dfm-notes-rail-wrap">
      <div className="dfm-notes-rail">
        <div className="dfm-note yellow">
          <div className="dfm-note-title">이번 주 회고</div>
          <div className="dfm-note-body">디자인 리뷰 잘 마무리. 다음 주는 앱 버전 마이그레이션 작업이 메인.</div>
          <div className="dfm-note-foot"><span>월 11/24</span><span>·</span></div>
        </div>
        <div className="dfm-note pink">
          <div className="dfm-note-title">살 것</div>
          <div className="dfm-note-body">우유 · 계란 · 시리얼 · 바나나. 빵집 들러서 캄파뉴 한 덩이도.</div>
          <div className="dfm-note-foot"><span>화 11/25</span><span>5</span></div>
        </div>
        <div className="dfm-note mint">
          <div className="dfm-note-title">아이디어</div>
          <div className="dfm-note-body">Dayflow에 위젯 화면 — 잠금화면에서 오늘 예산 한 줄로 보이게.</div>
          <div className="dfm-note-foot"><span>오늘</span><span>💡</span></div>
        </div>
        <div className="dfm-note add">+ 새 메모</div>
      </div>
      </div>

      <SectionHeader title="오늘 할 일" action={`${doneCount} / ${todos.length}`} />
      <div className="dfm-card">
        <div className="dfm-checklist">
          {todos.map((t, i) => (
            <SwipeRow key={i} onDelete={() => removeTodo(i)}>
              <div className="dfm-check-row" onClick={() => toggle(i)}>
                <div className={`dfm-check-box ${t.done ? "on" : ""}`}>
                  {t.done && (
                    <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5l3 3L11 1" stroke="#ffe27a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </div>
                <div className={`dfm-check-text ${t.done ? "done" : ""}`}>{t.text}</div>
                <div className="dfm-check-tag">{t.tag}</div>
              </div>
            </SwipeRow>
          ))}
          <div className="dfm-check-row dfm-todo-add" onClick={(e) => e.stopPropagation()}>
            <div className="dfm-check-box add" onClick={addTodo} role="button" aria-label="할 일 추가">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <input
              className="dfm-todo-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addTodo(); }}
              placeholder="할 일 추가… (Enter로 추가)"
            />
          </div>
        </div>
      </div>

      <SectionHeader title="이번 달 머니플로우" action="자세히" onAction={() => onNavigate?.("ledger")} />
      <div className="dfm-money">
        <div className="dfm-money-h">
          <div>
            <div className="label">11월 잔액</div>
            <div className="amount">+₩ 842,300</div>
          </div>
          <div className="delta">+12.4%</div>
        </div>
        <div className="dfm-money-bar">
          <span style={{ width: "42%", background: "#ffd84d" }} />
          <span style={{ width: "26%", background: "#ffb38a" }} />
          <span style={{ width: "16%", background: "#b9e7c9" }} />
          <span style={{ width: "10%", background: "#d4c1f0" }} />
          <span style={{ width: "6%", background: "#d8d2c2" }} />
        </div>
        <div className="dfm-money-legend">
          <span><span className="lg-dot" style={{ background: "#ffd84d" }} />식비</span>
          <span><span className="lg-dot" style={{ background: "#ffb38a" }} />교통</span>
          <span><span className="lg-dot" style={{ background: "#b9e7c9" }} />쇼핑</span>
          <span><span className="lg-dot" style={{ background: "#d4c1f0" }} />구독</span>
          <span><span className="lg-dot" style={{ background: "#d8d2c2" }} />기타</span>
        </div>

        <div className="dfm-money-list">
          {txns.map((t, i) => (
            <SwipeRow
              key={i}
              actions={[
                { label: "수정", color: "edit",   icon: "edit",  onClick: () => editTxn(i) },
                { label: "삭제", color: "delete", icon: "trash", onClick: () => removeTxn(i) },
              ]}
            >
              <div className="dfm-money-row" onClick={() => openTxnDetail(t)}>
                <div className="ico"><Ico name={t.ico} size={16} /></div>
                <div className="who">{t.name}<small>{t.sub}</small></div>
                <div className={"val " + (t.amount < 0 ? "expense" : "income")}>
                  {t.amount < 0 ? "-" : "+"}{Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            </SwipeRow>
          ))}
        </div>
      </div>

      <SectionHeader title="11월" action="전체 캘린더" onAction={() => onNavigate?.("calendar")} />
      <div className="dfm-cal">
        <div className="dfm-cal-h">
          <div className="month">2026 · 11월</div>
          <div className="dfm-cal-nav">
            <button><Ico name="chevL" size={14} /></button>
            <button><Ico name="chevR" size={14} /></button>
          </div>
        </div>
        <div className="dfm-cal-grid">
          {["일","월","화","수","목","금","토"].map((d, i) => (
            <div key={i} className="dfm-cal-dow">{d}</div>
          ))}
          {cells.map((c, i) => {
            const isToday = !c.muted && c.d === today;
            const hasEvent = !c.muted && eventDays.includes(c.d);
            return (
              <div key={i} className={`dfm-cal-day ${c.muted ? "muted" : ""} ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}`}>
                {c.d}
              </div>
            );
          })}
        </div>
        <div className="dfm-cal-events">
          <div className="dfm-cal-event">
            <span className="time">10:00</span>
            <div className="pill">디자인 시스템 리뷰<small>온라인 · 1시간</small></div>
          </div>
          <div className="dfm-cal-event">
            <span className="time">14:30</span>
            <div className="pill" style={{ borderLeftColor: "#ffb38a" }}>치과 정기검진<small>강남 OO치과 · 30분</small></div>
          </div>
          <div className="dfm-cal-event">
            <span className="time">19:00</span>
            <div className="pill" style={{ borderLeftColor: "#b9e7c9" }}>저녁 약속<small>이태원 · 친구 모임</small></div>
          </div>
        </div>
      </div>
    </>
  );
}


// ────────────────────────────────────────────────
// PLACEHOLDER pages (other tabs — 골격 수준)
// ────────────────────────────────────────────────
function MobileLedger() {
  const [scope, setScope] = useStateM("all"); // all | out | in

  // 11월 데이터 (실수령 ₩3,200,000 기준 시나리오)
  const income = 3650000;
  const expense = 1847200;
  const balance = income - expense;
  const lastMonthBalance = 1602000;
  const deltaPct = Math.round(((balance - lastMonthBalance) / lastMonthBalance) * 100);

  // 11개월 추이 (만원 단위)
  const trend = [
    {m:"1",  in:280, out:215},
    {m:"2",  in:285, out:198},
    {m:"3",  in:285, out:240},
    {m:"4",  in:300, out:225},
    {m:"5",  in:320, out:250},
    {m:"6",  in:285, out:212},
    {m:"7",  in:300, out:268},
    {m:"8",  in:340, out:228},
    {m:"9",  in:285, out:198},
    {m:"10", in:330, out:230},
    {m:"11", in:365, out:185, now:true},
  ];
  const trendMax = 400;

  // 카테고리별 지출
  const cats = [
    { name: "식비",   color: "#ffd84d", val: 482100 },
    { name: "주거",   color: "#1f1d18", val: 850000 },
    { name: "교통",   color: "#ffb38a", val: 188400 },
    { name: "쇼핑",   color: "#d4c1f0", val: 155100 },
    { name: "구독",   color: "#a8d4e3", val: 89000  },
    { name: "건강",   color: "#b9e7c9", val: 82600  },
  ];
  const catTotal = cats.reduce((a,c) => a + c.val, 0);

  // donut path generation
  const r = 42, cx = 55, cy = 55, stroke = 14;
  const C = 2 * Math.PI * r;

  // 일자별 거래 그룹 (요일/날짜 + 거래 배열)
  const days = [
    {
      date: "11월 14일", dow: "오늘 · 목",
      total: -16400,
      items: [
        { ico: "cup",  name: "스타벅스 강남점",   sub: "오전 9:42 · 식비",  amt: -6500,   cat: "식비" },
        { ico: "bus",  name: "지하철 단건",        sub: "오전 8:51 · 교통",  amt: -1450,   cat: "교통" },
        { ico: "bag",  name: "GS25 편의점",        sub: "오후 7:18 · 식비",  amt: -8450,   cat: "식비" },
      ],
    },
    {
      date: "11월 13일", dow: "어제 · 수",
      total: -77400,
      items: [
        { ico: "cup",  name: "탐앤탐스",          sub: "오후 3:12 · 식비",  amt: -5800,   cat: "식비" },
        { ico: "bag",  name: "이마트 트레이더스",  sub: "오후 8:01 · 식비",  amt: -71600,  cat: "식비" },
      ],
    },
    {
      date: "11월 12일", dow: "화",
      total: -67000,
      items: [
        { ico: "tag",  name: "넷플릭스",          sub: "정기결제 · 구독",   amt: -17000,  cat: "구독" },
        { ico: "bag",  name: "무신사",            sub: "셔츠 1벌 · 쇼핑",    amt: -50000,  cat: "쇼핑" },
      ],
    },
    {
      date: "11월 11일", dow: "월",
      total: 3582600,
      items: [
        { ico: "coin", name: "11월 급여",          sub: "(주)디자인하우스",   amt: 3650000, cat: "급여",  income: true },
        { ico: "tag",  name: "월세 자동이체",       sub: "정기 출금 · 주거",   amt: -67400,  cat: "주거" },
      ],
    },
  ];

  // chip filter is currently visual-only

  return (
    <>
      {/* HERO */}
      <div className="dfm-led-hero">
        <div className="dfm-led-month">
          <span><b>2026 · 11월</b></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Ico name="chevL" size={12} /> 11월 <Ico name="chevR" size={12} />
          </span>
        </div>
        <div className="dfm-led-balance">
          <span className="won">₩</span>{balance.toLocaleString()}
        </div>
        <div className="dfm-led-sub">
          전월 대비 <b>+{deltaPct}%</b> · 월급일까지 D-11
        </div>

        <div className="dfm-led-stats">
          <div className="dfm-led-stat in">
            <div className="lbl">수입</div>
            <div className="val">+{(income/10000).toFixed(0)}만</div>
            <div className="delta">↗ 정기 1건</div>
          </div>
          <div className="dfm-led-divider" />
          <div className="dfm-led-stat out">
            <div className="lbl">지출</div>
            <div className="val">-{(expense/10000).toFixed(0)}만</div>
            <div className="delta">↘ 23건</div>
          </div>
        </div>

        <div className="dfm-trend">
          <div className="dfm-trend-head">
            <span>월별 흐름 · 11개월</span>
            <div className="dfm-trend-legend">
              <span><i style={{ background: "#b9e7c9" }} />수입</span>
              <span><i style={{ background: "#ffb38a" }} />지출</span>
            </div>
          </div>
          <div className="dfm-trend-bars">
            {trend.map((d, i) => (
              <div key={i} className={`dfm-trend-col ${d.now ? "now" : ""}`}>
                <div className="b-in"  style={{ height: `${(d.in/trendMax)*100}%` }} />
                <div className="b-out" style={{ height: `${(d.out/trendMax)*100}%` }} />
              </div>
            ))}
          </div>
          <div className="dfm-trend-labels">
            {trend.map((d, i) => (
              <span key={i} className={d.now ? "now" : ""}>{d.m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY DONUT */}
      <SectionHeader title="카테고리 분석" action="자세히" />
      <div className="dfm-cats-card">
        <div className="dfm-donut-wrap">
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-paper)" strokeWidth={stroke} />
            {(() => {
              let off = 0;
              return cats.map((c, i) => {
                const len = (c.val / catTotal) * C;
                const dashoffset = -off;
                off += len;
                return (
                  <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={c.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={dashoffset}
                  />
                );
              });
            })()}
          </svg>
          <div className="dfm-donut-center">
            <div>
              <div className="lbl">총 지출</div>
              <div className="val">{(catTotal/10000).toFixed(0)}만</div>
            </div>
          </div>
        </div>
        <div className="dfm-cat-list">
          {cats.slice(0,5).map((c, i) => (
            <div key={i} className="dfm-cat-row">
              <span className="swatch" style={{ background: c.color }} />
              <span className="name">{c.name}</span>
              <span className="pct">{Math.round((c.val/catTotal)*100)}%</span>
              <span className="amt">{(c.val/10000).toFixed(0)}만</span>
            </div>
          ))}
        </div>
      </div>

      {/* TXN LIST */}
      <SectionHeader title="거래 내역" action="검색" />

      <div className="dfm-chips">
        <button className={`dfm-chip ${scope==="all" ? "on" : ""}`} onClick={() => setScope("all")}>전체 <span className="count">23</span></button>
        <button className={`dfm-chip ${scope==="out" ? "on" : ""}`} onClick={() => setScope("out")}>지출 <span className="count">22</span></button>
        <button className={`dfm-chip ${scope==="in"  ? "on" : ""}`} onClick={() => setScope("in")}>수입 <span className="count">1</span></button>
        <button className="dfm-chip">정기 <span className="count">3</span></button>
        <button className="dfm-chip">미분류 <span className="count">2</span></button>
      </div>

      {days.map((d, di) => (
        <div key={di} className="dfm-day">
          <div className="dfm-day-head">
            <div className="date">{d.date}<small>{d.dow}</small></div>
            <div className={`total ${d.total < 0 ? "expense" : ""}`}>
              {d.total > 0 ? "+" : ""}{d.total.toLocaleString()}
            </div>
          </div>
          <div className="dfm-day-rows">
            {d.items.map((it, i) => (
              <SwipeRow
                key={i}
                actions={[
                  { label: "수정", color: "edit",   icon: "edit",  onClick: () => openTxnDetail(it) },
                  { label: "삭제", color: "delete", icon: "trash", onClick: () => {} },
                ]}
              >
                <div className="dfm-money-row" onClick={() => openTxnDetail(it)}>
                  <div className="ico"><Ico name={it.ico} size={16} /></div>
                  <div className="who">{it.name}<small>{it.sub}</small></div>
                  <div className={`val ${it.income ? "income" : "expense"}`}>
                    {it.amt > 0 ? "+" : ""}{it.amt.toLocaleString()}
                  </div>
                </div>
              </SwipeRow>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function MobileCalendar() {
  // events keyed by day-of-month (Nov 2026)
  const eventsByDay = {
    3:  [{ t: "09:30", dur: "1시간",  title: "팀 스탠드업",          place: "온라인",       color: "#cfe7ff" }],
    7:  [
          { t: "11:00", dur: "30분",   title: "치과 정기검진",         place: "강남 미소치과", color: "#ffb38a" },
          { t: "19:00", dur: "2시간",  title: "독서 모임",             place: "합정 카페",     color: "#d4c1f0" },
        ],
    14: [
          { t: "10:00", dur: "1시간",  title: "디자인 시스템 리뷰",    place: "온라인",       color: "#cfe7ff" },
          { t: "14:30", dur: "45분",   title: "1:1 멘토링",            place: "성수 사무실",   color: "#b9e7c9" },
          { t: "19:30", dur: "2시간",  title: "저녁 약속",             place: "이태원",       color: "#ffb38a" },
        ],
    18: [{ t: "15:00", dur: "1.5시간", title: "분기 회고",             place: "회의실 B",    color: "#d4c1f0" }],
    22: [
          { t: "전일",  dur: "",       title: "엄마 생신",             place: "본가",         color: "#ffb38a" },
          { t: "18:00", dur: "3시간",  title: "가족 저녁 식사",         place: "한식당",       color: "#b9e7c9" },
        ],
    27: [{ t: "10:00", dur: "1시간",  title: "분기 결산 회의",        place: "온라인",       color: "#cfe7ff" }],
  };
  const dayNames = ["일","월","화","수","목","금","토"];
  const today = 14;
  const [sel, setSel] = useStateM(today);

  const selEvents = eventsByDay[sel] || [];
  const selDow = dayNames[((sel + 6) % 7)]; // Nov 1 2026 = Sunday → day d's dow = (d-1)%7? Actually Nov 1 2026 is Sunday, so day d → dow = (d-1)%7. We'll compute below.
  const dow = dayNames[(sel - 1) % 7];

  return (
    <div>
      <SectionHeader title="11월 일정" />
      <div className="dfm-cal">
        <div className="dfm-cal-h">
          <div className="month">2026 · 11월</div>
          <div className="dfm-cal-nav">
            <button><Ico name="chevL" size={14} /></button>
            <button><Ico name="chevR" size={14} /></button>
          </div>
        </div>
        <div className="dfm-cal-grid">
          {dayNames.map((d, i) => (
            <div key={i} className="dfm-cal-dow">{d}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const d = i - 1;
            const muted = d < 1 || d > 31;
            const real = muted ? (d < 1 ? 30 + d : d - 31) : d;
            const isToday = !muted && d === today;
            const isSel = !muted && d === sel;
            const ev = !muted && !!eventsByDay[d];
            return (
              <div
                key={i}
                onClick={() => !muted && setSel(d)}
                className={`dfm-cal-day ${muted ? "muted" : ""} ${isToday ? "today" : ""} ${ev ? "has-event" : ""} ${isSel ? "selected" : ""}`}
                style={{ cursor: muted ? "default" : "pointer" }}
              >{real}</div>
            );
          })}
        </div>
      </div>

      {/* selected-day header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "18px 2px 10px", borderBottom: "1px dashed var(--line)", marginBottom: 12 }}>
        <b style={{ fontSize: 22, letterSpacing: "-0.02em", fontFamily: "var(--hand)" }}>11월 {sel}일</b>
        <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>{dow}요일</span>
        {sel === today && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", background: "var(--yellow)", padding: "2px 8px", borderRadius: 999, border: "1px solid var(--yellow-edge)", marginLeft: "auto" }}>오늘</span>}
        {sel !== today && <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>{selEvents.length}건</span>}
      </div>

      {/* day timeline / list */}
      {selEvents.length === 0 ? (
        <div className="dfm-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", gap: 8, textAlign: "center" }}>
          <div style={{ fontSize: 28, opacity: 0.5 }}>○</div>
          <b style={{ fontSize: 14 }}>일정이 없어요</b>
          <small style={{ fontSize: 12, color: "var(--ink-mute)" }}>여유로운 하루를 보내세요</small>
          <button style={{ marginTop: 8, fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>
            <Ico name="plus" size={12} /> 일정 추가
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {selEvents.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 56, flexShrink: 0, paddingTop: 14 }}>
                <b style={{ fontSize: 13, fontFamily: "var(--mono)", display: "block" }}>{e.t}</b>
                {e.dur && <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>{e.dur}</small>}
              </div>
              <div className="dfm-card" style={{
                flex: 1,
                padding: "12px 14px",
                borderLeft: `4px solid ${e.color}`,
                borderRadius: "10px",
              }}>
                <b style={{ fontSize: 14, display: "block", marginBottom: 2 }}>{e.title}</b>
                <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{e.place}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

// ────────────────────────────────────────────────
// COMMUNITY · 가계 인증 / 절약 챌린지 / 팁 공유
// ────────────────────────────────────────────────
function MobileCommunity() {
  const [tab, setTab] = useStateM("feed"); // feed | challenges | ranking
  const [liked, setLiked] = useStateM({});
  const [saved, setSaved] = useStateM({});
  const [composeOpen, setComposeOpen] = useStateM(false);
  const [userPosts, setUserPosts] = useStateM([]); // posts the user creates

  const toggleLike = (id) => setLiked(s => ({ ...s, [id]: !s[id] }));
  const toggleSave = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));

  const handleSubmit = (post) => {
    const newPost = {
      id: "u" + Date.now(),
      author: "나비",
      avatar: "🦋",
      time: "방금",
      mine: true,
      ...post,
    };
    setUserPosts(p => [newPost, ...p]);
    setComposeOpen(false);
  };

  // ── 챌린지 데이터
  const challenges = [
    { id: "c1", title: "11월 무지출 5일",      sub: "외식·배달 끊기",      members: 1284, days: "5/30일", progress: 0.82, color: "#ffd84d", emoji: "🍱" },
    { id: "c2", title: "커피값 모으기",         sub: "매일 ₩4,500 적금",    members:  892, days: "12/30일", progress: 0.40, color: "#cfe7ff", emoji: "☕" },
    { id: "c3", title: "구독 다이어트",         sub: "월 ₩50,000 줄이기",   members:  567, days: "8/30일",  progress: 0.62, color: "#ffb38a", emoji: "✂️" },
  ];

  // ── 인증 피드
  const posts = [
    {
      id: "p1",
      author: "절약왕민지",
      avatar: "🌱",
      tag: "#11월무지출",
      time: "2시간 전",
      title: "오늘도 무지출 성공!",
      body: "회사 도시락 + 집에서 저녁 해먹기. 5일 연속이에요. 처음엔 힘들었는데 이제 습관이 되어가요 ☺️",
      stat: { label: "오늘 지출", val: "₩0", color: "#4a8d5a" },
      likes: 142, comments: 18, badge: "🔥 5일 연속",
    },
    {
      id: "p2",
      author: "커피요정",
      avatar: "☕",
      tag: "#커피값모으기",
      time: "5시간 전",
      title: "12일째 적금 인증",
      body: "스타벅스 대신 회사 커피머신. 오늘까지 ₩54,000 모았어요!",
      stat: { label: "12일 누적", val: "₩54,000", color: "#1f1d18" },
      likes: 89, comments: 12,
    },
    {
      id: "p3",
      author: "지출체크",
      avatar: "📒",
      tag: "#가계부공유",
      time: "어제",
      title: "10월 결산 — 처음으로 +₩50만",
      body: "월급 받자마자 자동이체 + 주간 예산 ₩100,000 룰 지킨 결과예요. 다음 달은 +₩60만 도전!",
      stat: { label: "10월 잔고", val: "+₩523,000", color: "#4a8d5a" },
      likes: 256, comments: 41, badge: "🏆 베스트",
    },
    {
      id: "p4",
      author: "구독정리꾼",
      avatar: "✂️",
      tag: "#구독다이어트",
      time: "2일 전",
      title: "안 쓰던 구독 4개 해지함",
      body: "넷플릭스, 멜론, 클라우드, 운동앱 — 다 해지하고 ₩47,000 절약. 진짜 필요한 것만 남기니 후련해요.",
      stat: { label: "월 절약액", val: "-₩47,000", color: "#dc4c3e" },
      likes: 178, comments: 24,
    },
  ];

  // ── 이번 주 절약왕 랭킹
  const ranking = [
    { rank: 1, name: "절약왕민지",  saved: 312000, avatar: "🌱", streak: 21, medal: "🥇" },
    { rank: 2, name: "지출체크",     saved: 287500, avatar: "📒", streak: 18, medal: "🥈" },
    { rank: 3, name: "구독정리꾼",   saved: 184000, avatar: "✂️", streak: 12, medal: "🥉" },
    { rank: 4, name: "도시락마스터", saved: 156000, avatar: "🍱", streak:  9 },
    { rank: 5, name: "현금쓰는사람", saved: 142000, avatar: "💵", streak:  7 },
  ];

  return (
    <div>
      {/* ── HERO 카드: 이번 주 커뮤니티 요약 */}
      <div className="dfm-card" style={{
        padding: "16px 18px",
        background: "linear-gradient(135deg, #fff5d6 0%, #ffe8b8 100%)",
        border: "1px solid var(--yellow-edge)",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 90, opacity: 0.18, transform: "rotate(-12deg)" }}>💰</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6 }}>
          <Ico name="users" size={11} /> 이번 주 커뮤니티
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <b style={{ fontSize: 26, fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>2,743명</b>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>이 함께 절약 중</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11, position: "relative" }}>
          <div>
            <b style={{ fontFamily: "var(--mono)", fontSize: 13, display: "block" }}>₩42.8M</b>
            <span style={{ color: "var(--ink-mute)" }}>이번 주 절약</span>
          </div>
          <div>
            <b style={{ fontFamily: "var(--mono)", fontSize: 13, display: "block" }}>1,284</b>
            <span style={{ color: "var(--ink-mute)" }}>오늘 인증</span>
          </div>
          <div>
            <b style={{ fontFamily: "var(--mono)", fontSize: 13, display: "block" }}>{challenges.length}</b>
            <span style={{ color: "var(--ink-mute)" }}>진행 챌린지</span>
          </div>
        </div>
      </div>

      {/* ── 세그먼트 탭 */}
      <div style={{
        display: "flex", gap: 4,
        padding: 4,
        background: "var(--bg-paper)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        marginBottom: 14,
      }}>
        {[
          { id: "feed",       label: "피드" },
          { id: "challenges", label: "챌린지" },
          { id: "ranking",    label: "랭킹" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 9,
              border: "none",
              background: tab === t.id ? "var(--ink)" : "transparent",
              color: tab === t.id ? "var(--yellow)" : "var(--ink-mute)",
              fontWeight: 700, fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.14s, color 0.14s",
            }}>{t.label}</button>
        ))}
      </div>

      {/* ── 피드 */}
      {tab === "feed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 인증 작성 prompt */}
          <button onClick={() => setComposeOpen(true)} style={{
            display: "flex", alignItems: "center", gap: 12,
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
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.background = "rgba(255,226,122,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.background = "transparent"; }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "grid", placeItems: "center", fontSize: 16 }}>🦋</div>
            <span style={{ flex: 1, fontSize: 13 }}>오늘의 절약 인증을 공유해보세요</span>
            <Ico name="plus" size={16} />
          </button>

          {[...userPosts, ...posts].map(p => {
            const isLiked = !!liked[p.id];
            const isSaved = !!saved[p.id];
            const lc = isLiked ? p.likes + 1 : p.likes;
            return (
              <div key={p.id} className="dfm-card" style={{ padding: 14 }}>
                {/* author row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-paper)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{p.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <b style={{ fontSize: 13 }}>{p.author}</b>
                      {p.badge && (
                        <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99, background: "var(--ink)", color: "var(--yellow)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{p.badge}</span>
                      )}
                    </div>
                    <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{p.tag} · {p.time}</small>
                  </div>
                  <button onClick={() => toggleSave(p.id)} style={{
                    width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer",
                    color: isSaved ? "var(--ink)" : "var(--ink-mute)",
                    display: "grid", placeItems: "center",
                  }} aria-label="저장">
                    <Ico name="bookmark" size={16} />
                  </button>
                </div>

                {/* content */}
                <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.title}</h4>
                <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{p.body}</p>

                {/* stat strip */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: 10,
                  background: "var(--bg-paper)",
                  border: "1px dashed var(--line)",
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>{p.stat.label}</span>
                  <b style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 800, color: p.stat.color }}>{p.stat.val}</b>
                </div>

                {/* actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6, borderTop: "1px dashed var(--line)" }}>
                  <button onClick={() => toggleLike(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 12px", borderRadius: 99,
                      background: isLiked ? "rgba(220,76,62,0.1)" : "transparent",
                      border: "none",
                      color: isLiked ? "#dc4c3e" : "var(--ink-mute)",
                      fontWeight: 600, fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.14s",
                    }}>
                    <span style={{ display: "inline-flex", transform: isLiked ? "scale(1.1)" : "scale(1)", transition: "transform 0.18s" }}>
                      {isLiked
                        ? <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill="#dc4c3e" /></svg>
                        : <Ico name="heart" size={14} />}
                    </span>
                    {lc.toLocaleString()}
                  </button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 12px", borderRadius: 99,
                    background: "transparent", border: "none",
                    color: "var(--ink-mute)", fontWeight: 600, fontSize: 12,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <Ico name="msg" size={14} /> {p.comments}
                  </button>
                  <div style={{ flex: 1 }} />
                  <button style={{ background: "transparent", border: "none", color: "var(--ink-mute)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>공유</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 챌린지 */}
      {tab === "challenges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {challenges.map(c => (
            <div key={c.id} className="dfm-card" style={{ padding: 14, position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: -10, right: -10,
                width: 70, height: 70, borderRadius: "50%",
                background: c.color, opacity: 0.5,
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color, display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: 15, display: "block" }}>{c.title}</b>
                    <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{c.sub}</small>
                  </div>
                </div>

                {/* progress */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--ink-mute)", marginBottom: 6, fontFamily: "var(--mono)" }}>
                  <span>{c.days}</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{Math.round(c.progress * 100)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "var(--bg-paper)", border: "1px solid var(--line)", overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: `${c.progress * 100}%`, height: "100%", background: "var(--ink)", borderRadius: 99 }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <small style={{ fontSize: 11, color: "var(--ink-mute)" }}><Ico name="users" size={11} /> {c.members.toLocaleString()}명 참여 중</small>
                  <button style={{
                    padding: "7px 14px", borderRadius: 99,
                    background: "var(--ink)", color: "var(--yellow)",
                    border: "none", fontWeight: 700, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
                  }}>참여하기</button>
                </div>
              </div>
            </div>
          ))}

          {/* 새 챌린지 만들기 */}
          <button style={{
            padding: "16px 14px",
            border: "1px dashed var(--line-strong)",
            borderRadius: 14,
            background: "transparent",
            color: "var(--ink-mute)",
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontSize: 13, fontWeight: 600,
          }}>
            <Ico name="plus" size={14} /> 나만의 챌린지 만들기
          </button>
        </div>
      )}

      {/* ── 랭킹 */}
      {tab === "ranking" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 4px 10px", fontSize: 11, color: "var(--ink-mute)" }}>
            <Ico name="trophy" size={12} /> 이번 주 절약왕 · 11월 9일~15일
          </div>
          <div className="dfm-card" style={{ padding: 0 }}>
            {ranking.map((r, i) => (
              <div key={r.rank} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px",
                borderBottom: i < ranking.length - 1 ? "1px dashed var(--line)" : "none",
              }}>
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--mono)", fontSize: 13, fontWeight: 800,
                  color: r.rank <= 3 ? "var(--ink)" : "var(--ink-mute)",
                }}>{r.medal || `${r.rank}`}</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-paper)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{r.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13, display: "block" }}>{r.name}</b>
                  <small style={{ fontSize: 11, color: "var(--ink-mute)" }}><Ico name="fire" size={10} /> {r.streak}일 연속</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b style={{ fontFamily: "var(--mono)", fontSize: 13, color: "#4a8d5a", display: "block" }}>+₩{r.saved.toLocaleString()}</b>
                  <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>이번 주</small>
                </div>
              </div>
            ))}
          </div>

          {/* 내 순위 */}
          <div style={{
            marginTop: 14,
            padding: "14px",
            borderRadius: 14,
            background: "var(--ink)",
            color: "var(--yellow)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 32, display: "grid", placeItems: "center", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 800 }}>42</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--yellow)", color: "var(--ink)", display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>🦋</div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, display: "block", color: "var(--yellow)" }}>나비님 (나)</b>
              <small style={{ fontSize: 11, color: "rgba(255,226,122,0.65)" }}>5일 연속 · 상위 12%</small>
            </div>
            <b style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--yellow)" }}>+₩86,400</b>
          </div>
        </>
      )}

      <div style={{ height: 16 }} />

      <ComposePostSheet open={composeOpen} onClose={() => setComposeOpen(false)} onSubmit={handleSubmit} />
      <CommentsSheet post={commentPost} onClose={() => setCommentPost(null)} />
      <ChallengeDetailSheet challenge={openChallenge} onClose={() => setOpenChallenge(null)}
        onJoin={(cid) => { setJoinedIds(s => ({ ...s, [cid]: true })); }}
        onLeave={(cid) => { setJoinedIds(s => { const n = { ...s }; delete n[cid]; return n; }); }} />
    </div>
  );
}

// ─── 인증 글 작성 시트
function ComposePostSheet({ open, onClose, onSubmit }) {
  const [text, setText] = useStateM("");
  const [tags, setTags] = useStateM([]); // chosen tag strings
  const [hasStat, setHasStat] = useStateM(false);
  const [statLabel, setStatLabel] = useStateM("오늘 지출");
  const [statValue, setStatValue] = useStateM("₩0");
  const [statTag, setStatTag] = useStateM("무지출");

  React.useEffect(() => {
    if (!open) { setText(""); setTags([]); setHasStat(false); setStatLabel("오늘 지출"); setStatValue("₩0"); setStatTag("무지출"); }
  }, [open]);

  const TAG_PRESETS = ["#무지출", "#커피값아끼기", "#편의점단호박", "#배달끊기", "#장보기", "#구독다이어트", "#대중교통", "#홈카페"];
  const STAT_PRESETS = [
    { label: "오늘 지출", value: "₩0", tag: "무지출" },
    { label: "절약액", value: "₩4,500", tag: "커피값" },
    { label: "연속 일수", value: "5일", tag: "스트릭" },
  ];
  const toggleTag = (t) => setTags(arr => arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t]);
  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      text: text.trim(),
      tags: tags.length ? tags : ["#절약기록"],
      stat: hasStat ? { label: statLabel, value: statValue, tag: statTag } : null,
      likes: 0,
      comments: 0,
    });
  };

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">절약 인증<small>오늘의 기록을 남겨보세요</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* author row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0 14px", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "grid", placeItems: "center", fontSize: 16 }}>🦋</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>나비</div>
              <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>전체 공개 · 익명 표시 가능</small>
            </div>
          </div>

          {/* text */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
              placeholder="오늘 어떻게 절약했나요? &#10;예: 커피값 4,500원 아끼고 텀블러 챙겼어요 ☕"
              style={{ width: "100%", border: "none", background: "transparent", color: "var(--ink)", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <small style={{ fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>{text.length} / 280</small>
            </div>
          </div>

          {/* tags */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>태그 (선택)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TAG_PRESETS.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  style={{
                    padding: "6px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                    border: "1px solid " + (tags.includes(t) ? "var(--ink)" : "var(--line)"),
                    background: tags.includes(t) ? "var(--ink)" : "transparent",
                    color: tags.includes(t) ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{t}</button>
              ))}
            </div>
          </div>

          {/* stat highlight */}
          <div style={{ padding: "14px 0 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>인증 수치 강조</span>
              <button onClick={() => setHasStat(!hasStat)}
                style={{
                  width: 44, height: 26, borderRadius: 999,
                  border: "1px solid " + (hasStat ? "var(--ink)" : "var(--line)"),
                  background: hasStat ? "var(--ink)" : "transparent",
                  padding: 0, cursor: "pointer", position: "relative",
                }}>
                <span style={{
                  position: "absolute", top: 2, left: hasStat ? 20 : 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: hasStat ? "var(--bg-paper)" : "var(--ink-mute)",
                  transition: "left .15s",
                }} />
              </button>
            </div>

            {hasStat && (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {STAT_PRESETS.map(p => {
                    const active = statLabel === p.label && statValue === p.value;
                    return (
                      <button key={p.label} onClick={() => { setStatLabel(p.label); setStatValue(p.value); setStatTag(p.tag); }}
                        style={{
                          padding: "6px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                          border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
                          background: active ? "var(--bg-paper)" : "transparent",
                          color: "var(--ink)", cursor: "pointer", fontFamily: "inherit",
                        }}>{p.label} · {p.value}</button>
                    );
                  })}
                </div>
                <div className="dfm-card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-paper)" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)" }}>{statLabel.toUpperCase()}</div>
                    <b style={{ fontFamily: "var(--mono)", fontSize: 22, color: "var(--ink)" }}>{statValue}</b>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 99, background: "var(--yellow)", color: "var(--ink)", letterSpacing: "0.04em" }}>{statTag}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>취소</button>
            <button onClick={submit} disabled={!canSubmit}
              style={{
                flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
                background: canSubmit ? "var(--ink)" : "var(--line)",
                color: canSubmit ? "var(--yellow)" : "var(--ink-mute)",
                fontWeight: 700, fontSize: 13,
                cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "inherit",
              }}>인증 올리기</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── 댓글 시트
function CommentsSheet({ post, onClose }) {
  const open = !!post;
  const [draft, setDraft] = useStateM("");
  const [extras, setExtras] = useStateM([]); // user-added comments

  React.useEffect(() => { if (open) { setDraft(""); setExtras([]); } }, [open, post && post.id]);

  // mocked seed comments per post (deterministic by post.id)
  const seed = open ? (
    {
      p1: [
        { who: "단호박", emoji: "🎃", time: "2시간 전", text: "와 5일째 진짜 대단해요 👏", likes: 12 },
        { who: "햇님",    emoji: "☀️", time: "1시간 전", text: "텀블러 같이 챙겨야겠어요!",   likes: 8 },
        { who: "구름이",  emoji: "☁️", time: "32분 전",  text: "저도 도전해볼게요",           likes: 3 },
      ],
      p2: [
        { who: "초록이", emoji: "🌱", time: "3시간 전", text: "금액이 진짜 크네요 ㄷㄷ", likes: 24 },
        { who: "달님",   emoji: "🌙", time: "2시간 전", text: "도시락 메뉴 공유해주세요!", likes: 14 },
      ],
      p3: [
        { who: "별빛",   emoji: "✨", time: "5시간 전", text: "구독 정리 진짜 답이에요", likes: 18 },
      ],
      p4: [
        { who: "바다",   emoji: "🌊", time: "어제",    text: "배달은 진짜 무서워요…",   likes: 7 },
      ],
    }[post.id] || []
  ) : [];

  const allComments = [...seed, ...extras];

  const submit = () => {
    if (!draft.trim()) return;
    setExtras(arr => [...arr, { who: "나비", emoji: "🦋", time: "방금", text: draft.trim(), likes: 0, mine: true }]);
    setDraft("");
  };

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`} style={{ maxHeight: "82vh" }}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">댓글<small>{open ? `${allComments.length}개 · @${post.author}` : ""}</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "4px 18px 0", overflow: "auto", maxHeight: "52vh" }}>
          {/* original post excerpt */}
          {open && (
            <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg-paper)", border: "1px solid var(--line)", marginBottom: 14, display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>{post.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <b style={{ fontSize: 12 }}>{post.author}</b>
                  <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>· {post.time}</small>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{post.text}</div>
              </div>
            </div>
          )}

          {/* comments list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
            {allComments.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.mine ? "var(--yellow)" : "var(--bg-paper)", border: "1px solid " + (c.mine ? "var(--yellow-edge)" : "var(--line)"), display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <b style={{ fontSize: 12 }}>{c.who}</b>
                    <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>· {c.time}</small>
                    {c.mine && <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99, background: "var(--ink)", color: "var(--yellow)", letterSpacing: "0.04em" }}>나</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.45 }}>{c.text}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <button style={{ background: "transparent", border: "none", color: "var(--ink-mute)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Ico name="heart" size={11} /> {c.likes}
                    </button>
                    <button style={{ background: "transparent", border: "none", color: "var(--ink-mute)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>답글</button>
                  </div>
                </div>
              </div>
            ))}
            {allComments.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 12px", color: "var(--ink-mute)", fontSize: 13 }}>
                <Ico name="msg" size={22} />
                <div style={{ marginTop: 6 }}>첫 댓글을 남겨보세요</div>
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div style={{ padding: "10px 14px 18px", borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🦋</div>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") submit(); }}
              placeholder="댓글을 남겨보세요"
              style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 99, background: "var(--bg-paper)", fontSize: 13, color: "var(--ink)", outline: "none", fontFamily: "inherit" }} />
            <button onClick={submit} disabled={!draft.trim()}
              style={{
                padding: "10px 14px", borderRadius: 99, border: "none",
                background: draft.trim() ? "var(--ink)" : "var(--line)",
                color: draft.trim() ? "var(--yellow)" : "var(--ink-mute)",
                fontWeight: 700, fontSize: 12, cursor: draft.trim() ? "pointer" : "not-allowed", fontFamily: "inherit",
              }}>등록</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── 챌린지 상세 / 참여 시트
function ChallengeDetailSheet({ challenge, onClose, onJoin, onLeave }) {
  const open = !!challenge;
  const [justJoined, setJustJoined] = useStateM(false);
  React.useEffect(() => { if (open) setJustJoined(false); }, [open, challenge && challenge.id]);

  if (!challenge) return (
    <>
      <div className="dfm-sheet-scrim" />
      <div className="dfm-sheet" />
    </>
  );

  const c = challenge;
  const joined = justJoined || c.joined;

  // detail content per challenge
  const meta = {
    c1: { reward: "₩30,000 \uc808\uc57d \ubaa9\ud45c", rules: ["\ub9e4\uc77c \uc2dd\ube44 \uc678 \uc81c\ub85c \uc9c0\ucd9c \uc778\uc99d", "\uc8fc 1\ud68c \ub9e4\uc7a5/\ubc30\ub2ec \ud5c8\uc6a9", "\ucd5c\uc18c 2\uc8fc \uc774\uc0c1 \ucc38\uc5ec"], duration: "11\uc6d4 1\uc77c ~ 11\uc6d4 30\uc77c" },
    c2: { reward: "\ucee4\ud53c\uac12 \u00d7 \uc77c\uc218",                  rules: ["\ub9e4\uc77c \ud65c\ub3d9 \uc11c\ud0dd\uc5d0 \ucee4\ud53c\uac12\uc744 \uc785\uae08", "\ud14d\uc2a4\ud2b8 \uc99d\ube59\uc73c\ub85c \uc778\uc99d", "30\uc77c \ub3d9\uc548 \uc9c4\ud589"], duration: "30\uc77c \ub808\uc774\uc2a4" },
    c3: { reward: "\uc6d4 \uad6c\ub3c5\ub8cc \uc808\uac10",                rules: ["\uc548 \uc4f0\ub294 \uad6c\ub3c5 1\uac1c \uc774\uc0c1 \ud574\uc9c0", "\ud574\uc9c0 \uc99d\uba85 \uc2a4\ud06c\ub9b0\uc0f7 \uc5c5\ub85c\ub4dc", "30\uc77c \uc720\uc9c0"], duration: "11\uc6d4 1\uc77c ~ 11\uc6d4 30\uc77c" },
  }[c.id] || { reward: "\uc808\uc57d\uae08", rules: ["\ub9e4\uc77c \uc778\uc99d \uc11c\ud0dd"], duration: c.days };

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`} style={{ maxHeight: "86vh" }}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head" style={{ paddingBottom: 8 }}>
          <div className="ttl">챌린지<small>{joined ? "참여 중" : "참여 가능"}</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px", overflow: "auto", maxHeight: "calc(86vh - 60px)" }}>
          {/* HERO */}
          <div style={{
            position: "relative", borderRadius: 16, padding: "18px 16px",
            background: c.color, overflow: "hidden", marginBottom: 14,
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 10 }}>{c.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: "var(--ink)" }}>{c.title}</div>
              <small style={{ fontSize: 12, color: "var(--ink)", opacity: 0.7 }}>{c.sub}</small>
            </div>
          </div>

          {/* stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            <div className="dfm-card" style={{ padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)" }}>참여자</div>
              <b style={{ fontFamily: "var(--mono)", fontSize: 16, display: "block", marginTop: 2 }}>{c.members.toLocaleString()}</b>
            </div>
            <div className="dfm-card" style={{ padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)" }}>달성률</div>
              <b style={{ fontFamily: "var(--mono)", fontSize: 16, display: "block", marginTop: 2 }}>{Math.round(c.progress * 100)}%</b>
            </div>
            <div className="dfm-card" style={{ padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)" }}>기간</div>
              <b style={{ fontFamily: "var(--mono)", fontSize: 12, display: "block", marginTop: 4 }}>{c.days}</b>
            </div>
          </div>

          {/* 참여중일 때만 my progress */}
          {joined && (
            <div className="dfm-card" style={{ padding: 14, marginBottom: 14, background: "var(--ink)", color: "var(--bg-paper)", border: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--yellow)" }}>나의 진행</span>
                <small style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "var(--mono)" }}>{justJoined ? "0 / 30일" : "12 / 30일"}</small>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.15)", overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: justJoined ? "0%" : "40%", height: "100%", background: "var(--yellow)", borderRadius: 99, transition: "width .3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{justJoined ? "오늘부터 시작!" : "5일 연속 인증중 🔥"}</small>
                <button style={{ padding: "7px 14px", borderRadius: 99, background: "var(--yellow)", color: "var(--ink)", border: "none", fontWeight: 700, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>오늘 인증하기</button>
              </div>
            </div>
          )}

          {/* 보상 */}
          <div style={{ padding: "12px 14px", borderRadius: 12, border: "1px dashed var(--line-strong)", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "grid", placeItems: "center", fontSize: 16 }}>🏆</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)" }}>달성 보상</div>
              <b style={{ fontSize: 13 }}>{meta.reward}</b>
            </div>
          </div>

          {/* 규칙 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--ink-mute)", marginBottom: 8 }}>참여 규칙</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meta.rules.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--ink)" }}>
                  <span style={{ fontFamily: "var(--mono)", color: "var(--ink-mute)", flexShrink: 0, width: 14 }}>{i + 1}.</span>
                  <span style={{ flex: 1, lineHeight: 1.45 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 친구 미리보기 */}
          <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--bg-paper)", border: "1px solid var(--line)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex" }}>
              {["🦊", "🐰", "🐻", "🐯"].map((e, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--bg-paper)", display: "grid", placeItems: "center", fontSize: 13, marginLeft: i === 0 ? 0 : -8 }}>{e}</div>
              ))}
            </div>
            <small style={{ fontSize: 11, color: "var(--ink-mute)", flex: 1 }}>친구 4명을 포함해 {c.members.toLocaleString()}명이 함께해요</small>
          </div>

          {/* CTA */}
          {!joined ? (
            <button onClick={() => { onJoin(c.id); setJustJoined(true); }}
              style={{ width: "100%", padding: "16px 0", borderRadius: 14, border: "none", background: "var(--ink)", color: "var(--yellow)", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              참여하기
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { onLeave(c.id); onClose(); }}
                style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-mute)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                그만두기
              </button>
              <button onClick={onClose}
                style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--yellow)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {justJoined ? "확인" : "친구에게 공유"}
              </button>
            </div>
          )}

          {/* 참여 직후 토스트성 안내 */}
          {justJoined && (
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "var(--yellow)", border: "1px solid var(--yellow-edge)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🎉</span>
              <small style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>참여 완료! 매일 오후 9시에 인증 알림을 보내드려요</small>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MobileMenu({ onNavigate, onProfile }) {
  const links = [
    ["wallet", "가계부 상세", "거래 내역 · 카테고리 분석", "ledger"],
    ["tag", "구독 관리", "12개 활성 · 이번 달 ₩47,000", "subs"],
    ["coin", "연봉 계산기", "실수령액 · 4대 보험", null],
    ["pdf", "이미지 → PDF", "여러 이미지를 한 파일로", null],
    ["crop", "이미지 자르기", "빠른 크롭과 내보내기", null],
    ["bell", "알림 설정", "리마인더 · 푸시 알림", "notif"],
    ["moon", "테마 · 모양", "다크 모드 · 포인트 컬러", "theme"],
  ];
  return (
    <div>
      <div className="dfm-card" onClick={onProfile} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, cursor: "pointer" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--yellow)", display: "grid", placeItems: "center", fontFamily: "var(--hand)", fontWeight: 700, fontSize: 22, border: "1px solid var(--yellow-edge)" }}>나</div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 15 }}>나비</b>
          <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>nabi@dayflow.app · 무료 플랜</div>
        </div>
        <Ico name="chevR" size={16} />
      </div>
      <SectionHeader title="바로가기" />
      <div className="dfm-card" style={{ padding: 0 }}>
        {links.map(([icoName, ttl, sub, route], i) => (
          <div key={i}
            onClick={() => route && onNavigate?.(route)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: i < links.length - 1 ? "1px dashed var(--line)" : "none", cursor: route ? "pointer" : "default", opacity: route ? 1 : 0.78 }}>
            <div className="dfm-tool-ico" style={{ width: 36, height: 36, fontSize: 16 }}><Ico name={icoName} size={16} /></div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, display: "block" }}>{ttl}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{sub}</small>
            </div>
            <Ico name="chevR" size={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// SUB-SCREEN HEADER (back button + title)
// ────────────────────────────────────────────────
function SubHeader({ title, onBack, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <button className="dfm-icon-btn" onClick={onBack} aria-label="뒤로">
        <Ico name="chevL" size={18} />
      </button>
      <b style={{ flex: 1, fontSize: 17, letterSpacing: "-0.01em" }}>{title}</b>
      {action}
    </div>
  );
}

// ────────────────────────────────────────────────
// SUBSCRIPTIONS — 구독 관리
// ────────────────────────────────────────────────
function SubscriptionsScreen({ onBack, onAdd }) {
  const subs = [
    { ico: "play",  name: "넷플릭스",       plan: "프리미엄 4K",        price: 17000, day: 8,  cat: "엔터", color: "#ffb38a" },
    { ico: "music", name: "스포티파이",     plan: "개인",               price:  7900, day: 12, cat: "엔터", color: "#b9e7c9" },
    { ico: "play",  name: "유튜브 프리미엄", plan: "광고 제거",          price: 14900, day: 3,  cat: "엔터", color: "#ffb38a" },
    { ico: "cloud", name: "iCloud+",        plan: "200GB",              price:  3300, day: 17, cat: "유틸", color: "#cfe7ff" },
    { ico: "tag",   name: "노션",            plan: "플러스",             price: 12000, day: 1,  cat: "업무", color: "#d4c1f0" },
    { ico: "tag",   name: "Figma",           plan: "프로페셔널",         price: 19500, day: 21, cat: "업무", color: "#d4c1f0" },
    { ico: "doc",   name: "어도비 CC",       plan: "포토 플랜",          price: 11000, day: 14, cat: "업무", color: "#d4c1f0" },
    { ico: "music", name: "애플뮤직",        plan: "패밀리",             price: 14900, day: 9,  cat: "엔터", color: "#b9e7c9" },
    { ico: "cloud", name: "Dropbox",         plan: "Plus 2TB",           price: 13900, day: 24, cat: "유틸", color: "#cfe7ff" },
    { ico: "tag",   name: "1Password",       plan: "개인",               price:  4500, day: 6,  cat: "유틸", color: "#cfe7ff" },
    { ico: "play",  name: "쿠팡플레이",      plan: "와우 멤버십 포함",   price:  7890, day: 18, cat: "엔터", color: "#ffb38a" },
    { ico: "doc",   name: "ChatGPT Plus",    plan: "월간",               price: 28000, day: 27, cat: "업무", color: "#d4c1f0" },
  ];
  const total = subs.reduce((a, s) => a + s.price, 0);
  const [filter, setFilter] = useStateM("전체");
  const cats = ["전체", "엔터", "업무", "유틸"];
  const visible = filter === "전체" ? subs : subs.filter(s => s.cat === filter);

  // upcoming charges (next 7 days) — fake "today is Nov 11"
  const today = 11;
  const upcoming = subs
    .map(s => ({ ...s, daysAway: ((s.day - today) + 30) % 30 }))
    .filter(s => s.daysAway <= 7)
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 3);

  return (
    <div>
      <SubHeader
        title="구독 관리"
        onBack={onBack}
        action={<button className="dfm-icon-btn" aria-label="추가" onClick={onAdd}><Ico name="plus" size={18} /></button>}
      />

      {/* hero summary */}
      <div className="dfm-card" style={{ background: "var(--yellow)", borderColor: "var(--yellow-edge)", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <small style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>이번 달 구독료</small>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <b style={{ fontSize: 30, fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>₩{total.toLocaleString()}</b>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>/ {subs.length}개</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11 }}>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="엔터").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>엔터테인먼트</div></span>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="업무").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>업무</div></span>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="유틸").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>유틸리티</div></span>
        </div>
      </div>

      {/* upcoming */}
      <SectionHeader title="다가오는 결제" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {upcoming.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < upcoming.length - 1 ? "1px dashed var(--line)" : "none" }}>
            <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: s.color, borderColor: "rgba(0,0,0,0.06)" }}><Ico name={s.ico} size={14} /></div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.daysAway === 0 ? "오늘" : `${s.daysAway}일 후`} · 매월 {s.day}일</small>
            </div>
            <b style={{ fontSize: 13, fontFamily: "var(--mono)" }}>₩{s.price.toLocaleString()}</b>
          </div>
        ))}
      </div>

      {/* filter chips */}
      <SectionHeader title="전체 구독" />
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: "7px 13px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: "1px solid " + (filter === c ? "var(--ink)" : "var(--line)"),
              background: filter === c ? "var(--ink)" : "transparent",
              color: filter === c ? "var(--bg-paper)" : "var(--ink)",
              whiteSpace: "nowrap", cursor: "pointer",
            }}>{c}</button>
        ))}
      </div>

      {/* list */}
      <div className="dfm-card" style={{ padding: 0 }}>
        {visible.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: i < visible.length - 1 ? "1px dashed var(--line)" : "none", cursor: "pointer" }}>
            <div className="dfm-tool-ico" style={{ width: 36, height: 36, background: s.color, borderColor: "rgba(0,0,0,0.06)" }}>
              <Ico name={s.ico} size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.plan} · 매월 {s.day}일</small>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ fontSize: 13, fontFamily: "var(--mono)", display: "block" }}>₩{s.price.toLocaleString()}</b>
              <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>월</small>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }}></div>
    </div>
  );
}

// ────────────────────────────────────────────────
// NOTIFICATIONS — 알림 설정
// ────────────────────────────────────────────────
function NotifToggleRow({ ico, title, sub, value, onChange, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: last ? "none" : "1px dashed var(--line)" }}>
      {ico && <div className="dfm-tool-ico" style={{ width: 32, height: 32 }}><Ico name={ico} size={14} /></div>}
      <div style={{ flex: 1 }}>
        <b style={{ fontSize: 13, display: "block" }}>{title}</b>
        {sub && <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{sub}</small>}
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        style={{
          width: 44, height: 26, borderRadius: 999,
          border: "1px solid " + (value ? "var(--ink)" : "var(--line)"),
          background: value ? "var(--ink)" : "transparent",
          padding: 0, cursor: "pointer", position: "relative",
          transition: "background 0.15s, border-color 0.15s",
        }}>
        <span style={{
          position: "absolute", top: 2, left: value ? 20 : 2,
          width: 20, height: 20, borderRadius: "50%",
          background: value ? "var(--bg-paper)" : "var(--ink)",
          transition: "left 0.18s cubic-bezier(0.2,0.7,0.2,1)",
        }} />
      </button>
    </div>
  );
}

function NotificationsScreen({ onBack }) {
  const [s, setS] = useStateM({
    push: true,
    daily: true,
    weekly: true,
    budget: true,
    bigSpend: true,
    subRenew: true,
    cal30: true,
    cal1d: false,
    quietStart: "22:00",
    quietEnd: "08:00",
    quietOn: true,
    sound: "기본",
  });
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  return (
    <div>
      <SubHeader title="알림 설정" onBack={onBack} />

      {/* master push status */}
      <div className="dfm-card" style={{
        marginBottom: 14, display: "flex", alignItems: "center", gap: 12,
        background: s.push ? "var(--mint, #e8f3e2)" : "var(--card)",
      }}>
        <div className="dfm-tool-ico" style={{ width: 40, height: 40, background: s.push ? "#b9e7c9" : "var(--bg-paper)" }}>
          <Ico name="bell" size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 14, display: "block" }}>{s.push ? "알림이 켜져 있어요" : "알림이 꺼져 있어요"}</b>
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            {s.push ? "iOS 시스템 권한 · 허용됨" : "탭하여 활성화"}
          </small>
        </div>
        <button
          onClick={() => set("push", !s.push)}
          aria-pressed={s.push}
          style={{
            width: 44, height: 26, borderRadius: 999,
            border: "1px solid " + (s.push ? "var(--ink)" : "var(--line)"),
            background: s.push ? "var(--ink)" : "transparent",
            padding: 0, cursor: "pointer", position: "relative",
          }}>
          <span style={{
            position: "absolute", top: 2, left: s.push ? 20 : 2,
            width: 20, height: 20, borderRadius: "50%",
            background: s.push ? "var(--bg-paper)" : "var(--ink)",
            transition: "left 0.18s cubic-bezier(0.2,0.7,0.2,1)",
          }} />
        </button>
      </div>

      {/* digests */}
      <SectionHeader title="요약 리포트" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14, opacity: s.push ? 1 : 0.5, pointerEvents: s.push ? "auto" : "none" }}>
        <NotifToggleRow title="일일 요약"   sub="매일 밤 9:00 · 오늘의 흐름"     value={s.daily}  onChange={v => set("daily", v)} />
        <NotifToggleRow title="주간 리포트" sub="일요일 오전 10:00 · 이번 주 정리" value={s.weekly} onChange={v => set("weekly", v)} last />
      </div>

      {/* triggers */}
      <SectionHeader title="가계부" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14, opacity: s.push ? 1 : 0.5, pointerEvents: s.push ? "auto" : "none" }}>
        <NotifToggleRow ico="wallet" title="예산 80% 도달"  sub="카테고리별 한도 임박"      value={s.budget}   onChange={v => set("budget", v)} />
        <NotifToggleRow ico="coin"   title="큰 지출 감지"   sub="₩100,000 이상 결제 즉시"   value={s.bigSpend} onChange={v => set("bigSpend", v)} />
        <NotifToggleRow ico="tag"    title="구독 갱신"      sub="결제 1일 전 알림"          value={s.subRenew} onChange={v => set("subRenew", v)} last />
      </div>

      <SectionHeader title="캘린더" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14, opacity: s.push ? 1 : 0.5, pointerEvents: s.push ? "auto" : "none" }}>
        <NotifToggleRow ico="cal" title="시작 30분 전" value={s.cal30} onChange={v => set("cal30", v)} />
        <NotifToggleRow ico="cal" title="하루 전 오전 9:00" value={s.cal1d} onChange={v => set("cal1d", v)} last />
      </div>

      {/* quiet hours */}
      <SectionHeader title="방해 금지" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <NotifToggleRow ico="moon" title="방해 금지 모드" sub="설정한 시간 동안 무음" value={s.quietOn} onChange={v => set("quietOn", v)} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", opacity: s.quietOn ? 1 : 0.45 }}>
          <div style={{ flex: 1, fontSize: 13 }}>시작</div>
          <input type="time" value={s.quietStart} onChange={e => set("quietStart", e.target.value)} disabled={!s.quietOn}
            style={{ fontFamily: "var(--mono)", fontSize: 14, padding: "6px 12px", background: "var(--bg-paper)", borderRadius: 8, border: "1px solid var(--line)", color: "var(--ink)", outline: "none", cursor: s.quietOn ? "pointer" : "default" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderTop: "1px dashed var(--line)", opacity: s.quietOn ? 1 : 0.45 }}>
          <div style={{ flex: 1, fontSize: 13 }}>종료</div>
          <input type="time" value={s.quietEnd} onChange={e => set("quietEnd", e.target.value)} disabled={!s.quietOn}
            style={{ fontFamily: "var(--mono)", fontSize: 14, padding: "6px 12px", background: "var(--bg-paper)", borderRadius: 8, border: "1px solid var(--line)", color: "var(--ink)", outline: "none", cursor: s.quietOn ? "pointer" : "default" }} />
        </div>
      </div>

      {/* sound */}
      <SectionHeader title="알림음" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {["기본", "차임", "조약돌", "물방울", "무음"].map((opt, i, arr) => (
          <div key={opt} onClick={() => set("sound", opt)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px dashed var(--line)" : "none", cursor: "pointer" }}>
            <div style={{ flex: 1, fontSize: 13 }}>{opt}</div>
            {s.sound === opt && <Ico name="check" size={16} />}
          </div>
        ))}
      </div>

      <div style={{ height: 16 }}></div>
    </div>
  );
}

// ────────────────────────────────────────────────
// PROFILE — 프로필 / 계정
// ────────────────────────────────────────────────
function ProfileScreen({ onBack, onUpgrade }) {
  const [name, setName] = useStateM("나비");
  const [email] = useStateM("nabi@dayflow.app");
  const [editOpen, setEditOpen] = useStateM(false);
  const [pwOpen, setPwOpen] = useStateM(false);
  const stats = [
    { label: "이번 달 입력", val: "84", unit: "건" },
    { label: "기록 시작",   val: "183", unit: "일째" },
    { label: "연속 사용",   val: "27", unit: "일" },
  ];
  const Row = ({ ico, title, sub, right, last, onClick, danger }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: last ? "none" : "1px dashed var(--line)", cursor: onClick ? "pointer" : "default" }}>
      {ico && <div className="dfm-tool-ico" style={{ width: 32, height: 32 }}><Ico name={ico} size={14} /></div>}
      <div style={{ flex: 1 }}>
        <b style={{ fontSize: 13, display: "block", color: danger ? "#c44a3a" : "var(--ink)" }}>{title}</b>
        {sub && <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{sub}</small>}
      </div>
      {right !== undefined ? right : (onClick && <Ico name="chevR" size={14} />)}
    </div>
  );
  return (
    <div>
      <SubHeader title="프로필" onBack={onBack} action={<button className="dfm-icon-btn" aria-label="편집" onClick={() => setEditOpen(true)}><Ico name="edit" size={18} /></button>} />

      {/* hero card — avatar + name + plan */}
      <div className="dfm-card" style={{ background: "var(--yellow)", borderColor: "var(--yellow-edge)", marginBottom: 14, textAlign: "center", padding: "22px 18px" }}>
        <div style={{ width: 76, height: 76, margin: "0 auto", borderRadius: 24, background: "var(--bg-paper)", border: "2px solid var(--ink)", display: "grid", placeItems: "center", fontFamily: "var(--hand)", fontWeight: 700, fontSize: 36 }}>나</div>
        <b style={{ display: "block", fontSize: 20, marginTop: 12, letterSpacing: "-0.01em" }}>{name}</b>
        <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{email}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, padding: "4px 10px", background: "var(--bg-paper)", borderRadius: 999, border: "1px solid var(--yellow-edge)", fontSize: 11, fontWeight: 600 }}>
          <Ico name="tag" size={11} /> 무료 플랜
        </div>
      </div>

      {/* stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="dfm-card" style={{ padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {s.val}<span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-mute)", marginLeft: 2 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* upgrade banner */}
      <button onClick={onUpgrade} className="dfm-card" style={{ marginBottom: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #fff5d6 0%, #ffe8b8 100%)", borderColor: "var(--yellow-edge)", width: "100%", textAlign: "left", cursor: "pointer", color: "var(--ink)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--ink)", color: "#ffd84d", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Ico name="coin" size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 13, display: "block" }}>Pro로 업그레이드</b>
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>광고 제거 · 무제한 기록 · ₩3,900 / 월</small>
        </div>
        <Ico name="chevR" size={14} />
      </button>

      {/* account */}
      <SectionHeader title="계정" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row ico="bell" title="이메일" sub={email} onClick={() => setEditOpen(true)} />
        <Row ico="tag"  title="비밀번호 변경" onClick={() => setPwOpen(true)} />
        <Row ico="cloud" title="연결된 계정" sub="Apple · Google" onClick={() => {}} last />
      </div>

      {/* data */}
      <SectionHeader title="데이터" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row ico="cloud" title="iCloud 동기화" right={<DfmSwitch on={true} />} />
        <Row ico="doc"   title="데이터 내보내기" sub="CSV · JSON" onClick={() => {}} />
        <Row ico="refresh" title="백업 및 복원" sub="마지막 백업 · 어제 23:00" onClick={() => {}} last />
      </div>

      {/* about */}
      <SectionHeader title="앱 정보" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row title="버전" right={<span style={{ fontSize: 12, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>2.4.1</span>} />
        <Row title="이용약관" onClick={() => {}} />
        <Row title="개인정보 처리방침" onClick={() => {}} />
        <Row title="문의하기" sub="help@dayflow.app" onClick={() => {}} last />
      </div>

      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row title="로그아웃" onClick={() => {}} danger last />
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-mute)", padding: "8px 0 24px", letterSpacing: "0.06em" }}>
        Dayflow · Made with ☕ in Seoul
      </div>

      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} initialName={name} email={email} onSave={(v) => { setName(v); setEditOpen(false); }} />
      <ChangePasswordSheet open={pwOpen} onClose={() => setPwOpen(false)} email={email} />
    </div>
  );
}

// reusable switch (matches NotifToggleRow style)
function DfmSwitch({ on, onChange }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange?.(!on); }} aria-pressed={on}
      style={{
        width: 40, height: 24, borderRadius: 999,
        border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
        background: on ? "var(--ink)" : "transparent",
        padding: 0, cursor: "pointer", position: "relative", flexShrink: 0,
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: on ? "var(--bg-paper)" : "var(--ink-mute)",
        transition: "left .15s",
      }} />
    </button>
  );
}

// ────────────────────────────────────────────────
// THEME — 테마 · 모양
// ────────────────────────────────────────────────
function ThemeScreen({ onBack }) {
  const [mode, setMode] = useStateM("auto");        // light | dark | auto
  const [accent, setAccent] = useStateM("yellow");
  const [font, setFont] = useStateM("hand");        // hand | sans | serif
  const [size, setSize] = useStateM(2);             // 1..4
  const [density, setDensity] = useStateM("comfy"); // cozy | comfy | compact
  const [paper, setPaper] = useStateM(true);
  const [haptics, setHaptics] = useStateM(true);

  const accents = [
    { id: "yellow", name: "노랑",  color: "#ffd84d" },
    { id: "pink",   name: "핑크",  color: "#ffb38a" },
    { id: "mint",   name: "민트",  color: "#b9e7c9" },
    { id: "blue",   name: "블루",  color: "#cfe7ff" },
    { id: "lilac",  name: "라일락", color: "#d4c1f0" },
    { id: "ink",    name: "잉크",   color: "#3a3528" },
  ];
  const sizes = ["작게", "보통", "크게", "더 크게"];

  // ── PREVIEW ──
  const previewBg = mode === "dark" ? "#1f1d18" : "var(--bg-paper)";
  const previewInk = mode === "dark" ? "#ede8d8" : "var(--ink)";
  const accentColor = accents.find(a => a.id === accent)?.color;
  const fontFamily = font === "hand" ? "var(--hand)" : font === "serif" ? "var(--serif, Georgia, serif)" : "var(--sans, system-ui)";
  const fontPx = [12, 14, 16, 18][size - 1];

  return (
    <div>
      <SubHeader title="테마 · 모양" onBack={onBack} />

      {/* live preview */}
      <div className="dfm-card" style={{
        background: previewBg, color: previewInk,
        border: "1px solid " + (mode === "dark" ? "rgba(255,255,255,0.08)" : "var(--line)"),
        marginBottom: 18, padding: 16,
        backgroundImage: paper ? "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)" : "none",
        backgroundSize: "10px 10px",
      }}>
        <small style={{ fontSize: 10, color: mode === "dark" ? "#9b9484" : "var(--ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>미리보기</small>
        <div style={{ marginTop: 8, fontFamily, fontSize: fontPx + 6, fontWeight: 700, lineHeight: 1.2 }}>
          오늘의 흐름
        </div>
        <div style={{ marginTop: 4, fontFamily, fontSize: fontPx, color: mode === "dark" ? "#bdb7a6" : "var(--ink-mute)" }}>
          11월 14일 토요일 · 좋은 아침이에요
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span style={{ padding: "5px 10px", borderRadius: 999, background: accentColor, color: accent === "ink" ? "#ffd84d" : "#3a3528", fontSize: 11, fontWeight: 600 }}>포인트</span>
          <span style={{ padding: "5px 10px", borderRadius: 999, border: "1px dashed " + (mode === "dark" ? "rgba(255,255,255,0.15)" : "var(--line)"), fontSize: 11, color: mode === "dark" ? "#bdb7a6" : "var(--ink-mute)" }}>보조</span>
        </div>
      </div>

      {/* mode */}
      <SectionHeader title="모드" />
      <div className="dfm-card" style={{ padding: 6, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {[
            { id: "light", label: "라이트", ico: "sun" },
            { id: "dark",  label: "다크",   ico: "moon" },
            { id: "auto",  label: "자동",   ico: "refresh" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{
                padding: "12px 8px", borderRadius: 10,
                border: "none",
                background: mode === m.id ? "var(--ink)" : "transparent",
                color: mode === m.id ? "var(--bg-paper)" : "var(--ink)",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
              <Ico name={m.ico} size={16} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* accent */}
      <SectionHeader title="포인트 컬러" />
      <div className="dfm-card" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
          {accents.map(a => (
            <button key={a.id} onClick={() => setAccent(a.id)}
              aria-pressed={accent === a.id}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: a.color,
                border: accent === a.id ? "2.5px solid var(--ink)" : "1px solid rgba(0,0,0,0.12)",
                cursor: "pointer", padding: 0, position: "relative",
                boxShadow: accent === a.id ? "0 0 0 3px var(--bg-paper) inset" : "none",
              }} aria-label={a.name}>
              {accent === a.id && (
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: "absolute", inset: 0, margin: "auto" }}>
                  <path d="M3 7l3 3 5-6" stroke={a.id === "ink" ? "#ffd84d" : "#3a3528"} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 12, textAlign: "center" }}>
          선택: <b style={{ color: "var(--ink)" }}>{accents.find(a => a.id === accent)?.name}</b>
        </div>
      </div>

      {/* font family */}
      <SectionHeader title="폰트" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {[
          { id: "hand",  label: "핸드라이팅", sub: "기본 · 나만의 노트 느낌", style: { fontFamily: "var(--hand)" } },
          { id: "sans",  label: "산세리프",   sub: "깔끔하고 또렷한 본문",   style: { fontFamily: "system-ui, -apple-system, sans-serif" } },
          { id: "serif", label: "세리프",     sub: "차분하고 클래식",        style: { fontFamily: "Georgia, 'Times New Roman', serif" } },
        ].map((f, i, arr) => (
          <div key={f.id} onClick={() => setFont(f.id)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: i < arr.length - 1 ? "1px dashed var(--line)" : "none", cursor: "pointer" }}>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 16, display: "block", ...f.style }}>오늘의 흐름</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{f.label} · {f.sub}</small>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "1.5px solid " + (font === f.id ? "var(--ink)" : "var(--line)"),
              display: "grid", placeItems: "center",
            }}>
              {font === f.id && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ink)" }} />}
            </div>
          </div>
        ))}
      </div>

      {/* font size */}
      <SectionHeader title="글자 크기" />
      <div className="dfm-card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>가</span>
          <div style={{ flex: 1, position: "relative", height: 24, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: "auto 0", height: 2, background: "var(--line)", borderRadius: 999 }} />
            <div style={{ position: "absolute", left: 0, right: `${(1 - (size - 1) / 3) * 100}%`, height: 2, background: "var(--ink)", borderRadius: 999 }} />
            {[1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setSize(n)}
                style={{
                  position: "absolute", left: `${((n - 1) / 3) * 100}%`,
                  transform: "translateX(-50%)",
                  width: 18, height: 18, borderRadius: "50%",
                  border: "none",
                  background: size >= n ? "var(--ink)" : "var(--line)",
                  cursor: "pointer", padding: 0,
                }} aria-label={sizes[n - 1]} />
            ))}
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>가</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-mute)" }}>
          {sizes.map((s, i) => <span key={i} style={{ fontWeight: size === i + 1 ? 700 : 400, color: size === i + 1 ? "var(--ink)" : "var(--ink-mute)" }}>{s}</span>)}
        </div>
      </div>

      {/* density */}
      <SectionHeader title="목록 간격" />
      <div className="dfm-card" style={{ padding: 6, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {[
            { id: "cozy",    label: "넉넉",   bars: [16, 16, 16] },
            { id: "comfy",   label: "보통",   bars: [12, 12, 12] },
            { id: "compact", label: "압축",   bars: [8, 8, 8] },
          ].map(d => (
            <button key={d.id} onClick={() => setDensity(d.id)}
              style={{
                padding: "12px 8px", borderRadius: 10,
                border: "none",
                background: density === d.id ? "var(--ink)" : "transparent",
                color: density === d.id ? "var(--bg-paper)" : "var(--ink)",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
              <div style={{ display: "flex", flexDirection: "column", gap: density === d.id ? 3 : 2, marginBottom: 2 }}>
                {d.bars.map((w, i) => (
                  <span key={i} style={{ width: w, height: 2, background: density === d.id ? "var(--bg-paper)" : "currentColor", opacity: 0.7, borderRadius: 1 }} />
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
        <NotifToggleRow ico="doc" title="종이 질감 배경" sub="살짝 도트 무늬 표시" value={paper} onChange={setPaper} />
        <NotifToggleRow ico="bell" title="햅틱 피드백" sub="탭에 진동" value={haptics} onChange={setHaptics} last />
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────
function ReceiptSheet({ txn, onClose }) {
  const open = !!txn;
  // synthesize receipt-like data based on txn
  const data = txn || {};

  // produce a barcode pattern (deterministic from name)
  const seed = (data.name || "x").split("").reduce((a,c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 36 }, (_, i) => {
    const v = (seed * (i + 7) * 31) % 7;
    return v < 2 ? 1 : (v < 5 ? 2 : 3);
  });

  // detail line items (faked per merchant)
  const items = (() => {
    const a = Math.abs(data.amt || 0);
    if (data.name?.includes("스타벅스")) return [
      { name: "아이스 카페 라떼 T", qty: 1, price: 5800 },
      { name: "에그 베이컨 샌드위치", qty: 1, price: 6500 },
    ];
    if (data.name?.includes("이마트")) return [
      { name: "유기농 우유 900ml", qty: 2, price: 6900 },
      { name: "한돈 삼겹살 500g", qty: 1, price: 21800 },
      { name: "신선란 30구", qty: 1, price: 8400 },
      { name: "아오리 사과 1.5kg", qty: 1, price: 14900 },
      { name: "오뚜기 진라면", qty: 2, price: 5400 },
    ];
    if (data.name?.includes("GS25")) return [
      { name: "포카리스웨트 620ml", qty: 1, price: 2400 },
      { name: "허니버터칩", qty: 1, price: 1900 },
      { name: "도시락 - 제육볶음", qty: 1, price: 4150 },
    ];
    if (data.name?.includes("지하철")) return [{ name: "교통카드 단건 결제", qty: 1, price: a }];
    if (data.name?.includes("넷플릭스")) return [{ name: "프리미엄 정기결제 (월)", qty: 1, price: a }];
    if (data.name?.includes("탐앤탐스")) return [{ name: "아메리카노 R", qty: 1, price: a }];
    if (data.name?.includes("무신사")) return [{ name: "옥스포드 셔츠 (스카이)", qty: 1, price: a }];
    if (data.name?.includes("월세")) return [{ name: "11월 월세 자동이체", qty: 1, price: a }];
    if (data.name?.includes("급여")) return [
      { name: "기본급", qty: 1, price: 3300000 },
      { name: "직책수당", qty: 1, price: 200000 },
      { name: "식대 비과세", qty: 1, price: 200000 },
      { name: "(공제) 4대 보험·세금", qty: 1, price: -50000 },
    ];
    return [{ name: data.name || "결제", qty: 1, price: a }];
  })();

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = Math.abs(data.amt || subtotal);

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">{data.income ? "수입 상세" : "결제 상세"}</div>
          <button className="close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="dfm-sheet-body">
          <div className="dfm-receipt">
            <div className="dfm-receipt-store">
              <div className="name">{data.name || ""}</div>
              <div className="meta">
                {data.income ? "Dayflow · 수입 입력" : "사업자 123-45-67890"} <br />
                서울 강남구 테헤란로 152 · 02-1234-5678
              </div>
            </div>

            <hr />

            <div className="dfm-receipt-rows">
              <div className="dfm-receipt-row">
                <span className="lbl">{data.sub?.split("·")[0]?.trim() || "거래일시"}</span>
                <span className="val">2026.11.{data.name?.includes("급여") ? "11" : "14"}</span>
              </div>
              <div className="dfm-receipt-row">
                <span className="lbl">분류</span>
                <span className="val">{data.cat || "-"}</span>
              </div>
              <div className="dfm-receipt-row">
                <span className="lbl">결제수단</span>
                <span className="val">{data.income ? "신한은행 입금" : "신한 체크카드"}</span>
              </div>
            </div>

            <hr />

            <div className="dfm-receipt-rows">
              {items.map((it, i) => (
                <div key={i} className="dfm-receipt-row">
                  <span className="lbl">{it.name}<span className="qty">×{it.qty}</span></span>
                  <span className="val">{it.price > 0 ? "" : "-"}{Math.abs(it.price * it.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="dfm-receipt-total">
              <span>합계</span>
              <span>{data.income ? "+" : ""}₩{total.toLocaleString()}</span>
            </div>

            <div className="dfm-receipt-pay">
              <span>승인번호 30041892</span>
              <span>14:32:08</span>
            </div>

            <div className="dfm-receipt-foot">
              감사합니다 · 교환·환불은 영수증 지참<br />
              www.dayflow.app · 자동 동기화됨
            </div>

            <div className="dfm-receipt-barcode">
              {bars.map((w, i) => (
                <i key={i} style={{ width: w + "px" }} />
              ))}
            </div>
          </div>

          <div className="dfm-meta-block">
            <h4>메모</h4>
            <div className={`dfm-memo ${data.memo ? "" : "empty"}`}>
              {data.memo || "메모를 추가하면 영수증과 함께 저장돼요."}
            </div>
          </div>

          <div className="dfm-meta-block">
            <h4>태그</h4>
            <div className="dfm-meta-tags">
              {(data.tags || ["#점심", "#팀회식", "#증빙필요"]).map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
              <span className="tag add">+ 태그</span>
            </div>
          </div>

          <div className="dfm-meta-block">
            <h4>첨부 사진</h4>
            <div className="dfm-photo-row">
              <div className="dfm-photo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                  <path d="m3 17 5-5 5 5 4-4 4 4" />
                </svg>
              </div>
              <div className="dfm-photo add">+</div>
            </div>
          </div>

          <div className="dfm-action-row">
            <button className="dfm-action-btn"><Ico name="refresh" size={14} /> 다시 분류</button>
            <button className="dfm-action-btn primary">메모 편집</button>
          </div>
          <button className="dfm-action-btn danger" style={{ marginTop: 8, width: "100%" }}>
            거래 삭제
          </button>
        </div>
      </div>
    </>
  );
}

window.ReceiptSheet = ReceiptSheet;
// txn detail handler exposed via window for simplicity (avoiding context boilerplate)
let _openTxnRef = null;
function openTxnDetail(txn) { if (_openTxnRef) _openTxnRef(txn); }

// ────────────────────────────────────────────────
// ADD SHEETS — Txn / Event quick-add (mobile)
// ────────────────────────────────────────────────
function TimerSettingsSheet({ open, onClose, settings, onChange }) {
  if (!settings) settings = { focus: 25, shortBreak: 5, longBreak: 15, sets: 4, sound: "차임", autoStart: false, vibrate: true };
  const set = (k, v) => onChange?.({ ...settings, [k]: v });
  const sounds = ["기본", "차임", "조약돌", "물방울", "무음"];
  const minutes = [15, 20, 25, 30, 45, 50, 60];
  const breakOpts = [3, 5, 10, 15];
  const longBreakOpts = [10, 15, 20, 30];
  const setsOpts = [2, 3, 4, 5, 6];

  const Row = ({ label, sub, children }) => (
    <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub || children ? 8 : 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );

  const Chip = ({ active, onClick, children }) => (
    <button onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
        border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--bg-paper)" : "var(--ink)",
        cursor: "pointer", fontFamily: "var(--mono)",
      }}>{children}</button>
  );

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">타이머 설정<small>뽀모도로 · 알림</small></div>
          <button className="close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* Big preview pill */}
          <div style={{ background: "var(--yellow)", border: "1px solid var(--yellow-edge)", borderRadius: 14, padding: "16px 18px", margin: "6px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>1세트 흐름</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                집중 {settings.focus}분 · 휴식 {settings.shortBreak}분
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>
                {settings.sets}세트 후 긴 휴식 {settings.longBreak}분
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", color: "var(--bg-paper)", display: "grid", placeItems: "center" }}>
              <Ico name="play" size={16} />
            </div>
          </div>

          <Row label="집중 시간" sub="한 세트당 몰입 시간 (분)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {minutes.map(m => <Chip key={m} active={settings.focus === m} onClick={() => set("focus", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="짧은 휴식" sub="세트 사이 휴식">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {breakOpts.map(m => <Chip key={m} active={settings.shortBreak === m} onClick={() => set("shortBreak", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="긴 휴식" sub={`${settings.sets}세트 후`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {longBreakOpts.map(m => <Chip key={m} active={settings.longBreak === m} onClick={() => set("longBreak", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="세트 수" sub="긴 휴식까지 반복할 횟수">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {setsOpts.map(m => <Chip key={m} active={settings.sets === m} onClick={() => set("sets", m)}>{m}</Chip>)}
            </div>
          </Row>

          <Row label="알림 소리">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {sounds.map(s => <Chip key={s} active={settings.sound === s} onClick={() => set("sound", s)}>{s}</Chip>)}
            </div>
          </Row>

          {/* Toggles */}
          {[
            ["autoStart", "자동 시작", "휴식이 끝나면 다음 세트를 자동으로 시작"],
            ["vibrate",   "진동",       "소리와 함께 진동 알림"],
          ].map(([key, ttl, sub]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ttl}</div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>{sub}</div>
              </div>
              <button onClick={() => set(key, !settings[key])} aria-pressed={settings[key]}
                style={{
                  width: 44, height: 26, borderRadius: 999,
                  border: "1px solid " + (settings[key] ? "var(--ink)" : "var(--line)"),
                  background: settings[key] ? "var(--ink)" : "transparent",
                  padding: 0, cursor: "pointer", position: "relative", flexShrink: 0,
                }}>
                <span style={{
                  position: "absolute", top: 2, left: settings[key] ? 20 : 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: settings[key] ? "var(--bg-paper)" : "var(--ink-mute)",
                  transition: "left .15s",
                }} />
              </button>
            </div>
          ))}

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={() => onChange?.({ focus: 25, shortBreak: 5, longBreak: 15, sets: 4, sound: "차임", autoStart: false, vibrate: true })}
              style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-mute)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              초기화
            </button>
            <button onClick={onClose}
              style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AddTxnSheet({ open, onClose }) {
  const [type, setType] = useStateM("out");        // out | in
  const [amount, setAmount] = useStateM("");
  const [cat, setCat] = useStateM("식비");
  const [name, setName] = useStateM("");
  const [pay, setPay] = useStateM("체크카드");
  const cats = type === "out"
    ? ["식비", "교통", "쇼핑", "엔터", "건강", "기타"]
    : ["월급", "용돈", "이자", "기타"];
  const pays = ["체크카드", "신용카드", "현금", "계좌이체"];
  const today = new Date();
  const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${"일월화수목금토"[today.getDay()]})`;
  const fmt = (v) => v ? Number(v).toLocaleString() : "0";

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">새 거래 추가<small>{dateStr}</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* type segmented */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, padding:4, background:"var(--bg)", borderRadius:12, border:"1px solid var(--line)", marginBottom:18 }}>
            {[["out","지출"],["in","수입"]].map(([k,l]) => (
              <button key={k} onClick={() => { setType(k); setCat(k==="out"?"식비":"월급"); }}
                style={{
                  padding:"10px 0", borderRadius:9, border:"none",
                  background: type===k ? "var(--bg-paper)" : "transparent",
                  fontWeight: type===k ? 700 : 500, fontSize:13, cursor:"pointer",
                  color: type===k ? (k==="out"?"#d44":"#1a8a4a") : "var(--ink-mute)",
                  boxShadow: type===k ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}>{l}</button>
            ))}
          </div>

          {/* amount */}
          <div style={{ textAlign:"center", padding:"14px 0 22px", borderBottom:"1px dashed var(--line)" }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:4, letterSpacing:0.5 }}>금액</div>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"baseline", gap:4, fontFamily:"var(--mono)" }}>
              <span style={{ fontSize:18, color: type==="out"?"#d44":"#1a8a4a", fontWeight:600 }}>
                {type==="out"?"-":"+"}₩
              </span>
              <input value={fmt(amount)} onChange={e => setAmount(e.target.value.replace(/[^\d]/g,""))}
                inputMode="numeric"
                style={{ fontSize:36, fontWeight:700, fontFamily:"var(--mono)", border:"none", background:"transparent",
                  color:"var(--ink)", textAlign:"center", width:"60%", outline:"none" }} />
            </div>
          </div>

          {/* category */}
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:8, fontWeight:600 }}>카테고리</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  style={{
                    padding:"7px 12px", borderRadius:999, fontSize:12, fontWeight:600,
                    border:"1px solid " + (cat===c?"var(--ink)":"var(--line)"),
                    background: cat===c?"var(--ink)":"transparent",
                    color: cat===c?"var(--bg-paper)":"var(--ink)",
                    cursor:"pointer",
                  }}>{c}</button>
              ))}
            </div>
          </div>

          {/* name */}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:6, fontWeight:600 }}>내용</div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={type==="out"?"예: 스타벅스 강남점":"예: 11월 월급"}
              style={{ width:"100%", padding:"11px 12px", border:"1px solid var(--line)", borderRadius:10,
                background:"var(--bg-paper)", fontSize:13, color:"var(--ink)", outline:"none" }} />
          </div>

          {/* method */}
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:8, fontWeight:600 }}>결제수단</div>
            <div style={{ display:"flex", gap:6 }}>
              {pays.map(p => (
                <button key={p} onClick={() => setPay(p)}
                  style={{
                    flex:1, padding:"9px 0", borderRadius:9, fontSize:11, fontWeight:600,
                    border:"1px solid " + (pay===p?"var(--ink)":"var(--line)"),
                    background: pay===p?"var(--bg)":"transparent",
                    color: pay===p?"var(--ink)":"var(--ink-mute)",
                    cursor:"pointer",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display:"flex", gap:8, marginTop:22 }}>
            <button onClick={onClose} style={{ flex:1, padding:"14px 0", borderRadius:12, border:"1px solid var(--line)", background:"transparent", color:"var(--ink)", fontWeight:600, fontSize:13, cursor:"pointer" }}>취소</button>
            <button onClick={onClose} style={{ flex:2, padding:"14px 0", borderRadius:12, border:"none", background:"var(--ink)", color:"var(--bg-paper)", fontWeight:700, fontSize:13, cursor:"pointer" }}>저장하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

function AddEventSheet({ open, onClose }) {
  const [title, setTitle] = useStateM("");
  const [cat, setCat] = useStateM("업무");
  const [allDay, setAllDay] = useStateM(false);
  const [start, setStart] = useStateM("10:00");
  const [end, setEnd] = useStateM("11:00");
  const [loc, setLoc] = useStateM("");
  const [color, setColor] = useStateM("#ffd95e");
  const cats = [
    { name: "업무",   color: "#ffd95e" },
    { name: "개인",   color: "#cfe7ff" },
    { name: "약속",   color: "#ffb38a" },
    { name: "건강",   color: "#b9e7c9" },
    { name: "기타",   color: "#d4c1f0" },
  ];
  const today = new Date();
  const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${"일월화수목금토"[today.getDay()]})`;

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">새 일정 추가<small>{dateStr}</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* title with color dot */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0 16px", borderBottom:"1px dashed var(--line)" }}>
            <div style={{ width:14, height:14, borderRadius:4, background:color, flexShrink:0, border:"1px solid rgba(0,0,0,0.08)" }} />
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="새 일정"
              style={{ flex:1, fontSize:18, fontWeight:600, border:"none", background:"transparent", color:"var(--ink)", outline:"none" }} />
          </div>

          {/* all day toggle */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px dashed var(--line)" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>종일</span>
            <button onClick={() => setAllDay(!allDay)}
              style={{
                width:44, height:26, borderRadius:999,
                border:"1px solid " + (allDay?"var(--ink)":"var(--line)"),
                background: allDay?"var(--ink)":"transparent",
                padding:0, cursor:"pointer", position:"relative",
              }}>
              <span style={{
                position:"absolute", top:2, left: allDay?20:2,
                width:20, height:20, borderRadius:"50%",
                background: allDay?"var(--bg-paper)":"var(--ink-mute)",
                transition:"left .15s",
              }} />
            </button>
          </div>

          {/* time */}
          {!allDay && (
            <div style={{ display:"flex", gap:8, padding:"14px 0", borderBottom:"1px dashed var(--line)" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:"var(--ink-mute)", marginBottom:4, fontWeight:600 }}>시작</div>
                <input type="time" value={start} onChange={e=>setStart(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", border:"1px solid var(--line)", borderRadius:10, background:"var(--bg-paper)", fontSize:14, fontFamily:"var(--mono)", color:"var(--ink)" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:"var(--ink-mute)", marginBottom:4, fontWeight:600 }}>종료</div>
                <input type="time" value={end} onChange={e=>setEnd(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", border:"1px solid var(--line)", borderRadius:10, background:"var(--bg-paper)", fontSize:14, fontFamily:"var(--mono)", color:"var(--ink)" }} />
              </div>
            </div>
          )}

          {/* category */}
          <div style={{ padding:"14px 0", borderBottom:"1px dashed var(--line)" }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:8, fontWeight:600 }}>분류</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {cats.map(c => (
                <button key={c.name} onClick={() => { setCat(c.name); setColor(c.color); }}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    padding:"7px 12px", borderRadius:999, fontSize:12, fontWeight:600,
                    border:"1px solid " + (cat===c.name?"var(--ink)":"var(--line)"),
                    background: cat===c.name?"var(--ink)":"transparent",
                    color: cat===c.name?"var(--bg-paper)":"var(--ink)",
                    cursor:"pointer",
                  }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* location */}
          <div style={{ padding:"14px 0 4px" }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:6, fontWeight:600 }}>장소 / 메모</div>
            <input value={loc} onChange={e => setLoc(e.target.value)}
              placeholder="예: 회의실 A · 줌 미팅"
              style={{ width:"100%", padding:"11px 12px", border:"1px solid var(--line)", borderRadius:10, background:"var(--bg-paper)", fontSize:13, color:"var(--ink)", outline:"none" }} />
          </div>

          {/* actions */}
          <div style={{ display:"flex", gap:8, marginTop:18 }}>
            <button onClick={onClose} style={{ flex:1, padding:"14px 0", borderRadius:12, border:"1px solid var(--line)", background:"transparent", color:"var(--ink)", fontWeight:600, fontSize:13, cursor:"pointer" }}>취소</button>
            <button onClick={onClose} style={{ flex:2, padding:"14px 0", borderRadius:12, border:"none", background:"var(--ink)", color:"var(--bg-paper)", fontWeight:700, fontSize:13, cursor:"pointer" }}>저장하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

function AddSubSheet({ open, onClose }) {
  const [name, setName] = useStateM("");
  const [price, setPrice] = useStateM("");
  const [cat, setCat] = useStateM("엔터");
  const [day, setDay] = useStateM(1);
  const [cycle, setCycle] = useStateM("월");
  const [pay, setPay] = useStateM("신용카드");
  const cats = [
    { name: "엔터", color: "#ffb38a", ico: "play"  },
    { name: "업무", color: "#d4c1f0", ico: "tag"   },
    { name: "유틸", color: "#cfe7ff", ico: "cloud" },
    { name: "기타", color: "#fff0a8", ico: "bell"  },
  ];
  const presets = [
    { name: "넷플릭스",       price: 17000, cat: "엔터" },
    { name: "유튜브 프리미엄", price: 14900, cat: "엔터" },
    { name: "스포티파이",     price:  7900, cat: "엔터" },
    { name: "노션",            price: 12000, cat: "업무" },
    { name: "ChatGPT Plus",    price: 28000, cat: "업무" },
    { name: "iCloud+",         price:  3300, cat: "유틸" },
  ];
  const cur = cats.find(c => c.name === cat) || cats[0];
  const cycles = ["월", "년", "주"];
  const pays = ["신용카드", "체크카드", "계좌이체", "기타"];
  const fmt = (v) => v ? Number(v).toLocaleString() : "0";

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">새 구독 추가<small>매월 빠져나가는 항목</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* preset chips */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>자주 쓰는 서비스</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginRight: -18, paddingRight: 18, scrollbarWidth: "none" }}>
              {presets.map(p => (
                <button key={p.name} onClick={() => { setName(p.name); setPrice(String(p.price)); setCat(p.cat); }}
                  style={{
                    flex: "0 0 auto", padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    border: "1px solid var(--line)", background: "var(--bg-paper)", color: "var(--ink)",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>{p.name}</button>
              ))}
            </div>
          </div>

          {/* name with icon swatch */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 16px", borderBottom: "1px dashed var(--line)" }}>
            <div className="dfm-tool-ico" style={{ width: 36, height: 36, background: cur.color, borderColor: "rgba(0,0,0,0.06)", flexShrink: 0 }}>
              <Ico name={cur.ico} size={16} />
            </div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="구독 서비스 이름"
              style={{ flex: 1, fontSize: 18, fontWeight: 600, border: "none", background: "transparent", color: "var(--ink)", outline: "none" }} />
          </div>

          {/* price */}
          <div style={{ textAlign: "center", padding: "16px 0 18px", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 4, letterSpacing: 0.5 }}>{cycle}별 결제 금액</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4, fontFamily: "var(--mono)" }}>
              <span style={{ fontSize: 18, color: "#d44", fontWeight: 600 }}>₩</span>
              <input value={fmt(price)} onChange={e => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--mono)", border: "none", background: "transparent", color: "var(--ink)", textAlign: "center", width: "60%", outline: "none" }} />
            </div>
            {/* cycle segmented */}
            <div style={{ display: "inline-flex", gap: 0, marginTop: 10, padding: 3, background: "var(--bg)", borderRadius: 9, border: "1px solid var(--line)" }}>
              {cycles.map(c => (
                <button key={c} onClick={() => setCycle(c)}
                  style={{
                    padding: "5px 14px", borderRadius: 7, fontSize: 11, fontWeight: 600, border: "none",
                    background: cycle === c ? "var(--bg-paper)" : "transparent",
                    color: cycle === c ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer", boxShadow: cycle === c ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}>{c}별</button>
              ))}
            </div>
          </div>

          {/* category */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>분류</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cats.map(c => (
                <button key={c.name} onClick={() => setCat(c.name)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    border: "1px solid " + (cat === c.name ? "var(--ink)" : "var(--line)"),
                    background: cat === c.name ? "var(--ink)" : "transparent",
                    color: cat === c.name ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                  }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* billing day */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>결제일</span>
              <b style={{ fontFamily: "var(--mono)", fontSize: 14 }}>매월 {day}일</b>
            </div>
            <input type="range" min="1" max="31" value={day} onChange={e => setDay(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--ink)" }} />
          </div>

          {/* method */}
          <div style={{ padding: "14px 0 4px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>결제수단</div>
            <div style={{ display: "flex", gap: 6 }}>
              {pays.map(p => (
                <button key={p} onClick={() => setPay(p)}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 11, fontWeight: 600,
                    border: "1px solid " + (pay === p ? "var(--ink)" : "var(--line)"),
                    background: pay === p ? "var(--bg)" : "transparent",
                    color: pay === p ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>취소</button>
            <button onClick={onClose} style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>구독 추가하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchSheet({ open, onClose, onJump }) {
  const [q, setQ] = useStateM("");
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQ("");
    }
  }, [open]);

  // unified search corpus across the app
  const corpus = [
    // 거래
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "스타벅스 강남점",      sub: "11/06 · 식비 · ₩6,800",   tone: "#ffd1b3" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "GS25 편의점",          sub: "11/05 · 식비 · ₩4,200",   tone: "#ffd1b3" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "11월 월급",             sub: "11/01 · 수입 · +₩3,200,000", tone: "#b9e7c9" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "쿠팡 — 생필품",         sub: "11/03 · 쇼핑 · ₩42,500",  tone: "#d4c1f0" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "지하철",                sub: "11/06 · 교통 · ₩1,400",   tone: "#cfe7ff" },
    // 구독
    { kind: "구독",   tab: "menu",     route: "subs", ico: "play",  title: "넷플릭스",       sub: "프리미엄 4K · 매월 8일 · ₩17,000", tone: "#ffb38a" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "music", title: "스포티파이",     sub: "개인 · 매월 12일 · ₩7,900",      tone: "#b9e7c9" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "tag",   title: "노션",            sub: "플러스 · 매월 1일 · ₩12,000",    tone: "#d4c1f0" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "doc",   title: "ChatGPT Plus",    sub: "월간 · 매월 27일 · ₩28,000",     tone: "#d4c1f0" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "cloud", title: "iCloud+",         sub: "200GB · 매월 17일 · ₩3,300",     tone: "#cfe7ff" },
    // 일정
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "디자인 리뷰",          sub: "11/22 · 14:00 — 15:00 · 회의실 A", tone: "#ffd95e" },
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "헬스장",                sub: "11/14 · 19:30 · 강남점",          tone: "#b9e7c9" },
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "민지랑 저녁",           sub: "11/22 · 19:00 · 합정 단골집",      tone: "#ffb38a" },
    // 메모 / 할 일
    { kind: "메모",   tab: "home",     ico: "tag",   title: "이번 주 회고",         sub: "디자인 리뷰 잘 마무리…",          tone: "#fff0a8" },
    { kind: "메모",   tab: "home",     ico: "tag",   title: "살 것",                  sub: "우유 · 계란 · 시리얼 · 바나나",   tone: "#ffd2dc" },
    { kind: "메모",   tab: "home",     ico: "tag",   title: "아이디어",               sub: "잠금화면 위젯 — 오늘 예산 한 줄로", tone: "#d4efdb" },
    { kind: "할 일",  tab: "home",     ico: "check", title: "월말 카드 명세서 정리", sub: "가계부",                          tone: "#fff0a8" },
    { kind: "할 일",  tab: "home",     ico: "check", title: "수요일 회의실 예약",     sub: "업무",                            tone: "#fff0a8" },
    // 도구
    { kind: "도구",   tab: "menu",     ico: "coin",  title: "연봉 계산기",            sub: "실수령액 · 4대 보험",             tone: "#fff0a8" },
    { kind: "도구",   tab: "menu",     ico: "pdf",   title: "이미지 → PDF",           sub: "여러 이미지를 한 파일로",          tone: "#cfe7ff" },
    { kind: "도구",   tab: "menu",     ico: "crop",  title: "이미지 자르기",          sub: "빠른 크롭과 내보내기",             tone: "#d4efdb" },
  ];

  const recent = ["넷플릭스", "스타벅스", "디자인 리뷰", "월급"];
  const trimmed = q.trim().toLowerCase();
  const matches = trimmed
    ? corpus.filter(it =>
        it.title.toLowerCase().includes(trimmed) ||
        it.sub.toLowerCase().includes(trimmed) ||
        it.kind.toLowerCase().includes(trimmed))
    : [];

  // group by kind
  const grouped = matches.reduce((acc, it) => {
    (acc[it.kind] = acc[it.kind] || []).push(it);
    return acc;
  }, {});

  const highlight = (text) => {
    if (!trimmed) return text;
    const i = text.toLowerCase().indexOf(trimmed);
    if (i < 0) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark style={{ background: "var(--yellow)", color: "var(--ink)", padding: "0 1px", borderRadius: 2 }}>
          {text.slice(i, i + trimmed.length)}
        </mark>
        {text.slice(i + trimmed.length)}
      </>
    );
  };

  const goTo = (it) => onJump?.(it.route || it.tab);

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`} style={{ height: "92vh", maxHeight: "92vh" }}>
        <div className="dfm-sheet-grip" />
        {/* search bar */}
        <div style={{ padding: "4px 16px 12px", borderBottom: "1px dashed var(--line)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", background: "var(--bg)",
            border: "1px solid var(--line)", borderRadius: 12,
          }}>
            <Ico name="search" size={16} />
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="거래 · 구독 · 일정 · 메모 검색"
              style={{ flex: 1, fontSize: 14, fontWeight: 500, border: "none", background: "transparent", color: "var(--ink)", outline: "none" }} />
            {q && (
              <button onClick={() => setQ("")} style={{ background: "transparent", border: "none", color: "var(--ink-mute)", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>✕</button>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--ink-mute)", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0, marginLeft: 4 }}>취소</button>
          </div>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "12px 16px 22px", overflowY: "auto" }}>
          {!trimmed && (
            <>
              {/* recent */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>최근 검색</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {recent.map(r => (
                    <button key={r} onClick={() => setQ(r)}
                      style={{
                        padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        border: "1px solid var(--line)", background: "var(--bg-paper)",
                        color: "var(--ink)", cursor: "pointer",
                      }}>{r}</button>
                  ))}
                </div>
              </div>

              {/* shortcuts */}
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>바로가기</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { ico: "wallet", title: "이번 달 가계부",  tone: "#fff0a8", target: "ledger" },
                    { ico: "cal",    title: "11월 캘린더",     tone: "#cfe7ff", target: "calendar" },
                    { ico: "tag",    title: "구독 관리",        tone: "#d4c1f0", target: "subs" },
                    { ico: "bell",   title: "알림 설정",        tone: "#ffd2dc", target: "notif" },
                  ].map(s => (
                    <button key={s.target} onClick={() => onJump?.(s.target)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 12px", borderRadius: 12,
                        border: "1px solid var(--line)", background: "var(--bg-paper)",
                        cursor: "pointer", textAlign: "left",
                      }}>
                      <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: s.tone, borderColor: "rgba(0,0,0,0.06)" }}>
                        <Ico name={s.ico} size={14} />
                      </div>
                      <b style={{ fontSize: 12 }}>{s.title}</b>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {trimmed && matches.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-mute)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>"{q}" 결과가 없어요</div>
              <small style={{ fontSize: 11 }}>다른 단어로 검색해보세요</small>
            </div>
          )}

          {trimmed && matches.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 10, fontWeight: 600 }}>
                {matches.length}개 결과
              </div>
              {Object.entries(grouped).map(([kind, items]) => (
                <div key={kind} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{kind}</div>
                  <div className="dfm-card" style={{ padding: 0 }}>
                    {items.map((it, i) => (
                      <button key={i} onClick={() => goTo(it)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "11px 14px", width: "100%",
                          borderBottom: i < items.length - 1 ? "1px dashed var(--line)" : "none",
                          background: "transparent", border: "none", textAlign: "left",
                          cursor: "pointer", color: "var(--ink)",
                        }}>
                        <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: it.tone, borderColor: "rgba(0,0,0,0.06)", flexShrink: 0 }}>
                          <Ico name={it.ico} size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b style={{ fontSize: 13, display: "block" }}>{highlight(it.title)}</b>
                          <small style={{ fontSize: 11, color: "var(--ink-mute)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{highlight(it.sub)}</small>
                        </div>
                        <Ico name="chevR" size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function EditProfileSheet({ open, onClose, initialName, email, onSave }) {
  const [name, setName] = useStateM(initialName || "");
  const [handle, setHandle] = useStateM("nabi.flow");
  const [bio, setBio] = useStateM("매일의 흐름을 기록 중 ☁️");
  const [emoji, setEmoji] = useStateM("나");
  React.useEffect(() => { if (open) setName(initialName || ""); }, [open, initialName]);

  const presets = ["나", "🦋", "✨", "☁️", "🌸", "🌙", "🍵", "🐱"];

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">프로필 수정<small>이름 · 아바타 · 소개</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* avatar preview */}
          <div style={{ textAlign: "center", padding: "8px 0 18px", borderBottom: "1px dashed var(--line)" }}>
            <div style={{
              width: 88, height: 88, margin: "0 auto", borderRadius: 26,
              background: "var(--yellow)", border: "2px solid var(--ink)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--hand)", fontWeight: 700, fontSize: emoji.length > 1 ? 38 : 42,
            }}>{emoji}</div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {presets.map(p => (
                <button key={p} onClick={() => setEmoji(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 12,
                    border: "1.5px solid " + (emoji === p ? "var(--ink)" : "var(--line)"),
                    background: emoji === p ? "var(--bg)" : "var(--bg-paper)",
                    fontSize: p.length > 1 ? 16 : 18, fontFamily: "var(--hand)", fontWeight: 600,
                    cursor: "pointer",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {/* name */}
          <div style={{ padding: "16px 0 14px", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 6, fontWeight: 600 }}>이름</div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="이름"
              style={{ width: "100%", padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 10,
                background: "var(--bg-paper)", fontSize: 15, fontWeight: 600, color: "var(--ink)", outline: "none" }} />
          </div>

          {/* handle */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 6, fontWeight: 600 }}>사용자명</div>
            <div style={{ display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--bg-paper)" }}>
              <span style={{ color: "var(--ink-mute)", fontSize: 14, fontFamily: "var(--mono)" }}>@</span>
              <input value={handle} onChange={e => setHandle(e.target.value.replace(/[^a-z0-9._]/gi, "").toLowerCase())}
                style={{ flex: 1, padding: "11px 6px", border: "none", background: "transparent",
                  fontSize: 14, fontFamily: "var(--mono)", color: "var(--ink)", outline: "none" }} />
            </div>
          </div>

          {/* email (read-only) */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 6, fontWeight: 600 }}>이메일</div>
            <div style={{ padding: "11px 12px", border: "1px dashed var(--line)", borderRadius: 10,
              background: "var(--bg)", fontSize: 13, color: "var(--ink-mute)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{email}</span>
              <small style={{ fontSize: 10 }}>변경 불가</small>
            </div>
          </div>

          {/* bio */}
          <div style={{ padding: "14px 0 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>한 줄 소개</span>
              <small style={{ fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>{bio.length}/40</small>
            </div>
            <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 40))}
              rows={2}
              placeholder="자신을 소개해주세요"
              style={{ width: "100%", padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 10,
                background: "var(--bg-paper)", fontSize: 13, color: "var(--ink)", outline: "none",
                resize: "none", fontFamily: "inherit" }} />
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>취소</button>
            <button onClick={() => onSave?.(name.trim() || initialName)} style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>저장하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ChangePasswordSheet({ open, onClose, email = "nabi@dayflow.app" }) {
  // 0 · confirm send  ·  1 · sent (waiting)
  const [step, setStep] = useStateM(0);
  const [sending, setSending] = useStateM(false);
  const [resentAt, setResentAt] = useStateM(0);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setStep(0); setSending(false); setResentAt(0); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSend = () => {
    if (sending) return;
    setSending(true);
    setTimeout(() => { setSending(false); setStep(1); }, 600);
  };

  const handleResend = () => {
    setResentAt(Date.now());
    setTimeout(() => setResentAt(0), 2400);
  };

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">비밀번호 변경<small>이메일로 안전하게 재설정해요</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {step === 0 && (
            <div style={{ padding: "8px 0 4px" }}>
              {/* hero */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "12px 0 18px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20, marginBottom: 16,
                  background: "var(--yellow, #ffd84d)", display: "grid", placeItems: "center",
                  fontSize: 28,
                }}>🔑</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                  이메일로 재설정 링크를 보내드려요
                </h2>
                <small style={{ fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.55, maxWidth: 260, display: "block" }}>
                  아래 이메일 주소로 재설정 링크가 전송됩니다.<br />링크를 눌러 새 비밀번호를 설정해주세요.
                </small>
              </div>

              {/* email pill */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 12,
                background: "var(--bg-paper)", border: "1px solid var(--line)",
                marginBottom: 14,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--ink)", color: "var(--bg-paper)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Ico name="bell" size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-mute)", fontWeight: 600, marginBottom: 2 }}>가입한 이메일</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
                </div>
              </div>

              {/* security tip */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,216,77,0.18)", border: "1px solid rgba(255,216,77,0.4)",
                marginBottom: 18,
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>🛡️</span>
                <small style={{ fontSize: 11, color: "var(--ink)", lineHeight: 1.5 }}>
                  보안을 위해 링크는 <b>1시간</b> 동안만 유효해요. 본인이 요청한 게 아니면 무시해도 됩니다.
                </small>
              </div>

              {/* actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>취소</button>
                <button onClick={handleSend} disabled={sending}
                  style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
                    background: "var(--ink)", color: "var(--bg-paper)",
                    fontWeight: 700, fontSize: 13, cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}>
                  {sending ? "보내는 중…" : "재설정 링크 보내기"}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ padding: "12px 0 4px", textAlign: "center" }}>
              {/* mailbox icon */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 18 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: 26,
                  background: "var(--yellow, #ffd84d)",
                  display: "grid", placeItems: "center", fontSize: 44,
                  boxShadow: "0 12px 28px rgba(255,216,77,0.4)",
                }}>📬</div>
                <div style={{
                  position: "absolute", top: -6, right: -10,
                  background: "#4a8d5a", color: "#fff",
                  padding: "4px 10px", borderRadius: 99,
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                  transform: "rotate(8deg)",
                }}>SENT</div>
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                메일을 보냈어요
              </h2>
              <small style={{ fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.55, display: "block", maxWidth: 280, margin: "0 auto 14px" }}>
                받은 편지함에서 이메일을 확인하고<br />링크를 눌러 비밀번호를 다시 만들어주세요
              </small>

              {/* email pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 99,
                background: "var(--bg-paper)", border: "1px solid var(--line)",
                fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
                marginBottom: 18,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4a8d5a" }} />
                {email}
              </div>

              {/* tip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,216,77,0.18)", border: "1px solid rgba(255,216,77,0.4)",
                fontSize: 11, color: "var(--ink)", textAlign: "left",
                marginBottom: 18,
              }}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{ lineHeight: 1.4 }}>메일이 안 보이면 스팸함을 확인해주세요</span>
              </div>

              {/* actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={onClose}
                  style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                    background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  확인
                </button>
                <button onClick={handleResend}
                  style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                    background: "transparent", color: "var(--ink-mute)",
                    fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  {resentAt ? "✓ 다시 보냈어요" : "다시 보내기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function UpgradeSheet({ open, onClose }) {
  const [plan, setPlan] = useStateM("year"); // month | year
  const [confirmed, setConfirmed] = useStateM(false);
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setConfirmed(false); setPlan("year"); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const features = [
    { ico: "tag",    title: "광고 없는 깔끔한 화면",       sub: "무료 플랜의 모든 광고 제거" },
    { ico: "wallet", title: "무제한 기록",                 sub: "거래 · 일정 · 메모 · 할 일 한도 없이" },
    { ico: "cloud",  title: "iCloud 자동 동기화",          sub: "모든 기기에서 실시간 백업" },
    { ico: "moon",   title: "테마 · 위젯 모두 잠금 해제",  sub: "다크 모드 · 잠금화면 위젯 6종" },
    { ico: "doc",    title: "월간 PDF 리포트",             sub: "매월 1일 자동 발송" },
    { ico: "bell",   title: "우선 고객 지원",              sub: "24시간 내 답변 · 1:1 채팅" },
  ];

  const plans = [
    { id: "month", label: "월간",   price: "₩3,900",   sub: "매월 결제",                   badge: null },
    { id: "year",  label: "연간",   price: "₩39,000",  sub: "월 ₩3,250 · 17% 할인",        badge: "BEST" },
  ];

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`} style={{ height: "92vh", maxHeight: "92vh" }}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <div className="ttl" style={{ visibility: "hidden" }}>x</div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px", overflowY: "auto" }}>
          {!confirmed && (
            <>
              {/* hero */}
              <div style={{ textAlign: "center", padding: "8px 0 22px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20, margin: "0 auto 14px",
                  background: "var(--ink)", color: "#ffd84d",
                  display: "grid", placeItems: "center",
                  boxShadow: "0 8px 24px rgba(40,30,10,0.18)",
                }}>
                  <Ico name="coin" size={28} />
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Dayflow Pro</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", fontFamily: "var(--hand)" }}>
                  하루의 흐름,<br />더 깊게 기록해요
                </h2>
                <small style={{ fontSize: 12, color: "var(--ink-mute)" }}>기록을 멈추지 않게 도와드릴게요 ✨</small>
              </div>

              {/* features */}
              <div className="dfm-card" style={{ padding: 0, marginBottom: 18 }}>
                {features.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 14px",
                    borderBottom: i < features.length - 1 ? "1px dashed var(--line)" : "none",
                  }}>
                    <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: "var(--yellow)", borderColor: "var(--yellow-edge)", flexShrink: 0 }}>
                      <Ico name={f.ico} size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: 13, display: "block" }}>{f.title}</b>
                      <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{f.sub}</small>
                    </div>
                    <div style={{ color: "var(--ink-mute)", fontSize: 14 }}>✓</div>
                  </div>
                ))}
              </div>

              {/* plan picker */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {plans.map(p => (
                  <button key={p.id} onClick={() => setPlan(p.id)}
                    style={{
                      position: "relative",
                      padding: "16px 14px",
                      borderRadius: 14,
                      border: "2px solid " + (plan === p.id ? "var(--ink)" : "var(--line)"),
                      background: plan === p.id ? "var(--bg)" : "var(--bg-paper)",
                      cursor: "pointer", textAlign: "left", color: "var(--ink)",
                    }}>
                    {p.badge && (
                      <span style={{
                        position: "absolute", top: -8, right: 10,
                        padding: "3px 8px", borderRadius: 999,
                        background: "var(--ink)", color: "#ffd84d",
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                      }}>{p.badge}</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid " + (plan === p.id ? "var(--ink)" : "var(--line)"),
                        background: plan === p.id ? "var(--ink)" : "transparent",
                        position: "relative", flexShrink: 0,
                      }}>
                        {plan === p.id && (
                          <span style={{ position: "absolute", inset: 3, background: "var(--bg-paper)", borderRadius: "50%" }} />
                        )}
                      </div>
                      <b style={{ fontSize: 13 }}>{p.label}</b>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)", letterSpacing: "-0.01em" }}>{p.price}</div>
                    <small style={{ fontSize: 10, color: "var(--ink-mute)", display: "block", marginTop: 2 }}>{p.sub}</small>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button onClick={() => setConfirmed(true)}
                style={{
                  width: "100%", padding: "16px 0", borderRadius: 14,
                  border: "none", background: "var(--ink)", color: "#ffd84d",
                  fontWeight: 800, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(40,30,10,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                <Ico name="coin" size={16} />
                3일 무료 체험 시작
              </button>
              <small style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 10, color: "var(--ink-mute)", lineHeight: 1.5 }}>
                3일 후 {plan === "year" ? "₩39,000 / 년" : "₩3,900 / 월"} 자동 결제 · 언제든 해지<br />
                약관 · 개인정보처리방침 · 환불정책
              </small>
            </>
          )}

          {confirmed && (
            <div style={{ padding: "22px 0", textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: 24, margin: "0 auto 18px",
                background: "var(--mint, #b9e7c9)",
                display: "grid", placeItems: "center",
                boxShadow: "0 8px 24px rgba(40,30,10,0.12)",
              }}>
                <Ico name="check" size={32} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", fontFamily: "var(--hand)" }}>
                Pro에 오신 것을 환영해요!
              </h2>
              <small style={{ fontSize: 12, color: "var(--ink-mute)", display: "block", marginBottom: 22 }}>
                3일 무료 체험이 시작됐어요 · {plan === "year" ? "연간" : "월간"} 플랜
              </small>

              <div className="dfm-card" style={{ padding: "14px 16px", marginBottom: 18, textAlign: "left", background: "var(--yellow)", borderColor: "var(--yellow-edge)" }}>
                <small style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: 0.5, fontWeight: 700, textTransform: "uppercase" }}>다음 결제일</small>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)", margin: "4px 0 2px" }}>
                  2026년 11월 9일
                </div>
                <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                  {plan === "year" ? "₩39,000 / 년 (연간)" : "₩3,900 / 월"} · Apple ID로 결제
                </small>
              </div>

              <button onClick={onClose}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12,
                  border: "none", background: "var(--ink)", color: "var(--bg-paper)",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                Pro 기능 둘러보기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MobileApp({ initialTab = "home" }) {
  const [tab, setTab] = useStateM(initialTab);
  const [openTxn, setOpenTxn] = useStateM(null);
  const [addTxnOpen, setAddTxnOpen] = useStateM(false);
  const [addEventOpen, setAddEventOpen] = useStateM(false);
  const [addSubOpen, setAddSubOpen] = useStateM(false);
  const [searchOpen, setSearchOpen] = useStateM(false);
  const [upgradeOpen, setUpgradeOpen] = useStateM(false);
  const [timerSetOpen, setTimerSetOpen] = useStateM(false);
  const [timerSettings, setTimerSettings] = useStateM({
    focus: 25, shortBreak: 5, longBreak: 15, sets: 4, sound: "차임", autoStart: false, vibrate: true
  });
  const [menuStack, setMenuStack] = useStateM([]); // ["subs"], ["notif"]
  _openTxnRef = setOpenTxn;

  const onFab = () => {
    // contextual:
    //   menu → calendar → 일정 추가  ·  menu → subs → 구독 추가
    //   ledger / home / community → 거래 추가
    const top = menuStack[menuStack.length - 1];
    if (tab === "menu" && top === "calendar") setAddEventOpen(true);
    else if (tab === "menu" && top === "subs") setAddSubOpen(true);
    else setAddTxnOpen(true);
  };

  // when leaving menu tab, reset stack
  const goTab = (t) => { setTab(t); if (t !== "menu") setMenuStack([]); };
  const pushMenu = (route) => setMenuStack(s => [...s, route]);
  const popMenu  = () => setMenuStack(s => s.slice(0, -1));

  // unified navigate — main tabs go to tabs, sub-routes (subs/notif/salary/loan/crop/pdf/calendar) push menu stack
  const navigate = (route) => {
    const tabs = ["home", "ledger", "community", "menu"];
    if (tabs.includes(route)) { goTab(route); return; }
    // calendar opens as a sub-route inside menu (since it's no longer a bottom tab)
    setTab("menu");
    setMenuStack([route]);
  };

  const menuTop = menuStack[menuStack.length - 1];
  const MenuPage =
    menuTop === "subs"     ? <SubscriptionsScreen onBack={popMenu} onAdd={() => setAddSubOpen(true)} /> :
    menuTop === "notif"    ? <NotificationsScreen onBack={popMenu} /> :
    menuTop === "profile"  ? <ProfileScreen      onBack={popMenu} onUpgrade={() => setUpgradeOpen(true)} /> :
    menuTop === "theme"    ? <ThemeScreen        onBack={popMenu} /> :
    menuTop === "calendar" ? (
      <div>
        <SubHeader title="11월 캘린더" onBack={popMenu} action={<button className="dfm-icon-btn" onClick={() => setAddEventOpen(true)} aria-label="추가"><Ico name="plus" size={18} /></button>} />
        <MobileCalendar />
      </div>
    ) :
    <MobileMenu onNavigate={navigate} onProfile={() => pushMenu("profile")} />;

  const Page = (
    tab === "home"      ? <MobileHome onNavigate={navigate} onAddTxn={() => setAddTxnOpen(true)} onAddEvent={() => setAddEventOpen(true)} /> :
    tab === "ledger"    ? <MobileLedger /> :
    tab === "community" ? <MobileCommunity /> :
    tab === "menu"      ? MenuPage :
    null
  );

  // top greeting differs per tab
  const titleByTab = {
    home:      { greet: "안녕하세요 ☀️", name: "나비님" },
    ledger:    { greet: "11월의 흐름",   name: "가계부" },
    community: { greet: "함께 절약해요", name: "커뮤니티" },
    menu:      { greet: "내 정보",        name: "메뉴" },
  };
  const subTitleByRoute = {
    subs:     { greet: "매월 빠져나가는", name: "구독" },
    notif:    { greet: "언제 알릴까요?",   name: "알림" },
    profile:  { greet: "내 정보 ·",         name: "프로필" },
    theme:    { greet: "내 취향대로",       name: "테마" },
    calendar: { greet: "이번 달 일정",      name: "캘린더" },
  };
  const tt = (tab === "menu" && menuTop && subTitleByRoute[menuTop])
    ? subTitleByRoute[menuTop]
    : (titleByTab[tab] || titleByTab.home);

  return (
    <div className="dfm">
      <div className="dfm-top">
        <div className="dfm-greeting">{tt.greet}<b>{tt.name}</b></div>
        <div className="dfm-top-actions">
          <button className="dfm-icon-btn" onClick={() => setSearchOpen(true)} aria-label="검색"><Ico name="search" size={18} /></button>
          <button className="dfm-icon-btn" onClick={() => navigate("notif")} aria-label="알림 설정">
            <Ico name="bell" size={18} />
            <span className="dot-badge"></span>
          </button>
        </div>
      </div>

      <div className="dfm-body">
        {Page}
      </div>

      <div className="dfm-tabbar">
        <button className={`dfm-tab ${tab === "home" ? "active" : ""}`} onClick={() => goTab("home")}>
          <Ico name="home" />
          <span className="label">홈</span>
        </button>
        <button className={`dfm-tab ${tab === "ledger" ? "active" : ""}`} onClick={() => goTab("ledger")}>
          <Ico name="wallet" />
          <span className="label">가계부</span>
        </button>
        <button className="dfm-tab fab" onClick={onFab}>
          <span className="fab-btn"><Ico name="plus" size={24} /></span>
          <span className="label">{(tab === "menu" && menuStack[menuStack.length - 1] === "calendar") ? "일정" : "거래"}</span>
        </button>
        <button className={`dfm-tab ${tab === "community" ? "active" : ""}`} onClick={() => goTab("community")}>
          <Ico name="users" />
          <span className="label">커뮤니티</span>
        </button>
        <button className={`dfm-tab ${tab === "menu" ? "active" : ""}`} onClick={() => goTab("menu")}>
          <Ico name="menu" />
          <span className="label">메뉴</span>
        </button>
      </div>

      <ReceiptSheet txn={openTxn} onClose={() => setOpenTxn(null)} />
      <AddTxnSheet open={addTxnOpen} onClose={() => setAddTxnOpen(false)} />
      <AddEventSheet open={addEventOpen} onClose={() => setAddEventOpen(false)} />
      <AddSubSheet open={addSubOpen} onClose={() => setAddSubOpen(false)} />
      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} onJump={(target) => { setSearchOpen(false); navigate(target); }} />
      <UpgradeSheet open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <TimerSettingsSheet open={timerSetOpen} onClose={() => setTimerSetOpen(false)} settings={timerSettings} onChange={setTimerSettings} />
    </div>
  );
}

window.MobileApp = MobileApp;
