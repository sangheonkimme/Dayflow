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
import styles from "./StickyNotes.module.css";

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
    <div className={`${styles.notesCard} col-9`}>
      <div className={styles.notesHead}>
        <div className={styles.notesTitle}>
          <h2>스티커 메모</h2>
          <span className="hand">붙여두면 잊지 않아요</span>
        </div>
        <div className={styles.notesControls}>
          <div className={styles.colorPick} title="새 메모 색상">
            {(["yellow", "pink", "blue"] as const).map((c) => (
              <div
                key={c}
                className={
                  styles.swatch + (activeColor === c ? ` ${styles.active}` : "")
                }
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
            className={styles.addNote}
            onClick={addNote}
            disabled={notes.length >= 3}
          >
            <Icon name="plus" size={14} />
            메모 추가
          </button>
        </div>
      </div>

      <div className={styles.notesBoard}>
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
            className={`${styles.sticky} ${styles.empty}`}
            onClick={addNote}
            style={{ width: 220, minHeight: 200 }}
          >
            + 새 메모
          </div>
        )}
      </div>

      <div className={styles.notesFoot}>
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
    <div className={`${styles.sticky} ${styles[note.color]}`}>
      <button className={styles.stickyClose} onClick={() => onRemove(note.id)}>
        <Icon name="x" size={12} />
      </button>
      <div className={styles.stickyTitle}>
        <span className={styles.stickyTitleEmoji}>{note.emoji}</span>
        <input
          className={styles.stickyTitleInput}
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
      <div className={styles.stickyFoot}>
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
  const removePin = (id: string | number) => removePinById(id);
  const addPin = () => {
    upsertPin({ id: Date.now(), label: "새 메모", value: "내용 입력…" });
  };
  const updatePin = (np: { id: string | number }) => upsertPin(np);

  return (
    <div className={styles.deskPile}>
      <div className={styles.deskPileRow}>
        <div className={styles.journalPaper}>
          <div className={styles.journalHead}>
            <div className={styles.journalTab}>오늘의 한 줄</div>
            <div className={styles.moodPick}>
              {MOODS.map((m) => (
                <button
                  key={m.emoji}
                  className={
                    styles.moodBtn + (mood === m.emoji ? ` ${styles.on}` : "")
                  }
                  onClick={() => setMood(m.emoji)}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.journalBody}>
            <span className={styles.journalMood}>{mood}</span>
            <textarea
              className={styles.journalInput}
              value={journalDraft}
              onChange={(e) => setJournalDraft(e.target.value)}
              onBlur={commitJournal}
              placeholder="오늘 어땠어요? 한 줄로 남겨보세요…"
              rows={2}
            />
          </div>
          <div className={styles.journalFoot}>
            <span className="hand">
              {new Date().getMonth() + 1}월 {new Date().getDate()}일
            </span>
            <span className={styles.journalCount}>{journalDraft.length} / 80</span>
          </div>
        </div>

        <div className={styles.pinBoard}>
          <div className={styles.pinBoardHead}>
            <h3>자주 쓰는 정보</h3>
            <button className={styles.pinAdd} onClick={addPin}>
              <Icon name="plus" size={11} />핀 추가
            </button>
          </div>
          <div className={styles.pinCards}>
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

function PinCard({ pin, onRemove, onUpdate }: any) {
  // editing: null(보기) | "label"(라벨 편집) | "value"(내용 편집)
  const [editing, setEditing] = useState<null | "label" | "value">(null);
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

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pin.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  const close = () => {
    labelField.commit();
    valueField.commit();
    setEditing(null);
  };

  return (
    <div className={styles.pinCard}>
      <button
        className={styles.pinClose}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Icon name="x" size={10} />
      </button>

      {/* 라벨 — 보기/편집 모두 같은 자리에 렌더해 클릭 영역 분리 */}
      {editing === "label" ? (
        <input
          className={styles.pinLabelIn}
          value={labelField.value}
          onChange={(e) => labelField.setDraft(e.target.value)}
          onBlur={close}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="라벨"
          autoFocus
        />
      ) : (
        <div
          className={styles.pinLabel}
          onClick={() => setEditing("label")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setEditing("label");
          }}
          title="클릭하여 라벨 편집"
        >
          {pin.label}
        </div>
      )}

      {/* 값 — 동일 패턴 */}
      {editing === "value" ? (
        <input
          className={styles.pinValueIn}
          value={valueField.value}
          onChange={(e) => valueField.setDraft(e.target.value)}
          onBlur={close}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="내용"
          autoFocus
        />
      ) : (
        <div
          className={styles.pinValue}
          onClick={() => setEditing("value")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setEditing("value");
          }}
          title="클릭하여 내용 편집"
        >
          {pin.value}
        </div>
      )}

      {editing == null && (
        <button className={styles.pinCopy} onClick={copy}>
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
      )}
    </div>
  );
}
