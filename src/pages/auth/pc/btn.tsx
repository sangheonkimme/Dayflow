// @ts-nocheck

export const PCBtn = ({
  children,
  kind = "primary",
  onClick,
  dark,
  disabled,
  full = true,
  size = "md",
}) => {
  const styles = {
    primary: {
      background: dark ? "#fff" : "#1a1814",
      color: dark ? "#1a1814" : "#fff",
      border: "1px solid transparent",
    },
    google: {
      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.16)"
        : "1px solid rgba(0,0,0,0.1)",
    },
    ghost: {
      background: "transparent",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.16)"
        : "1px solid rgba(0,0,0,0.1)",
    },
    yellow: {
      background: "#ffd84d",
      color: "#1a1814",
      border: "1px solid transparent",
    },
  };
  const sizes = {
    md: { padding: "12px 20px", fontSize: 14 },
    lg: { padding: "14px 22px", fontSize: 15 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[kind],
        ...sizes[size],
        width: full ? "100%" : "auto",
        borderRadius: 10,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        letterSpacing: "-0.01em",
        transition: "all 0.1s",
      }}
    >
      {children}
    </button>
  );
}

// ─────────── Brand panel (left side, big visual) ───────────
