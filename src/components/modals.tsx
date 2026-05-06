// @ts-nocheck
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Modal } from '@/components/ui/Modal';
import { DOW } from '@/lib/date';
import { EVENT_CATEGORIES, EVENT_COLOR_PALETTE } from '@/lib/categories';

// ============================================================
// Helpers
// ============================================================
function parseTxn(input, type) {
  const cats = ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];
  const incomeCats = ["월급", "보너스", "부수입", "환급", "기타"];
  const list = type === "in" ? incomeCats : cats;
  const cat = list.find(c => input.includes(c)) || (type === "in" ? "월급" : "기타");
  const num = input.replace(/,/g, "").match(/(\d+(?:\.\d+)?)([kw만천]?)/i);
  let amount = 0;
  if (num) {
    let v = parseFloat(num[1]);
    const unit = num[2].toLowerCase();
    if (unit === "k" || unit === "천") v *= 1000;
    if (unit === "w" || unit === "만") v *= 10000;
    amount = Math.round(v);
  }
  const memo = input.replace(/(\d+(?:\.\d+)?[kw만천]?)/i, "").replace(cat, "").trim() || "—";
  return { amount, cat, memo };
}

function parseEvent(input) {
  const cats = EVENT_CATEGORIES;
  const cat = cats.find(c => input.includes(c)) ||
    (/(미팅|회의|스탠드업|리뷰)/.test(input) ? "업무" :
     /(운동|헬스|러닝|요가)/.test(input) ? "운동" : "개인");

  // tomorrow / today / weekday parsing
  const today = new Date();
  let date = new Date(today);
  if (/내일/.test(input)) date.setDate(date.getDate() + 1);
  else if (/모레/.test(input)) date.setDate(date.getDate() + 2);
  else {
    const dows = DOW;
    const m = input.match(/([일월화수목금토])요일?/);
    if (m) {
      const target = dows.indexOf(m[1]);
      const cur = date.getDay();
      let diff = target - cur;
      if (diff <= 0) diff += 7;
      date.setDate(date.getDate() + diff);
    }
  }

  // time
  const tm = input.match(/(오전|오후)?\s*(\d{1,2})(?::(\d{2}))?\s*시?/);
  let hour = 14, min = 0;
  if (tm) {
    hour = parseInt(tm[2], 10);
    min = tm[3] ? parseInt(tm[3], 10) : 0;
    if (tm[1] === "오후" && hour < 12) hour += 12;
    if (tm[1] === "오전" && hour === 12) hour = 0;
  }

  const title = input
    .replace(/(오늘|내일|모레)/, "")
    .replace(/([일월화수목금토])요일?/, "")
    .replace(/(오전|오후)?\s*\d{1,2}(?::\d{2})?\s*시?/, "")
    .replace(cat, "")
    .trim() || "새 일정";

  return { date, hour, min, cat, title };
}

