import styles from "@/screens/mobile/mobile.module.css";
import { pressable } from "@/lib/a11y";

export const SectionHeader = ({ title, action, onAction }: any) => {
  return (
    <div className={styles.dfmSectionH}>
      <h3>{title}</h3>
      {action && (
        <span
          className={styles.more + (onAction ? " " + styles.clickable : "")}
          {...(onAction ? pressable(onAction) : {})}
          style={onAction ? { cursor: "pointer" } : undefined}
        >
          {action} →
        </span>
      )}
    </div>
  );
};

// ───────── Swipe-actions row (iOS pattern) ─────────
