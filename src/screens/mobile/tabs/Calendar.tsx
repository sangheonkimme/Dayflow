import { useState, useMemo } from "react";
import { DOW, MONTHS } from "@/lib/date";
import { useEvents, useEventsByDate } from "@/data/events";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/mobile/mobile.module.css";

export const MobileCalEvents = () => {
  const d = new Date();
  const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const events = useEventsByDate(todayKey);
  if (!events.length) {
    return (
      <div className={styles.dfmCalEvents}>
        <div
          style={{ padding: "10px 0", fontSize: 12, color: "var(--ink-mute)" }}
        >
          오늘 일정 없음
        </div>
      </div>
    );
  }
  return (
    <div className={styles.dfmCalEvents}>
      {events.slice(0, 3).map((ev) => (
        <div key={ev.id} className={styles.dfmCalEvent}>
          <span className={styles.time}>
            {ev.allDay ? "종일" : ev.startTime || ""}
          </span>
          <div
            className={styles.pill}
            style={ev.color ? { borderLeftColor: ev.color } : undefined}
          >
            {ev.title}
            {(ev.place || ev.endTime) && (
              <small>
                {[ev.place, ev.endTime ? `~${ev.endTime}` : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ────────────────────────────────────────────────
// PLACEHOLDER pages (other tabs — 골격 수준)
// ────────────────────────────────────────────────

export const MobileCalendar = ({ onAddEvent }: any) => {
  // 보고 있는 달은 cursor 로 관리(이전/다음 네비). 일정은 events repo 에서
  // 해당 달 day-of-month 로 그룹.
  const { data: monthEventsAll } = useEvents();
  const todayDateObj = new Date();
  const [cursor, setCursor] = useState(() => new Date());
  const yr = cursor.getFullYear();
  const mo = cursor.getMonth();
  const isCurrentMonth =
    yr === todayDateObj.getFullYear() && mo === todayDateObj.getMonth();
  const today = todayDateObj.getDate();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const monthPrefix = `${yr}-${String(mo + 1).padStart(2, "0")}-`;
  const eventsByDay = useMemo(() => {
    const map: Record<number, any[]> = {};
    for (const ev of monthEventsAll) {
      if (!ev.date.startsWith(monthPrefix)) continue;
      const day = parseInt(ev.date.slice(8, 10), 10);
      const adapted = {
        t: ev.allDay ? "전일" : ev.startTime || "",
        dur: ev.endTime ? `${ev.startTime || ""}~${ev.endTime}` : "",
        title: ev.title,
        place: ev.place || "",
        color: ev.color || "#cfe7ff",
      };
      (map[day] ||= []).push(adapted);
    }
    return map;
  }, [monthEventsAll, monthPrefix]);
  const dayNames = DOW;
  const [sel, setSel] = useState(today);
  const selDay = Math.min(sel, daysInMonth);

  const selEvents = eventsByDay[selDay] || [];
  const selDow = DOW[new Date(yr, mo, selDay).getDay()];
  const selIsToday = isCurrentMonth && selDay === today;

  // 실제 달력 그리드(요일 오프셋 + 말일 + 다음달 채움).
  const cells = useMemo(() => {
    const firstDow = new Date(yr, mo, 1).getDay();
    const prevDays = new Date(yr, mo, 0).getDate();
    const arr: { real: number; muted: boolean }[] = [];
    for (let i = 0; i < firstDow; i++)
      arr.push({ real: prevDays - firstDow + 1 + i, muted: true });
    for (let i = 1; i <= daysInMonth; i++) arr.push({ real: i, muted: false });
    let nd = 1;
    while (arr.length % 7 !== 0 || arr.length < 35)
      arr.push({ real: nd++, muted: true });
    return arr;
  }, [yr, mo, daysInMonth]);

  const goPrev = () => {
    setCursor(new Date(yr, mo - 1, 1));
    setSel(1);
  };
  const goNext = () => {
    setCursor(new Date(yr, mo + 1, 1));
    setSel(1);
  };

  return (
    <div>
      <SectionHeader title={`${MONTHS[mo]} 일정`} />
      <div className={styles.dfmCal}>
        <div className={styles.dfmCalH}>
          <div className={styles.month}>
            {yr} · {MONTHS[mo]}
          </div>
          <div className={styles.dfmCalNav}>
            <button type="button" onClick={goPrev} aria-label="이전 달">
              <Ico name="chevL" size={14} />
            </button>
            <button type="button" onClick={goNext} aria-label="다음 달">
              <Ico name="chevR" size={14} />
            </button>
          </div>
        </div>
        <div className={styles.dfmCalGrid}>
          {dayNames.map((d, i) => (
            <div key={i} className={styles.dfmCalDow}>
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            const isToday = !c.muted && isCurrentMonth && c.real === today;
            const isSel = !c.muted && c.real === selDay;
            const ev = !c.muted && !!eventsByDay[c.real];
            return (
              <div
                key={i}
                {...pressable(() => {
                  if (!c.muted) setSel(c.real);
                })}
                className={[
                  styles.dfmCalDay,
                  c.muted ? styles.muted : "",
                  isToday ? styles.today : "",
                  ev ? styles.hasEvent : "",
                  isSel ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ cursor: c.muted ? "default" : "pointer" }}
              >
                {c.real}
              </div>
            );
          })}
        </div>
      </div>

      {/* selected-day header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          padding: "18px 2px 10px",
          borderBottom: "1px dashed var(--line)",
          marginBottom: 12,
        }}
      >
        <b
          style={{
            fontSize: 22,
            letterSpacing: "-0.02em",
            fontFamily: "var(--hand)",
          }}
        >
          {MONTHS[mo]} {selDay}일
        </b>
        <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>
          {selDow}요일
        </span>
        {selIsToday && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink)",
              background: "var(--yellow)",
              padding: "2px 8px",
              borderRadius: 999,
              border: "1px solid var(--yellow-edge)",
              marginLeft: "auto",
            }}
          >
            오늘
          </span>
        )}
        {!selIsToday && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "var(--ink-mute)",
              fontFamily: "var(--mono)",
            }}
          >
            {selEvents.length}건
          </span>
        )}
      </div>

      {/* day timeline / list */}
      {selEvents.length === 0 ? (
        <div
          className={styles.dfmCard}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 16px",
            gap: 8,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.5 }}>○</div>
          <b style={{ fontSize: 14 }}>일정이 없어요</b>
          <small style={{ fontSize: 12, color: "var(--ink-mute)" }}>
            여유로운 하루를 보내세요
          </small>
          <button
            type="button"
            onClick={onAddEvent}
            style={{
              marginTop: 8,
              fontSize: 12,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            <Ico name="plus" size={12} /> 일정 추가
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {selEvents.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 56, flexShrink: 0, paddingTop: 14 }}>
                <b
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--mono)",
                    display: "block",
                  }}
                >
                  {e.t}
                </b>
                {e.dur && (
                  <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                    {e.dur}
                  </small>
                )}
              </div>
              <div
                className={styles.dfmCard}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderLeft: `4px solid ${e.color}`,
                  borderRadius: "10px",
                }}
              >
                <b style={{ fontSize: 14, display: "block", marginBottom: 2 }}>
                  {e.title}
                </b>
                <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                  {e.place}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
};

// ────────────────────────────────────────────────
// COMMUNITY · 가계 인증 / 절약 챌린지 / 팁 공유
// ────────────────────────────────────────────────
