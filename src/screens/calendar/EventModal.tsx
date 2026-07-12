import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { DOW, toLocalYmd } from "@/lib/date";
import { EVENT_CATEGORIES, EVENT_COLOR_PALETTE } from "@/lib/categories";
import { pressable } from "@/lib/a11y";
import { CAT_COLOR, parseEvent, fmtDate, fmtTime } from "@/lib/event-parse";

// ============================================================
// EVENT MODAL — B + C 하이브리드
// ============================================================
export function EventModal({ onClose, editing, onDelete, onSave }: any) {
  // editing.id 있으면 기존 일정 수정.
  // editing.date 등 일부 필드만 있고 id 없으면 'draft'(신규 + 사전 선택값).
  // editing 자체가 없으면 빠른 입력(Quick) 모드.
  const isDraft = !!editing && editing.id == null;
  const [mode, setMode] = useState(
    editing && editing.id != null ? "edit" : isDraft ? "edit" : "quick",
  );
  return (
    <Modal open={true} onClose={onClose}>
      {mode === "edit" && (
        <EventEdit
          onClose={onClose}
          editing={editing}
          onDelete={onDelete}
          onSave={onSave}
          isDraft={isDraft}
        />
      )}
      {mode === "quick" && (
        <EventQuick
          onClose={onClose}
          onSave={onSave}
          onDetailed={() => setMode("detailed")}
        />
      )}
      {mode === "detailed" && (
        <EventDetailed
          onClose={onClose}
          onSave={onSave}
          onBack={() => setMode("quick")}
        />
      )}
    </Modal>
  );
}

