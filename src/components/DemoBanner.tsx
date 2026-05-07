// @ts-nocheck
// 데모(mock) 모드일 때 화면 상단에 표시되는 배너.
// "시작하기" 클릭 시 live 모드로 전환 → 인증 화면으로 이동.

import { useDataModeStore } from "@/store/dataMode";

export const DemoBanner = () => {
  const mode = useDataModeStore((s) => s.mode);
  const setMode = useDataModeStore((s) => s.setMode);

  if (mode !== "mock") return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #fff5d1 0%, #ffe27a 100%)",
        borderBottom: "1px solid var(--line)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        fontSize: 13,
        color: "#1a1814",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>👀</span>
        <span>
          <b>데모 데이터를 보고 있어요</b> · 둘러보고 마음에 들면 시작해보세요
        </span>
      </div>
      <button
        type="button"
        onClick={() => setMode("live")}
        style={{
          background: "#1a1814",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        시작하기 →
      </button>
    </div>
  );
};
