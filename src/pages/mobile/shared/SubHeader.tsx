import { Ico } from "@/pages/mobile/shared/Ico";

export const SubHeader = ({ title, onBack, action }: any) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <button className="dfm-icon-btn" onClick={onBack} aria-label="뒤로">
        <Ico name="chevL" size={18} />
      </button>
      <b style={{ flex: 1, fontSize: 17, letterSpacing: "-0.01em" }}>{title}</b>
      {action}
    </div>
  );
};

// ────────────────────────────────────────────────
// SUBSCRIPTIONS — 구독 관리
// ────────────────────────────────────────────────
