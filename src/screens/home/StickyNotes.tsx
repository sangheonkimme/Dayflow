import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useDraftField } from "@/lib/useDraftField";
import type { StickyColor } from "@/types";
import {
  useStickyNotes,
  stickyDateLabel,
  stickyAuthorLabel,
} from "@/data/sticky-notes";
import { useDailyLog } from "@/data/daily-log";
import { usePinnedInfo } from "@/data/pinned-info";
import { MOODS, emojiToMood, moodToEmoji } from "@/data/lookups";

// ============================================================
// STICKY NOTES — hero feature (with DeskPile beneath)
// ============================================================
export function StickyNotes() {
  const { data: notes, upsert, remove } = useStickyNotes();
  const [activeColor, setActiveColor] = useState<StickyColor>("yellow");

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

  const patchNote = (id, patch) => {
    const n = notes.find((x) => x.id === id);
    if (!n) return;
    const hasChange = Object.entries(patch).some(([k, v]) => n[k] !== v);
    if (hasChange) upsert({ ...n, ...patch });
  };

  const removeNote = (id) => {
    remove(id);
  };

  return (
    <div className="notes-card col-9">
      <div className="notes-head">
        <div className="notes-title">
          <h2>스티커 메모</h2>
          <span className="hand">붙여두면 잊지 않아요</span>
        </div>
        <div className="notes-controls">
          <div className="color-pick" title="새 메모 색상">
            {(["yellow", "pink", "blue"] as const).map((c) => (
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
        {notes.map((n) => (
          <StickyCard
            key={n.id}
            note={n}
            onRemove={removeNote}
            onPatch={patchNote}
          />
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

// 입력 중에는 로컬 draft만 갱신하고 blur 시점에 1회 commit. (IME 안전)
function StickyCard({ note, onRemove, onPatch }) {
  const titleField = useDraftField<string>({
    value: note.title ?? "",
    onCommit: (next) => onPatch(note.id, { title: next }),
  });
  const textField = useDraftField<string>({
    value: note.text,
    onCommit: (next) => onPatch(note.id, { text: next }),
  });

  return (
    <div className={"sticky " + note.color}>
      <button className="sticky-close" onClick={() => onRemove(note.id)}>
        <Icon name="x" size={12} />
      </button>
      <div className="sticky-title">
        <span className="sticky-title-emoji">{note.emoji}</span>
        <input
          className="sticky-title-input"
          value={titleField.value}
          onChange={(e) => titleField.setDraft(e.target.value)}
          onBlur={titleField.commit}
          placeholder="제목"
        />
      </div>
      <textarea
        value={textField.value}
        onChange={(e) => textField.setDraft(e.target.value)}
        onBlur={textField.commit}
        placeholder="메모를 입력하세요..."
      />
      <div className="sticky-foot">
        <span>— {stickyAuthorLabel(note)}</span>
        <span>{stickyDateLabel(note)}</span>
      </div>
    </div>
  );
}

// ============================================================
// DESK PILE — under sticky-note board
// 1) 오늘의 한 줄 (lined-paper journal)
// 2) 자주 쓰는 정보 (index-card chips)
// ============================================================
function DeskPile() {
  const { entry, setOneLine, setMood: setMoodHook } = useDailyLog();
  const mood = moodToEmoji(entry?.mood ?? "fire");
  const journal = entry?.oneLine ?? "";
  const setMood = (emoji) => setMoodHook(emojiToMood(emoji));
  const {
    value: journalDraft,
    setDraft: setJournalDraft,
    commit: commitJournal,
  } = useDraftField<string>({ value: journal, onCommit: setOneLine });

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
              value={journalDraft}
              onChange={(e) => setJournalDraft(e.target.value)}
              onBlur={commitJournal}
              placeholder="오늘 어땠어요? 한 줄로 남겨보세요…"
              rows={2}
            />
          </div>
          <div className="journal-foot">
            <span className="hand">
              {new Date().getMonth() + 1}월 {new Date().getDate()}일
            </span>
            <span className="journal-count">{journalDraft.length} / 80</span>
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

  const labelField = useDraftField<string>({
    value: pin.label,
    onCommit: (next) => {
      if (next !== pin.label) onUpdate({ ...pin, label: next });
    },
  });
  const valueField = useDraftField<string>({
    value: pin.value,
    onCommit: (next) => {
      if (next !== pin.value) onUpdate({ ...pin, value: next });
    },
  });

  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pin.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  const finishEditing = () => {
    labelField.commit();
    valueField.commit();
    setEditing(false);
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
            value={labelField.value}
            onChange={(e) => labelField.setDraft(e.target.value)}
            onBlur={labelField.commit}
            onClick={(e) => e.stopPropagation()}
            placeholder="라벨"
          />
          <input
            className="pin-value-in"
            value={valueField.value}
            onChange={(e) => valueField.setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={finishEditing}
            onKeyDown={(e) => e.key === "Enter" && finishEditing()}
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