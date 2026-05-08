import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";

export const NotificationsSection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>알림</h3>
        <SettingRow label="포모도로 종료" sub="집중 / 휴식 끝났을 때 알림">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="할 일 마감 임박" sub="마감 1시간 전 알림">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="일정 시작 전" sub="일정 15분 전 미리 알림">
          <ToggleSwitch on={false} />
        </SettingRow>
        <SettingRow label="정기 구독 결제" sub="결제 3일 전 알림">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="이메일 요약" sub="주간 활동 요약 메일">
          <ToggleSwitch on={false} />
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>방해 금지 시간</h3>
        <SettingRow label="시작 시간">
          <input className="set-input" type="time" defaultValue="22:00" />
        </SettingRow>
        <SettingRow label="종료 시간">
          <input className="set-input" type="time" defaultValue="07:00" />
        </SettingRow>
      </div>
    </>
  );
};
