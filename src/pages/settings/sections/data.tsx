// @ts-nocheck
import { SettingRow } from "@/pages/settings/setting-row";
import { ToggleSwitch } from "@/pages/settings/toggle-switch";

export const DataSection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>백업 · 내보내기</h3>
        <SettingRow label="자동 백업" sub="매일 자정 클라우드에 저장">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="가계부 내보내기" sub="CSV / Excel 형식">
          <button className="timer-btn">다운로드</button>
        </SettingRow>
        <SettingRow label="전체 데이터 내보내기" sub="JSON 형식">
          <button className="timer-btn">다운로드</button>
        </SettingRow>
      </div>
      <div className="settings-group danger">
        <h3>위험 구역</h3>
        <SettingRow label="모든 메모 삭제" sub="복구할 수 없습니다">
          <button className="timer-btn danger-btn">삭제</button>
        </SettingRow>
        <SettingRow label="계정 삭제" sub="모든 데이터가 영구 삭제됩니다">
          <button className="timer-btn danger-btn">계정 삭제</button>
        </SettingRow>
      </div>
    </>
  );
}
