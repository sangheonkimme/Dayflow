import { useState, useEffect, useMemo } from "react";
import { MobileCalEvents } from "@/screens/mobile/tabs/Calendar";
import { openTxnDetail } from "@/screens/mobile/shared/TxnDetailBridge";
import { DOW } from "@/lib/date";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useChecklist } from "@/data/checklist";
import { recent as selectRecent } from "@/data/transactions";
import { inferIcon } from "@/data/transactions";
import { daysWithEventsInMonth } from "@/data/events";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { SwipeRow } from "@/screens/mobile/shared/SwipeRow";

export const MobileHome = ({ onNavigate, onAddTxn, onAddEvent }: any) => {
  const {
    data: todoTasks,
    upsert: upsertTodo,
    remove: removeTodoById,
  } = useChecklist();
  // Adapt ChecklistTask → mobile shape (text/tag/done) for the existing render.
  const todos = useMemo(
    () =>
      todoTasks.map((t) => ({
        id: t.id,
        text: t.text,
        done: t.done,
        tag: t.time || "할 일",
      })),
    [todoTasks],
  );

  const { all: txnsAll, remove: removeTxnById } = useTransactions();
  const txns = useMemo(
    () =>
      selectRecent(txnsAll, 3).map((t) => ({
        id: t.id,
        ico: inferIcon(t),
        name: t.label,
        sub: `${t.date.slice(5).replace("-", ".")}${t.time ? " " + t.time : ""}`,
        amount: t.amount,
        cat: t.cat || "기타",
      })),
    [txnsAll],
  );

  const removeTxn = (i) => {
    const id = txns[i]?.id;
    if (id != null) removeTxnById(id);
  };
  const editTxn = (i: number) => {
    const t = txnsAll.find((x) => x.id === txns[i]?.id);
    if (t) openTxnDetail(t);
  };
  const [newTodo, setNewTodo] = useState("");
  const toggle = (i) => {
    const id = todos[i]?.id;
    if (id == null) return;
    const t = todoTasks.find((x) => x.id === id);
    if (t) upsertTodo({ ...t, done: !t.done });
  };
  const removeTodo = (i) => {
    const id = todos[i]?.id;
    if (id != null) removeTodoById(id);
  };
  const addTodo = () => {
    const v = newTodo.trim();
    if (!v) return;
    upsertTodo({ id: Date.now(), text: v, done: false, time: "지금" });
    setNewTodo("");
  };
  const doneCount = todos.filter((t) => t.done).length;

  // calendar event-days derived from real events for the current month.
  const todayDate = new Date();
  const today = todayDate.getDate();
  const { data: monthEvents } = useEvents();
  const eventDaySet = useMemo(
    () =>
      daysWithEventsInMonth(
        monthEvents,
        todayDate.getFullYear(),
        todayDate.getMonth(),
      ),
    [monthEvents, todayDate],
  );
  const eventDays = useMemo(() => [...eventDaySet], [eventDaySet]);
  const cells: { d: number; muted?: boolean }[] = [];
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
            <div className="dfm-note-body">
              디자인 리뷰 잘 마무리. 다음 주는 앱 버전 마이그레이션 작업이 메인.
            </div>
            <div className="dfm-note-foot">
              <span>월 11/24</span>
              <span>·</span>
            </div>
          </div>
          <div className="dfm-note pink">
            <div className="dfm-note-title">살 것</div>
            <div className="dfm-note-body">
              우유 · 계란 · 시리얼 · 바나나. 빵집 들러서 캄파뉴 한 덩이도.
            </div>
            <div className="dfm-note-foot">
              <span>화 11/25</span>
              <span>5</span>
            </div>
          </div>
          <div className="dfm-note mint">
            <div className="dfm-note-title">아이디어</div>
            <div className="dfm-note-body">
              Dayflow에 위젯 화면 — 잠금화면에서 오늘 예산 한 줄로 보이게.
            </div>
            <div className="dfm-note-foot">
              <span>오늘</span>
              <span>💡</span>
            </div>
          </div>
          <div className="dfm-note add">+ 새 메모</div>
        </div>
      </div>

      <SectionHeader
        title="오늘 할 일"
        action={`${doneCount} / ${todos.length}`}
      />
      <div className="dfm-card">
        <div className="dfm-checklist">
          {todos.map((t, i) => (
            <SwipeRow key={i} onDelete={() => removeTodo(i)}>
              <div className="dfm-check-row" onClick={() => toggle(i)}>
                <div className={`dfm-check-box ${t.done ? "on" : ""}`}>
                  {t.done && (
                    <svg width="12" height="10" viewBox="0 0 12 10">
                      <path
                        d="M1 5l3 3L11 1"
                        stroke="#ffe27a"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className={`dfm-check-text ${t.done ? "done" : ""}`}>
                  {t.text}
                </div>
                <div className="dfm-check-tag">{t.tag}</div>
              </div>
            </SwipeRow>
          ))}
          <div
            className="dfm-check-row dfm-todo-add"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="dfm-check-box add"
              onClick={addTodo}
              role="button"
              aria-label="할 일 추가"
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M6 2v8M2 6h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              className="dfm-todo-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="할 일 추가… (Enter로 추가)"
            />
          </div>
        </div>
      </div>

      <SectionHeader
        title="이번 달 머니플로우"
        action="자세히"
        onAction={() => onNavigate?.("ledger")}
      />
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
          <span>
            <span className="lg-dot" style={{ background: "#ffd84d" }} />
            식비
          </span>
          <span>
            <span className="lg-dot" style={{ background: "#ffb38a" }} />
            교통
          </span>
          <span>
            <span className="lg-dot" style={{ background: "#b9e7c9" }} />
            쇼핑
          </span>
          <span>
            <span className="lg-dot" style={{ background: "#d4c1f0" }} />
            구독
          </span>
          <span>
            <span className="lg-dot" style={{ background: "#d8d2c2" }} />
            기타
          </span>
        </div>

        <div className="dfm-money-list">
          {txns.map((t, i) => (
            <SwipeRow
              key={i}
              actions={[
                {
                  label: "수정",
                  color: "edit",
                  icon: "edit",
                  onClick: () => editTxn(i),
                },
                {
                  label: "삭제",
                  color: "delete",
                  icon: "trash",
                  onClick: () => removeTxn(i),
                },
              ]}
            >
              <div className="dfm-money-row" onClick={() => openTxnDetail(t)}>
                <div className="ico">
                  <Ico name={t.ico} size={16} />
                </div>
                <div className="who">
                  {t.name}
                  <small>{t.sub}</small>
                </div>
                <div className={"val " + (t.amount < 0 ? "expense" : "income")}>
                  {t.amount < 0 ? "-" : "+"}
                  {Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            </SwipeRow>
          ))}
        </div>
      </div>

      <SectionHeader
        title="11월"
        action="전체 캘린더"
        onAction={() => onNavigate?.("calendar")}
      />
      <div className="dfm-cal">
        <div className="dfm-cal-h">
          <div className="month">2026 · 11월</div>
          <div className="dfm-cal-nav">
            <button>
              <Ico name="chevL" size={14} />
            </button>
            <button>
              <Ico name="chevR" size={14} />
            </button>
          </div>
        </div>
        <div className="dfm-cal-grid">
          {DOW.map((d, i) => (
            <div key={i} className="dfm-cal-dow">
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            const isToday = !c.muted && c.d === today;
            const hasEvent = !c.muted && eventDays.includes(c.d);
            return (
              <div
                key={i}
                className={`dfm-cal-day ${c.muted ? "muted" : ""} ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}`}
              >
                {c.d}
              </div>
            );
          })}
        </div>
        <MobileCalEvents />
      </div>
    </>
  );
};

// ────────────────────────────────────────────────
// MobileCalEvents — today's events for MobileHome bottom strip
// ────────────────────────────────────────────────
