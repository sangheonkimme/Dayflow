export const PCField = ({
  label,
  type = "text",
  value,
  onChange,
  dark,
  rightSlot,
  autoFocus,
  placeholder,
  error,
  onKeyDown,
}: any) => {
  const ink = dark ? "#fff" : "#1a1814";
  const mute = dark ? "rgba(255,255,255,0.55)" : "rgba(26,24,20,0.55)";
  const bg = dark ? "rgba(255,255,255,0.04)" : "#fff";
  const line = error
    ? "#dc4c3e"
    : dark
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.1)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: mute,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          background: bg,
          border: `1px solid ${line}`,
          borderRadius: 10,
          transition: "border-color 0.15s",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 14px",
            paddingRight: rightSlot ? 44 : 14,
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontFamily: "inherit",
            color: ink,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: "#dc4c3e", fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};

// ─────────── PC Button ───────────
