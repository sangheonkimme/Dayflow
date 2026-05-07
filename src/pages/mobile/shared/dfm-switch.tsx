// @ts-nocheck

export const DfmSwitch = ({ on, onChange }) => {
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange?.(!on); }} aria-pressed={on}
      style={{
        width: 40, height: 24, borderRadius: 999,
        border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
        background: on ? "var(--ink)" : "transparent",
        padding: 0, cursor: "pointer", position: "relative", flexShrink: 0,
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: on ? "var(--bg-paper)" : "var(--ink-mute)",
        transition: "left .15s",
      }} />
    </button>
  );
}

// ────────────────────────────────────────────────
// THEME — 테마 · 모양
// ────────────────────────────────────────────────
