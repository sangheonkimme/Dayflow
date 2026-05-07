import { SettingRow } from "@/pages/settings/SettingRow";
import { ToggleSwitch } from "@/pages/settings/ToggleSwitch";

export const SecuritySection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>앱 잠금</h3>
        <SettingRow label="앱 진입 시 잠금" sub="시작할 때 인증 요구">
          <ToggleSwitch on={false} />
        </SettingRow>
        <SettingRow label="가계부 잠금" sub="가계부 페이지만 별도 잠금">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="자동 잠금 시간">
          <select className="set-input" defaultValue="5">
            <option value="0">즉시</option>
            <option value="1">1분 후</option>
            <option value="5">5분 후</option>
            <option value="30">30분 후</option>
          </select>
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>인증</h3>
        <SettingRow label="비밀번호 변경">
          <button className="timer-btn">변경</button>
        </SettingRow>
        <SettingRow label="생체 인증" sub="Face ID / 지문">
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="2단계 인증" sub="이메일 OTP">
          <ToggleSwitch on={false} />
        </SettingRow>
      </div>
    </>
  );
};
