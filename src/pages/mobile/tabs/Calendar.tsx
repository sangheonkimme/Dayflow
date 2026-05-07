// @ts-nocheck
import { useState } from "react";
import { DOW } from "@/lib/date";
import { useEvents, useEventsByDate } from "@/features/events/hooks/useEvents";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SectionHeader } from "@/pages/mobile/shared/SectionHeader";

export const MobileCalEvents = () => {
  const d = new Date();
  const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const events = useEventsByDate(todayKey);
  if (!events.length) {
    return (
      <div className="dfm-cal-events">
        <div style={{ padding: "10px 0", fontSize: 12, color: "var(--ink-mute)" }}>오늘 일정 없음</div>
      </div>
    );
  }
  return (
    <div className="dfm-cal-events">
      {events.slice(0, 3).map((ev) => (
        <div key={ev.id} className="dfm-cal-event">
          <span className="time">{ev.allDay ? "종일" : ev.startTime || ""}</span>
          <div className="pill" style={ev.color ? { borderLeftColor: ev.color } : null}>
            {ev.title}
            {(ev.place || ev.endTime) && (
              <small>{[ev.place, ev.endTime ? `~${ev.endTime}` : ""].filter(Boolean).join(" · ")}</small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
// PLACEHOLDER pages (other tabs — 골격 수준)
// ────────────────────────────────────────────────

export const MobileCalendar = () => {
  // Events come from the events repo, grouped by day-of-month for the
  // current calendar month.
  const { data: monthEventsAll } = useEvents();
  const todayDateObj = new Date();
  const yr = todayDateObj.getFullYear(), mo = todayDateObj.getMonth();
  const monthPrefix = `${yr}-${String(mo + 1).padStart(2, "0")}-`;
  const eventsByDay = useMemo(() => {
    const map = {};
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
  const today = todayDateObj.getDate();
  const [sel, setSel] = useState(today);

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
