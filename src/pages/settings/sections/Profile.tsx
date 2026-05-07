// @ts-nocheck
import { SettingRow } from "@/pages/settings/SettingRow";

export const ProfileSection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>프로필</h3>
        <div className="profile-hero">
          <div
            className="avatar"
            style={{
              width: 64,
              height: 64,
              fontSize: 26,
              background: "var(--pink)",
            }}
          >
            N
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 18 }}>나비</b>
            <div className="muted" style={{ fontSize: 13 }}>
              nabi@dayflow.app · 무료 플랜
            </div>
          </div>
          <button className="timer-btn">사진 변경</button>
        </div>
        <SettingRow label="이름">
          <input className="set-input" defaultValue="나비" />
        </SettingRow>
        <SettingRow label="이메일">
          <input className="set-input" defaultValue="nabi@dayflow.app" />
        </SettingRow>
        <SettingRow label="자기소개" sub="대시보드 상단에 표시됩니다">
          <textarea
            className="set-input"
            rows="2"
            defaultValue="디자이너 / 일과 삶의 균형을 추구합니다."
          />
        </SettingRow>
        <SettingRow label="시간대">
          <select className="set-input" defaultValue="seoul">
            <option value="seoul">(GMT+9) 서울</option>
            <option>도쿄</option>
            <option>뉴욕</option>
          </select>
        </SettingRow>
      </div>
    </>
  );
};
