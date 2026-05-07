// @ts-nocheck
export const SectionHeader = ({ title, action, onAction }) => {
  return (
    <div className="dfm-section-h">
      <h3>{title}</h3>
      {action && (
        <span
          className={"more" + (onAction ? " clickable" : "")}
          onClick={onAction}
          style={onAction ? { cursor: "pointer" } : undefined}
        >{action} →</span>
      )}
    </div>
  );
}

// ───────── Swipe-actions row (iOS pattern) ─────────
