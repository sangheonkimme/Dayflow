import { Icon } from "@/components/Icon";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/settings/SettingsPage.module.css";
import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";

export const AppearanceSection = ({ tweaks, setTweak }: any) => {
  const accents = [
    { id: "yellow", c: "#ffe27a", label: "노랑" },
    { id: "coral", c: "#ffb38a", label: "코랄" },
    { id: "mint", c: "#b9e7c9", label: "민트" },
    { id: "lilac", c: "#d4c1f0", label: "라일락" },
  ];
  return (
    <>
      <div className={styles.group}>
        <h3>테마</h3>
        <SettingRow label="다크 모드" sub="저녁 작업에 편한 어두운 테마">
          <ToggleSwitch
            on={!!tweaks.dark}
            onChange={(v) => setTweak("dark", v)}
          />
        </SettingRow>
        <SettingRow label="포인트 컬러" sub="브랜드 색상과 강조 요소에 적용">
          <div className="row" style={{ gap: 8 }}>
            {accents.map((a) => (
              <div
                key={a.id}
                className={
                  styles.accSwatch +
                  (tweaks.accent === a.id ? " " + styles.on : "")
                }
                style={{ background: a.c }}
                {...pressable(() => setTweak("accent", a.id))}
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

      <div className={styles.group}>
        <h3>글꼴 · 타이포그래피</h3>
        <SettingRow label="기본 글꼴">
          <select className={styles.setInput} defaultValue="jakarta">
            <option value="jakarta">Plus Jakarta Sans</option>
            <option>Pretendard</option>
            <option>Noto Sans KR</option>
          </select>
        </SettingRow>
        <SettingRow label="글자 크기" sub="앱 전체 기준">
          <select className={styles.setInput} defaultValue="m">
            <option value="s">작게</option>
            <option value="m">보통</option>
            <option value="l">크게</option>
          </select>
        </SettingRow>
      </div>
    </>
  );
};
