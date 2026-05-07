import { useState, useEffect } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { TIMER_PRESETS } from '@/data/lookups';

export function GeneralTimer() {
  const [duration, setDuration] = useState(5 * 60);
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
