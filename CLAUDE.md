# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack snapshot (2026-06-06)

**Next.js 16 (App Router, Turbopack 기본) + React 19 + TypeScript + Supabase (`@supabase/ssr`) + TanStack Query + Zustand + Tailwind v3 (preflight off, 점진 도입).**

> Next 16 으로 dev/build 둘 다 Turbopack 이 기본. 보호 라우트 진입 가드는 Next 16 컨벤션에 맞춰 `middleware.ts` → 레포 루트 **`proxy.ts`** (export `proxy()`) 로 이전 완료. `eslint-config-next` 는 ESLint 9 flat config 이행 전까지 v15 에 고정.

Vite SPA 잔재는 모두 제거됨 (vitest 포함). 글로벌 `src/styles/styles.css` chrome 일부만 점진 마이그레이션 대상. 진행 상태는 `docs/nextjs-migration-plan.md` 참고.

## Commands

> 패키지 매니저는 **pnpm 10** (corepack 으로 활성화). `package.json` 의 `packageManager` 필드가 진실. npm/yarn 사용 금지.

- `pnpm dev` — Next.js dev server (기본 포트 3000). `NODE_OPTIONS=--max-http-header-size=32768` (Supabase 대용량 auth 쿠키 대비).
- `pnpm build` — `next build`. Type errors fail the build.
- `pnpm start` — production 서버 (기본 포트 3000). dev 와 동일한 NODE_OPTIONS.
- `pnpm typecheck` — `tsc --noEmit`. ts-nocheck 신규 추가는 ESLint 가 차단.
- `pnpm lint` — `eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0`.

> 테스트 러너 없음 (vitest 제거). 검증은 typecheck + lint + build + 수동 동작 확인.

Path alias `@/*` → `src/*`. `app/`, `proxy.ts` 는 레포 루트에 위치하고 별도 alias 없이 상대/절대 import.

## Environment

`.env`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 정식 (Phase 1+).
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — 레거시 fallback (`src/lib/supabase/index.ts` 가 둘 다 읽음).

미설정 시: `proxy.ts` 는 통과, 클라 `useAuth` 는 'guest', mock 모드(`useDataModeStore`) 토글 시 in-memory 시드로 동작.

`WLD (4)/` 디렉토리는 시안 모음 — `tsconfig` exclude + `.eslintrc.cjs` ignorePatterns. **읽거나 grep 하지 말 것.**

## Architecture

### 라우트 (Next App Router)

```
app/
├ layout.tsx           — 루트(html/body, fonts, Providers, 글로벌 CSS import)
├ page.tsx             — 랜딩 (인증 시 /dashboard 로 redirect)
├ globals.css          — Tailwind directives + reset (preflight off)
├ robots.ts / sitemap.ts / icon.tsx / apple-icon.tsx — 메타데이터·파비콘 라우트
├ (auth)/
│  ├ login/   signup/   forgot/   onboarding/   page.tsx   (+ _actions.ts)
├ auth/
│  └ callback/route.ts — Supabase OAuth(PKCE) 콜백 (code → 세션 쿠키 → next 리다이렉트)
├ tools/
│  ├ layout.tsx (.module.css), crop/ pdf/        page.tsx
├ dashboard/
│  ├ layout.tsx        — Sidebar(usePathname)+Modals+SearchOverlay+Tweaks
│  ├ page.tsx          — RSC: prefetch 6 도메인 → HydrationBoundary → HomeClient
│  ├ ledger/calendar/memo/subs/txns: page.tsx (RSC prefetch) + *Client.tsx
│  └ settings/salary/loan/cash: page.tsx (클라 전용)
└ (레포 루트) proxy.ts — /dashboard/* 보호 (Supabase 미인증 → /login?next=)
```

### Client UI (`src/screens/`)

각 라우트가 import 하는 클라이언트 컴포넌트. **1 파일 1 페이지** 규칙. 페이지 chrome CSS 는 컴포넌트 옆 `*.module.css` 로 격리 (Phase 4b 진행 중).

