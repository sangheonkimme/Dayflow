import { SettingRow } from "@/pages/settings/SettingRow";
import { ToggleSwitch } from "@/pages/settings/ToggleSwitch";

export const ToolsSection = () => {
  return (
    <>
      <div className="settings-group">
        <h3>포모도로 기본값</h3>
        <SettingRow label="집중 시간 (분)">
          <input className="set-input" type="number" defaultValue="25" />
        </SettingRow>
        <SettingRow label="짧은 휴식 (분)">
          <input className="set-input" type="number" defaultValue="5" />
        </SettingRow>
        <SettingRow label="긴 휴식 (분)">
          <input className="set-input" type="number" defaultValue="15" />
        </SettingRow>
        <SettingRow label="자동으로 다음 세션 시작">
          <ToggleSwitch on={false} />
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>스티커 메모</h3>
        <SettingRow label="새 메모 기본 색상">
          <select className="set-input" defaultValue="yellow">
            <option value="yellow">노랑</option>
            <option>분홍</option>
            <option>파랑</option>
          </select>
        </SettingRow>
        <SettingRow label="최대 메모 개수">
          <input className="set-input" type="number" defaultValue="3" />
        </SettingRow>
      </div>
    </>
  );
};
