import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import styles from "./TxnModal.module.css";

// ─────────────────────────────────────────────
// Helper — natural-language quick parse
// ─────────────────────────────────────────────
function parseTxn(input: string, type: "in" | "out") {
  const cats = ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];
  const incomeCats = ["월급", "보너스", "부수입", "환급", "기타"];
  const list = type === "in" ? incomeCats : cats;
  const cat =
    list.find((c) => input.includes(c)) || (type === "in" ? "월급" : "기타");
  // 콤마 구분자 제거 후 숫자+단위 매칭. memo 추출도 같은 normalized 본문 기준.
  const normalized = input.replace(/,/g, "");
  const num = normalized.match(/(\d+(?:\.\d+)?)([kw만천]?)/i);
  let amount = 0;
  let amountToken = "";
  if (num) {
    let v = parseFloat(num[1]);
    const unit = num[2].toLowerCase();
    if (unit === "k" || unit === "천") v *= 1000;
    if (unit === "w" || unit === "만") v *= 10000;
    amount = Math.round(v);
    amountToken = num[0];
  }
  const memo =
    normalized
      .replace(amountToken, "")
      .replace(cat, "")
      .replace(/\s+/g, " ")
      .trim() || "—";
  return { amount, cat, memo };
}

// ============================================================
// TXN MODAL — B + C 하이브리드
// ============================================================
export function TxnModal({ onClose, editing, onDelete, onSave }: any) {
  const [mode, setMode] = useState(editing ? "edit" : "quick");
  return (
    <Modal open={true} onClose={onClose}>
      {mode === "edit" && (
        <TxnEdit
          onClose={onClose}
          editing={editing}
          onDelete={onDelete}
          onSave={onSave}
        />
      )}
      {mode === "quick" && (
        <TxnQuick
          onClose={onClose}
          onSave={onSave}
          onDetailed={() => setMode("detailed")}
        />
      )}
      {mode === "detailed" && (
        <TxnDetailed
          onClose={onClose}
          onSave={onSave}
          onBack={() => setMode("quick")}
        />
      )}
    </Modal>
  );
}

