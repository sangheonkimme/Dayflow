export const Btn = ({
  children,
  kind = "primary",
  onClick,
  dark,
  disabled,
  full = true,
}: any) => {
  const styles = {
    primary: {
      background: dark ? "#fff" : "#1a1814",
      color: dark ? "#1a1814" : "#fff",
      border: "1px solid transparent",
    },
    google: {
      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(0,0,0,0.12)",
    },
    ghost: {
      background: "transparent",
      color: dark ? "#fff" : "#1a1814",
      border: dark
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(0,0,0,0.12)",
    },
    yellow: {
      background: "#ffd84d",
      color: "#1a1814",
      border: "1px solid transparent",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[kind],
        width: full ? "100%" : "auto",
        padding: "13px 20px",
        borderRadius: 12,
        fontSize: 14.5,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        letterSpacing: "-0.01em",
        transition: "transform 0.1s, opacity 0.15s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {children}
    </button>
  );
};
