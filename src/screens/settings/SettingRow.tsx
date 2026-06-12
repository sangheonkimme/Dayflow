import styles from "./SettingRow.module.css";

// 환경설정 한 줄 — 라벨 + 보조설명 + 우측 컨트롤
// comingSoon: 아직 저장 로직이 없는 항목 — "준비중" 뱃지 + 컨트롤 비활성 처리
export const SettingRow = ({ label, sub, comingSoon, children }: any) => {
  return (
    <div className="setting-row">
      <div className="setting-label">
        {comingSoon ? (
          <div className={styles.labelRow}>
            <b>{label}</b>
            <span className={styles.badge}>준비중</span>
          </div>
        ) : (
          <b>{label}</b>
        )}
        {sub && <small>{sub}</small>}
      </div>
      <div className="setting-control">
        {comingSoon ? (
          <fieldset className={styles.control} disabled>
            {children}
          </fieldset>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