- `screens/landing/LandingPage.tsx`
- `screens/auth/{PcLogin,MobileLogin,PcSignup,...}` + 공유 `BrandMark`/`Field`/`Btn`
- `screens/tools/ImageTools.tsx` (CropCanvasPage + PdfCanvasPage)
- `screens/{ledger,calendar,memo,subs,txns,salary,loan}/*Page.tsx` + 모달
- `screens/home/{HomePage,StickyNotes,Checklist,MoneyFlow,MiniCalendar,ToolCard,timers/*}`
- `screens/mobile/{MobileApp,tabs/*,sheets/*,screens/*,community/*,shared/*}`

### 데이터 레이어 (3-tier)

```
component → useXxx() (TanStack Query) → Repository → Store (useSyncExternalStore) → DataSource (mock | supabase)
```

**서버측 (RSC)** — `src/server/` (flat):

- 8개 도메인 fetcher (`transactions/events/memos/sticky-notes/checklist/subscriptions/pinned-info/daily-log`).
- `_session.ts` — RSC 용 `@supabase/ssr` server client + 세션 헬퍼. `cache()` 로 요청당 1회. 비로그인 시 빈 배열.
- `keys.ts` — RSC ↔ 클라 query key 일치 (`queryKeys.transactions = ["transactions"]` 등).
- `prefetch.ts` — entries 받아 `dehydrate(QueryClient)` 반환.
- 라우트 page.tsx 가 prefetch + `<HydrationBoundary>` 로 client wrapper 감쌈 (홈은 6개만 prefetch, memos/subscriptions 는 클라 lazy).

**클라측** — `src/data/`:

- `data/store.ts` — generic `createStore<T>` 팩토리. 불변 frozen-array 스냅샷 + Status('idle'|'loading'|'success'|'error'). useSyncExternalStore 호환 (서버 스냅샷 인자 포함 — Next prerender 안전).
- `data/source/{types,mock,supabase,index}.ts` — DataSource bag of `Repository<T>`. mock 은 in-memory + 시드, supabase 는 `@supabase/supabase-js`. `getDataSource()` 싱글톤 + `configureDataSource(mode,userId)` 로 mode 전환.
- `data/source/mappers/*` — Supabase row ↔ 도메인 타입 변환 (`docs/schema-alignment.md` 참고).
- `data/useRepositoryQuery.ts` — 도메인 훅 베이스. useSyncExternalStore + useQuery 결합. mutation 은 `useMutation` 으로 노출.
- 도메인 hook 파일들 (`data/{transactions,events,memos,sticky-notes,checklist,subscriptions,pinned-info,daily-log,auth,preferences,lookups}.ts`) — `useXxx()` + 셀렉터 + 시드 + `formatXxxLabel` 같은 helper.

### 인증 / 보호

- `proxy.ts` (레포 루트, export `proxy()`) 가 `/dashboard/*` 진입 전 세션 갱신 + 미인증 시 `/login?next=...` redirect. env 미설정 시 통과.
- 클라: `useAuth()` 가 supabase.auth.onAuthStateChange 구독, status: 'unknown'|'authed'|'guest'.
- **Google OAuth (PKCE)** — PC/모바일 로그인 버튼 → `signInWithOAuth` → `app/auth/callback/route.ts` 가 `exchangeCodeForSession` 으로 세션 쿠키 세팅 후 `next` 로 리다이렉트 (open redirect 방지: 내부 경로만 허용).
- Server Actions (`app/(auth)/_actions.ts`) — `signInAction` / `signUpAction` / `sendPasswordResetAction` / `signOutAction`. 폼 wire-up 은 점진 (현재는 useAuth 클라 훅 사용 중).
- Supabase 클라이언트는 `src/lib/supabase/{client,server,index}.ts` — `client.ts`(브라우저), `server.ts`(RSC/route handler), `index.ts`(legacy `@supabase/supabase-js` + VITE fallback).

### Tweaks

- `usePreferences()` (Zustand persist) — 다크모드 / 액센트 컬러 / showCalendar / forceMobile / `pinBoardTitle` 등 UI 환경설정.
- 다크 모드는 `body.dark` 클래스 토글, accent 는 CSS 변수(`--yellow`) 동적 변경.
- `<TweaksPanel>` 은 dashboard layout 에 항상 마운트.

