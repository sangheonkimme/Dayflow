// @ts-nocheck
// 환경설정 한 줄 — 라벨 + 보조설명 + 우측 컨트롤
export const SettingRow = ({ label, sub, children }) => {
  return (
    <div className="setting-row">
      <div className="setting-label">
        <b>{label}</b>
        {sub && <small>{sub}</small>}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
};
