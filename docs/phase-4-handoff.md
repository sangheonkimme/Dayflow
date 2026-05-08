# Phase 4 — 스타일 마이그레이션 (부분 완료)

> ✅ **Phase 4a (2026-05-08 완료)** — Tailwind v3 + next/font + 디자인 토큰 매핑.
>
> ⏳ **Phase 4b (남음)** — CSS Modules 로 페이지 단위 이전 + shadcn/ui 도입 + preflight 활성화. 페이지별 시각 회귀 검토 필요해 별도 세션에서 진행.

## Phase 4a 결과 (완료)

- **Tailwind v3** 설치 (`tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`).
  - `theme.extend` 가 `:root` CSS 변수와 1:1 매핑 (`colors.bg → var(--bg)` 식). 다크 모드/액센트 토글이 그대로 동작.
  - `darkMode: "class"` — `body.dark` 토글과 호환.
  - `corePlugins.preflight: false` — 글로벌 reset 과 충돌 회피. Phase 4b 에서 활성화.
  - 빌드 CSS 에 `bg-yellow`, `font-hand` 등 유틸 생성 확인.
- **next/font** 도입.
  - `app/layout.tsx` 가 `Plus_Jakarta_Sans`, `Gaegu`, `JetBrains_Mono` 를 variable 옵션으로 로드.
  - `styles.css` / `landing.css` 의 `--sans`/`--hand`/`--mono` 가 `var(--font-*)` chain.
  - Google Fonts `@import url(...)` 제거 — Vite `@import` 위치 사고 영구 차단.
- **호환성**: 기존 글로벌 CSS 와 공존. 17 라우트 빌드 통과.

## Phase 4b 남은 작업 (별도 세션 권장)

## 전략

**Tailwind + CSS Modules 하이브리드** 권장. 이유:
- Tailwind: 신규 컴포넌트, shadcn/ui 와 자연 호환, 빠른 변경
- CSS Modules: 기존 시안 스타일(`.sticky.yellow::before` 같은 복잡한 nth-child + pseudo) 은 모듈로 보존, 재작성 부담 줄임

## 작업 단계

### 1. Tailwind 도입 + 디자인 토큰 매핑

- [ ] `npm install -D tailwindcss postcss autoprefixer`
- [ ] `npx tailwindcss init -p` → `tailwind.config.ts`
- [ ] `app/layout.tsx` 에 `import './globals.css'` (Tailwind directives)
- [ ] `tailwind.config.ts` 의 `theme.extend` 에 기존 토큰 매핑:
  - `colors.bg`, `colors.bg-paper`, `colors.ink`, `colors.ink-soft`, `colors.ink-mute`, `colors.line`, `colors.yellow` (CSS 변수와 연동)
  - `fontFamily.hand` (Caveat / Gaegu)
  - `borderRadius`, `boxShadow` 토큰
- [ ] `:root --bg --ink ...` CSS 변수는 그대로 유지하고 Tailwind 가 `var(--bg)` 참조

### 2. 폰트 → `next/font`

- [ ] `app/layout.tsx`:
  ```tsx
  import { Caveat, Gaegu, Plus_Jakarta_Sans } from "next/font/google";
  ```
- [ ] CSS 의 `@import url(...)` Google Fonts 라인 제거 (`src/styles/styles.css`)
- [ ] `font.variable` 을 `<html className={...}>` 에 적용

### 3. CSS Modules 로 페이지 단위 이전

페이지별 별도 PR. 각 페이지 옆에 `*.module.css` 두기.

이전 우선순위 (영향 범위 큰 순):
- [ ] `src/screens/landing/` → `app/(public)/_components/*.module.css`
- [ ] `src/screens/home/` → `app/(app)/_components/*.module.css`
- [ ] `src/screens/ledger/`, `calendar/`, `txns/`, `subs/`, `memo/`, `settings/`
- [ ] `src/screens/auth/` (모바일/PC 양쪽)
- [ ] `src/screens/mobile/*` (탭, 시트, 커뮤니티)
- [ ] `src/components/Shell.tsx` (Sidebar, Topbar) → 모듈

각 페이지 작업:
1. 글로벌 styles.css 에서 해당 페이지 관련 클래스 추출
2. `Page.module.css` 로 옮기고 `:local()` 자동 스코프 적용
3. JSX 에서 `import styles from './Page.module.css'`, `className={styles.foo}` 로 교체
4. styles.css 에서 옮긴 클래스 삭제

### 4. shadcn/ui 도입

- [ ] `npx shadcn-ui@latest init` (Tailwind config 자동 통합)
- [ ] 점진 도입 컴포넌트: `Button`, `Dialog`(모달), `Input`, `Select`, `Tabs`, `Tooltip`, `Sheet`(모바일)
- [ ] 기존 모달(`TxnModal`, `EventModal`)을 `Dialog` 로 재구성 — 시각·동작 회귀 검증
- [ ] 시안과 톤 매칭: shadcn 의 변수 기반 테마(`--primary`, `--background`...)에 기존 색 매핑

### 5. 이미지 → `next/image`

- [ ] 시안 이미지(`public/images/`, 랜딩 갤러리 등) `<img>` → `<Image>` 교체
- [ ] `next.config.ts` 의 `images.remotePatterns` 에 외부 호스트 등록 (Supabase Storage URL 등)

### 6. 글로벌 CSS 잔해 제거

목표: `src/styles/styles.css` 가 디자인 토큰(`:root --xxx`) + reset + 글로벌 폰트 클래스만 남음 (~200줄).

- [ ] `src/styles/landing.css` 전체 → `app/(public)/landing.module.css` 로 이전 또는 삭제
- [ ] `src/styles/styles.css` 의 페이지·컴포넌트 클래스 전부 모듈로 이전
- [ ] 남은 글로벌은 토큰·reset·`@font-face`·body 기본만

## 시각 회귀 방지

- 페이지 단위 PR 마다 **시안 스크린샷 비교** 필수
- Storybook 또는 Playwright visual regression 도입 검토 (선택)
- 디자인 토큰 (`--bg`, `--ink`) 값은 Phase 4 동안 절대 변경 금지

## Phase 4 종료 기준

- [ ] Tailwind 활성, `tailwind.config.ts` 에 토큰 매핑 완료
- [ ] `next/font` 로 Google Fonts 직렬화 — `@import` 사고 영구 차단
- [ ] `src/styles/styles.css` < 300줄 (현재 3000+)
- [ ] 모든 페이지가 `*.module.css` 또는 Tailwind 사용
- [ ] shadcn/ui Button/Dialog/Input/Select/Tabs 적용
- [ ] `next/image` 로 이미지 최적화
- [ ] `@ts-nocheck` 전부 제거 (P0~P4 인벤토리 참고)
- [ ] 시각 회귀 없음

## 결정 필요

- shadcn 컴포넌트의 시안 일치 비용. 쉽게 매핑 안 되는 경우 (paper-desk 텍스처, 손글씨 폰트) 는 커스텀 유지.
- Tailwind v3 vs v4. v4 가 안정화됐으면 도입.
- Storybook 도입 여부 (디자인 시스템 문서화 가치 vs 부트스트랩 비용)
- 다크 모드 토큰 — 현재 `body.dark` 분기. Tailwind `dark:` 와 호환되도록 `dark` 전략으로 통일.
