// @ts-nocheck
import { useMemo } from 'react';
import { Icon } from '@/components/icons';
import { formatWon, formatSignedWon } from '@/lib/format';
import { DOW } from '@/lib/date';
import { useTransactions } from '@/data/hooks/useTransactions';
import { useEvents } from '@/data/hooks/useEvents';
import {
  monthlyTotals,
  currentMonthSummary,
  recent as selectRecent,
} from '@/data/selectors/transactions';
import { inferIcon, inferPayday } from '@/data/selectors/derived';
import {
  daysWithEventsInMonth,
  upcoming as upcomingEvents,
} from '@/data/selectors/events';

// ============================================================
// MONEY FLOW
// ============================================================
function MoneyFlow({ onAdd, onOpenLedger, onEditTxn }) {
  const { all: txnsAll } = useTransactions();

  const { in: dataIn, out: dataOut, months } = useMemo(
    () => monthlyTotals(txnsAll),
    [txnsAll],
  );
  const data = dataIn.map((v, i) => ({ in: v, out: dataOut[i] ?? 0 }));
  const max = Math.max(90, ...dataIn, ...dataOut);

  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const txns = useMemo(() => selectRecent(txnsAll, 4), [txnsAll]);

  const income = summary.income || 3200000;
  const expense = summary.expense;
  const balance = summary.net;
  const budgetPct = income > 0 ? Math.round((expense / income) * 100) : 0;
  const daysToPayday = 28;

  const fmt = formatSignedWon;
  const won = formatWon;

  return (
    <div className="money-card col-7">
      <div className="card-head">
        <div>
          <div className="card-title"><Icon name="wallet" size={16} />가계부 — {months[months.length - 1]}</div>
          <div className="card-sub">월급일까지 D-{daysToPayday} · 이번 달 흐름을 한눈에</div>
        </div>
        <button className="timer-btn primary" onClick={onAdd}>+ 내역 추가</button>
      </div>

      <div className="money-summary">
        <div className="money-stat income">
          <div className="lbl">월급 (실수령)</div>
          <div className="val">{won(income)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>매월 25일 입금</div>
        </div>
        <div className="money-stat expense">
          <div className="lbl">이번 달 지출</div>
          <div className="val">{won(expense)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>예산 {budgetPct}% 사용</div>
        </div>
        <div className="money-stat">
          <div className="lbl">남은 예산</div>
          <div className="val" style={{ color: balance > 500000 ? "#2d7a3a" : "var(--red)" }}>{won(balance)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>D-{daysToPayday}까지 사용 가능</div>
        </div>
      </div>

      <div className="budget-meter">
        <div className="budget-meter-track">
          <div className="budget-meter-fill" style={{ width: budgetPct + "%" }} />
        </div>
        <div className="budget-meter-labels">
          <span>0</span>
          <span><b>{budgetPct}%</b> 사용 중</span>
          <span>{won(income)}</span>
        </div>
      </div>

      <div className="bars">
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", gap: 2, alignItems: "stretch", justifyContent: "flex-end" }}>
            <div className="bar in" style={{ height: `${(d.in / max) * 60}%` }} />
            <div className="bar out" style={{ height: `${(d.out / max) * 40}%` }} />
          </div>
        ))}
      </div>
      <div className="bars-axis">
        {months.map(m => <span key={m}>{m}</span>)}
      </div>

      <div className="txns">
        {txns.map(t => (
          <div key={t.id} className="txn">
            <div className="txn-ico"><Icon name={inferIcon(t)} size={14} /></div>
            <div className="txn-label">
              {t.label} {inferPayday(t) && <span className="tag" style={{ background: "#e6f4ea", borderColor: "#9ed1ad", color: "#2d7a3a", marginLeft: 4 }}>월급</span>}
              <small>{t.note}</small>
            </div>
            <div className={"txn-amount " + t.type}>{fmt(t.amount)}</div>
            <button className="txn-edit-btn" onClick={() => onEditTxn && onEditTxn(t)} title="수정">
              <Icon name="note" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MINI CALENDAR
// ============================================================
function MiniCalendar({ onOpen, memos, quickMemo, setQuickMemo, addQuickMemo, onEditEvent }) {
  const today = new Date();
  const yr = today.getFullYear(), mo = today.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const daysPrev = new Date(yr, mo, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: daysPrev - i, muted: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i });
  while (cells.length < 42) cells.push({ d: cells.length - daysInMonth - firstDay + 1, muted: true });

  const { data: events } = useEvents();
  const eventDays = useMemo(() => daysWithEventsInMonth(events, yr, mo), [events, yr, mo]);
  const upcoming = useMemo(() => upcomingEvents(events, 2, today), [events]);
  const monthEventCount = events.filter(e =>
    e.date.startsWith(`${yr}-${String(mo + 1).padStart(2, '0')}-`),
  ).length;
  const dow = DOW;

  const formatTime = (e) => {
    if (!e.startTime) return "";
    const [h, m] = e.startTime.split(":").map(n => parseInt(n, 10));
    const ampm = h < 12 ? "오전" : "오후";
    const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    let label = `${ampm} ${hh}:${String(m).padStart(2, "0")}`;
    if (e.endTime) {
      const [eh, em] = e.endTime.split(":").map(n => parseInt(n, 10));
      const ehh = eh === 0 ? 12 : eh > 12 ? eh - 12 : eh;
      label += ` — ${ehh}:${String(em).padStart(2, "0")}`;
    }
    return label;
  };

  return (
    <div className="cal-card col-5">
      <div className="card-head">
        <div>
          <div className="card-title"><Icon name="cal" size={16} />{yr}.{String(mo+1).padStart(2,"0")}</div>
          <div className="card-sub">이번 달 일정 {monthEventCount}개</div>
        </div>
        <div className="row" style={{ gap: 4 }}>
          <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={onOpen} title="전체 보기">⤢</button>
        </div>
      </div>
      <div className="cal-grid">
        {dow.map(d => <div key={d} className="dow">{d}</div>)}
        {cells.map((c, i) => {
          const isToday = !c.muted && c.d === today.getDate();
          const has = !c.muted && eventDays.has(c.d);
          return (
            <div key={i} className={"cal-day" + (c.muted ? " muted" : "") + (isToday ? " today" : "") + (has ? " has" : "")}>
              {c.d}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
        {upcoming.map((ev, i) => (
          <div key={ev.id} className="upc row" style={{ gap: 10, fontSize: 12 }}>
            <span style={{ width: 4, height: 28, background: ev.color || "var(--ink)", borderRadius: 99 }} />
            <div style={{ flex: 1 }}>
              <b>{ev.title}</b>
              <div className="muted" style={{ fontSize: 11 }}>{formatTime(ev)}</div>
            </div>
            {i === 0 && <span className="tag live">곧</span>}
            <button className="upc-edit-btn" onClick={() => onEditEvent && onEditEvent(ev)} title="수정">
              <Icon name="note" size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="quick-memo">
        <span className="hand">한 줄 메모</span>
        <input
          placeholder="떠오른 생각을 빠르게 적어두세요"
          value={quickMemo || ""}
          onChange={(e) => setQuickMemo && setQuickMemo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addQuickMemo && addQuickMemo()}
        />
        <button onClick={() => addQuickMemo && addQuickMemo()}>저장</button>
      </div>
      {memos && memos.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {memos.slice(0, 2).map((m, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--ink-soft)", padding: "4px 8px", background: "var(--card)", borderRadius: 6, borderLeft: "3px solid var(--yellow-edge)" }}>
              · {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ============================================================
// TOOL CARDS
// ============================================================
function ToolCard({ icon, title, desc, items, onClick }) {
  return (
    <div className="tool-card col-4" onClick={onClick}>
      <div className="tool-arrow"><Icon name="arrow" size={16} /></div>
      <div className="tool-icon"><Icon name={icon} size={18} /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {items && (
        <ul>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </div>
  );
}

export { MoneyFlow, MiniCalendar, ToolCard };