const fmtDate = (d) => `${d.getMonth()+1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`;
const fmtTime = (h, m) => {
  const ampm = h < 12 ? "오전" : "오후";
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${hh}:${String(m).padStart(2, "0")}`;
};

// ============================================================
// TXN MODAL — B + C 하이브리드
// ============================================================
function TxnModal({ onClose, editing, onDelete, onSave }) {
  const [mode, setMode] = useState(editing ? "edit" : "quick");
  return (
    <Modal open={true} onClose={onClose}>
      {mode === "edit" && <TxnEdit onClose={onClose} editing={editing} onDelete={onDelete} onSave={onSave} />}
      {mode === "quick" && <TxnQuick onClose={onClose} onDetailed={() => setMode("detailed")} />}
      {mode === "detailed" && <TxnDetailed onClose={onClose} onBack={() => setMode("quick")} />}
    </Modal>
  );
}

// Single-page edit form (no steps) — used when modifying an existing txn
function TxnEdit({ onClose, editing, onDelete, onSave }) {
  const cats = ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];
  const incomeCats = ["월급", "보너스", "부수입", "환급", "기타"];
  const [type, setType] = useState(editing?.type || "out");
  const [amt, setAmt] = useState(Math.abs(editing?.amount || 0).toString());
  const [cat, setCat] = useState(editing?.cat || (editing?.type === "in" ? "월급" : "식비"));
  const [memo, setMemo] = useState(editing?.label || "");
  const [note, setNote] = useState(editing?.note || "");
  const [confirmDel, setConfirmDel] = useState(false);
  const list = type === "in" ? incomeCats : cats;

  return (
    <>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>내역 수정</h3>
            <span className="badge-edit">✏️ EDIT</span>
          </div>
          <small>기존 내역의 정보를 변경하거나 삭제할 수 있어요</small>
        </div>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="modal-body" style={{ gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
        <div className="seg">
          <button className={type === "out" ? "on" : ""} onClick={() => setType("out")}>지출</button>
          <button className={type === "in" ? "on" : ""} onClick={() => setType("in")}>수입</button>
        </div>
        <div className={"amount-display " + type}>
          {type === "out" ? "-" : "+"}₩{parseInt(amt || "0", 10).toLocaleString()}
        </div>
        <div className="field">
          <label>금액</label>
          <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} autoFocus />
        </div>
        <div className="field-row">
          <div className="field">
            <label>날짜</label>
            <input type="date" defaultValue={editing?.date || new Date().toISOString().slice(0,10)} />
          </div>
          <div className="field">
            <label>시간</label>
            <input type="time" defaultValue={editing?.time || "12:00"} />
          </div>
        </div>
        <div className="field">
          <label>카테고리</label>
          <div className="cat-chip-row">
            {list.map(c => (
              <span key={c} className={"cat-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>내용</label>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>
        <div className="field">
          <label>메모</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="부가 설명" />
        </div>
        <div className="field">
          <label>결제 수단</label>
          <select defaultValue={editing?.method || "card"}>
            <option value="card">신용카드 — 신한 1234</option>
            <option value="cash">현금</option>
            <option value="bank">계좌이체 — 카카오뱅크</option>
            <option value="pay">간편결제 — 카카오페이</option>
          </select>
        </div>
      </div>
      <div className="modal-foot edit">
        {confirmDel ? (
          <>
            <span className="del-confirm-label">정말 삭제할까요?</span>
            <button className="timer-btn" onClick={() => setConfirmDel(false)}>아니오</button>
            <button className="timer-btn danger" onClick={() => { onDelete && onDelete(editing); onClose(); }}>네, 삭제</button>
          </>
        ) : (
          <>
            <button className="timer-btn ghost-danger" onClick={() => setConfirmDel(true)}>
              <Icon name="trash" size={13} /> 삭제
            </button>
            <div style={{ flex: 1 }} />
            <button className="timer-btn" onClick={onClose}>취소</button>
            <button className="timer-btn primary" onClick={() => { onSave && onSave({ ...editing, type, amount: type === "out" ? -Math.abs(parseInt(amt, 10) || 0) : Math.abs(parseInt(amt, 10) || 0), cat, label: memo, note }); onClose(); }}>저장하기</button>
          </>
        )}
      </div>
    </>
  );
}

function TxnQuick({ onClose, onDetailed }) {
  const [type, setType] = useState("out");
  const [val, setVal] = useState("");
  const parsed = parseTxn(val, type);
  const recent = type === "in"
    ? [{ icon: "💰", label: "월급 3,200,000" }, { icon: "💸", label: "환급 12,000" }]
    : [
        { icon: "☕", label: "커피 4500" },
        { icon: "🍱", label: "점심 9000" },
        { icon: "🚇", label: "교통 1500" },
        { icon: "🍞", label: "빵 5000" },
      ];

  return (
    <>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>빠른 기록</h3>
            <span className="badge-zap">⚡ B+C</span>
          </div>
          <small>한 줄로 적으면 알아서 분류해드려요</small>
        </div>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="modal-body" style={{ gap: 16 }}>
        <div className="seg">
          <button className={type === "out" ? "on" : ""} onClick={() => setType("out")}>지출</button>
          <button className={type === "in" ? "on" : ""} onClick={() => setType("in")}>수입</button>
          <button onClick={() => alert("이체 기능 준비중")}>이체</button>
        </div>

        <input
          className="big-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={type === "in" ? "예: 월급 3200000" : "예: 점심 8000 식비"}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && val.trim() && onClose()}
        />

        {val.trim() && (
          <div className="parsed-preview">
            <span className={"pp-amount " + type}>
              {type === "out" ? "-" : "+"}₩{parsed.amount.toLocaleString()}
            </span>
            <span className="parsed-chip">{parsed.cat}</span>
            <span style={{ flex: 1, color: "var(--ink-soft)", fontSize: 12 }}>{parsed.memo}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-mute)" }}>오늘</span>
          </div>
        )}

        <div>
          <div className="qs-label">자주 쓴 항목</div>
          <div className="quick-suggest">
            {recent.map((r, i) => (
              <span key={i} className="qs" onClick={() => setVal(r.label)}>
                {r.icon} {r.label}
              </span>
            ))}
          </div>
        </div>

        <div className="quick-tip">
          <code>8000 점심</code> · <code>커피 4.5k</code> · <code>+50000 월급</code>
        </div>
      </div>
      <div className="modal-foot">
        <button className="timer-btn" onClick={onDetailed}>상세 입력 →</button>
        <button className="timer-btn primary" onClick={onClose} disabled={!val.trim()}>저장 (Enter)</button>
      </div>
    </>
  );
}

function TxnDetailed({ onClose, onBack }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("out");
  const [amt, setAmt] = useState("0");
  const [cat, setCat] = useState("");
  const [memo, setMemo] = useState("");
  const cats = type === "in" ? ["월급", "보너스", "부수입", "환급", "기타"] : ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];

  const press = (k) => {
    if (k === "←") setAmt(a => a.slice(0, -1) || "0");
    else if (k === "C") setAmt("0");
    else setAmt(a => a === "0" ? k : a + k);
  };

  const next = () => {
    if (step === 0 && amt === "0") return;
    if (step === 1 && !cat) return;
    setStep(s => Math.min(s + 1, 2));
  };
  const back = () => step === 0 ? onBack() : setStep(s => s - 1);

  return (
    <>
      <div className="modal-head">
        <div>
          <h3>+ 내역 추가</h3>
          <small>{step + 1} / 3 단계 · {step === 0 ? "금액 입력" : step === 1 ? "카테고리 선택" : "메모 입력"}</small>
        </div>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="step-progress">
        <div className={"step-pill " + (step >= 0 ? "active" : "")} />
        <div className={"step-pill " + (step >= 1 ? "active" : "")} />
        <div className={"step-pill " + (step >= 2 ? "active" : "")} />
      </div>

      {step === 0 && (
        <div className="step-content">
          <div className="seg big">
            <button className={type === "out" ? "on" : ""} onClick={() => setType("out")}>지출</button>
            <button className={type === "in" ? "on" : ""} onClick={() => setType("in")}>수입</button>
            <button onClick={() => alert("이체 준비중")}>이체</button>
          </div>
          <div className="step-num-display">
            <div className="step-num-label">얼마를 {type === "in" ? "받았나요" : "썼나요"}?</div>
            <div className={"step-num" + (amt === "0" ? " empty" : "") + " " + type}>
              {type === "out" ? "-" : "+"}₩{parseInt(amt, 10).toLocaleString()}
            </div>
          </div>
          <div className="numpad">
            {["1","2","3","4","5","6","7","8","9"].map(n =>
              <button key={n} onClick={() => press(n)}>{n}</button>
            )}
            <button className="util" onClick={() => press("000")}>000</button>
            <button onClick={() => press("0")}>0</button>
            <button className="util" onClick={() => press("←")}>← 지움</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 16 }}>어떤 카테고리인가요?</div>
          <div className="cat-grid">
            {cats.map(c => (
              <button key={c} className={"cat-tile" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginTop: 18 }}>
            <label>날짜 / 시간</label>
            <div className="field-row">
              <input type="date" defaultValue={new Date().toISOString().slice(0,10)} />
              <input type="time" defaultValue="12:00" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 16 }}>마지막으로 메모와 결제수단</div>
          <div className="field">
            <label>내용 / 메모</label>
            <input placeholder={type === "in" ? "예: 11월 급여" : "예: 점심 — 김밥천국"} value={memo} onChange={(e) => setMemo(e.target.value)} autoFocus />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label>결제 수단</label>
            <select defaultValue="card">
              <option value="card">신용카드 — 신한 1234</option>
              <option value="cash">현금</option>
              <option value="bank">계좌이체 — 카카오뱅크</option>
              <option value="pay">간편결제 — 카카오페이</option>
            </select>
          </div>
          <div className="step-summary">
            <div className="ss-row"><span>금액</span><b className={type === "out" ? "out" : "in"}>{type === "out" ? "-" : "+"}₩{parseInt(amt, 10).toLocaleString()}</b></div>
            <div className="ss-row"><span>카테고리</span><b>{cat}</b></div>
          </div>
        </div>
      )}

      <div className="modal-foot">
        <button className="timer-btn" onClick={back}>{step === 0 ? "← 빠른 입력" : "← 이전"}</button>
        {step < 2
          ? <button className="timer-btn primary" onClick={next} disabled={(step === 0 && amt === "0") || (step === 1 && !cat)}>다음 →</button>
          : <button className="timer-btn primary" onClick={onClose}>저장하기</button>}
      </div>
    </>
  );
}

// ============================================================
// EVENT MODAL — B + C 하이브리드
// ============================================================
function EventModal({ onClose, editing, onDelete, onSave }) {
  const [mode, setMode] = useState(editing ? "edit" : "quick");
  return (
    <Modal open={true} onClose={onClose}>
      {mode === "edit" && <EventEdit onClose={onClose} editing={editing} onDelete={onDelete} onSave={onSave} />}
      {mode === "quick" && <EventQuick onClose={onClose} onDetailed={() => setMode("detailed")} />}
      {mode === "detailed" && <EventDetailed onClose={onClose} onBack={() => setMode("quick")} />}
    </Modal>
  );
}

function EventEdit({ onClose, editing, onDelete, onSave }) {
  const cats = EVENT_CATEGORIES;
  const colors = EVENT_COLOR_PALETTE;
  const [title, setTitle] = useState(editing?.title || "");
  const [allDay, setAllDay] = useState(editing?.allDay || false);
  const [cat, setCat] = useState(editing?.cat || "업무");
  const [color, setColor] = useState(editing?.color || "var(--red)");
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>일정 수정</h3>
            <span className="badge-edit">✏️ EDIT</span>
          </div>
          <small>일정의 정보를 변경하거나 삭제할 수 있어요</small>
        </div>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="modal-body" style={{ gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
        <div className="field">
          <label>제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </div>

        <div className="field-row">
          <div className="field">
            <label>날짜</label>
            <input type="date" defaultValue={editing?.date || new Date().toISOString().slice(0,10)} />
          </div>
          <div className="field">
            <label>반복</label>
            <select defaultValue={editing?.repeat || "none"}>
              <option value="none">반복 안함</option>
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>시간</span>
            <label style={{ display: "flex", gap: 6, fontWeight: 500, fontSize: 12, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
              종일
            </label>
          </label>
          {!allDay && (
            <div className="field-row">
              <input type="time" defaultValue={editing?.startTime || "14:00"} />
              <input type="time" defaultValue={editing?.endTime || "15:00"} />
            </div>
          )}
        </div>

        <div className="field">
          <label>카테고리</label>
          <div className="cat-chip-row">
            {cats.map(c => (
              <span key={c} className={"cat-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</span>
            ))}
          </div>
        </div>

        <div className="field">
          <label>색상</label>
          <div className="color-chip-row">
            {colors.map(c => (
              <div key={c} className={"color-chip" + (color === c ? " on" : "")}
                style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>

        <div className="field">
          <label>장소</label>
          <input defaultValue={editing?.place || ""} placeholder="예: 회의실 A / Zoom" />
        </div>

        <div className="field">
          <label>메모</label>
          <textarea rows="2" defaultValue={editing?.memo || ""} placeholder="자료 / 준비물 / 참고사항" />
        </div>

        <div className="field">
          <label>알림</label>
          <select defaultValue={editing?.alarm || "15"}>
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
            <button className="timer-btn" onClick={() => setConfirmDel(false)}>아니오</button>
            <button className="timer-btn danger" onClick={() => { onDelete && onDelete(editing); onClose(); }}>네, 삭제</button>
          </>
        ) : (
          <>
            <button className="timer-btn ghost-danger" onClick={() => setConfirmDel(true)}>
              <Icon name="trash" size={13} /> 삭제
            </button>
            <div style={{ flex: 1 }} />
            <button className="timer-btn" onClick={onClose}>취소</button>
            <button className="timer-btn primary" onClick={() => { onSave && onSave({ ...editing, title, cat, color, allDay }); onClose(); }}>저장하기</button>
          </>
        )}
      </div>
    </>
  );
}

function EventQuick({ onClose, onDetailed }) {
  const [val, setVal] = useState("");
  const parsed = val.trim() ? parseEvent(val) : null;

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
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
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
          onKeyDown={(e) => e.key === "Enter" && val.trim() && onClose()}
        />

        {parsed && (
          <div className="parsed-preview">
            <div style={{ width: 4, height: 36, background: "var(--red)", borderRadius: 99 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{parsed.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
                {fmtDate(parsed.date)} · {fmtTime(parsed.hour, parsed.min)}
              </div>
            </div>
            <span className="parsed-chip">{parsed.cat}</span>
          </div>
        )}

        <div>
          <div className="qs-label">이렇게 적어보세요</div>
          <div className="nl-examples">
            {examples.map((e, i) => (
              <div key={i} className="nl-example" onClick={() => setVal(e.label)}>
                <b>{e.label}</b>
                <span>{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-tip">
          <code>매주 화 9시</code> · <code>5/15 종일</code> · <code>오전 11시 30분</code>
        </div>
      </div>
      <div className="modal-foot">
        <button className="timer-btn" onClick={onDetailed}>상세 입력 →</button>
        <button className="timer-btn primary" onClick={onClose} disabled={!val.trim()}>저장 (Enter)</button>
      </div>
    </>
  );
}

function EventDetailed({ onClose, onBack }) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [dateIdx, setDateIdx] = useState(1); // 내일
  const [duration, setDuration] = useState("1시간");
  const [startHour, setStartHour] = useState(15);
  const [cat, setCat] = useState("");
  const [color, setColor] = useState("var(--red)");
  const cats = EVENT_CATEGORIES;
  const colors = EVENT_COLOR_PALETTE;
  const today = new Date();
  const dates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      d: i === 0 ? "오늘" : i === 1 ? "내일" : DOW[d.getDay()],
      n: `${d.getMonth()+1}/${d.getDate()}`,
    };
  });
  const durations = ["30분", "1시간", "1.5시간", "2시간"];

  const next = () => {
    if (step === 0 && !title.trim()) return;
    setStep(s => Math.min(s + 1, 2));
  };
  const back = () => step === 0 ? onBack() : setStep(s => s - 1);

  return (
    <>
      <div className="modal-head">
        <div>
          <h3>+ 일정 추가</h3>
          <small>{step + 1} / 3 단계 · {step === 0 ? "언제 할까요?" : step === 1 ? "카테고리 / 색상" : "추가 옵션"}</small>
        </div>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
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
            <label>제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 팀 스탠드업" autoFocus style={{ height: 44, fontSize: 15 }} />
          </div>
          <div className="step-num-label" style={{ marginBottom: 8 }}>날짜</div>
          <div className="time-chips">
            {dates.map((d, i) => (
              <div key={i} className={"time-chip" + (dateIdx === i ? " on" : "")} onClick={() => setDateIdx(i)}>
                <div className="tc-day">{d.d}</div>
                <div className="tc-date">{d.n}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 6 }}>
            <div className="step-num-label">시작</div>
            <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 16 }}>{fmtTime(startHour, 0)}</div>
          </div>
          <input type="range" min="0" max="23" value={startHour} onChange={(e) => setStartHour(parseInt(e.target.value, 10))} style={{ width: "100%", accentColor: "var(--ink)" }} />
          <div className="step-num-label" style={{ marginTop: 12, marginBottom: 6 }}>지속 시간</div>
          <div className="duration-row">
            {durations.map(d => (
              <button key={d} className={duration === d ? "on" : ""} onClick={() => setDuration(d)}>{d}</button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 12 }}>카테고리</div>
          <div className="cat-grid">
            {cats.map(c => (
              <button key={c} className={"cat-tile" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="step-num-label" style={{ marginTop: 18, marginBottom: 8 }}>색상</div>
          <div className="color-chip-row">
            {colors.map(c => (
              <div key={c} className={"color-chip" + (color === c ? " on" : "")}
                style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
          <div className="field" style={{ marginTop: 18 }}>
            <label>장소</label>
            <input placeholder="예: 회의실 A / Zoom" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="field">
            <label>메모</label>
            <textarea rows="3" placeholder="자료 / 준비물 / 참고사항" />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label>알림</label>
            <select defaultValue="15">
              <option value="0">없음</option>
              <option value="5">5분 전</option>
              <option value="15">15분 전</option>
              <option value="30">30분 전</option>
              <option value="60">1시간 전</option>
              <option value="1440">하루 전</option>
            </select>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label>반복</label>
            <select defaultValue="none">
              <option value="none">반복 안함</option>
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
            </select>
          </div>
          <div className="step-summary">
            <div className="ss-row"><span>제목</span><b>{title || "—"}</b></div>
            <div className="ss-row"><span>일시</span><b>{dates[dateIdx].n} · {fmtTime(startHour, 0)} ({duration})</b></div>
            <div className="ss-row"><span>분류</span><b>{cat || "—"}</b></div>
          </div>
        </div>
      )}

      <div className="modal-foot">
        <button className="timer-btn" onClick={back}>{step === 0 ? "← 빠른 입력" : "← 이전"}</button>
        {step < 2
          ? <button className="timer-btn primary" onClick={next} disabled={step === 0 && !title.trim()}>다음 →</button>
          : <button className="timer-btn primary" onClick={onClose}>저장하기</button>}
      </div>
    </>
  );
}

export { TxnModal, EventModal };