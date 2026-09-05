import { useState } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";
import { useEvents } from "@/data/events";
import { toLocalYmd } from "@/lib/date";
import { useSheet } from "@/screens/mobile/sheets/useSheet";
import { parseEvent, fmtDate, fmtTime, CAT_COLOR } from "@/lib/event-parse";
import styles from "@/screens/mobile/mobile.module.css";

export const AddEventSheet = ({ open, onClose }: any) => {
  const { sheetRef, gripHandlers, sheetStyle } = useSheet({
    open,
    onClose: () => onClose?.(),
    snaps: ["medium", "large"],
  });
  const { upsert } = useEvents();
  // toISOString 은 UTC — KST 오전 9시 전엔 어제가 나오므로 로컬 기준 사용
  const todayStr = toLocalYmd(new Date());
  const [quick, setQuick] = useState("");
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("업무");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(todayStr);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [loc, setLoc] = useState("");
  const [color, setColor] = useState("#ffd95e");
  const cats = [
    { name: "업무", color: "#ffd95e" },
    { name: "개인", color: "#cfe7ff" },
    { name: "약속", color: "#ffb38a" },
    { name: "건강", color: "#b9e7c9" },
    { name: "기타", color: "#d4c1f0" },
  ];

  // ⚡ 빠른 입력 — PC EventModal 과 동일한 자연어 파서를 재사용해 아래 폼을 채운다.
  const parsed = quick.trim() ? parseEvent(quick) : null;
  const applyQuick = () => {
    if (!parsed) return;
    const hh = String(parsed.hour).padStart(2, "0");
    const mm = String(parsed.min).padStart(2, "0");
    const endHh = String(Math.min(23, parsed.hour + 1)).padStart(2, "0");
    setTitle(parsed.title);
    setDate(toLocalYmd(parsed.date));
    setAllDay(parsed.allDay);
    if (!parsed.allDay) {
      setStart(`${hh}:${mm}`);
      setEnd(`${endHh}:${mm}`);
    }
    setCat(parsed.cat);
    // 모바일 시트 자체 카테고리 색이 있으면 그걸, 없으면 범례 색으로 매핑
    const local = cats.find((c) => c.name === parsed.cat);
    setColor(local ? local.color : CAT_COLOR[parsed.cat] || color);
    setQuick("");
  };
  const dispDate = (() => {
    const d = new Date(date);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${"일월화수목금토"[d.getDay()]})`;
  })();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await upsert({
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date,
      cat,
      color,
      allDay,
      ...(allDay ? {} : { startTime: start, endTime: end }),
      ...(loc.trim() ? { place: loc.trim() } : {}),
    } as any);
    setTitle("");
    setLoc("");
    onClose?.();
  };

  return (
    <>
      <div
        role="presentation"
        className={`${styles.dfmSheetScrim} ${open ? styles.on : ""}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="새 일정 추가"
        className={`${styles.dfmSheet} ${open ? styles.on : ""}`}
        style={sheetStyle}
      >
        <div className={styles.dfmSheetGrip} {...gripHandlers} />
        <div className={styles.dfmSheetHead} {...gripHandlers}>
          <div className={styles.ttl}>
            새 일정 추가<small>{dispDate}</small>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            <Ico name="close" size={18} />
          </button>
        </div>

        <div className={styles.dfmSheetBody} style={{ padding: "0 18px 22px" }}>
          {/* ⚡ 빠른 입력 — 자연어로 적으면 아래 폼을 자동으로 채워요 */}
          <div
            style={{
              padding: "12px 0 16px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                onKeyDown={(e) => {
                  // 한글 조합 중 Enter(isComposing)는 무시 — 조합 확정 키 오작동 방지
                  if (
                    e.key === "Enter" &&
                    !e.nativeEvent.isComposing &&
                    quick.trim()
                  ) {
                    e.preventDefault();
                    applyQuick();
                  }
                }}
                placeholder="⚡ 내일 오후 3시 팀 미팅"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "11px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  background: "var(--bg-paper)",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={applyQuick}
                disabled={!quick.trim()}
                style={{
                  flexShrink: 0,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--ink)",
                  background: quick.trim() ? "var(--ink)" : "transparent",
                  color: quick.trim() ? "var(--bg-paper)" : "var(--ink-mute)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: quick.trim() ? "pointer" : "not-allowed",
                }}
              >
                적용
              </button>
            </div>
            {parsed && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                  fontSize: 12,
                  color: "var(--ink-mute)",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {parsed.title}
                </span>
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fmtDate(parsed.date)} ·{" "}
                  {parsed.allDay ? "종일" : fmtTime(parsed.hour, parsed.min)}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    flexShrink: 0,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid var(--line)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {parsed.cat}
                </span>
              </div>
            )}
          </div>

          {/* title with color dot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0 16px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: color,
                flexShrink: 0,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새 일정"
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: 600,
                border: "none",
                background: "transparent",
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>날짜</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: "8px 10px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
                fontSize: 13,
                fontFamily: "var(--mono)",
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* all day toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>종일</span>
            <button
              onClick={() => setAllDay(!allDay)}
              style={{
                width: 44,
                height: 26,
                borderRadius: 999,
                border: "1px solid " + (allDay ? "var(--ink)" : "var(--line)"),
                background: allDay ? "var(--ink)" : "transparent",
                padding: 0,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: allDay ? 20 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: allDay ? "var(--bg-paper)" : "var(--ink-mute)",
                  transition: "left .15s",
                }}
              />
            </button>
          </div>

          {/* time */}
          {!allDay && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "14px 0",
                borderBottom: "1px dashed var(--line)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  시작
                </div>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: "var(--bg-paper)",
                    fontSize: 14,
                    fontFamily: "var(--mono)",
                    color: "var(--ink)",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  종료
                </div>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: "var(--bg-paper)",
                    fontSize: 14,
                    fontFamily: "var(--mono)",
                    color: "var(--ink)",
                  }}
                />
              </div>
            </div>
          )}

          {/* category */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              분류
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cats.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setCat(c.name);
                    setColor(c.color);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border:
                      "1px solid " +
                      (cat === c.name ? "var(--ink)" : "var(--line)"),
                    background: cat === c.name ? "var(--ink)" : "transparent",
                    color: cat === c.name ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c.color,
                    }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* location */}
          <div style={{ padding: "14px 0 4px" }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              장소 / 메모
            </div>
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="예: 회의실 A · 줌 미팅"
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
                fontSize: 13,
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--ink)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{
                flex: 2,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--ink)",
                color: "var(--bg-paper)",
                fontWeight: 700,
                fontSize: 13,
                cursor: !title.trim() ? "not-allowed" : "pointer",
                opacity: !title.trim() ? 0.5 : 1,
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
