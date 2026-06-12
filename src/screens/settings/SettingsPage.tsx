import { useState } from "react";
import { Icon } from "@/components/Icon";
import { pressable } from "@/lib/a11y";
import { ProfileSection } from "@/screens/settings/sections/Profile";
import { AppearanceSection } from "@/screens/settings/sections/Appearance";
import { LedgerSettingsSection } from "@/screens/settings/sections/Ledger";
import { NotificationsSection } from "@/screens/settings/sections/Notifications";
import { ToolsSection } from "@/screens/settings/sections/Tools";
import { SecuritySection } from "@/screens/settings/sections/Security";
import { DataSection } from "@/screens/settings/sections/Data";
import { AccountSection } from "@/screens/settings/sections/Account";

export const SettingsPage = ({ tweaks, setTweak }: any) => {
  const [section, setSection] = useState("profile");
  const sections = [
    {
      id: "profile",
      icon: "home",
      label: "프로필",
      sub: "이름 · 이메일 · 사진",
    },
    {
      id: "appearance",
      icon: "sparkle",
      label: "테마 · 외관",
      sub: "다크 모드 · 색상",
    },
    {
      id: "ledger",
      icon: "wallet",
      label: "가계부 설정",
      sub: "월급일 · 카테고리 · 통화",
    },
    {
      id: "notifications",
      icon: "bell",
      label: "알림",
      sub: "푸시 · 이메일 · 사운드",
    },
    {
      id: "tools",
      icon: "settings",
      label: "도구 설정",
      sub: "타이머 · 메모 기본값",
    },
    {
      id: "security",
      icon: "settings",
      label: "보안 · 잠금",
      sub: "비밀번호 · 생체 인증",
    },
    {
      id: "data",
      icon: "wallet",
      label: "데이터",
      sub: "백업 · 내보내기 · 삭제",
    },
    { id: "account", icon: "coin", label: "계정 · 결제", sub: "플랜 · 청구" },
  ];

  return (
    <div data-screen-label="04 환경설정">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 환경설정</div>
          <h1 className="page-title">
            환경설정 <span className="hand-sub">— 내 입맛에 맞게</span>
          </h1>
          <div className="page-sub">앱 동작과 모양을 자유롭게 바꿔보세요</div>
        </div>
        <button
          className="timer-btn"
          disabled
          title="변경 사항은 자동으로 저장돼요"
        >
          자동 저장됨
        </button>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav">
          {sections.map((s) => (
            <div
              key={s.id}
              className={"settings-nav-item" + (section === s.id ? " on" : "")}
              {...pressable(() => setSection(s.id))}
            >
              <Icon name={s.icon} size={16} />
              <div>
                <b>{s.label}</b>
                <small>{s.sub}</small>
              </div>
            </div>
          ))}
        </aside>

        <div className="settings-main">
          {section === "profile" && <ProfileSection />}
          {section === "appearance" && (
            <AppearanceSection tweaks={tweaks} setTweak={setTweak} />
          )}
          {section === "ledger" && (
            <LedgerSettingsSection tweaks={tweaks} setTweak={setTweak} />
          )}
          {section === "notifications" && <NotificationsSection />}
          {section === "tools" && <ToolsSection />}
          {section === "security" && <SecuritySection />}
          {section === "data" && <DataSection />}
          {section === "account" && <AccountSection />}
        </div>
      </div>
    </div>
  );
};
