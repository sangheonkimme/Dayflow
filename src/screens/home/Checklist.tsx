import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { useChecklist } from "@/data/checklist";
import styles from "./Checklist.module.css";

const MAX_TASKS = 7;

export function Checklist() {
  const { data: tasks, upsert, remove: removeTask } = useChecklist();
  const [input, setInput] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const r = 24,
    c = 2 * Math.PI * r;
  const isFull = tasks.length >= MAX_TASKS;

  // 미완료 → 완료 순서로 분리. 같은 그룹 내 입력 순서는 유지.
  const { pending, completed } = useMemo(() => {
    const pending = tasks.filter((t) => !t.done);
    const completed = tasks.filter((t) => t.done);
    return { pending, completed };
  }, [tasks]);

  const toggle = (id: number) => {
    const t = tasks.find((x) => x.id === id);
    if (t) upsert({ ...t, done: !t.done });
  };
  const remove = (id: number) => removeTask(id);
  const add = () => {
    if (!input.trim()) return;
    if (isFull) return;
    upsert({ id: Date.now(), text: input, done: false, time: "지금" });
    setInput("");
  };

  return (
    <div className={`${styles.checklistCard} col-3`}>
      <div className="card-head">
        <div>
          <div className="card-title">
            <span className="dot" />
            오늘 체크리스트
          </div>
          <div className="card-sub">
            완료 {done}/{tasks.length}개{" "}
            <span style={{ color: "var(--ink-mute)" }}>
              (최대 {MAX_TASKS}개)
            </span>
          </div>
        </div>
        <div className={styles.progressRing}>
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
          <div className={styles.pct}>{pct}%</div>
        </div>
      </div>

      <div className={styles.addTask}>
        <input
          placeholder={
            isFull
              ? `최대 ${MAX_TASKS}개 — 기존 항목을 완료/삭제하세요`
              : "할 일을 입력하고 Enter"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          disabled={isFull}
        />
        <button onClick={add} disabled={isFull}>
          <Icon name="plus" size={14} />
        </button>
      </div>

      <ul className={styles.tasks}>
        {pending.map((t) => (
          <li
            key={t.id}
            className={styles.task}
            onClick={() => toggle(t.id)}
          >
            <span className={styles.check}>
              <Icon name="check" size={12} />
            </span>
            <div style={{ flex: 1 }}>
              <div className={styles.taskLabel}>{t.text}</div>
              <div className={styles.taskMeta}>{t.time}</div>
            </div>
            <button
              className={styles.taskDel}
              onClick={(e) => {
                e.stopPropagation();
                remove(t.id);
              }}
            >
              <Icon name="trash" size={14} />
            </button>
          </li>
        ))}
        {completed.length > 0 && pending.length > 0 && (
          <li className={styles.divider} aria-hidden="true">
            <span>완료</span>
          </li>
        )}
        {completed.map((t) => (
          <li
            key={t.id}
            className={`${styles.task} ${styles.done}`}
            onClick={() => toggle(t.id)}
          >
            <span className={styles.check}>
              <Icon name="check" size={12} />
            </span>
            <div style={{ flex: 1 }}>
              <div className={styles.taskLabel}>{t.text}</div>
              <div className={styles.taskMeta}>{t.time}</div>
            </div>
            <button
              className={styles.taskDel}
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
