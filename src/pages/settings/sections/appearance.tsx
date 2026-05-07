// @ts-nocheck
import { Icon } from "@/components/icons";
import { SettingRow } from "@/pages/settings/setting-row";
import { ToggleSwitch } from "@/pages/settings/toggle-switch";

export const AppearanceSection = ({ tweaks, setTweak }) => {
  const accents = [
    { id: "yellow", c: "#ffe27a", label: "노랑" },
    { id: "coral", c: "#ffb38a", label: "코랄" },
    { id: "mint", c: "#b9e7c9", label: "민트" },
    { id: "lilac", c: "#d4c1f0", label: "라일락" },
  ];
  return (
    <>
      <div className="settings-group">
        <h3>테마</h3>
        <SettingRow label="다크 모드" sub="저녁 작업에 편한 어두운 테마">
          <ToggleSwitch on={!!tweaks.dark} onChange={(v) => setTweak("dark", v)} />
        </SettingRow>
        <SettingRow label="포인트 컬러" sub="브랜드 색상과 강조 요소에 적용">
          <div className="row" style={{ gap: 8 }}>
            {accents.map((a) => (
              <div
                key={a.id}
                className={"acc-swatch" + (tweaks.accent === a.id ? " on" : "")}
                style={{ background: a.c }}
                onClick={() => setTweak("accent", a.id)}
                title={a.label}
              >
                {tweaks.accent === a.id && <Icon name="check" size={14} />}
              </div>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="달력 표시" sub="대시보드에 미니 달력 노출">
          <ToggleSwitch
            on={tweaks.showCalendar !== false}
            onChange={(v) => setTweak("showCalendar", v)}
          />
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>글꼴 · 타이포그래피</h3>
        <SettingRow label="기본 글꼴">
          <select className="set-input" defaultValue="jakarta">
            <option value="jakarta">Plus Jakarta Sans</option>
            <option>Pretendard</option>
            <option>Noto Sans KR</option>
          </select>
        </SettingRow>
        <SettingRow label="글자 크기" sub="앱 전체 기준">
          <select className="set-input" defaultValue="m">
            <option value="s">작게</option>
            <option value="m">보통</option>
            <option value="l">크게</option>
          </select>
        </SettingRow>
      </div>
    </>
  );
}