## 스타일 — Phase 4b 진행

- **Tailwind v3** 도입 (`tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`). preflight 는 OFF — 글로벌 CSS 와 공존 단계. 모든 마이그레이션 끝나면 활성화.
- **`next/font`** 로 Plus_Jakarta_Sans / Gaegu / JetBrains_Mono 를 `--font-{sans,hand,mono}` 변수로 주입. Google Fonts `@import` 사고 영구 차단.
- **CSS Module 분할** — 페이지/컴포넌트별 `*.module.css` 로 점진 이전:
  - 완료: tools layout, Sidebar+Topbar(Shell), 5 dashboard 페이지(memo/subs/txns/salary/loan-search), image-tools, home 6개 컴포넌트(StickyNotes/Checklist/MoneyFlow/MiniCalendar/ToolCard/timers).
  - 미이전 글로벌 CSS:
    - `src/styles/styles.css` (~990줄) — APP SHELL, GRID, SECTION HEADINGS, HELPERS, dark theme, MODAL/EDIT MODAL (공유 chrome).
    - `src/styles/pages.css` — page-head/crumb/page-title/timer-btn/icon-btn 등 공유 클래스 (의도적 글로벌).
    - `src/styles/landing.css` — `.landing-root` 스코프 (안전).
    - `src/styles/{flows,flows-extra,mobile,mobile-app}.css` — Phase 4b 후속 작업 대상.
- **글로벌 CSS leak 방지 규칙**:
  - 새로운 글로벌 클래스 정의 금지. 컴포넌트 옆 `*.module.css` 사용.
  - 흔한 이름(`nav`/`card`/`btn`/`section`/`brand`) 신규 사용 시 module 강제.
  - 사이드바·랜딩·도구 등 surface 별 클래스 충돌 없는지 확인 (`docs/css-global-audit.md` 참고).

## 컨벤션

- 모든 UI 카피는 한국어. 신규 문구는 기존 톤(반말 친근체) 매칭.
- TypeScript: `@ts-nocheck` 추가 금지(ESLint `ban-ts-comment` 룰이 차단). 정 필요하면 `@ts-expect-error` + 사유 코멘트.
- `: any` 는 마이그레이션 잔재용으로만 허용 (`@typescript-eslint/no-explicit-any: off`). 신규 코드는 실 타입.
- Server Component vs Client Component:
  - 라우트 page.tsx 는 가능한 RSC. 인터랙션 leaf 만 `'use client'`.
  - useState/useRef/useEffect 가 필요한 모든 컴포넌트는 `'use client'`.
- Lazy import 패턴: `lazy(() => import("...").then((m) => ({ default: m.X })))` (다중 named export 호환).

## Commit message convention

- **본문은 한국어로 작성.** Conventional Commits 접두사(`feat:`, `fix:`, `chore:`, `refactor:`, `docs:` 등) 는 영어 그대로. 예: `feat: 사이드바 스크롤 + 로그아웃 버튼 정리`.
- 마이그레이션 Phase 커밋은 `chore(phase-N): ...` 또는 `feat(phase-N/<topic>): ...`.
- `Co-Authored-By` / `🤖 Generated with` 풋터 추가 안 함 (전역 룰).

## 도메인 ↔ DB 스키마

- `docs/schema-alignment.md` — 도메인 타입 vs Supabase 컬럼 매핑. A(add column) / B(selector derive) / C(mapper rename) 분류.
- `docs/supabase-plan.md` — 테이블 DDL, RLS(`auth.uid() = user_id`), `handle_new_user` 트리거.
- `docs/nextjs-migration-plan.md` — Phase 0~5 마이그레이션 체크리스트 (현 상태 추적).
- `docs/css-global-audit.md` — 글로벌 CSS leak 감사 결과 + 규칙.
- `docs/ts-nocheck-inventory.md` — Phase 5 에서 27→0건 회복 완료.
