"use client";
import { useState } from "react";

import styles from "@/screens/mobile/mobile.module.css";
import { useAuth } from "@/data/auth";

// 추출된 헬퍼/탭 (Phase 6c-1)
import { Ico } from "@/screens/mobile/shared/Ico";
import { MobileHome } from "@/screens/mobile/tabs/Home";
import { MobileLedger } from "@/screens/mobile/tabs/Ledger";
import { MobileCalendar } from "@/screens/mobile/tabs/Calendar";
import { MobileMenu } from "@/screens/mobile/tabs/Menu";

// 추출된 화면/시트 (Phase 6c-2)
import { SubHeader } from "@/screens/mobile/shared/SubHeader";
import { setOpenTxnRef } from "@/screens/mobile/shared/TxnDetailBridge";
import { SubscriptionsScreen } from "@/screens/mobile/screens/Subscriptions";
import { NotificationsScreen } from "@/screens/mobile/screens/Notifications";
import { ProfileScreen } from "@/screens/mobile/screens/Profile";
import { ThemeScreen } from "@/screens/mobile/screens/Theme";
import { ReceiptSheet } from "@/screens/mobile/sheets/ReceiptSheet";
import { TimerSettingsSheet } from "@/screens/mobile/sheets/TimerSettingsSheet";
import { AddTxnSheet } from "@/screens/mobile/sheets/AddTxnSheet";
import { AddEventSheet } from "@/screens/mobile/sheets/AddEventSheet";
import { AddSubSheet } from "@/screens/mobile/sheets/AddSubSheet";
import { SearchSheet } from "@/screens/mobile/sheets/SearchSheet";
import { UpgradeSheet } from "@/screens/mobile/sheets/UpgradeSheet";

// ============================================================
// Dayflow Mobile · Adaptive layout
// 메인 홈은 완성도 높게, 그 외 탭은 placeholder
// ============================================================

