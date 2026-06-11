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
import styles from "@/screens/mobile/mobile.module.css";

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
      <div className={styles.dfmNotesRailWrap}>
        <div className={styles.dfmNotesRail}>
          <div className={`${styles.dfmNote} ${styles.yellow}`}>
            <div className={styles.dfmNoteTitle}>이번 주 회고</div>
            <div className={styles.dfmNoteBody}>
              디자인 리뷰 잘 마무리. 다음 주는 앱 버전 마이그레이션 작업이 메인.
            </div>
            <div className={styles.dfmNoteFoot}>
              <span>월 11/24</span>
              <span>·</span>
            </div>
          </div>
          <div className={`${styles.dfmNote} ${styles.pink}`}>
            <div className={styles.dfmNoteTitle}>살 것</div>
            <div className={styles.dfmNoteBody}>
              우유 · 계란 · 시리얼 · 바나나. 빵집 들러서 캄파뉴 한 덩이도.
            </div>
            <div className={styles.dfmNoteFoot}>
              <span>화 11/25</span>
              <span>5</span>
            </div>
          </div>
          <div className={`${styles.dfmNote} ${styles.mint}`}>
            <div className={styles.dfmNoteTitle}>아이디어</div>
            <div className={styles.dfmNoteBody}>
              Dayflow에 위젯 화면 — 잠금화면에서 오늘 예산 한 줄로 보이게.
            </div>
            <div className={styles.dfmNoteFoot}>
              <span>오늘</span>
              <span>💡</span>
            </div>
          </div>
          <div className={`${styles.dfmNote} ${styles.add}`}>+ 새 메모</div>
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
              <div className={styles.dfmCheckRow} onClick={() => toggle(i)}>
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
            <div className={styles.label}>11월 잔액</div>
            <div className={styles.amount}>+₩ 842,300</div>
          </div>
          <div className={styles.delta}>+12.4%</div>
        </div>
        <div className={styles.dfmMoneyBar}>
          <span style={{ width: "42%", background: "#ffd84d" }} />
          <span style={{ width: "26%", background: "#ffb38a" }} />
          <span style={{ width: "16%", background: "#b9e7c9" }} />
          <span style={{ width: "10%", background: "#d4c1f0" }} />
          <span style={{ width: "6%", background: "#d8d2c2" }} />
        </div>
        <div className={styles.dfmMoneyLegend}>
          <span>
            <span className={styles.lgDot} style={{ background: "#ffd84d" }} />
            식비
          </span>
          <span>
            <span className={styles.lgDot} style={{ background: "#ffb38a" }} />
            교통
          </span>
          <span>
            <span className={styles.lgDot} style={{ background: "#b9e7c9" }} />
            쇼핑
          </span>
          <span>
            <span className={styles.lgDot} style={{ background: "#d4c1f0" }} />
            구독
          </span>
          <span>
            <span className={styles.lgDot} style={{ background: "#d8d2c2" }} />
            기타
          </span>
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
                onClick={() => openTxnDetail(t)}
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
        title="11월"
        action="전체 캘린더"
        onAction={() => onNavigate?.("calendar")}
      />
      <div className={styles.dfmCal}>
        <div className={styles.dfmCalH}>
          <div className={styles.month}>2026 · 11월</div>
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
