import { Ico } from "@/screens/mobile/shared/Ico";
import styles from "@/screens/mobile/mobile.module.css";

export const NotifToggleRow = ({ ico, title, sub, value, onChange, last }: any) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 14px",
        borderBottom: last ? "none" : "1px dashed var(--line)",
      }}
    >
      {ico && (
        <div className={styles.dfmToolIco} style={{ width: 32, height: 32 }}>
          <Ico name={ico} size={14} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <b style={{ fontSize: 13, display: "block" }}>{title}</b>
        {sub && (
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            {sub}
          </small>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          border: "1px solid " + (value ? "var(--ink)" : "var(--line)"),
          background: value ? "var(--ink)" : "transparent",
          padding: 0,
          cursor: "pointer",
          position: "relative",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 20 : 2,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: value ? "var(--bg-paper)" : "var(--ink)",
            transition: "left 0.18s cubic-bezier(0.2,0.7,0.2,1)",
          }}
        />
      </button>
    </div>
  );
};
