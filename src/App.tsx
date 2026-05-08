import { lazy, Suspense, useState, useEffect } from "react";
import { Sidebar } from "@/components/Shell";
import { HomePage } from "@/pages/home/HomePage";
import { LedgerPage } from "@/pages/ledger/LedgerPage";
import { CalendarPage } from "@/pages/calendar/CalendarPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { TxnsPage } from "@/pages/txns/TxnsPage";
import { TxnModal } from "@/pages/ledger/TxnModal";
import { EventModal } from "@/pages/calendar/EventModal";
import {
  TweaksPanel,
  TweakSection,
  TweakToggle,
  TweakRadio,
} from "@/components/TweaksPanel";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePreferences } from "@/data/preferences";
import { useAuth } from "@/data/auth";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useDataModeStore } from "@/store/dataMode";
import { useModalStore } from "@/store/modal";
import { DemoBanner } from "@/components/DemoBanner";
import { configureDataSource, getReadyPromise } from "@/data/source";
import { queryClient } from "@/app/queryClient";
import type { TxnDraft, AccentColor, AuthPreviewView } from "@/types";

const MemoPage = lazy(() =>
  import("@/pages/memo/MemoPage").then((m) => ({ default: m.MemoPage })),
);
const SubsPage = lazy(() =>
  import("@/pages/subs/SubsPage").then((m) => ({ default: m.SubsPage })),
);
const SalaryCalcPage = lazy(() =>
  import("@/pages/salary/SalaryCalcPage").then((m) => ({
    default: m.SalaryCalcPage,
  })),
);
const LoanCalcPage = lazy(() =>
  import("@/pages/loan/LoanSearch").then((m) => ({
    default: m.LoanCalcPage,
  })),
);
const SearchOverlay = lazy(() =>
  import("@/pages/loan/LoanSearch").then((m) => ({
    default: m.SearchOverlay,
  })),
);
const CropCanvasPage = lazy(() =>
  import("@/pages/tools/ImageTools").then((m) => ({
    default: m.CropCanvasPage,
  })),
);
const PdfCanvasPage = lazy(() =>
  import("@/pages/tools/ImageTools").then((m) => ({
    default: m.PdfCanvasPage,
  })),
);
const MobileApp = lazy(() =>
  import("@/pages/mobile/MobileApp").then((m) => ({ default: m.MobileApp })),
);
const LoginScreen = lazy(() =>
  import("@/pages/auth/MobileLogin").then((m) => ({
    default: m.LoginScreen,
  })),
);
const SignupScreen = lazy(() =>
  import("@/pages/auth/MobileSignup").then((m) => ({
    default: m.SignupScreen,
  })),
);
const OnboardingScreen = lazy(() =>
  import("@/pages/auth/MobileOnboarding").then((m) => ({
    default: m.OnboardingScreen,
  })),
);
const ForgotScreen = lazy(() =>
  import("@/pages/auth/MobileForgot").then((m) => ({
    default: m.ForgotScreen,
  })),
);
const PCLogin = lazy(() =>
  import("@/pages/auth/PcLogin").then((m) => ({ default: m.PCLogin })),
);
const PCSignup = lazy(() =>
  import("@/pages/auth/PcSignup").then((m) => ({ default: m.PCSignup })),
);
const PCForgot = lazy(() =>
  import("@/pages/auth/PcForgot").then((m) => ({ default: m.PCForgot })),
);
const PCOnboarding = lazy(() =>
  import("@/pages/auth/PcOnboarding").then((m) => ({
    default: m.PCOnboarding,
  })),
);
const LandingPage = lazy(() =>
  import("@/pages/landing/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);

const PageFallback = () => (
  <div style={{ padding: 32, color: "var(--ink-mute)", fontSize: 13 }}>
    불러오는 중…
  </div>
);

// ─────────────────────────────────────────────
// Public hash routes (auth gate 우회) — /#/tools/crop, /#/tools/pdf
// 로그인 없이 외부에서 직접 접근 가능한 공개 도구 페이지.
// ─────────────────────────────────────────────
type PublicRoute = "crop" | "pdf" | null;
function parsePublicRoute(hash: string): PublicRoute {
  if (!hash) return null;
  const normalized = hash.replace(/^#\/?/, "/");
  if (normalized.startsWith("/tools/crop")) return "crop";
  if (normalized.startsWith("/tools/pdf")) return "pdf";
  return null;
}

function PublicToolShell({ route }: { route: Exclude<PublicRoute, null> }) {
  const Tool = route === "crop" ? CropCanvasPage : PdfCanvasPage;
  return (
    <div className="public-tool-shell">
      <header className="public-tool-bar">
        <a href="#/" className="public-tool-brand" aria-label="Dayflow 홈">
          <span className="public-tool-mark">D</span>
          <span className="public-tool-name">Dayflow</span>
        </a>
        <nav className="public-tool-nav">
          <a href="#/tools/crop" className={route === "crop" ? "on" : ""}>
            이미지 자르기
          </a>
          <a href="#/tools/pdf" className={route === "pdf" ? "on" : ""}>
            이미지 → PDF
          </a>
        </nav>
        <a href="#/" className="public-tool-cta">
          전체 앱 둘러보기 →
        </a>
      </header>
      <div className="public-tool-body">
        <Tool />
      </div>
    </div>
  );
}

export default function App() {
  const auth = useAuth();
  const mode = useDataModeStore((s) => s.mode);
  const userId = auth.user?.id ?? null;
  const sourceKey = `${mode}:${userId ?? "guest"}`;
  const [readyKey, setReadyKey] = useState<string | null>(null);

  // 데이터 소스를 mode + userId에 맞춰 재구성. 변경 시 RQ 캐시도 통째 비움.
  // ready promise를 기다린 뒤에야 트리를 마운트해서 placeholder store가 그대로 박히는 문제 방지.
  useEffect(() => {
    if (auth.status === "unknown") return;
    const changed = configureDataSource({ mode, userId });
    if (changed) queryClient.clear();
    let cancelled = false;
    setReadyKey(null);
    getReadyPromise().finally(() => {
      if (!cancelled) setReadyKey(sourceKey);
    });
    return () => {
      cancelled = true;
    };
  }, [mode, userId, auth.status, sourceKey]);

  // 초기 세션 복원 / 데이터 소스 init 중에는 splash로 깜박임 방지
  if (auth.status === "unknown" || readyKey !== sourceKey) {
    return <PageFallback />;
  }

  // mode/userId 변경 시 트리 remount → 모든 도메인 hook이 새 store 구독
  return <AppShell key={sourceKey} />;
}

function AppShell() {
  const [tweaks, setTweak] = usePreferences();
  const auth = useAuth();
  const mode = useDataModeStore((s) => s.mode);
  const setDataMode = useDataModeStore((s) => s.setMode);
  const { upsert: upsertTxn, remove: removeTxn } = useTransactions();
  const { upsert: upsertEvent, remove: removeEvent } = useEvents();
  const [active, setActive] = useState<string>("home");
  const modal = useModalStore((s) => s.modal);
  const openTxn = useModalStore((s) => s.openTxn);
  const openEvent = useModalStore((s) => s.openEvent);
  const closeModal = useModalStore((s) => s.close);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [publicRoute, setPublicRoute] = useState<PublicRoute>(() =>
    parsePublicRoute(window.location.hash),
  );

  useEffect(() => {
    const onHash = () =>
      setPublicRoute(parsePublicRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const isNarrowViewport = useMediaQuery("(max-width: 768px)");
  const isMobile = tweaks.forceMobile || isNarrowViewport;

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

  // ─────────────────────────────────────────────
  // 공개 도구 라우트 — auth gate보다 먼저 처리해서 로그인 없이 접근 가능.
  // ─────────────────────────────────────────────
  if (publicRoute) {
    return (
      <Suspense fallback={<PageFallback />}>
        <PublicToolShell route={publicRoute} />
      </Suspense>
    );
  }

  // ─────────────────────────────────────────────
  // 인증 게이트 — 실 세션 기반 (useAuth)
  // mock 모드에서는 비로그인이어도 대시보드(데모 데이터)를 보여줌
  // ─────────────────────────────────────────────
  if (auth.status === "guest" && mode === "live") {
    const setView = (view: AuthPreviewView) => setTweak("authPreview", view);
    const dark = !!tweaks.dark;
    const lang: "ko" | "en" = "ko";
    // PC 첫 진입 시 마케팅 랜딩 → CTA 클릭 시 인증 화면으로 진입.
    // (auth preview tweak이 'login' 외 값이면 사용자가 명시적으로 그 화면을 본다는 뜻이라 랜딩 스킵)
    if (
      !isMobile &&
      showLanding &&
      (tweaks.authPreview ?? "login") === "login"
    ) {
      return (
        <Suspense fallback={<PageFallback />}>
          <LandingPage onGoToAuth={() => setShowLanding(false)} />
          {renderTweaks()}
        </Suspense>
      );
    }
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
    else if (tweaks.authPreview === "forgot") PCScreen = PCForgot;
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
        <DemoBanner />
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
      <HomePage
        tweaks={tweaks}
        setTweak={setTweak}
        setActive={setActive}
        setSearchOpen={setSearchOpen}
        openTxn={() => openTxn()}
        openEvent={openEvent}
        onEditTxn={openTxn}
      />
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
        <TweakSection title="데이터 모드">
          <TweakRadio
            label="소스"
            value={mode}
            options={[
              { value: "mock", label: "데모(시드)" },
              { value: "live", label: "실데이터" },
            ]}
            onChange={(v: string) => setDataMode(v as "live" | "mock")}
          />
          <div
            style={{ fontSize: 11, color: "var(--ink-mute)", padding: "4px 0" }}
          >
            {mode === "mock"
              ? "in-memory 시드 — 새로고침 시 리셋"
              : "Supabase 연결 — 로그인 필요"}
          </div>
        </TweakSection>
        <TweakSection title="인증">
          <div
            style={{ fontSize: 12, color: "var(--ink-mute)", padding: "4px 0" }}
          >
            {auth.user ? auth.user.email : "비로그인"}
          </div>
          {auth.user && (
            <button
              type="button"
              className="tweak-btn"
              onClick={() => auth.signOut()}
              style={{
                background: "transparent",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          )}
          {auth.status === "guest" && (
            <TweakRadio
              label="인증 화면 프리뷰"
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
          )}
        </TweakSection>
      </TweaksPanel>
    );
  }

  return (
    <>
      <DemoBanner />
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
