import { useState, useMemo } from "react";
import { MobileCalEvents } from "@/screens/mobile/tabs/Calendar";
import { openTxnDetail } from "@/screens/mobile/shared/TxnDetailBridge";
import { DOW, MONTHS } from "@/lib/date";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useChecklist } from "@/data/checklist";
import { useStickyNotes, stickyDateLabel } from "@/data/sticky-notes";
import { recent as selectRecent } from "@/data/transactions";
import { inferIcon } from "@/data/transactions";
import { currentMonthSummary, categoryShare } from "@/data/transactions";
import { daysWithEventsInMonth } from "@/data/events";
import { formatSignedWon } from "@/lib/format";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { SwipeRow } from "@/screens/mobile/shared/SwipeRow";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/mobile/mobile.module.css";

export const MobileHome = ({ onNavigate, _onAddTxn, _onAddEvent }: any) => {
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

  // 스티커 메모 (오늘의 메모) — 실데이터. hook 이 최대 3개로 soft-cap.
  const { data: stickyNotes } = useStickyNotes();

  // 이번 달 머니플로우 — 실 거래 기반 집계.
  const monthLabel = MONTHS[new Date().getMonth()] ?? "";
  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const balance = summary.net;
  // 전월 순액 대비 증감률(%).
  const deltaPct = useMemo(() => {
    const now = new Date();
    const p = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const key = `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, "0")}`;
    let inc = 0;
    let exp = 0;
    for (const t of txnsAll) {
      if (!t.date.startsWith(key)) continue;
      if (t.type === "in") inc += t.amount;
      else exp += Math.abs(t.amount);
    }
    const prevNet = inc - exp;
    if (prevNet === 0) return 0;
    return Math.round(((balance - prevNet) / Math.abs(prevNet)) * 1000) / 10;
  }, [txnsAll, balance]);
  // 카테고리 지출 분해 — 상위 4 + 나머지(기타).
  const CAT_COLORS = ["#ffd84d", "#ffb38a", "#b9e7c9", "#d4c1f0", "#d8d2c2"];
  const segments = useMemo(() => {
    const shares = categoryShare(txnsAll, "expense");
    const top = shares
      .slice(0, 4)
      .map((s, i) => ({ label: s.cat, pct: s.pct, color: CAT_COLORS[i]! }));
    const restPct =
      Math.round(shares.slice(4).reduce((a, s) => a + s.pct, 0) * 10) / 10;
    return restPct > 0
      ? [...top, { label: "기타", pct: restPct, color: CAT_COLORS[4]! }]
      : top;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnsAll]);

  // calendar — 현재 연/월 기준 실제 그리드 + 이벤트 표시일.
  const todayDate = new Date();
  const today = todayDate.getDate();
  const calYear = todayDate.getFullYear();
  const calMonth = todayDate.getMonth(); // 0-based
  const { data: monthEvents } = useEvents();
  const eventDaySet = useMemo(
    () => daysWithEventsInMonth(monthEvents, calYear, calMonth),
    [monthEvents, calYear, calMonth],
  );
  const eventDays = useMemo(() => [...eventDaySet], [eventDaySet]);
  const cells: { d: number; muted?: boolean }[] = [];
  const firstDow = new Date(calYear, calMonth, 1).getDay(); // 0=일
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ d: prevMonthDays - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d });
  let trailing = 1;
  while (cells.length < 42 && (cells.length % 7 !== 0 || cells.length < 35))
    cells.push({ d: trailing++, muted: true });

  return (
    <>
      <SectionHeader title="오늘의 메모" action="전체" />
      <div className={styles.dfmNotesRailWrap}>
        <div className={styles.dfmNotesRail}>
          {stickyNotes.map((n) => (
            <div
              key={n.id}
              className={`${styles.dfmNote} ${styles[n.color] ?? styles.yellow}`}
            >
              <div className={styles.dfmNoteTitle}>
                {n.emoji ? `${n.emoji} ` : ""}
                {n.title}
              </div>
              <div className={styles.dfmNoteBody}>{n.text}</div>
              <div className={styles.dfmNoteFoot}>
                <span>{stickyDateLabel(n)}</span>
                <span>{n.author ?? "나"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader
        title="오늘 할 일"
        action={`${doneCount} / ${todos.length}`}
      />
      <div className={styles.dfmCard}>
        <div className={styles.dfmChecklist}>
          {todos.map((t, i) => (
            <SwipeRow key={i} onDelete={() => removeTodo(i)}>
              <div className={styles.dfmCheckRow} {...pressable(() => toggle(i))}>
                <div
                  className={`${styles.dfmCheckBox} ${t.done ? styles.on : ""}`}
                >
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
                <div
                  className={`${styles.dfmCheckText} ${t.done ? styles.done : ""}`}
                >
                  {t.text}
                </div>
                <div className={styles.dfmCheckTag}>{t.tag}</div>
              </div>
            </SwipeRow>
          ))}
          <div
            role="presentation"
            className={`${styles.dfmCheckRow} ${styles.dfmTodoAdd}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.dfmCheckBox} ${styles.add}`}
              onClick={addTodo}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  addTodo();
                }
              }}
              role="button"
              tabIndex={0}
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
              className={styles.dfmTodoInput}
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
      <div className={styles.dfmMoney}>
        <div className={styles.dfmMoneyH}>
          <div>
            <div className={styles.label}>{monthLabel} 잔액</div>
            <div className={styles.amount}>{formatSignedWon(balance)}</div>
          </div>
          {deltaPct !== 0 && (
            <div className={styles.delta}>
              {deltaPct > 0 ? "+" : ""}
              {deltaPct}%
            </div>
          )}
        </div>
        <div className={styles.dfmMoneyBar}>
          {segments.map((s) => (
            <span
              key={s.label}
              style={{ width: `${s.pct}%`, background: s.color }}
            />
          ))}
        </div>
        <div className={styles.dfmMoneyLegend}>
          {segments.map((s) => (
            <span key={s.label}>
              <span className={styles.lgDot} style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>

        <div className={styles.dfmMoneyList}>
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
              <div
                className={styles.dfmMoneyRow}
                {...pressable(() => openTxnDetail(t))}
              >
                <div className={styles.ico}>
                  <Ico name={t.ico} size={16} />
                </div>
                <div className={styles.who}>
                  {t.name}
                  <small>{t.sub}</small>
                </div>
                <div
                  className={`${styles.val} ${t.amount < 0 ? styles.expense : styles.income}`}
                >
                  {t.amount < 0 ? "-" : "+"}
                  {Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            </SwipeRow>
          ))}
        </div>
      </div>

      <SectionHeader
        title={monthLabel}
        action="전체 캘린더"
        onAction={() => onNavigate?.("calendar")}
      />
      <div className={styles.dfmCal}>
        <div className={styles.dfmCalH}>
          <div className={styles.month}>
            {calYear} · {monthLabel}
          </div>
          <div className={styles.dfmCalNav}>
            <button>
              <Ico name="chevL" size={14} />
            </button>
            <button>
              <Ico name="chevR" size={14} />
            </button>
          </div>
        </div>
        <div className={styles.dfmCalGrid}>
          {DOW.map((d, i) => (
            <div key={i} className={styles.dfmCalDow}>
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            const isToday = !c.muted && c.d === today;
            const hasEvent = !c.muted && eventDays.includes(c.d);
            return (
              <div
                key={i}
                className={[
                  styles.dfmCalDay,
                  c.muted ? styles.muted : "",
                  isToday ? styles.today : "",
                  hasEvent ? styles.hasEvent : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