const MobileApp = ({ initialTab = "home" }: any) => {
  const { user } = useAuth();
  const userName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "나비";
  const [tab, setTab] = useState(initialTab);
  const [openTxn, setOpenTxn] = useState<unknown>(null);
  const [addTxnOpen, setAddTxnOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [timerSetOpen, setTimerSetOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    sets: 4,
    sound: "차임",
    autoStart: false,
    vibrate: true,
  });
  const [menuStack, setMenuStack] = useState<string[]>([]); // ["subs"], ["notif"]
  setOpenTxnRef(setOpenTxn);

  const onFab = () => {
    // contextual:
    //   menu → calendar → 일정 추가  ·  menu → subs → 구독 추가
    //   ledger / home / community → 거래 추가
    const top = menuStack[menuStack.length - 1];
    if (tab === "calendar") setAddEventOpen(true);
    else if (tab === "menu" && top === "calendar") setAddEventOpen(true);
    else if (tab === "menu" && top === "subs") setAddSubOpen(true);
    else setAddTxnOpen(true);
  };

  // when leaving menu tab, reset stack
  const goTab = (t) => {
    setTab(t);
    if (t !== "menu") setMenuStack([]);
  };
  const pushMenu = (route) => setMenuStack((s) => [...s, route]);
  const popMenu = () => setMenuStack((s) => s.slice(0, -1));

  // unified navigate — main tabs go to tabs, sub-routes (subs/notif/salary/loan/crop/pdf/calendar) push menu stack
  const navigate = (route) => {
    const tabs = ["home", "ledger", "calendar", "menu"];
    if (tabs.includes(route)) {
      goTab(route);
      return;
    }
    // calendar opens as a sub-route inside menu (since it's no longer a bottom tab)
    setTab("menu");
    setMenuStack([route]);
  };

  const menuTop = menuStack[menuStack.length - 1];
  const MenuPage =
    menuTop === "subs" ? (
      <SubscriptionsScreen onBack={popMenu} onAdd={() => setAddSubOpen(true)} />
    ) : menuTop === "notif" ? (
      <NotificationsScreen onBack={popMenu} />
    ) : menuTop === "profile" ? (
      <ProfileScreen onBack={popMenu} onUpgrade={() => setUpgradeOpen(true)} />
    ) : menuTop === "theme" ? (
      <ThemeScreen onBack={popMenu} />
    ) : menuTop === "calendar" ? (
      <div>
        <SubHeader
          title="캘린더"
          onBack={popMenu}
          action={
            <button
              className={styles.dfmIconBtn}
              onClick={() => setAddEventOpen(true)}
              aria-label="추가"
            >
              <Ico name="plus" size={18} />
            </button>
          }
        />
        <MobileCalendar onAddEvent={() => setAddEventOpen(true)} />
      </div>
    ) : (
      <MobileMenu onNavigate={navigate} onProfile={() => pushMenu("profile")} />
    );

  const Page =
    tab === "home" ? (
      <MobileHome
        onNavigate={navigate}
        onAddTxn={() => setAddTxnOpen(true)}
        onAddEvent={() => setAddEventOpen(true)}
      />
    ) : tab === "ledger" ? (
      <MobileLedger />
    ) : tab === "calendar" ? (
      <MobileCalendar onAddEvent={() => setAddEventOpen(true)} />
    ) : tab === "menu" ? (
      MenuPage
    ) : null;

  // top greeting differs per tab
  const titleByTab = {
    home: { greet: "안녕하세요 ☀️", name: `${userName}님` },
    ledger: { greet: "11월의 흐름", name: "가계부" },
    calendar: { greet: "이번 달 일정", name: "캘린더" },
    menu: { greet: "내 정보", name: "메뉴" },
  };
  const subTitleByRoute = {
    subs: { greet: "매월 빠져나가는", name: "구독" },
    notif: { greet: "언제 알릴까요?", name: "알림" },
    profile: { greet: "내 정보 ·", name: "프로필" },
    theme: { greet: "내 취향대로", name: "테마" },
    calendar: { greet: "이번 달 일정", name: "캘린더" },
  };
  const tt =
    tab === "menu" && menuTop && subTitleByRoute[menuTop]
      ? subTitleByRoute[menuTop]
      : titleByTab[tab] || titleByTab.home;

  return (
    <div className={styles.dfm}>
      <div className={styles.dfmTop}>
        <div className={styles.dfmGreeting}>
          {tt.greet}
          <b>{tt.name}</b>
        </div>
        <div className={styles.dfmTopActions}>
          <button
            className={styles.dfmIconBtn}
            onClick={() => setSearchOpen(true)}
            aria-label="검색"
          >
            <Ico name="search" size={18} />
          </button>
          <button
            className={styles.dfmIconBtn}
            onClick={() => navigate("notif")}
            aria-label="알림 설정"
          >
            <Ico name="bell" size={18} />
            <span className={styles.dotBadge}></span>
          </button>
        </div>
      </div>

      <div className={styles.dfmBody}>{Page}</div>

      <div className={styles.dfmTabbar}>
        <button
          className={`${styles.dfmTab} ${tab === "home" ? styles.active : ""}`}
          onClick={() => goTab("home")}
        >
          <Ico name="home" />
          <span className={styles.label}>홈</span>
        </button>
        <button
          className={`${styles.dfmTab} ${tab === "ledger" ? styles.active : ""}`}
          onClick={() => goTab("ledger")}
        >
          <Ico name="wallet" />
          <span className={styles.label}>가계부</span>
        </button>
        <button className={`${styles.dfmTab} ${styles.fab}`} onClick={onFab}>
          <span className={styles.fabBtn}>
            <Ico name="plus" size={24} />
          </span>
          <span className={styles.label}>
            {tab === "calendar" ||
            (tab === "menu" && menuStack[menuStack.length - 1] === "calendar")
              ? "일정"
              : "거래"}
          </span>
        </button>
        <button
          className={`${styles.dfmTab} ${tab === "calendar" ? styles.active : ""}`}
          onClick={() => goTab("calendar")}
        >
          <Ico name="cal" />
          <span className={styles.label}>캘린더</span>
        </button>
        <button
          className={`${styles.dfmTab} ${tab === "menu" ? styles.active : ""}`}
          onClick={() => goTab("menu")}
        >
          <Ico name="menu" />
          <span className={styles.label}>메뉴</span>
        </button>
      </div>

      <ReceiptSheet txn={openTxn} onClose={() => setOpenTxn(null)} />
      <AddTxnSheet open={addTxnOpen} onClose={() => setAddTxnOpen(false)} />
      <AddEventSheet
        open={addEventOpen}
        onClose={() => setAddEventOpen(false)}
      />
      <AddSubSheet open={addSubOpen} onClose={() => setAddSubOpen(false)} />
      <SearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJump={(target) => {
          setSearchOpen(false);
          navigate(target);
        }}
      />
      <UpgradeSheet open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <TimerSettingsSheet
        open={timerSetOpen}
        onClose={() => setTimerSetOpen(false)}
        settings={timerSettings}
        onChange={setTimerSettings}
      />
    </div>
  );
};

export { MobileApp };
