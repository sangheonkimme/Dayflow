# Phase 2 — 라우트 이식 (완료)

> ✅ **2026-05-08 완료.** `src/App.tsx` 의 SPA 라우팅을 Next.js App Router 17개 라우트로 이식. 빌드 통과, dev 서버 16/16 200 OK.

## 결과 라우트 맵

```
/                           landing (authed/mock 은 /dashboard 로 redirect)
/login /signup /forgot      auth (라우트 그룹 (auth))
/onboarding
/tools/crop /tools/pdf      공개 도구 (공유 layout)
/dashboard                  home
/dashboard/ledger           가계부
/dashboard/calendar
/dashboard/memo
/dashboard/subs
/dashboard/txns
/dashboard/settings
/dashboard/salary
/dashboard/loan
/dashboard/cash             (loan 별칭)
```

`src/App.tsx` 와 `src/lib/spa-nav.ts` 는 Phase 2 마무리에서 삭제. SPA 라우팅 흔적 없음.

## 이식 우선순위 (1주 분량 추정)

각 라우트를 **별도 PR** 로 끊어서 진행. 시각 회귀 추적 용이.

### 1. `/` — 마케팅 랜딩 (RSC + 정적)

- 원본: `src/screens/landing/LandingPage.tsx` (`@ts-nocheck`, 시안 이식 잔재 있음)
- 작업:
  - `app/page.tsx` 의 placeholder 를 LandingPage 로 교체
  - `@ts-nocheck` 제거하고 타입 회복
  - 인터랙션 없는 섹션은 RSC, 스크롤/클릭 인터랙션 컴포넌트만 `'use client'` 분리
  - `app/page.tsx` 에 `metadata` 정의 (제목/설명/OG 이미지)
  - `app/opengraph-image.tsx` 추가 (선택)
- 주의:
  - 파일 끝 `window.Landing = Landing;` 잔재 (이미 Phase 0 에서 제거)
  - `useEffect` 사용 부분 모두 별도 클라 컴포넌트로 분리 필요
  - "무료 도구" 링크는 이미 `/tools/crop` path 라우팅 (Phase 0)

### 2. `/login`, `/signup`, `/forgot` — 인증 폼 (Server Action)

- 원본: `src/screens/auth/PcLogin.tsx`, `MobileLogin.tsx`, `PcSignup.tsx`, `MobileSignup.tsx`, `PcForgot.tsx`, `MobileForgot.tsx`, `PcOnboarding.tsx`, `MobileOnboarding.tsx`
- 작업:
  - `app/(auth)/login/page.tsx` 등 라우트 그룹으로 묶기
  - 폼 제출은 Server Action (`'use server'`) 으로 — `signIn(formData)`, `signUp(formData)`, `requestReset(formData)`
  - Supabase 호출은 `lib/supabase/server.ts` 의 `createClient()`
  - 모바일 vs PC 분기는 **`useMediaQuery` 클라 훅**(SSR 안전 가드 필요) 또는 CSS-only 분기로 처리. 둘 다 같은 라우트.
- 주의:
  - 기존 `useAuth()` (`src/data/auth.ts`) 는 클라 전용. RSC 에서는 `lib/supabase/server.ts` 직접 사용.
  - `Enter 키 로그인 + 아이디 기억하기` 동작 (528488d 커밋) 보존 필수.

### 3. `/tools/crop`, `/tools/pdf` — 공개 도구

- 원본: `src/screens/tools/ImageTools.tsx` (`CropCanvasPage`, `PdfCanvasPage` 두 export)
- 작업:
  - `app/tools/crop/page.tsx`, `app/tools/pdf/page.tsx` 각각
  - 현재 PublicToolShell (App.tsx) 을 `app/tools/layout.tsx` 로 옮기기 (같은 헤더 공유)
  - 헤더의 `spaLinkClick` 은 `next/link` 의 `<Link>` 로 교체 (Phase 1 의 `src/lib/spa-nav.ts` 는 Phase 5 에서 제거)
- 주의:
  - 100% 클라 컴포넌트 (canvas API, file upload). 파일 최상단 `'use client'`.
  - PublicToolShell 의 글로벌 leak 방지 (Phase 0 에서 격리한 `.public-tool-*` 스코프 유지)

### 4. `/dashboard/*` — 인증 후 대시보드

- 원본: `src/App.tsx` 의 `AppShell` + `renderPage()` switch + `src/screens/{home,ledger,calendar,memo,subs,txns,settings,salary,loan}/`
- 작업:
  - `app/(app)/layout.tsx` — 인증 가드 (RSC 에서 `getUser()`, 미인증 redirect), Sidebar
  - `app/(app)/page.tsx` — Home (HomePage 이식)
  - `app/(app)/ledger/page.tsx`, `calendar/page.tsx`, `memo/page.tsx`, `subs/page.tsx`, `txns/page.tsx`, `settings/page.tsx`, `salary/page.tsx`, `loan/page.tsx`
  - **데이터 prefetch** — Phase 3 에서 RSC 가 초기 데이터 prefetch → `HydrationBoundary` 로 TanStack Query 캐시 hydrate.
  - 모달(`TxnModal`, `EventModal`) 은 라우트 외 클라 상태(zustand `useModalStore`) 그대로 유지. 향후 parallel routes (`@modal`) 로 옮기는 건 선택.
- 주의:
  - `useDataModeStore` 의 `mock` 모드는 RSC 에선 비활성. Phase 3 에서 클라 토글로 한정.
  - `useTransactions`, `useEvents` 등 도메인 훅은 클라 (TanStack Query). Phase 3 에서 RSC prefetch 결과를 hydrate 받게 변경.
  - `middleware.ts` 의 보호 라우트 가드 활성화 — `/((?!login|signup|forgot|tools|$).*)` 패턴.

### 5. 모바일 대시보드 — 동일 라우트

- 원본: `src/screens/mobile/MobileApp.tsx` + `tabs/`, `sheets/`, `community/`
- 작업:
  - 별도 라우트 만들지 않음. `app/(app)/page.tsx` 등에서 `useMediaQuery` 로 분기.
  - 또는 컴포넌트 단위로 모바일 변형 적용 (CSS / 별도 컴포넌트).
- 주의:
  - 모바일 sheet 들은 zustand 로 관리되는 클라 상태. RSC 와 무관, 그대로 유지.

## Phase 2 종료 기준

- [ ] 5개 라우트 그룹 모두 `app/` 으로 이식 완료
- [ ] `src/screens/*` 의 모든 페이지가 Next 라우트에서 호출됨 (App.tsx 의 `renderPage()` switch 폐기)
- [ ] `src/App.tsx`, `src/lib/spa-nav.ts` 제거 (또는 Phase 5)
- [ ] `npm run build` (next build) 통과 + 모든 라우트 SSG 또는 SSR 명시적 결정
- [ ] 시안과 시각 회귀 없음 (페이지별 스크린샷 비교)

## 미결정·결정해야 할 사항

- 라우트 그룹 명명: `(auth)` / `(app)` / `(public)` / 도메인별?
- 모달을 parallel routes 로 옮길지 여부 (지금 zustand 로 충분히 동작 — 보류)
- Sidebar 의 `active` 상태 동기화: Next `usePathname()` 으로 변경 (직접 setActive 폐기)
- TweaksPanel: 라우트 무관 항상 마운트 → `app/layout.tsx` 에 두기
