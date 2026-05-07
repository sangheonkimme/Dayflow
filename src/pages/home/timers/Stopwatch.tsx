import { useState, useEffect } from 'react';
import { Icon } from '@/shared/ui/Icon';

export function Stopwatch() {
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
