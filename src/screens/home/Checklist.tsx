import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useChecklist } from "@/data/checklist";
import styles from "./Checklist.module.css";

export function Checklist() {
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
    <div className={`${styles.checklistCard} col-3`}>
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
          placeholder="할 일을 입력하고 Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button onClick={add}>
          <Icon name="plus" size={14} />
        </button>
      </div>

      <ul className={styles.tasks}>
        {tasks.map((t) => (
          <li
            key={t.id}
            className={`${styles.task}${t.done ? ` ${styles.done}` : ""}`}
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