function TxnEdit({ onClose, editing, onDelete, onSave }) {
  const cats = ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];
  const incomeCats = ["월급", "보너스", "부수입", "환급", "기타"];
  const [type, setType] = useState(editing?.type || "out");
  const [amt, setAmt] = useState(Math.abs(editing?.amount || 0).toString());
  const [cat, setCat] = useState(
    editing?.cat || (editing?.type === "in" ? "월급" : "식비"),
  );
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
        <div className="seg">
          <button
            className={type === "out" ? "on" : ""}
            onClick={() => setType("out")}
          >
            지출
          </button>
          <button
            className={type === "in" ? "on" : ""}
            onClick={() => setType("in")}
          >
            수입
          </button>
        </div>
        <div className={`${styles.amountDisplay} ${type}`}>
          {type === "out" ? "-" : "+"}₩
          {parseInt(amt || "0", 10).toLocaleString()}
        </div>
        <div className="field">
          <label>금액</label>
          <input
            type="number"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            autoFocus
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>날짜</label>
            <input
              type="date"
              defaultValue={
                editing?.date || new Date().toISOString().slice(0, 10)
              }
            />
          </div>
          <div className="field">
            <label>시간</label>
            <input type="time" defaultValue={editing?.time || "12:00"} />
          </div>
        </div>
        <div className="field">
          <label>카테고리</label>
          <div className="cat-chip-row">
            {list.map((c) => (
              <span
                key={c}
                className={"cat-chip" + (cat === c ? " on" : "")}
                onClick={() => setCat(c)}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>내용</label>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>
        <div className="field">
          <label>메모</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="부가 설명"
          />
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
            <button className="timer-btn" onClick={() => setConfirmDel(false)}>
              아니오
            </button>
            <button
              className="timer-btn danger"
              onClick={() => {
                onDelete && onDelete(editing);
                onClose();
              }}
            >
              네, 삭제
            </button>
          </>
        ) : (
          <>
            <button
              className="timer-btn ghost-danger"
              onClick={() => setConfirmDel(true)}
            >
              <Icon name="trash" size={13} /> 삭제
            </button>
            <div style={{ flex: 1 }} />
            <button className="timer-btn" onClick={onClose}>
              취소
            </button>
            <button
              className="timer-btn primary"
              onClick={() => {
                onSave &&
                  onSave({
                    ...editing,
                    type,
                    amount:
                      type === "out"
                        ? -Math.abs(parseInt(amt, 10) || 0)
                        : Math.abs(parseInt(amt, 10) || 0),
                    cat,
                    label: memo,
                    note,
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

function TxnQuick({ onClose, onSave, onDetailed }: any) {
  const [type, setType] = useState<"in" | "out">("out");
  const [val, setVal] = useState("");
  const parsed = parseTxn(val, type);

  const today = new Date().toISOString().slice(0, 10);
  const save = () => {
    if (!val.trim()) return;
    onSave &&
      onSave({
        type,
        amount: type === "out" ? -parsed.amount : parsed.amount,
        cat: parsed.cat,
        label: parsed.memo === "—" ? parsed.cat : parsed.memo,
        date: today,
      });
    onClose();
  };
  const recent =
    type === "in"
      ? [
          { icon: "💰", label: "월급 3,200,000" },
          { icon: "💸", label: "환급 12,000" },
        ]
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
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="modal-body" style={{ gap: 16 }}>
        <div className="seg">
          <button
            className={type === "out" ? "on" : ""}
            onClick={() => setType("out")}
          >
            지출
          </button>
          <button
            className={type === "in" ? "on" : ""}
            onClick={() => setType("in")}
          >
            수입
          </button>
          <button onClick={() => alert("이체 기능 준비중")}>이체</button>
        </div>

        <input
          className="big-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={
            type === "in" ? "예: 월급 3200000" : "예: 점심 8000 식비"
          }
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && val.trim() && save()}
        />

        {val.trim() && (
          <div className="parsed-preview">
            <span className={"pp-amount " + type}>
              {type === "out" ? "-" : "+"}₩{parsed.amount.toLocaleString()}
            </span>
            <span className="parsed-chip">{parsed.cat}</span>
            <span style={{ flex: 1, color: "var(--ink-soft)", fontSize: 12 }}>
              {parsed.memo}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-mute)",
              }}
            >
              오늘
            </span>
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
          <code>8000 점심</code> · <code>커피 4.5k</code> ·{" "}
          <code>+50000 월급</code>
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

function TxnDetailed({ onClose, onSave, onBack }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("out");
  const [amt, setAmt] = useState("0");
  const [cat, setCat] = useState("");
  const [memo, setMemo] = useState("");

  const save = () => {
    const numeric = parseInt(amt, 10) || 0;
    if (numeric === 0 || !cat) return;
    onSave &&
      onSave({
        type,
        amount: type === "out" ? -numeric : numeric,
        cat,
        label: memo || cat,
        date: new Date().toISOString().slice(0, 10),
      });
    onClose();
  };
  const cats =
    type === "in"
      ? ["월급", "보너스", "부수입", "환급", "기타"]
      : ["식비", "주거", "교통", "쇼핑", "여가", "건강", "구독", "기타"];

  const press = (k) => {
    if (k === "←") setAmt((a) => a.slice(0, -1) || "0");
    else if (k === "C") setAmt("0");
    else setAmt((a) => (a === "0" ? k : a + k));
  };

  const next = () => {
    if (step === 0 && amt === "0") return;
    if (step === 1 && !cat) return;
    setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => (step === 0 ? onBack() : setStep((s) => s - 1));

  return (
    <>
      <div className="modal-head">
        <div>
          <h3>+ 내역 추가</h3>
          <small>
            {step + 1} / 3 단계 ·{" "}
            {step === 0
              ? "금액 입력"
              : step === 1
                ? "카테고리 선택"
                : "메모 입력"}
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
        <div className="step-content">
          <div className="seg big">
            <button
              className={type === "out" ? "on" : ""}
              onClick={() => setType("out")}
            >
              지출
            </button>
            <button
              className={type === "in" ? "on" : ""}
              onClick={() => setType("in")}
            >
              수입
            </button>
            <button onClick={() => alert("이체 준비중")}>이체</button>
          </div>
          <div className="step-num-display">
            <div className="step-num-label">
              얼마를 {type === "in" ? "받았나요" : "썼나요"}?
            </div>
            <div
              className={
                "step-num" + (amt === "0" ? " empty" : "") + " " + type
              }
            >
              {type === "out" ? "-" : "+"}₩{parseInt(amt, 10).toLocaleString()}
            </div>
          </div>
          <div className="numpad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <button key={n} onClick={() => press(n)}>
                {n}
              </button>
            ))}
            <button className="util" onClick={() => press("000")}>
              000
            </button>
            <button onClick={() => press("0")}>0</button>
            <button className="util" onClick={() => press("←")}>
              ← 지움
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 16 }}>
            어떤 카테고리인가요?
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
          <div className="field" style={{ marginTop: 18 }}>
            <label>날짜 / 시간</label>
            <div className="field-row">
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
              <input type="time" defaultValue="12:00" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content" style={{ paddingBottom: 20 }}>
          <div className="step-num-label" style={{ marginBottom: 16 }}>
            마지막으로 메모와 결제수단
          </div>
          <div className="field">
            <label>내용 / 메모</label>
            <input
              placeholder={
                type === "in" ? "예: 11월 급여" : "예: 점심 — 김밥천국"
              }
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              autoFocus
            />
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
            <div className="ss-row">
              <span>금액</span>
              <b className={type === "out" ? "out" : "in"}>
                {type === "out" ? "-" : "+"}₩
                {parseInt(amt, 10).toLocaleString()}
              </b>
            </div>
            <div className="ss-row">
              <span>카테고리</span>
              <b>{cat}</b>
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
            disabled={(step === 0 && amt === "0") || (step === 1 && !cat)}
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
