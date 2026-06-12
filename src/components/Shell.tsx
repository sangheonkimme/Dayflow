import { Icon } from "@/components/Icon";
import { DOW } from "@/lib/date";
import { useAuth } from "@/data/auth";
import { IMAGE_TOOLS_PUBLIC } from "@/lib/feature-flags";
import { pressable } from "@/lib/a11y";
import s from "@/components/Shell.module.css";

// ============================================================
// SIDEBAR
// ============================================================
interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

function Sidebar({ active, onSelect }: SidebarProps) {
  const { user, signOut } = useAuth();
  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "나비";
  const avatarChar = (displayName[0] ?? "N").toUpperCase();
  // settings is reachable via gear icon next to user name in the side-foot,
  // so it doesn't need its own nav entry.
  const groups = [
    {
      label: "홈",
      items: [
        { id: "home", icon: "home", label: "대시보드", sub: "오늘의 한눈에" },
      ],
    },
    {
      label: "가계 · 일정",
      items: [
        {
          id: "ledger",
          icon: "wallet",
          label: "가계부",
          sub: "수입 · 지출 · 통계",
        },
        {
          id: "txns",
          icon: "cash",
          label: "거래내역",
          sub: "전체 검색 · 상세",
        },
        { id: "subs", icon: "repeat", label: "정기구독", sub: "구독 관리" },
        { id: "calendar", icon: "cal", label: "캘린더", sub: "일정 · 이벤트" },
      ],
    },
    {
      label: "기록",
      items: [{ id: "memo", icon: "note", label: "메모", sub: "장문 메모" }],
    },
    {
      label: "도구",
      items: [
        {
          id: "salary",
          icon: "coin",
          label: "연봉 계산기",
          sub: "실수령액 계산",
        },
        {
          id: "loan",
          icon: "cash",
          label: "대출 이자 계산기",
          sub: "원리금/원금 균등",
        },
        ...(IMAGE_TOOLS_PUBLIC
          ? [
              {
                id: "crop",
                icon: "crop",
                label: "이미지 자르기",
                sub: "비율 / 크롭",
              },
              {
                id: "pdf",
                icon: "pdf",
                label: "이미지 → PDF",
                sub: "한번에 변환",
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.brandMark}>D</div>
        <div>
          <div className={s.brandName}>Dayflow</div>
          <div className={s.brandTag}>Dashboard · 2026</div>
        </div>
      </div>

      <nav className={s.nav}>
        {groups.map((g, gi) => (
          <div
            key={g.label}
            className={`${s.navGroup}${gi === 0 ? ` ${s.first}` : ""}`}
          >
            <div className={s.sectionLabel}>{g.label}</div>
            {g.items.map((it) => (
              <div
                key={it.id}
                className={`${s.navItem}${active === it.id ? ` ${s.active}` : ""}`}
                {...pressable(() => onSelect(it.id))}
              >
                <Icon name={it.icon} size={18} />
                <div className={s.labelWrap}>
                  <span>{it.label}</span>
                  <small>{it.sub}</small>
                </div>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className={s.footWrap}>
        <div
          className={`${s.foot}${active === "settings" ? ` ${s.active}` : ""}`}
        >
          <div className={s.avatar}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
            ) : (
              avatarChar
            )}
          </div>
          <div className={s.footMeta}>
            <b>{displayName}</b>
            <span>{user ? "무료 플랜" : "로그인 필요"}</span>
          </div>
          <button
            className={s.footSettings}
            onClick={() => onSelect("settings")}
            title="환경설정"
            aria-label="환경설정"
          >
            <Icon name="settings" size={16} />
          </button>
        </div>
        {user && (
          <button
            type="button"
            className={s.logout}
            onClick={() => signOut()}
            aria-label="로그아웃"
          >
            <Icon name="logout" size={14} />
            로그아웃
          </button>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// TOPBAR
// ============================================================
interface TopbarProps {
  dark?: boolean;
  onToggleDark?: () => void;
  onSearch?: () => void;
}

function Topbar({ dark, onToggleDark, onSearch }: TopbarProps) {
  const today = new Date();
  const weekday = DOW[today.getDay()];
  const { user } = useAuth();
  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "방문자";
  return (
    <div className={s.topbar}>
      <div>
        <h1>
          좋은 아침이에요, {displayName}{" "}
          <span className="hand">— let's get it done</span>
        </h1>
        <div className={s.topbarSub}>
          {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일 (
          {weekday}) · 오늘은 4개의 일정과 1개의 포모도로 세션이 예약되어
          있어요.
        </div>
      </div>
      <div className={s.topbarActions}>
        <div className={s.search} {...pressable(() => onSearch?.())}>
          <Icon name="search" size={14} />
          <input placeholder="검색하기..." readOnly />
          <kbd>⌘K</kbd>
        </div>
        <button className="icon-btn" onClick={onToggleDark} title="테마 변경">
          <Icon name={dark ? "sun" : "moon"} size={16} />
        </button>
        <button className="icon-btn" title="알림">
          <Icon name="bell" size={16} />
        </button>
      </div>
    </div>
  );
}

export { Sidebar, Topbar };
