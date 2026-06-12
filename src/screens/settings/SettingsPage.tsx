import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProfileSection } from "@/screens/settings/sections/Profile";
import { AppearanceSection } from "@/screens/settings/sections/Appearance";
import { LedgerSettingsSection } from "@/screens/settings/sections/Ledger";
import { NotificationsSection } from "@/screens/settings/sections/Notifications";
import { ToolsSection } from "@/screens/settings/sections/Tools";
import { SecuritySection } from "@/screens/settings/sections/Security";
import { DataSection } from "@/screens/settings/sections/Data";
import { AccountSection } from "@/screens/settings/sections/Account";

// 8개 섹션 정의 — 탭 라우팅(?tab=)·검색 필터의 단일 소스.
// keywords: 섹션 안의 개별 설정명까지 검색되도록 한 색인(라벨/보조설명 외 추가어).
const SECTIONS = [
  {
    id: "profile",
    icon: "home",
    label: "프로필",
    sub: "이름 · 이메일 · 사진",
    keywords: "프로필 이름 이메일 사진 아바타 닉네임",
  },
  {
    id: "appearance",
    icon: "sparkle",
    label: "테마 · 외관",
    sub: "다크 모드 · 색상",
    keywords: "테마 외관 다크 모드 라이트 포인트 컬러 색상 글꼴 폰트 글자 크기 달력",
  },
  {
    id: "ledger",
    icon: "wallet",
    label: "가계부 설정",
    sub: "월급일 · 카테고리 · 통화",
    keywords: "가계부 월급일 급여 카테고리 통화 예산 한도 정기결제 자동분류 주기",
  },
  {
    id: "notifications",
    icon: "bell",
    label: "알림",
    sub: "푸시 · 이메일 · 사운드",
    keywords: "알림 푸시 이메일 사운드 리마인더 방해금지 포모도로 마감 일정",
  },
  {
    id: "tools",
    icon: "settings",
    label: "도구 설정",
    sub: "타이머 · 메모 기본값",
    keywords: "도구 타이머 포모도로 집중 휴식 메모 스티커 기본값",
  },
  {
    id: "security",
    icon: "settings",
    label: "보안 · 잠금",
    sub: "비밀번호 · 생체 인증",
    keywords: "보안 잠금 비밀번호 패스워드 생체 지문 페이스 2단계 2fa otp 인증",
  },
  {
    id: "data",
    icon: "wallet",
    label: "데이터",
    sub: "백업 · 내보내기 · 삭제",
    keywords: "데이터 백업 내보내기 csv json 다운로드 삭제 탈퇴 계정삭제 export",
  },
  {
    id: "account",
    icon: "coin",
    label: "계정 · 결제",
    sub: "플랜 · 청구",
    keywords: "계정 결제 플랜 구독 pro 프로 업그레이드 청구 요금",
  },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id) as readonly string[];
const DEFAULT_SECTION = "profile";

export const SettingsPage = ({ tweaks, setTweak }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // 탭 상태는 URL ?tab= 에 보관 → 딥링크/새로고침/뒤로가기 지원.
  const rawTab = searchParams.get("tab");
  const section =
    rawTab && SECTION_IDS.includes(rawTab) ? rawTab : DEFAULT_SECTION;

  const setSection = useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tab", id);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 검색 — 라벨/보조설명/키워드 색인에 대해 부분 일치 필터.
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? SECTIONS.filter((s) =>
            `${s.label} ${s.sub} ${s.keywords}`.toLowerCase().includes(q),
          )
        : SECTIONS,
    [q],
  );

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
        <aside className="settings-nav" aria-label="환경설정 섹션">
          <div className="settings-search" role="search">
            <Icon name="search" size={14} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="설정 검색…"
              aria-label="설정 검색"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="settings-empty" role="status">
              “{query}” 검색 결과가 없어요
            </div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                className={
                  "settings-nav-item" + (section === s.id ? " on" : "")
                }
                aria-current={section === s.id ? "page" : undefined}
                onClick={() => setSection(s.id)}
              >
                <Icon name={s.icon} size={16} />
                <div>
                  <b>{s.label}</b>
                  <small>{s.sub}</small>
                </div>
              </button>
            ))
          )}
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
