/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useMemo } from "react";
import { Icon } from "@/components/Icon";
import { DOW } from "@/lib/date";
import {
  useEvents,
  daysWithEventsInMonth,
  upcoming as upcomingEvents,
} from "@/data/events";

export function MiniCalendar({
  onOpen,
  memos,
  quickMemo,
  setQuickMemo,
  addQuickMemo,
  onEditEvent,
}) {
  const today = new Date();
  const yr = today.getFullYear(),
    mo = today.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const daysPrev = new Date(yr, mo, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ d: daysPrev - i, muted: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i });
  while (cells.length < 42)
    cells.push({ d: cells.length - daysInMonth - firstDay + 1, muted: true });

  const { data: events } = useEvents();
  const eventDays = useMemo(
    () => daysWithEventsInMonth(events, yr, mo),
    [events, yr, mo],
  );
  const upcoming = useMemo(() => upcomingEvents(events, 2, today), [events]);
  const monthEventCount = events.filter((e) =>
    e.date.startsWith(`${yr}-${String(mo + 1).padStart(2, "0")}-`),
  ).length;
  const dow = DOW;

  const formatTime = (e) => {
    if (!e.startTime) return "";
    const [h, m] = e.startTime.split(":").map((n) => parseInt(n, 10));
    const ampm = h < 12 ? "오전" : "오후";
    const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    let label = `${ampm} ${hh}:${String(m).padStart(2, "0")}`;
    if (e.endTime) {
      const [eh, em] = e.endTime.split(":").map((n) => parseInt(n, 10));
      const ehh = eh === 0 ? 12 : eh > 12 ? eh - 12 : eh;
      label += ` — ${ehh}:${String(em).padStart(2, "0")}`;
    }
    return label;
  };

  return (
    <div className="cal-card col-5">
      <div className="card-head">
        <div>
          <div className="card-title">
            <Icon name="cal" size={16} />
            {yr}.{String(mo + 1).padStart(2, "0")}
          </div>
          <div className="card-sub">이번 달 일정 {monthEventCount}개</div>
        </div>
        <div className="row" style={{ gap: 4 }}>
          <button
            className="icon-btn"
            style={{ width: 30, height: 30 }}
            onClick={onOpen}
            title="전체 보기"
          >
            ⤢
          </button>
        </div>
      </div>
      <div className="cal-grid">
        {dow.map((d) => (
          <div key={d} className="dow">
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const isToday = !c.muted && c.d === today.getDate();
          const has = !c.muted && eventDays.has(c.d);
          return (
            <div
              key={i}
              className={
                "cal-day" +
                (c.muted ? " muted" : "") +
                (isToday ? " today" : "") +
                (has ? " has" : "")
              }
            >
              {c.d}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px dashed var(--line)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {upcoming.map((ev, i) => (
          <div
            key={ev.id}
            className="upc row"
            style={{ gap: 10, fontSize: 12 }}
          >
            <span
              style={{
                width: 4,
                height: 28,
                background: ev.color || "var(--ink)",
                borderRadius: 99,
              }}
            />
            <div style={{ flex: 1 }}>
              <b>{ev.title}</b>
              <div className="muted" style={{ fontSize: 11 }}>
                {formatTime(ev)}
              </div>
            </div>
            {i === 0 && <span className="tag live">곧</span>}
            <button
              className="upc-edit-btn"
              onClick={() => onEditEvent && onEditEvent(ev)}
              title="수정"
            >
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
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {memos.slice(0, 2).map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                padding: "4px 8px",
                background: "var(--card)",
                borderRadius: 6,
                borderLeft: "3px solid var(--yellow-edge)",
              }}
            >
              · {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
