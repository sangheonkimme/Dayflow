/* global React, Icon */
const { useState, useEffect, useRef } = React;

// ============================================================
// STICKY NOTES — hero feature
// ============================================================
function StickyNotes({ initial }) {
  const [notes, setNotes] = useState(initial || [
    { id: 1, color: "yellow", title: "오늘의 목표", emoji: "✨", text: "디자인 시안 마무리하고\n팀에 공유하기 — 6시 전!", date: "오늘", author: "나" },
    { id: 2, color: "pink", title: "감사 메모", emoji: "💌", text: "민수씨가 도와준 거\n잊지 말고 답례하기.\n커피 한 잔 어때?", date: "어제", author: "나" },
    { id: 3, color: "blue", title: "내일 회의 준비", emoji: "📋", text: "· 디자인 시안 3개\n· 카피 초안 정리\n· 일정표 출력", date: "오늘", author: "나" },
  ]);
  const [activeColor, setActiveColor] = useState("yellow");

  const addNote = () => {
    if (notes.length >= 3) {
      // replace oldest empty? — simple: cap at 3 with toast feel
      return;
    }
    setNotes([...notes, { id: Date.now(), color: activeColor, title: "새 메모", emoji: "📝", text: "", date: "방금", author: "나" }]);
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const removeNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const rotations = [-2, 1.5, -1];

  return (
    <div className="notes-card col-9">
      <div className="notes-head">
        <div className="notes-title">
          <h2>스티커 메모</h2>
          <span className="hand">붙여두면 잊지 않아요</span>
        </div>
        <div className="notes-controls">
          <div className="color-pick" title="새 메모 색상">
            {["yellow","pink","blue"].map(c => (
              <div
                key={c}
                className={"swatch" + (activeColor === c ? " active" : "")}
                style={{ background: c === "yellow" ? "var(--yellow)" : c === "pink" ? "var(--pink)" : "var(--blue)" }}
                onClick={() => setActiveColor(c)}
              />
            ))}
          </div>
          <button className="add-note" onClick={addNote} disabled={notes.length >= 3}>
            <Icon name="plus" size={14} />
            메모 추가
          </button>
        </div>
      </div>

      <div className="notes-board">
        {notes.map((n, i) => (
          <div
            key={n.id}
            className={"sticky " + n.color}
            style={{ "--rot": `${rotations[i % rotations.length]}deg`, transform: `rotate(${rotations[i % rotations.length]}deg)` }}
          >
            <button className="sticky-close" onClick={() => removeNote(n.id)}>
              <Icon name="x" size={12} />
            </button>
            <div className="sticky-title">
              <span className="sticky-title-emoji">{n.emoji}</span>
              {n.title}
            </div>
            <textarea
              value={n.text}
              onChange={(e) => updateNote(n.id, e.target.value)}
              placeholder="메모를 입력하세요..."
            />
            <div className="sticky-foot">
              <span>— {n.author}</span>
              <span>{n.date}</span>
            </div>
          </div>
        ))}
        {notes.length < 3 && (
          <div className="sticky empty" onClick={addNote} style={{ width: 220, minHeight: 200 }}>
            + 새 메모
          </div>
        )}
      </div>

      <div className="notes-foot">
        <span>스티커 메모는 최대 3개까지 추가할 수 있어요.</span>
        <span className="hand">{notes.length} / 3</span>
      </div>

      <DeskPile />
    </div>
  );
}

// ============================================================
// DESK PILE — under the sticky-note board, fills empty space
// 1) 오늘의 한 줄 (lined-paper journal entry)
// 2) 자주 쓰는 정보 (index-card chips: phone, account, etc.)
// ============================================================
function DeskPile() {
  const moods = [
    { emoji: "😌", label: "차분" },
    { emoji: "😊", label: "좋음" },
    { emoji: "😴", label: "피곤" },
    { emoji: "🔥", label: "집중" },
    { emoji: "😵", label: "혼란" },
    { emoji: "🥲", label: "복잡" },
  ];
  const [mood, setMood] = useState("🔥");
  const [journal, setJournal] = useState("디자인 시안 미팅 잘 끝났다. 오후엔 카피 정리만 하면 끝!");

  const [pins, setPins] = useState([
    { id: 1, label: "사무실 wifi", value: "WL_office / coffee2024" },
    { id: 2, label: "회사 계좌", value: "신한 110-***-****" },
    { id: 3, label: "택배함 비번", value: "#1204" },
    { id: 4, label: "주차 자리", value: "B2 — 47번" },
  ]);

  const removePin = (id) => setPins(pins.filter(p => p.id !== id));
  const addPin = () => {
    setPins([...pins, { id: Date.now(), label: "새 메모", value: "내용 입력…" }]);
  };

  return (
    <div className="desk-pile">
      <div className="desk-pile-row">
        <div className="journal-paper">
          <div className="journal-head">
            <div className="journal-tab">오늘의 한 줄</div>
            <div className="mood-pick">
              {moods.map(m => (
                <button
                  key={m.emoji}
                  className={"mood-btn" + (mood === m.emoji ? " on" : "")}
                  onClick={() => setMood(m.emoji)}
                  title={m.label}
                >{m.emoji}</button>
              ))}
            </div>
          </div>
          <div className="journal-body">
            <span className="journal-mood">{mood}</span>
            <textarea
              className="journal-input"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="오늘 어땠어요? 한 줄로 남겨보세요…"
              rows="2"
            />
          </div>
          <div className="journal-foot">
            <span className="hand">{new Date().getMonth()+1}월 {new Date().getDate()}일</span>
            <span className="journal-count">{journal.length} / 80</span>
          </div>
        </div>

        <div className="pin-board">
          <div className="pin-board-head">
            <h3>자주 쓰는 정보</h3>
            <button className="pin-add" onClick={addPin}>
              <Icon name="plus" size={11} />
              핀 추가
            </button>
          </div>
          <div className="pin-cards">
            {pins.map(p => (
              <PinCard key={p.id} pin={p} onRemove={() => removePin(p.id)} onUpdate={(np) => setPins(pins.map(x => x.id === p.id ? np : x))} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PinCard({ pin, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pin.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  return (
    <div className="pin-card" onClick={() => setEditing(true)}>
      <button className="pin-close" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        <Icon name="x" size={10} />
      </button>
      {editing ? (
        <>
          <input
            className="pin-label-in"
            value={pin.label}
            onChange={(e) => onUpdate({ ...pin, label: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="라벨"
          />
          <input
            className="pin-value-in"
            value={pin.value}
            onChange={(e) => onUpdate({ ...pin, value: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            placeholder="내용"
            autoFocus
          />
        </>
      ) : (
        <>
          <div className="pin-label">{pin.label}</div>
          <div className="pin-value">{pin.value}</div>
          <button className="pin-copy" onClick={copy}>
            {copied ? <><Icon name="check" size={10} /> 복사됨</> : <><Icon name="copy" size={10} /> 복사</>}
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================
// CHECKLIST
// ============================================================
function Checklist() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "디자인 시스템 컬러 토큰 정리", done: true, time: "오전 10:00" },
    { id: 2, text: "스티커 메모 컴포넌트 리팩토링", done: true, time: "오전 11:30" },
    { id: 3, text: "포모도로 — 1세션", done: false, time: "오후 1:00" },
    { id: 4, text: "팀 스탠드업", done: false, time: "오후 3:00" },
    { id: 5, text: "장보기 (우유, 빵)", done: false, time: "오후 7:00" },
  ]);
  const [input, setInput] = useState("");

  const done = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const r = 24, c = 2 * Math.PI * r;

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => setTasks(tasks.filter(t => t.id !== id));
  const add = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false, time: "지금" }]);
    setInput("");
  };

  return (
    <div className="checklist-card col-3">
      <div className="card-head">
        <div>
          <div className="card-title"><span className="dot" />오늘 체크리스트</div>
          <div className="card-sub">완료 {done}/{tasks.length}개</div>
        </div>
        <div className="progress-ring">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r={r} stroke="var(--line)" strokeWidth="5" fill="none" />
            <circle cx="30" cy="30" r={r}
              stroke="var(--ink)" strokeWidth="5" fill="none"
              strokeDasharray={c}
              strokeDashoffset={c - (c * pct) / 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.4s" }}
            />
          </svg>
          <div className="pct">{pct}%</div>
        </div>
      </div>

      <div className="add-task">
        <input
          placeholder="할 일을 입력하고 Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button onClick={add}><Icon name="plus" size={14} /></button>
      </div>

      <ul className="tasks">
        {tasks.map(t => (
          <li key={t.id} className={"task" + (t.done ? " done" : "")} onClick={() => toggle(t.id)}>
            <span className="check"><Icon name="check" size={12} /></span>
            <div style={{ flex: 1 }}>
              <div className="task-label">{t.text}</div>
              <div className="task-meta">{t.time}</div>
            </div>
            <button className="task-del" onClick={(e) => { e.stopPropagation(); remove(t.id); }}>
              <Icon name="trash" size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

window.StickyNotes = StickyNotes;
window.Checklist = Checklist;
