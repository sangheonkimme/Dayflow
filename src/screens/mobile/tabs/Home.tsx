import { useState, useMemo } from "react";
import { MobileCalEvents } from "@/screens/mobile/tabs/Calendar";
import { openTxnDetail } from "@/screens/mobile/shared/TxnDetailBridge";
import { DOW, MONTHS } from "@/lib/date";
import {
  useTransactions,
  recent as selectRecent,
  inferIcon,
  inferPayday,
  currentMonthSummary,
  categoryShare,
} from "@/data/transactions";
import { useEvents, daysWithEventsInMonth } from "@/data/events";
import { useChecklist } from "@/data/checklist";
import { useStickyNotes, stickyDateLabel } from "@/data/sticky-notes";
import { useDraftField } from "@/lib/useDraftField";
import { formatSignedWon } from "@/lib/format";
import type { StickyColor } from "@/types";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { SwipeRow } from "@/screens/mobile/shared/SwipeRow";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/mobile/mobile.module.css";

// 카테고리 → 막대/범례 색상. categoryShare 결과를 색칠하는 용도.
const CAT_COLORS: Record<string, string> = {
  식비: "#ffd84d",
  외식: "#ffc24d",
  주거: "#f4a26b",
  교통: "#ffb38a",
  쇼핑: "#b9e7c9",
  여가: "#a9d8f0",
  구독: "#d4c1f0",
  건강: "#9be7d4",
  도서: "#e0c9a8",
  급여: "#9ed1ad",
  부수입: "#9ed1ad",
  환불: "#9ed1ad",
  기타: "#d8d2c2",
};
const catColor = (c: string) => CAT_COLORS[c] ?? "#d8d2c2";

const STICKY_PALETTE: StickyColor[] = ["yellow", "pink", "blue"];

