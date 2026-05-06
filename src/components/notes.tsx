// @ts-nocheck
import { useState } from "react";
import { Icon } from "@/components/icons";
import { useStickyNotes } from "@/features/sticky-notes/hooks/useStickyNotes";
import { useChecklist } from "@/features/checklist/hooks/useChecklist";
import { useDailyLog } from "@/features/daily-log/hooks/useDailyLog";
import { usePinnedInfo } from "@/features/pinned-info/hooks/usePinnedInfo";
import { MOODS, emojiToMood, moodToEmoji } from "@/shared/data/seeds/lookups";
import { stickyDateLabel, stickyAuthorLabel } from "@/data/selectors/derived";

// ============================================================
// STICKY NOTES — hero feature
// ============================================================
function StickyNotes() {
  const { data: notes, upsert, remove } = useStickyNotes();
  const [activeColor, setActiveColor] = useState("yellow");

  const addNote = () => {
    upsert({
      id: Date.now(),
      color: activeColor,
      title: "새 메모",
      emoji: "📝",
      text: "",
      date: "방금",
      author: "나",
    });
  };

  const updateNote = (id, text) => {
    const n = notes.find((x) => x.id === id);
    if (n) upsert({ ...n, text });
  };

  const removeNote = (id) => {
    remove(id);
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
            {["yellow", "pink", "blue"].map((c) => (
              <div
                key={c}
                className={"swatch" + (activeColor === c ? " active" : "")}
                style={{
                  background:
                    c === "yellow"
                      ? "var(--yellow)"
                      : c === "pink"
                        ? "var(--pink)"
                        : "var(--blue)",
                }}
                onClick={() => setActiveColor(c)}
              />
            ))}
          </div>
          <button
            className="add-note"
            onClick={addNote}
            disabled={notes.length >= 3}
          >
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
            style={{
              "--rot": `${rotations[i % rotations.length]}deg`,
              transform: `rotate(${rotations[i % rotations.length]}deg)`,
            }}
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
              <span>— {stickyAuthorLabel(n)}</span>
              <span>{stickyDateLabel(n)}</span>
            </div>
          </div>
        ))}
        {notes.length < 3 && (
          <div
            className="sticky empty"
            onClick={addNote}
            style={{ width: 220, minHeight: 200 }}
          >
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
  const { entry, setOneLine, setMood: setMoodHook } = useDailyLog();
  const mood = moodToEmoji(entry?.mood ?? "fire");
  const journal = entry?.oneLine ?? "";
  const setMood = (emoji) => setMoodHook(emojiToMood(emoji));
  const setJournal = (text) => setOneLine(text);

  const {
    data: pins,
    upsert: upsertPin,
    remove: removePinById,
  } = usePinnedInfo();
  const removePin = (id) => removePinById(id);
  const addPin = () => {
    upsertPin({ id: Date.now(), label: "새 메모", value: "내용 입력…" });
  };
  const updatePin = (np) => upsertPin(np);

  return (
    <div className="desk-pile">
      <div className="desk-pile-row">
        <div className="journal-paper">
          <div className="journal-head">
            <div className="journal-tab">오늘의 한 줄</div>
            <div className="mood-pick">
              {MOODS.map((m) => (
                <button
                  key={m.emoji}
                  className={"mood-btn" + (mood === m.emoji ? " on" : "")}
                  onClick={() => setMood(m.emoji)}
                  title={m.label}
                >
                  {m.emoji}
                </button>
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
            <span className="hand">
              {new Date().getMonth() + 1}월 {new Date().getDate()}일
            </span>
            <span className="journal-count">{journal.length} / 80</span>
          </div>
        </div>

        <div className="pin-board">
          <div className="pin-board-head">
            <h3>자주 쓰는 정보</h3>
            <button className="pin-add" onClick={addPin}>
              <Icon name="plus" size={11} />핀 추가
            </button>
          </div>
          <div className="pin-cards">
            {pins.map((p) => (
              <PinCard
                key={p.id}
                pin={p}
                onRemove={() => removePin(p.id)}
                onUpdate={updatePin}
              />
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
      <button
        className="pin-close"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
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
            {copied ? (
              <>
                <Icon name="check" size={10} /> 복사됨
              </>
            ) : (
              <>
                <Icon name="copy" size={10} /> 복사
              </>
            )}
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
  const { data: tasks, upsert, remove: removeTask } = useChecklist();
  const [input, setInput] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const r = 24,
    c = 2 * Math.PI * r;

  const toggle = (id) => {
    const t = tasks.find((x) => x.id === id);
    if (t) upsert({ ...t, done: !t.done });
  };
  const remove = (id) => removeTask(id);
  const add = () => {
    if (!input.trim()) return;
    upsert({ id: Date.now(), text: input, done: false, time: "지금" });
    setInput("");
  };

  return (
    <div className="checklist-card col-3">
      <div className="card-head">
        <div>
          <div className="card-title">
            <span className="dot" />
            오늘 체크리스트
          </div>
          <div className="card-sub">
            완료 {done}/{tasks.length}개
          </div>
        </div>
        <div className="progress-ring">
          <svg width="60" height="60">
            <circle
              cx="30"
              cy="30"
              r={r}
              stroke="var(--line)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="30"
              cy="30"
              r={r}
              stroke="var(--ink)"
              strokeWidth="5"
              fill="none"
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
        <button onClick={add}>
          <Icon name="plus" size={14} />
        </button>
      </div>

      <ul className="tasks">
        {tasks.map((t) => (
          <li
            key={t.id}
            className={"task" + (t.done ? " done" : "")}
            onClick={() => toggle(t.id)}
          >
            <span className="check">
              <Icon name="check" size={12} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="task-label">{t.text}</div>
              <div className="task-meta">{t.time}</div>
            </div>
            <button
              className="task-del"
              onClick={(e) => {
                e.stopPropagation();
                remove(t.id);
              }}
            >
              <Icon name="trash" size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { StickyNotes, Checklist };
