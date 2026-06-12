import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { DOW } from "@/lib/date";
import styles from "./MiniCalendar.module.css";
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
  onRemoveMemo,
  onEditEvent,
}: any) {
  const today = new Date();
  const yr = today.getFullYear(),
    mo = today.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const daysPrev = new Date(yr, mo, 0).getDate();
  // 선택된 날짜 (현재 달 기준 day, null = 오늘 + 임박 일정 노출)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const cells: { d: number; muted?: boolean }[] = [];
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
  const upcoming = useMemo(
    () => upcomingEvents(events, 2, new Date()),
    [events],
  );
  const monthKey = `${yr}-${String(mo + 1).padStart(2, "0")}`;
  const selectedEvents = useMemo(() => {
    if (selectedDay == null) return [];
    const dateStr = `${monthKey}-${String(selectedDay).padStart(2, "0")}`;
    return events
      .filter((e) => e.date === dateStr)
      .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  }, [events, selectedDay, monthKey]);
  const visibleEvents = selectedDay == null ? upcoming : selectedEvents;
  const monthEventCount = events.filter((e) =>
    e.date.startsWith(monthKey + "-"),
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
    <div className={`${styles.calCard} col-5`}>
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
      <div className={styles.calGrid}>
        {dow.map((d) => (
          <div key={d} className="dow">
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const isToday = !c.muted && c.d === today.getDate();
          const has = !c.muted && eventDays.has(c.d);
          const isSelected = !c.muted && selectedDay === c.d;
          return (
            <div
              key={i}
              role={c.muted ? undefined : "button"}
              tabIndex={c.muted ? -1 : 0}
              onClick={() => {
                if (c.muted) return;
                setSelectedDay(selectedDay === c.d ? null : c.d);
              }}
              onKeyDown={(e) => {
                if (c.muted) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedDay(selectedDay === c.d ? null : c.d);
                }
              }}
              className={
                styles.calDay +
                (c.muted ? " muted" : "") +
                (isToday ? " today" : "") +
                (has ? " has" : "") +
                (isSelected ? " selected" : "")
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
        {selectedDay != null && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              color: "var(--ink-mute)",
              marginBottom: 2,
              gap: 6,
            }}
          >
            <span>
              {mo + 1}월 {selectedDay}일 일정 · {selectedEvents.length}개
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                className="upc-edit-btn"
                onClick={() => {
                  if (!onEditEvent) return;
                  const dateStr = `${monthKey}-${String(selectedDay).padStart(2, "0")}`;
                  onEditEvent({ date: dateStr });
                }}
                title="이 날에 일정 추가"
                style={{ fontSize: 11, padding: "2px 8px" }}
              >
                + 추가
              </button>
              <button
                className="upc-edit-btn"
                onClick={() => setSelectedDay(null)}
                title="선택 해제"
                style={{ fontSize: 11, padding: "2px 6px" }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {visibleEvents.length === 0 && selectedDay != null && (
          <div
            style={{ fontSize: 12, color: "var(--ink-mute)", padding: "6px 0" }}
          >
            등록된 일정이 없어요
          </div>
        )}
        {visibleEvents.map((ev, i) => (
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
            {selectedDay == null && i === 0 && (
              <span className="tag live">곧</span>
            )}
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
      <div className={styles.quickMemo}>
        <span className={styles.hand}>한 줄 메모</span>
        <input
          placeholder={
            (memos?.length ?? 0) >= 3
              ? "최대 3개 — 기존 메모를 지우고 추가하세요"
              : "떠오른 생각을 빠르게 적어두세요"
          }
          value={quickMemo || ""}
          onChange={(e) => setQuickMemo && setQuickMemo(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (memos?.length ?? 0) < 3 &&
            addQuickMemo &&
            addQuickMemo()
          }
          disabled={(memos?.length ?? 0) >= 3}
        />
        <button
          onClick={() => addQuickMemo && addQuickMemo()}
          disabled={(memos?.length ?? 0) >= 3}
        >
          저장
        </button>
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
          {memos.map((m: string, i: number) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "var(--ink-soft)",
                padding: "4px 8px",
                background: "var(--card)",
                borderRadius: 6,
                borderLeft: "3px solid var(--yellow-edge)",
              }}
            >
              <span style={{ flex: 1 }}>· {m}</span>
              {onRemoveMemo && (
                <button
                  onClick={() => onRemoveMemo(i)}
                  title="삭제"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--ink-mute)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 11,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              textAlign: "right",
              marginTop: 2,
            }}
          >
            {memos.length} / 3
          </div>
        </div>
      )}
    </div>
  );
}