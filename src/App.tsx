import { lazy, Suspense, useState, useEffect } from "react";
import { Sidebar, Topbar } from "@/components/shell";
import { StickyNotes, Checklist } from "@/components/notes";
import { GeneralTimer, Pomodoro, Stopwatch } from "@/components/timers";
import { MoneyFlow, MiniCalendar, ToolCard } from "@/components/money";
import { LedgerPage, CalendarPage, SettingsPage } from "@/components/pages";
import { TxnsPage } from "@/components/txns";
import { TxnModal, EventModal } from "@/components/modals";
import {
  TweaksPanel,
  TweakSection,
  TweakToggle,
  TweakRadio,
} from "@/components/tweaks-panel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePreferences } from "@/data/hooks/usePreferences";
import { useAuth } from "@/data/hooks/useAuth";
import { useTransactions } from "@/data/hooks/useTransactions";
import { useEvents } from "@/data/hooks/useEvents";
import type {
  ModalState,
  TxnDraft,
  EventDraft,
  AccentColor,
  AuthPreviewView,
} from "@/types";

const MemoPage = lazy(() =>
  import("@/components/memo").then((m) => ({ default: m.MemoPage })),
);
const SubsPage = lazy(() =>
  import("@/components/subs").then((m) => ({ default: m.SubsPage })),
);
const SalaryCalcPage = lazy(() =>
  import("@/components/salary").then((m) => ({
    default: m.SalaryCalcPage,
  })),
);
const LoanCalcPage = lazy(() =>
  import("@/components/loan-search").then((m) => ({
    default: m.LoanCalcPage,
  })),
);
const SearchOverlay = lazy(() =>
  import("@/components/loan-search").then((m) => ({
    default: m.SearchOverlay,
  })),
);
const CropCanvasPage = lazy(() =>
  import("@/components/image-tools").then((m) => ({
    default: m.CropCanvasPage,
  })),
);
const PdfCanvasPage = lazy(() =>
  import("@/components/image-tools").then((m) => ({
    default: m.PdfCanvasPage,
  })),
);
const MobileApp = lazy(() =>
  import("@/components/mobile-app").then((m) => ({ default: m.MobileApp })),
);
const LoginScreen = lazy(() =>
  import("@/components/auth-login").then((m) => ({
    default: m.LoginScreen,
  })),
);
const SignupScreen = lazy(() =>
  import("@/components/auth-flows").then((m) => ({
    default: m.SignupScreen,
  })),
);
const OnboardingScreen = lazy(() =>
  import("@/components/auth-flows").then((m) => ({
    default: m.OnboardingScreen,
  })),
);
const ForgotScreen = lazy(() =>
  import("@/components/auth-forgot").then((m) => ({
    default: m.ForgotScreen,
  })),
);
const PCLogin = lazy(() =>
  import("@/components/auth-pc").then((m) => ({ default: m.PCLogin })),
);
const PCSignup = lazy(() =>
  import("@/components/auth-pc").then((m) => ({ default: m.PCSignup })),
);
const PCOnboarding = lazy(() =>
  import("@/components/auth-pc").then((m) => ({
    default: m.PCOnboarding,
  })),
);

const PageFallback = () => (
  <div style={{ padding: 32, color: "var(--ink-mute)", fontSize: 13 }}>
    불러오는 중…
  </div>
);

// TWEAK_DEFAULTS lives in src/data/seeds/lookups.ts so usePreferences can
// own initial state without re-importing this module.

