"use client";
// Dashboard 는 인증 사용자별 상태가 다양해 정적 prerender 불가 — 클라 전용.
// (force-dynamic 은 client component 에서 export 불가라, 대신 useSyncExternalStore
// SSR 에러를 무시하도록 children 에 export const dynamic 두는 게 정석. 단 모든
// dashboard 페이지에 일일이 추가하기 번거로워서 페이지별로 처리.)
// Phase 3 에서 RSC + HydrationBoundary 도입 시 일부 페이지는 서버 렌더 가능.

// 대시보드 공통 chrome 스타일.
// SearchOverlay 는 src/components/SearchOverlay 로 분리됨 (Phase 1).
// mobile-app.css 는 Phase 4b stage-7 에서 mobile.module.css 로 완전 이전됨 (git rm).
// mobile.css 는 데스크탑 chrome 의 모바일 미디어쿼리 — 글로벌 잔존.
import "@/styles/mobile.css";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/Shell";
import {
  TweaksPanel,
  TweakSection,
  TweakToggle,
  TweakRadio,
} from "@/components/TweaksPanel";
import { DemoBanner } from "@/components/DemoBanner";
import { TxnModal } from "@/screens/ledger/TxnModal";
import { EventModal } from "@/screens/calendar/EventModal";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePreferences, usePreferencesSync } from "@/data/preferences";
import { useAuth } from "@/data/auth";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useDataModeStore } from "@/store/dataMode";
import { useModalStore } from "@/store/modal";
import { configureDataSource, getReadyPromise } from "@/data/source";
import { queryClient } from "@/lib/query-client";
import { navKeyToHref } from "@/lib/nav";
import type { AccentColor } from "@/types";

import type { SearchEntry } from "@/components/SearchOverlay/SearchOverlay";

const SearchOverlay = lazy(() =>
  import("@/components/SearchOverlay/SearchOverlay").then((m) => ({
    default: m.SearchOverlay,
  })),
);
const MobileApp = lazy(() =>
  import("@/screens/mobile/MobileApp").then((m) => ({ default: m.MobileApp })),
);

const PageFallback = () => (
  <div style={{ padding: 32, color: "var(--ink-mute)", fontSize: 13 }}>
    불러오는 중…
  </div>
);

// pathname → sidebar active key
function pathToActive(pathname: string): string {
  if (pathname === "/" || pathname === "") return "home";
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg ?? "home";
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathToActive(pathname ?? "/");

  const [tweaks, setTweak] = usePreferences();
  const auth = useAuth();
  const mode = useDataModeStore((s) => s.mode);
  const userId = auth.user?.id ?? null;
  const sourceKey = `${mode}:${userId ?? "guest"}`;

  // 환경설정 Supabase 동기화 (로그인 사용자 한정, 비로그인은 no-op).
  usePreferencesSync(userId, auth.status === "authed");
  const [readyKey, setReadyKey] = useState<string | null>(null);

  const modal = useModalStore((s) => s.modal);
  const closeModal = useModalStore((s) => s.close);
  const { upsert: upsertTxn, remove: removeTxn } = useTransactions();
  const { upsert: upsertEvent, remove: removeEvent } = useEvents();
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const navigateFromSearch = useCallback(
    (entry: SearchEntry) => {
      router.push(navKeyToHref(entry.id));
    },
    [router],
  );

  const isNarrowViewport = useMediaQuery("(max-width: 768px)");
  const isMobile = tweaks.forceMobile || isNarrowViewport;

  // TweaksPanel 은 디자인/프로토타입용 개발 도구. 데이터모드·모바일강제 같은
  // 개발 전용 토글이 들어 있고, 사용자용 항목(다크/액센트/달력)은 Settings 로
  // 일원화됐다. production 빌드에선 mount 하지 않는다(중복 진입점 제거).
  const showDevTweaks = process.env.NODE_ENV !== "production";

  // 데이터 소스 mode + userId 갱신.
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

  // 다크 모드 + 액센트 컬러
  useEffect(() => {
    document.body.classList.toggle("dark", !!tweaks.dark);
  }, [tweaks.dark]);
  useEffect(() => {
    const map: Record<AccentColor, string> = {
      yellow: "#ffe27a",
      coral: "#ffb38a",
      mint: "#b9e7c9",
      lilac: "#d4c1f0",
    };
    document.documentElement.style.setProperty(
      "--yellow",
      map[tweaks.accent] || "#ffe27a",
    );
  }, [tweaks.accent]);

  // ⌘K 검색
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

  // 인증 게이트: 비로그인 + live 모드면 /login. mock 모드는 데모로 통과.
  useEffect(() => {
    if (auth.status === "guest" && mode === "live") router.replace("/login");
  }, [auth.status, mode, router]);

  // 초기 세션 복원 / 데이터 소스 init 중 splash
  if (auth.status === "unknown" || readyKey !== sourceKey) {
    return <PageFallback />;
  }

  // 모바일 — MobileApp 단일 진입. 라우트 분기는 내부 탭으로.
  // 동적 뷰포트 높이(100dvh) flex 컬럼: DemoBanner(있으면) 가 자기 높이를
  // 차지하고 MobileApp 셸(.dfm flex:1)이 나머지를 채운다 → 탭바가 항상 화면
  // 하단에 고정. iOS Safari 주소창 토글에도 튀지 않음.
  if (isMobile) {
    return (
      <Suspense fallback={<PageFallback />}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100dvh",
          }}
        >
          <DemoBanner />
          <MobileApp initialTab="home" />
        </div>
        {showDevTweaks && <Tweaks tweaks={tweaks} setTweak={setTweak} />}
      </Suspense>
    );
  }

  return (
    <>
      <DemoBanner />
      <div className="app">
        <Sidebar
          active={active}
          onSelect={(key) => router.push(navKeyToHref(key))}
        />
        <main className="main" data-screen-label={active}>
          <Suspense fallback={<PageFallback />}>{children}</Suspense>
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
            onClose={closeSearch}
            onNavigate={navigateFromSearch}
          />
        </Suspense>
      )}

      {showDevTweaks && <Tweaks tweaks={tweaks} setTweak={setTweak} />}
    </>
  );
}

function Tweaks({
  tweaks,
  setTweak,
}: {
  tweaks: any;
  setTweak: (k: string, v: any) => void;
}) {
  const auth = useAuth();
  const mode = useDataModeStore((s) => s.mode);
  const setDataMode = useDataModeStore((s) => s.setMode);
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
      </TweakSection>
    </TweaksPanel>
  );
}