function EventEdit({ onClose, editing, onDelete, onSave, isDraft }: any) {
  const cats = EVENT_CATEGORIES;
  const colors = EVENT_COLOR_PALETTE;
  const isExisting = editing?.id != null;
  const [title, setTitle] = useState(editing?.title || "");
  const [allDay, setAllDay] = useState(editing?.allDay || false);
  const [cat, setCat] = useState(editing?.cat || "업무");
  const [color, setColor] = useState(editing?.color || "var(--red)");
  // toISOString 은 UTC 기준이라 KST 오전 9시 전엔 어제 날짜가 나옴 — 로컬 기준 사용
  const [date, setDate] = useState(editing?.date || toLocalYmd(new Date()));
  const [repeat, setRepeat] = useState(editing?.repeat || "none");
  // 기존 일정은 원래 값 유지 — 시간 없는 일정에 14:00 이 몰래 주입되면 안 됨.
  const [startTime, setStartTime] = useState(
    isExisting ? editing?.startTime || "" : editing?.startTime || "14:00",
  );
  const [endTime, setEndTime] = useState(
    isExisting ? editing?.endTime || "" : editing?.endTime || "15:00",
  );
  const [place, setPlace] = useState(editing?.place || "");
  const [memo, setMemo] = useState(editing?.memo || "");
  const [alarm, setAlarm] = useState(
    isExisting ? String(editing.alarm ?? 0) : String(editing?.alarm ?? 15),
  );
  const [confirmDel, setConfirmDel] = useState(false);

  const canSave = title.trim().length > 0;
  const timeInvalid =
    !allDay && !!startTime && !!endTime && endTime < startTime;

  return (
    <>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>{isDraft ? "일정 추가" : "일정 수정"}</h3>
            {!isDraft && <span className="badge-edit">✏️ EDIT</span>}
          </div>
          <small>
            {isDraft
              ? "선택한 날짜로 새 일정을 만들어요"
              : "일정의 정보를 변경하거나 삭제할 수 있어요"}
          </small>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      <div
        className="modal-body"
        style={{ gap: 14, maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="field">
          <label htmlFor="evt-title">제목</label>
          <input
            id="evt-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="evt-date">날짜</label>
            <input
              id="evt-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="evt-repeat">반복</label>
            <select
              id="evt-repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="none">반복 안함</option>
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>시간</span>
            <label
              style={{
                display: "flex",
                gap: 6,
                fontWeight: 500,
                fontSize: 12,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
              종일
            </label>
          </label>
          {!allDay && (
            <div className="field-row">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}
          {timeInvalid && (
            <small style={{ color: "var(--red)", marginTop: 4 }}>
              종료 시간이 시작 시간보다 빨라요
            </small>
          )}
        </div>

        <div className="field">
          <span className="field-cap">카테고리</span>
          <div className="cat-chip-row">
            {cats.map((c) => (
              <span
                key={c}
                className={"cat-chip" + (cat === c ? " on" : "")}
                {...pressable(() => setCat(c))}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-cap">색상</span>
          <div className="color-chip-row">
            {colors.map((c) => (
              <div
                key={c}
                className={"color-chip" + (color === c ? " on" : "")}
                style={{ background: c }}
                {...pressable(() => setColor(c))}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="evt-place">장소</label>
          <input
            id="evt-place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="예: 회의실 A / Zoom"
          />
        </div>

        <div className="field">
          <label htmlFor="evt-memo">메모</label>
          <textarea
            id="evt-memo"
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="자료 / 준비물 / 참고사항"
          />
        </div>

        <div className="field">
          <label htmlFor="evt-alarm">알림</label>
          <select
            id="evt-alarm"
            value={alarm}
            onChange={(e) => setAlarm(e.target.value)}
          >
            <option value="0">없음</option>
            <option value="5">5분 전</option>
            <option value="15">15분 전</option>
            <option value="30">30분 전</option>
            <option value="60">1시간 전</option>
            <option value="1440">하루 전</option>
          </select>
        </div>
      </div>
      <div className="modal-foot edit">
        {confirmDel ? (
          <>
            <span className="del-confirm-label">정말 삭제할까요?</span>
            <button className="timer-btn" onClick={() => setConfirmDel(false)}>
              아니오
            </button>
            <button
              className="timer-btn danger"
              onClick={() => {
                onDelete?.(editing);
                onClose();
              }}
            >
              네, 삭제
            </button>
          </>
        ) : (
          <>
            {!isDraft && (
              <button
                className="timer-btn ghost-danger"
                onClick={() => setConfirmDel(true)}
              >
                <Icon name="trash" size={13} /> 삭제
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button className="timer-btn" onClick={onClose}>
              취소
            </button>
            <button
              className="timer-btn primary"
              disabled={!canSave || timeInvalid}
              onClick={() => {
                if (!canSave || timeInvalid) return;
                onSave?.({
                    ...editing,
                    title: title.trim(),
                    cat,
                    color,
                    allDay,
                    date,
                    repeat,
                    // 종일이면 시간 무의미 — 잔존값이 "종일 · 14:00—15:00"로 새는 것 방지
                    startTime: allDay || !startTime ? undefined : startTime,
                    endTime:
                      allDay || !startTime || !endTime ? undefined : endTime,
                    place: place.trim() || undefined,
                    memo: memo.trim() || undefined,
                    alarm: alarm === "0" ? null : Number(alarm),
                  });
                onClose();
              }}
            >
              저장하기
            </button>
          </>
        )}
      </div>
    </>
  );
}

function EventQuick({ onClose, onSave, onDetailed }) {
  const [val, setVal] = useState("");
  const parsed = val.trim() ? parseEvent(val) : null;

  const save = () => {
    if (!parsed) return;
    const startTime = `${String(parsed.hour).padStart(2, "0")}:${String(parsed.min).padStart(2, "0")}`;
    onSave?.({
        title: parsed.title,
        date: toLocalYmd(parsed.date),
        startTime: parsed.allDay ? undefined : startTime,
        allDay: parsed.allDay || undefined,
        repeat: parsed.repeat !== "none" ? parsed.repeat : undefined,
        cat: parsed.cat,
        // 색을 고르는 단계가 없으므로 카테고리 범례 색으로 자동 지정
        color: CAT_COLOR[parsed.cat],
      });
    onClose();
  };

  const examples = [
    { label: "내일 오후 3시 팀 스탠드업", desc: "내일 일정" },
    { label: "월요일 10시 디자인 리뷰", desc: "이번 주 월요일" },
    { label: "금요일 7시 저녁 약속", desc: "이번 주 금요일" },
  ];

  return (
    <>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>빠른 일정</h3>
            <span className="badge-zap">⚡ B+C</span>
          </div>
          <small>자연스럽게 적으면 자동으로 만들어드려요</small>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="modal-body" style={{ gap: 16 }}>
        <input
          className="big-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="예: 내일 오후 3시 팀 미팅"
          autoFocus
          onKeyDown={(e) => {
            // 한글 조합 중 Enter(isComposing)는 무시 — 조합 확정 키로 저장되는 사고 방지
            if (e.key === "Enter" && !e.nativeEvent.isComposing && val.trim())
              save();
          }}
        />

        {parsed && (
          <div className="parsed-preview">
            <div
              style={{
                width: 4,
                height: 36,
                background: "var(--red)",
                borderRadius: 99,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {parsed.title}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}
              >
                {fmtDate(parsed.date)} ·{" "}
                {parsed.allDay ? "종일" : fmtTime(parsed.hour, parsed.min)}
                {parsed.repeat !== "none" ? ` · ${parsed.repeat} 반복` : ""}
              </div>
            </div>
            <span className="parsed-chip">{parsed.cat}</span>
          </div>
        )}

        <div>
          <div className="qs-label">이렇게 적어보세요</div>
          <div className="nl-examples">
            {examples.map((e, i) => (
              <div
                key={i}
                className="nl-example"
                {...pressable(() => setVal(e.label))}
              >
                <b>{e.label}</b>
                <span>{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-tip">
          <code>매주 화요일 9시</code> · <code>5/15 종일</code> ·{" "}
          <code>오전 11시 30분</code>
        </div>
      </div>
      <div className="modal-foot">
        <button className="timer-btn" onClick={onDetailed}>
          상세 입력 →
        </button>
        <button
          className="timer-btn primary"
          onClick={save}
          disabled={!val.trim()}
        >
          저장 (Enter)
        </button>
      </div>
    </>
  );
}

function EventDetailed({ onClose, onSave, onBack }) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [dateIdx, setDateIdx] = useState(1);
  const [duration, setDuration] = useState("1시간");
  const [startHour, setStartHour] = useState(15);
  const [cat, setCat] = useState("");
  const [color, setColor] = useState("var(--red)");
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [alarm, setAlarm] = useState("15");
  const [repeat, setRepeat] = useState("none");
  const cats = EVENT_CATEGORIES;
  const colors = EVENT_COLOR_PALETTE;
  const today = new Date();
  const dates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      d: i === 0 ? "오늘" : i === 1 ? "내일" : DOW[d.getDay()],
      n: `${d.getMonth() + 1}/${d.getDate()}`,
    };
  });
  const durations = ["30분", "1시간", "1.5시간", "2시간"];

  const save = () => {
    if (!title.trim()) return;
    const sel = new Date(today);
    sel.setDate(sel.getDate() + dateIdx);
    const yyyyMmDd = `${sel.getFullYear()}-${String(sel.getMonth() + 1).padStart(2, "0")}-${String(sel.getDate()).padStart(2, "0")}`;
    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const durMin =
      duration === "30분"
        ? 30
        : duration === "1시간"
          ? 60
          : duration === "1.5시간"
            ? 90
            : 120;
    const endHour = Math.min(23, startHour + Math.floor((0 + durMin) / 60));
    const endMin = durMin % 60;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
    onSave?.({
        title: title.trim(),
        date: yyyyMmDd,
        startTime,
        endTime,
        cat: cat || "개인",
        color,
        place: place.trim() || undefined,
        memo: memo.trim() || undefined,
        alarm: alarm === "0" ? null : Number(alarm),
        repeat: repeat !== "none" ? repeat : undefined,
      });
    onClose();
  };

  const next = () => {
    if (step === 0 && !title.trim()) return;
    setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => (step === 0 ? onBack() : setStep((s) => s - 1));

  return (
    <>
      <div className="modal-head">
        <div>
          <h3>+ 일정 추가</h3>
          <small>
            {step + 1} / 3 단계 ·{" "}
            {step === 0
              ? "언제 할까요?"
              : step === 1
                ? "카테고리 / 색상"
                : "추가 옵션"}
          </small>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="step-progress">
        <div className={"step-pill " + (step >= 0 ? "active" : "")} />
        <div className={"step-pill " + (step >= 1 ? "active" : "")} />
        <div className={"step-pill " + (step >= 2 ? "active" : "")} />
      </div>

      {step === 0 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="evt-s-title">제목</label>
            <input
              id="evt-s-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 팀 스탠드업"
              autoFocus
              style={{ height: 44, fontSize: 15 }}
            />
          </div>
          <div className="step-num-label" style={{ marginBottom: 8 }}>
            날짜
          </div>
          <div className="time-chips">
            {dates.map((d, i) => (
              <div
                key={i}
                className={"time-chip" + (dateIdx === i ? " on" : "")}
                {...pressable(() => setDateIdx(i))}
              >
                <div className="tc-day">{d.d}</div>
                <div className="tc-date">{d.n}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              marginBottom: 6,
            }}
          >
            <div className="step-num-label">시작</div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {fmtTime(startHour, 0)}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "var(--ink)" }}
          />
          <div
            className="step-num-label"
            style={{ marginTop: 12, marginBottom: 6 }}
          >
            지속 시간
          </div>
          <div className="duration-row">
            {durations.map((d) => (
              <button
                key={d}
                className={duration === d ? "on" : ""}
                onClick={() => setDuration(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 12 }}>
            카테고리
          </div>
          <div className="cat-grid">
            {cats.map((c) => (
              <button
                key={c}
                className={"cat-tile" + (cat === c ? " on" : "")}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div
            className="step-num-label"
            style={{ marginTop: 18, marginBottom: 8 }}
          >
            색상
          </div>
          <div className="color-chip-row">
            {colors.map((c) => (
              <div
                key={c}
                className={"color-chip" + (color === c ? " on" : "")}
                style={{ background: c }}
                {...pressable(() => setColor(c))}
              />
            ))}
          </div>
          <div className="field" style={{ marginTop: 18 }}>
            <label htmlFor="evt-s-place">장소</label>
            <input
              id="evt-s-place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="예: 회의실 A / Zoom"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="field">
            <label htmlFor="evt-s-memo">메모</label>
            <textarea
              id="evt-s-memo"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="자료 / 준비물 / 참고사항"
            />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="evt-s-alarm">알림</label>
            <select
              id="evt-s-alarm"
              value={alarm}
              onChange={(e) => setAlarm(e.target.value)}
            >
              <option value="0">없음</option>
              <option value="5">5분 전</option>
              <option value="15">15분 전</option>
              <option value="30">30분 전</option>
              <option value="60">1시간 전</option>
              <option value="1440">하루 전</option>
            </select>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="evt-s-repeat">반복</label>
            <select
              id="evt-s-repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="none">반복 안함</option>
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
            </select>
          </div>
          <div className="step-summary">
            <div className="ss-row">
              <span>제목</span>
              <b>{title || "—"}</b>
            </div>
            <div className="ss-row">
              <span>일시</span>
              <b>
                {dates[dateIdx].n} · {fmtTime(startHour, 0)} ({duration})
              </b>
            </div>
            <div className="ss-row">
              <span>분류</span>
              <b>{cat || "—"}</b>
            </div>
          </div>
        </div>
      )}

      <div className="modal-foot">
        <button className="timer-btn" onClick={back}>
          {step === 0 ? "← 빠른 입력" : "← 이전"}
        </button>
        {step < 2 ? (
          <button
            className="timer-btn primary"
            onClick={next}
            disabled={step === 0 && !title.trim()}
          >
            다음 →
          </button>
        ) : (
          <button className="timer-btn primary" onClick={save}>
            저장하기
          </button>
        )}
      </div>
    </>
  );
}