import { useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';

export function Pomodoro() {
  const FOCUS = 25 * 60, BREAK = 5 * 60;
  const [mode, setMode] = useState<'focus' | 'break'>("focus");
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(2);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          setRunning(false);
          if (mode === "focus") setSessions(s => s + 1);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const switchMode = (m: 'focus' | 'break') => {
    setMode(m);
    setRemaining(m === "focus" ? FOCUS : BREAK);
    setRunning(false);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const r = 75, c = 2 * Math.PI * r;
  const total = mode === "focus" ? FOCUS : BREAK;
  const pct = remaining / total;

  return (
    <div className="timer-card pomodoro col-4">
      <div className="card-head">
        <div className="card-title" style={{ color: "var(--red)" }}>
          <Icon name="flame" size={16} />포모도로 타이머
        </div>
        <span className="tag">{sessions}회 완료</span>
      </div>
      <div className="row" style={{ justifyContent: "center", gap: 6, marginBottom: 4 }}>
        <span className={"preset" + (mode === "focus" ? " on" : "")} onClick={() => switchMode("focus")}>집중 25</span>
        <span className={"preset" + (mode === "break" ? " on" : "")} onClick={() => switchMode("break")}>휴식 5</span>
      </div>
      <div className="timer-display">
        <div className="timer-circle">
          <svg width="170" height="170">
            <circle cx="85" cy="85" r={r} stroke="rgba(226,92,77,0.18)" strokeWidth="4" fill="none" />
            <circle cx="85" cy="85" r={r}
              stroke="var(--red)" strokeWidth="4" fill="none"
              strokeDasharray={c}
              strokeDashoffset={c - c * pct}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.3s" }}
            />
          </svg>
          <div className="timer-time">
            {mm}:{ss}
            <small>{mode === "focus" ? "집중 시간" : "휴식 시간"}</small>
          </div>
        </div>
      </div>
      <div className="timer-controls">
        <button className="timer-btn primary" onClick={() => setRunning(!running)}>
          <Icon name={running ? "pause" : "play"} size={12} />
          {running ? "일시정지" : "시작"}
        </button>
      </div>
      <div className="timer-foot">오늘 — {sessions * 25}분 집중</div>
    </div>
  );
}