export default function App() {
  const [tweaks, setTweak] = usePreferences();
  const auth = useAuth();
  // Bridge: tweaks.authed mirrors auth.status; toggling the dev panel calls
  // signIn/signOut.
  const setAuthed = (next: boolean) => {
    if (next) auth.signIn();
    else auth.signOut();
    setTweak("authed", next);
  };
  const { upsert: upsertTxn, remove: removeTxn } = useTransactions();
  const { upsert: upsertEvent, remove: removeEvent } = useEvents();
  const [active, setActive] = useState<string>("home");
  const [modal, setModal] = useState<ModalState>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickMemo, setQuickMemo] = useState("");
  const [memos, setMemos] = useState<string[]>([
    "헬스장 가는 길에 빵집 들르기",
    "수요일 회의 자료 미리 보기",
  ]);

  const isNarrowViewport = useMediaQuery("(max-width: 768px)");
  const isMobile = tweaks.forceMobile || isNarrowViewport;

  const openTxn = (editing?: TxnDraft) => setModal({ type: "txn", editing });
  const openEvent = (editing?: EventDraft) =>
    setModal({ type: "event", editing });
  const closeModal = () => setModal(null);

  useEffect(() => {
    document.body.classList.toggle("dark", !!tweaks.dark);
  }, [tweaks.dark]);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobile]);

  useEffect(() => {
    const accentMap: Record<AccentColor, string> = {
      yellow: "#ffe27a",
      coral: "#ffb38a",
      mint: "#b9e7c9",
      lilac: "#d4c1f0",
    };
    document.documentElement.style.setProperty(
      "--yellow",
      accentMap[tweaks.accent] || "#ffe27a",
    );
  }, [tweaks.accent]);

  const addQuickMemo = () => {
    if (!quickMemo.trim()) return;
    setMemos([quickMemo, ...memos].slice(0, 3));
    setQuickMemo("");
  };

  // ─────────────────────────────────────────────
  // 인증 화면 (Supabase 연결 전 mock — `authed` 플래그로 토글)
  // ─────────────────────────────────────────────
  if (!tweaks.authed) {
    const setView = (view: AuthPreviewView) => setTweak("authPreview", view);
    const dark = !!tweaks.dark;
    const lang: "ko" | "en" = "ko";
    if (isMobile) {
      const props = { variant: "A" as const, lang, dark, onSwitch: setView };
      let Screen: any = LoginScreen;
      if (tweaks.authPreview === "signup") Screen = SignupScreen;
      else if (tweaks.authPreview === "onboarding") Screen = OnboardingScreen;
      else if (tweaks.authPreview === "forgot") Screen = ForgotScreen;
      return (
        <Suspense fallback={<PageFallback />}>
          <Screen {...props} onBackToLogin={() => setView("login")} />
          {renderTweaks()}
        </Suspense>
      );
    }
    let PCScreen: any = PCLogin;
    if (tweaks.authPreview === "signup") PCScreen = PCSignup;
    else if (tweaks.authPreview === "onboarding") PCScreen = PCOnboarding;
    return (
      <Suspense fallback={<PageFallback />}>
        <PCScreen lang={lang} dark={dark} onSwitch={setView} />
        {renderTweaks()}
      </Suspense>
    );
  }

  // ─────────────────────────────────────────────
  // 모바일 대시보드
  // ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <Suspense fallback={<PageFallback />}>
        <MobileApp initialTab="home" />
        {renderTweaks()}
      </Suspense>
    );
  }

  // ─────────────────────────────────────────────
  // 데스크톱 대시보드
  // ─────────────────────────────────────────────
  function renderPage() {
    if (active === "ledger")
      return <LedgerPage onAdd={() => openTxn()} onEditTxn={openTxn} />;
    if (active === "calendar")
      return <CalendarPage onAdd={() => openEvent()} onEditEvent={openEvent} />;
    if (active === "memo") return <MemoPage />;
    if (active === "subs") return <SubsPage onAdd={() => openTxn()} />;
    if (active === "crop") return <CropCanvasPage />;
    if (active === "pdf") return <PdfCanvasPage />;
    if (active === "txns")
      return (
        <TxnsPage
          onAdd={(prefill?: TxnDraft) => openTxn(prefill)}
          onEditTxn={openTxn}
        />
      );
    if (active === "salary") return <SalaryCalcPage />;
    if (active === "loan" || active === "cash") return <LoanCalcPage />;
    if (active === "settings")
      return <SettingsPage tweaks={tweaks} setTweak={setTweak} />;

    return (
      <>
        <Topbar
          dark={tweaks.dark}
          onToggleDark={() => setTweak("dark", !tweaks.dark)}
          onSearch={() => setSearchOpen(true)}
        />

        <div className="grid">
          <StickyNotes />
          <Checklist />
        </div>

        <div className="section-h" style={{ marginTop: 26 }}>
          <h2>도구 모음</h2>
          <span className="more">전체 보기 →</span>
        </div>
        <div className="grid">
          <ToolCard
            icon="coin"
            title="연봉 계산기"
            desc="실수령액을 간편하게 계산해보세요"
            items={["2026년 기준 세율 적용", "4대 보험 · 소득세 자동 계산"]}
            onClick={() => setActive("salary")}
          />
          <ToolCard
            icon="crop"
            title="이미지 자르기"
            desc="업로드한 이미지를 빠르게 자르고 내보내세요"
            items={["원하는 크기와 포맷 설정", "전체 화면 도구에서 사용 가능"]}
            onClick={() => setActive("crop")}
          />
          <ToolCard
            icon="pdf"
            title="이미지 → PDF"
            desc="여러 이미지를 하나의 PDF로 깔끔하게 합쳐요"
            items={["품질 유지와 순서 편집", "전체 화면 도구에서 진행"]}
            onClick={() => setActive("pdf")}
          />
        </div>

        <div className="section-h" style={{ marginTop: 26 }}>
          <h2>타이머</h2>
          <span className="more" onClick={() => setActive("settings")}>
            설정 →
          </span>
        </div>
        <div className="grid">
          <GeneralTimer />
          <Pomodoro />
          <Stopwatch />
        </div>

        <div className="section-h" style={{ marginTop: 26 }}>
          <h2>한눈에 보기</h2>
          <span className="more" onClick={() => setActive("ledger")}>
            자세히 →
          </span>
        </div>
        <div className="grid">
          <MoneyFlow
            onAdd={() => openTxn()}
            onOpenLedger={() => setActive("ledger")}
            onEditTxn={openTxn}
          />
          {tweaks.showCalendar && (
            <MiniCalendar
              onOpen={() => setActive("calendar")}
              memos={memos}
              quickMemo={quickMemo}
              setQuickMemo={setQuickMemo}
              addQuickMemo={addQuickMemo}
              onEditEvent={openEvent}
            />
          )}
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 18,
            borderTop: "1px dashed var(--line)",
            fontSize: 12,
            color: "var(--ink-mute)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>© 2026 Dayflow Dashboard · Made with ☕ in Seoul</span>
          <span>v2.0 · 패치노트</span>
        </div>
      </>
    );
  }

  function renderTweaks() {
    return (
      <TweaksPanel title="Tweaks">
        <TweakSection title="모양">
          <TweakToggle
            label="다크 모드"
            value={tweaks.dark}
            onChange={(v: boolean) => setTweak("dark", v)}
          />
          <TweakRadio
            label="포인트 컬러"
            value={tweaks.accent}
            options={[
              { value: "yellow", label: "노랑" },
              { value: "coral", label: "코랄" },
              { value: "mint", label: "민트" },
              { value: "lilac", label: "라일락" },
            ]}
            onChange={(v: string) => setTweak("accent", v as AccentColor)}
          />
        </TweakSection>
        <TweakSection title="레이아웃">
          <TweakToggle
            label="달력 표시"
            value={tweaks.showCalendar}
            onChange={(v: boolean) => setTweak("showCalendar", v)}
          />
          <TweakToggle
            label="모바일 강제 (프리뷰)"
            value={tweaks.forceMobile}
            onChange={(v: boolean) => setTweak("forceMobile", v)}
          />
        </TweakSection>
        <TweakSection title="인증 (mock — Supabase 연결 전)">
          <TweakToggle
            label="로그인 상태"
            value={tweaks.authed}
            onChange={setAuthed}
          />
          <TweakRadio
            label="인증 화면"
            value={tweaks.authPreview}
            options={[
              { value: "login", label: "로그인" },
              { value: "signup", label: "가입" },
              { value: "onboarding", label: "온보딩" },
              { value: "forgot", label: "비밀번호" },
            ]}
            onChange={(v: string) =>
              setTweak("authPreview", v as AuthPreviewView)
            }
          />
        </TweakSection>
      </TweaksPanel>
    );
  }

  return (
    <>
      <div className="app">
        <Sidebar active={active} onSelect={setActive} />
        <main className="main" data-screen-label={active}>
          <Suspense fallback={<PageFallback />}>{renderPage()}</Suspense>
        </main>
      </div>

      {modal?.type === "txn" && (
        <TxnModal
          onClose={closeModal}
          editing={modal.editing}
          onDelete={(t: any) => t?.id != null && removeTxn(t.id)}
          onSave={(t: any) => upsertTxn(t)}
        />
      )}
      {modal?.type === "event" && (
        <EventModal
          onClose={closeModal}
          editing={modal.editing}
          onDelete={(e: any) => e?.id != null && removeEvent(e.id)}
          onSave={(e: any) => upsertEvent(e)}
        />
      )}

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onNavigate={setActive}
          />
        </Suspense>
      )}

      {renderTweaks()}
    </>
  );
}
