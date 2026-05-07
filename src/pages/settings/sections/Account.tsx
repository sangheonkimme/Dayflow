// @ts-nocheck

export const AccountSection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>현재 플랜</h3>
        <div className="plan-card">
          <div>
            <b style={{ fontSize: 18 }}>무료 플랜</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              스티커 3개 · 기본 도구 · 광고 없음
            </div>
          </div>
          <button className="timer-btn primary">Pro로 업그레이드</button>
        </div>
        <div className="plan-card pro">
          <div>
            <b style={{ fontSize: 18 }}>Pro 플랜 — ₩4,900/월</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              무제한 메모 · 클라우드 백업 · 우선 지원 · 가족 공유
            </div>
          </div>
          <span className="tag">추천</span>
        </div>
      </div>
    </>
  );
};