export const MobileHome = ({ onNavigate, _onAddTxn, _onAddEvent }: any) => {
  // ── 오늘 할 일 (체크리스트) ──
  const {
    data: todoTasks,
    upsert: upsertTodo,
    remove: removeTodoById,
  } = useChecklist();
  // ChecklistTask → 모바일 렌더용 shape(text/tag/done) 어댑트.
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

  // ── 거래 ──
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

  // 이번 달 머니플로우 요약 — PC MoneyFlow 와 동일 derive.
  // 이번 달 거래가 없으면 월급(3.2M) fallback 으로 헤드라인 숫자를 유지.
  const money = useMemo(() => {
    const now = new Date();
    const summary = currentMonthSummary(txnsAll);
    const paydaySum = txnsAll
      .filter((t) => t.date.startsWith(summary.key) && inferPayday(t))
      .reduce((s, t) => s + t.amount, 0);
    const income = paydaySum || 3_200_000;
    const balance = income - summary.expense;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
    const shares = categoryShare(txnsAll, "expense").filter((s) => s.pct > 0);
    return { monthLabel: MONTHS[now.getMonth()], balance, savingsRate, shares };
  }, [txnsAll]);

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

  // ── 오늘의 메모 (스티커) ──
  const { data: notes, upsert: upsertNote, remove: removeNote } = useStickyNotes();
  const addNote = () => {
    upsertNote({
      id: Date.now(),
      color: STICKY_PALETTE[notes.length % STICKY_PALETTE.length],
      title: "새 메모",
      emoji: "📝",
      text: "",
      date: new Date().toISOString(),
      author: "나",
    });
  };
  const patchNote = (id, patch) => {
    const n = notes.find((x) => x.id === id);
    if (n) upsertNote({ ...n, ...patch });
  };

  // ── 미니 캘린더 (현재 월 실제 그리드 + 이전/다음 달 네비) ──
  const todayDate = new Date();
  const today = todayDate.getDate();
  const { data: monthEvents } = useEvents();
  const [viewDate, setViewDate] = useState(() => new Date());
  const vYear = viewDate.getFullYear();
  const vMonth = viewDate.getMonth();
  const isCurrentMonth =
    vYear === todayDate.getFullYear() && vMonth === todayDate.getMonth();
  const eventDays = useMemo(
    () => [...daysWithEventsInMonth(monthEvents, vYear, vMonth)],
    [monthEvents, vYear, vMonth],
  );
  const cells = useMemo(() => {
    const firstDow = new Date(vYear, vMonth, 1).getDay(); // 0=일
    const daysInMonth = new Date(vYear, vMonth + 1, 0).getDate();
    const prevDays = new Date(vYear, vMonth, 0).getDate();
    const arr: { d: number; muted?: boolean }[] = [];
    for (let i = 0; i < firstDow; i++)
      arr.push({ d: prevDays - firstDow + 1 + i, muted: true });
    for (let i = 1; i <= daysInMonth; i++) arr.push({ d: i });
    let nd = 1;
    while (arr.length % 7 !== 0 || arr.length < 35)
      arr.push({ d: nd++, muted: true });
    return arr;
  }, [vYear, vMonth]);
  const goPrevMonth = () => setViewDate(new Date(vYear, vMonth - 1, 1));
  const goNextMonth = () => setViewDate(new Date(vYear, vMonth + 1, 1));

  return (
    <>
      <SectionHeader title="오늘의 메모" action="전체" />
      <div className={styles.dfmNotesRailWrap}>
        <div className={styles.dfmNotesRail}>
          {notes.map((n) => (
            <MobileStickyCard
              key={n.id}
              note={n}
              onPatch={patchNote}
              onRemove={removeNote}
            />
          ))}
          {notes.length < 3 && (
            <button
              type="button"
              className={`${styles.dfmNote} ${styles.add}`}
              onClick={addNote}
              aria-label="새 메모 추가"
            >
              + 새 메모
            </button>
          )}
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
            <div className={styles.label}>{money.monthLabel} 잔액</div>
            <div className={styles.amount}>{formatSignedWon(money.balance)}</div>
          </div>
          <div className={styles.delta}>{money.savingsRate}% 남음</div>
        </div>
        {money.shares.length > 0 && (
          <>
            <div className={styles.dfmMoneyBar}>
              {money.shares.map((s) => (
                <span
                  key={s.cat}
                  style={{ width: `${s.pct}%`, background: catColor(s.cat) }}
                />
              ))}
            </div>
            <div className={styles.dfmMoneyLegend}>
              {money.shares.slice(0, 5).map((s) => (
                <span key={s.cat}>
                  <span
                    className={styles.lgDot}
                    style={{ background: catColor(s.cat) }}
                  />
                  {s.cat}
                </span>
              ))}
            </div>
          </>
        )}

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
        title={MONTHS[vMonth]}
        action="전체 캘린더"
        onAction={() => onNavigate?.("calendar")}
      />
      <div className={styles.dfmCal}>
        <div className={styles.dfmCalH}>
          <div className={styles.month}>
            {vYear} · {MONTHS[vMonth]}
          </div>
          <div className={styles.dfmCalNav}>
            <button type="button" onClick={goPrevMonth} aria-label="이전 달">
              <Ico name="chevL" size={14} />
            </button>
            <button type="button" onClick={goNextMonth} aria-label="다음 달">
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
            const isToday = isCurrentMonth && !c.muted && c.d === today;
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
// MobileStickyCard — 인라인 편집(제목/본문) + 삭제. 편집은 useDraftField
// 로 blur 시 1회 commit (한글 IME 안전).
// ────────────────────────────────────────────────
function MobileStickyCard({ note, onPatch, onRemove }: any) {
  const title = useDraftField<string>({
    value: note.title ?? "",
    onCommit: (v) => onPatch(note.id, { title: v }),
  });
  const body = useDraftField<string>({
    value: note.text ?? "",
    onCommit: (v) => onPatch(note.id, { text: v }),
  });
  const color: StickyColor = STICKY_PALETTE.includes(note.color)
    ? note.color
    : "yellow";

  return (
    <div className={`${styles.dfmNote} ${styles[color]}`}>
      <button
        type="button"
        className={styles.dfmNoteClose}
        onClick={() => onRemove(note.id)}
        aria-label="메모 삭제"
      >
        <Ico name="x" size={12} />
      </button>
      <input
        className={styles.dfmNoteTitleInput}
        value={title.value}
        onChange={(e) => title.setDraft(e.target.value)}
        onBlur={title.commit}
        placeholder="제목"
        aria-label="메모 제목"
      />
      <textarea
        className={styles.dfmNoteBodyInput}
        value={body.value}
        onChange={(e) => body.setDraft(e.target.value)}
        onBlur={body.commit}
        placeholder="메모 입력…"
        aria-label="메모 내용"
      />
      <div className={styles.dfmNoteFoot}>
        <span>{stickyDateLabel(note)}</span>
        <span>·</span>
      </div>
    </div>
  );
}
