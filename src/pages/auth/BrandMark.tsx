export const BrandMark = ({ size = 28, dark = false }: any) => {
  const ink = dark ? "#fff" : "#1a1814";
  const yellow = "#ffd84d";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: yellow,
          position: "relative",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: "50%",
            background: ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: size * 0.18,
            right: size * 0.2,
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: "50%",
            background: ink,
          }}
        />
      </div>
      <b
        style={{
          fontSize: size * 0.55,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: ink,
        }}
      >
        Dayflow
      </b>
    </div>
  );
};
