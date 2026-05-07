import { useState, useEffect } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { TIMER_PRESETS } from '@/shared/data/seeds/lookups';

// ============================================================
// TIMER — generic countdown
// ============================================================
function GeneralTimer() {
  const [duration, setDuration] = useState(5 * 60); // seconds
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const presets = TIMER_PRESETS;
  const [activePreset, setActivePreset] = useState(5);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const setPreset = (m: number) => {
    setDuration(m * 60);
    setRemaining(m * 60);
    setRunning(false);
    setActivePreset(m);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const r = 75, c = 2 * Math.PI * r;
  const pct = duration ? remaining / duration : 0;

  return (
    <div className="timer-card col-4">
      <div className="card-head">
        <div className="card-title">
          <Icon name="target" size={16} />일반 타이머
        </div>
        <button className="icon-btn" style={{ width: 30, height: 30 }}><Icon name="settings" size={14} /></button>
      </div>
      <div className="timer-display">
        <div className="timer-circle">
          <svg width="170" height="170">
            <circle cx="85" cy="85" r={r} stroke="var(--line)" strokeWidth="3" fill="none" />
            <circle cx="85" cy="85" r={r}
              stroke="var(--ink)" strokeWidth="3" fill="none"
              strokeDasharray={c}
              strokeDashoffset={c - c * pct}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.3s" }}
            />
          </svg>
          <div className="timer-time">
            {mm}:{ss}
            <small>총 {Math.floor(duration/60)}:00</small>
          </div>
        </div>
      </div>
      <div className="timer-controls">
        <button className="timer-btn primary" onClick={() => setRunning(!running)}>
          <Icon name={running ? "pause" : "play"} size={12} />
          {running ? "일시정지" : "시작"}
        </button>
        <button className="timer-btn" onClick={() => { setRemaining(duration); setRunning(false); }}>
          <Icon name="reset" size={12} />초기화
        </button>
      </div>
      <div className="timer-foot">빠른 설정 — 클릭 한 번으로 시간 지정</div>
      <div className="preset-row">
        {presets.map(p => (
          <span key={p} className={"preset" + (activePreset === p ? " on" : "")} onClick={() => setPreset(p)}>{p}M</span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// POMODORO
// ============================================================
function Pomodoro() {
  const FOCUS = 25 * 60, BREAK = 5 * 60;
  const [mode, setMode] = useState("focus");
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

// ============================================================
// STOPWATCH
// ============================================================
function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setMs(m => m + 10), 10);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);

  return (
    <div className="timer-card stopwatch col-4">
      <div className="card-head">
        <div className="card-title" style={{ color: "#2c5e8b" }}>
          <Icon name="zap" size={16} />스톱워치
        </div>
        {running && <span className="tag live">REC</span>}
      </div>
      <div className="timer-display">
        <div className="timer-circle">
          <svg width="170" height="170">
            <circle cx="85" cy="85" r="75" stroke="rgba(44,94,139,0.18)" strokeWidth="4" fill="none" />
          </svg>
          <div className="timer-time" style={{ fontSize: 28 }}>
            {String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}.{String(cs).padStart(2,"0")}
            <small>{running ? "측정중" : "정지"}</small>
          </div>
        </div>
      </div>
      <div className="timer-controls">
        <button className="timer-btn primary" onClick={() => setRunning(!running)}>
          <Icon name={running ? "pause" : "play"} size={12} />
          {running ? "정지" : "시작"}
        </button>
        <button className="timer-btn" onClick={() => setLaps([...laps, ms])} disabled={!running}>
          기록
        </button>
        <button className="timer-btn" onClick={() => { setMs(0); setLaps([]); setRunning(false); }}>
          <Icon name="reset" size={12} />
        </button>
      </div>
      <div className="timer-foot">랩 {laps.length}개</div>
    </div>
  );
}

export { GeneralTimer, Pomodoro, Stopwatch };