// @ts-nocheck
import { useState, useMemo } from "react";
import { Icon } from "@/components/icons";
import { DOW } from "@/lib/date";
import { EVENT_CATEGORY_COLORS } from "@/lib/categories";
import { useEvents } from "@/features/events/hooks/useEvents";

export const CalendarPage = ({ onAdd, onEditEvent }) => {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  // selected day-of-month (within current cursor month). default = today if same month
  const [selDay, setSelDay] = useState(
    cursor.getMonth() === today.getMonth() &&
      cursor.getFullYear() === today.getFullYear()
      ? today.getDate()
      : 1,
  );

  const yr = cursor.getFullYear(),
    mo = cursor.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const daysPrev = new Date(yr, mo, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ d: daysPrev - i, muted: true, mo: mo - 1 });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i, mo });
  while (cells.length < 42)
    cells.push({
      d: cells.length - daysInMonth - firstDay + 1,
      muted: true,
      mo: mo + 1,
    });

  const { data: rawEvents } = useEvents();
  // Group events into a day-of-month → adapted-shape map for the cursor month.
  const events = useMemo(() => {
    const monthPrefix = `${yr}-${String(mo + 1).padStart(2, "0")}-`;
    const map = {};
    for (const ev of rawEvents) {
      if (!ev.date.startsWith(monthPrefix)) continue;
      const day = parseInt(ev.date.slice(8, 10), 10);
      const adapted = {
        id: ev.id,
        t: ev.title,
        color: ev.color || "var(--ink)",
        time: ev.allDay ? "종일" : ev.startTime || "",
        dur: ev.startTime && ev.endTime ? `${ev.startTime}—${ev.endTime}` : "",
        place: ev.place || "",
        _orig: ev,
      };
      (map[day] ||= []).push(adapted);
    }
    return map;
  }, [rawEvents, yr, mo]);

  const dow = DOW;
  const selEvents = events[selDay] || [];
  const isSelToday =
    selDay === today.getDate() &&
    mo === today.getMonth() &&
    yr === today.getFullYear();
  // compute weekday for selected day
  const selDate = new Date(yr, mo, selDay);
  const selDow = dow[selDate.getDay()];

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <div data-screen-label="03 캘린더">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 캘린더</div>
          <h1 className="page-title">
            {yr}년 {monthNames[mo]}{" "}
            <span className="hand-sub">— 이달의 일정</span>
          </h1>
          <div className="page-sub">
            총 {Object.values(events).flat().length}개의 일정 ·{" "}
            {Object.keys(events).length}일에 분포
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div
            className="row"
            style={{
              gap: 0,
              border: "1px solid var(--line)",
              borderRadius: 8,
              overflow: "hidden",
              background: "var(--card)",
            }}
          >
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(yr, mo - 1, 1));
                setSelDay(1);
              }}
            >
              ‹
            </button>
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelDay(today.getDate());
              }}
            >
              오늘
            </button>
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(yr, mo + 1, 1));
                setSelDay(1);
              }}
            >
              ›
            </button>
          </div>
          <button className="timer-btn primary" onClick={onAdd}>
            + 일정 추가
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card card-pad col-8">
          <div className="big-cal">
            <div className="big-cal-head">
              {dow.map((d, i) => (
                <div
                  key={d}
                  className={
                    "big-dow" + (i === 0 ? " sun" : i === 6 ? " sat" : "")
                  }
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="big-cal-grid">
              {cells.map((c, i) => {
                const isToday =
                  !c.muted &&
                  c.d === today.getDate() &&
                  mo === today.getMonth() &&
                  yr === today.getFullYear();
                const dayEvents = !c.muted ? events[c.d] || [] : [];
                const dow_i = i % 7;
                return (
                  <div
                    key={i}
                    className={
                      "big-cell" +
                      (c.muted ? " muted" : "") +
                      (isToday ? " today" : "") +
                      (!c.muted && c.d === selDay ? " selected" : "")
                    }
                    onClick={() => !c.muted && setSelDay(c.d)}
                  >
                    <div
                      className={
                        "big-cell-num" +
                        (dow_i === 0 ? " sun" : dow_i === 6 ? " sat" : "")
                      }
                    >
                      {c.d}
                      {isToday && <span className="today-pill">TODAY</span>}
                    </div>
                    <div className="big-cell-events">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <div
                          key={j}
                          className="big-event"
                          style={{ background: e.color }}
                        >
                          {e.time && (
                            <span className="big-event-time">{e.time}</span>
                          )}
                          {e.t}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="big-event-more">
                          +{dayEvents.length - 3}개
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card card-pad col-4">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="cal" size={16} />
                {monthNames[mo]} {selDay}일{" "}
                <span
                  style={{
                    color: "var(--ink-mute)",
                    fontWeight: 500,
                    marginLeft: 6,
                  }}
                >
                  {selDow}요일
                </span>
              </div>
              <div className="card-sub">
                {isSelToday ? "오늘" : `${selEvents.length}건의 일정`}
              </div>
            </div>
            {isSelToday && <span className="tag">오늘</span>}
            {!isSelToday && <span className="tag">{selEvents.length}</span>}
          </div>
          <div className="upcoming">
            {selEvents.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "32px 16px",
                  gap: 8,
                  textAlign: "center",
                  color: "var(--ink-mute)",
                }}
              >
                <div style={{ fontSize: 32, opacity: 0.4 }}>○</div>
                <b style={{ fontSize: 14, color: "var(--ink)" }}>
                  일정이 없어요
                </b>
                <small style={{ fontSize: 12 }}>여유로운 하루를 보내세요</small>
                <button
                  className="timer-btn"
                  style={{ marginTop: 6 }}
                  onClick={onAdd}
                >
                  + 일정 추가
                </button>
              </div>
            ) : (
              selEvents.map((e, i) => (
                <div key={i} className="upc">
                  <span className="upc-bar" style={{ background: e.color }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="upc-day">
                      {e.time}
                      {e.dur ? ` · ${e.dur}` : ""}
                    </div>
                    <div className="upc-title">{e.t}</div>
                    {e.place && <div className="upc-time">{e.place}</div>}
                  </div>
                  <button
                    className="upc-edit-btn"
                    onClick={() => onEditEvent && onEditEvent(e._orig || e)}
                    title="수정"
                  >
                    <Icon name="note" size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px dashed var(--line)",
            }}
          >
            <div
              className="card-title"
              style={{ fontSize: 13, marginBottom: 10 }}
            >
              일정 카테고리
            </div>
            <div className="legend">
              {EVENT_CATEGORY_COLORS.map(([n, c]) => (
                <span key={n} className="legend-item">
                  <span className="legend-dot" style={{ background: c }} />
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
