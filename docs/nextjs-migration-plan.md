# Next.js 도입 마이그레이션 계획

> 작성일: 2026-05-08
> 대상: Vite + React 18 SPA → Next.js 15 (App Router) + React 19
> 전환 방식: **인플레이스(in-place)** — 같은 레포에서 Vite 진입점만 걷어내고 Next로 갈아끼움. 별도 브랜치에서 Phase 단위로 진행, main 은 Vite 버전 유지하다 일괄 머지.

---

## 0. 인플레이스 vs 병행

- **인플레이스 (채택)** — 현 레포 `Dayflow/` 위에서 `vite` 패키지·`index.html`·`src/main.tsx` 제거하고 `app/`·`next.config.ts` 추가. `src/shared/data/`, `src/lib/`, `src/store/` 같은 프레임워크-무관 코드는 그대로 유지. PR 단위가 명확하고 히스토리 끊기지 않음.
- **병행(side-by-side)** — `apps/legacy` + `apps/web` monorepo. 큰 팀에는 안전하나 우리 규모엔 오버킬, 부트스트랩/CI 부담만 늘어남.

브랜치 전략:

- `feat/nextjs` 장기 브랜치에서 Phase 0~5 진행.
- 각 Phase 마지막에 main 으로 리베이스해 충돌 최소화.
- Phase 5 완료 시 한 번에 main 머지 + 이전 SPA 빌드 폐기.

---

## 1. 도입 동기

| 문제                              | 현 상태                                                          | Next.js 도입 후                                |
| --------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| 랜딩 SEO/OG                       | SPA 안에 박혀 인덱싱·미리보기 약함                               | RSC 정적 SSG + `metadata` API                  |
| 데이터 페칭 분산                  | 직접 짠 `useSyncExternalStore` 스토어 + `getDataSource()` 싱글톤 | RSC + `@supabase/ssr` + TanStack Query hydrate |
| 공개 도구 라우트 (`#/tools/crop`) | hash routing, 코드분할 안 됨                                     | 파일 라우팅, 자동 청크                         |
| CSS 글로벌 leak                   | `.nav`, `.card` 같은 흔한 클래스 충돌 (실제 사고 2건)            | CSS Modules + Tailwind 로 차단                 |
| 인증 가드                         | 클라에서만 분기, 보호 페이지가 잠깐 노출                         | `middleware.ts` + RSC `getUser()`              |
| `@ts-nocheck` 파일                | 빌드는 통과하지만 런타임 에러 미검출 (LandingPage 사고)          | 타입 회복 + RSC 강제                           |

---

## 2. 권장 스택

- **Next.js 15 (App Router)** + **React 19** — RSC, Server Actions, `use cache`.
- **Supabase `@supabase/ssr`** — 쿠키 기반 세션, RSC/Route Handler/Middleware 통합.
- **TanStack Query 유지** — 클라 mutation·낙관적 업데이트는 그대로.
- **Zustand 유지** — UI 상태(modal, tweaks).
- **CSS Modules + Tailwind** — 점진 도입. 기존 `src/styles/*.css` 는 토큰만 남기고 폐기.
- **shadcn/ui** — 버튼/모달/입력 표준화. 페이즈 4 에서 도입.
- **MDX (선택)** — 랜딩 카피·FAQ 컨텐츠 분리.

---

## 3. 페이즈 로드맵

### Phase 0 — 사전 정리 (현 Vite 레포에서 선행)

목표: Next 옮기기 전에 이식 친화적 형태로 만들어 두기. **Next 부트스트랩 PR 전에 모두 머지.**

- [x] `App.tsx` 의 `renderPage()` switch 를 라우트 단위로 모듈화. → 데스크탑 페이지는 이미 1파일 1컴포넌트(`LedgerPage`, `CalendarPage`, `MemoPage`, `SubsPage`, `TxnsPage`, `SettingsPage`, `SalaryCalcPage`, `LoanCalcPage`, `CropCanvasPage`, `PdfCanvasPage`)로 분리되어 있었음. 인라인이던 home 분기를 `pages/home/HomePage.tsx` 로 추출하여 모든 라우트가 동일한 패턴(컴포넌트 + props 인터페이스)을 따르도록 정리. App.tsx 라인수 약 100줄 감소.
- [x] hash routing(`#/tools/crop` 등) 전부 정리. → `react-router-dom` 도입 없이 `src/lib/spa-nav.ts` (32줄, History API + 커스텀 이벤트) 로 자체 처리. 공개 도구는 `/tools/crop`, `/tools/pdf` 로 path 기반. 랜딩 내부 링크(`#features`, `#demo` 등)는 동일 페이지 anchor 라 그대로 유지. **주의**: 프로덕션 호스팅은 SPA fallback(rewrite all → index.html) 필요 — Phase 1 Next.js 도입과 함께 자연 해소되므로 Vite 단계에서는 dev 동작만 보장.
- [x] **글로벌 CSS 셀렉터 전수 감사**. → `docs/css-global-audit.md`. leak 후보 5건(`.nav`, `.brand-mark`, `.brand-mark::after`, `.brand-name`, `.swatch`) 모두 `.app`/`.sidebar` 스코프로 격리. 흔한 이름(`.card`, `.btn` 등)은 Phase 4에서 CSS Modules 로 자연 해소.
- [x] `@ts-nocheck` 파일 목록화 + 타입 회복 우선순위 매기기. → `docs/ts-nocheck-inventory.md` (27개, P0~P4 분류)
- [x] `WLD (4)/` 시안은 그대로 무시. → `tsconfig.json` exclude + `.eslintrc.cjs` ignorePatterns 양쪽 반영 확인

### Phase 1 — Next.js 셸 부트스트랩

목표: 빈 Next 앱이 떠서 `/` 라우트가 "Hello" 라도 렌더되는 상태.

- [x] Next.js 15 + React 19 + @supabase/ssr 도입 (수동 install — `create-next-app` 인터랙티브 회피). Tailwind 는 Phase 4 에서.
- [x] `package.json` scripts: `dev`/`build`/`start` 를 next 로 교체. `vite`/`@vitejs/plugin-react` 는 vitest 의존성으로 dev 잔존(전용 사용 안 함).
- [x] `index.html`, `src/main.tsx`, `src/vite-env.d.ts` 제거. `vite.config.ts` 는 vitest 가 읽으므로 보존.
- [x] `src/shared/data/`, `src/lib/`, `src/store/`, `src/data/` 그대로 유지. **단** `src/pages/` → `src/screens/` 리네임 (Next Pages Router 자동 인식 회피). `src/app/` → `src/shared/query/` 이전 (Next App Router 와 충돌 회피).
- [x] `lib/supabase/{client,server,middleware}.ts` 3분할 (@supabase/ssr 패턴). 레거시 `src/lib/supabase.ts` 는 `process.env.NEXT_PUBLIC_*` 우선 + `VITE_*` fallback 으로 호환 유지.
- [x] `middleware.ts` 추가 — 세션 갱신만 활성. 보호 라우트 리다이렉트는 Phase 2 에서.
- [x] `npm run build` (next build) 통과. `/` Hello placeholder 정적 렌더, dev 서버 200 OK 확인.

**Phase 1 인계 노트** (Phase 2 시작 전 필수)
- `.env` 에 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가 필요. (현재 `VITE_*` 만 있음 → 레거시 fallback 으로 동작 중)
- `src/App.tsx` 와 `src/screens/*` 는 Next 라우트로 미연결 상태. Phase 2 에서 라우트별 이식.
- `pageExtensions` 옵션 안 씀 — Phase 2 완료 후에도 src/screens/ 가 남아있으면 명시적 제거 또는 폴더 이전.

### Phase 2 — 라우트 이식 ✅

페이지별 커밋. 17 라우트 모두 `app/` 으로 이식.

- [x] **`/` 랜딩** — `app/page.tsx` + 'use client' LandingPage. authed/mock 시 `/dashboard` redirect.
- [x] **`/login` `/signup` `/forgot` `/onboarding`** — `app/(auth)/*/page.tsx`. PC/Mobile useMediaQuery 분기. (Server Action 은 Phase 5 후속)
- [x] **`/tools/crop` `/tools/pdf`** — `app/tools/<slug>/page.tsx` + 공유 layout.
- [x] **`/dashboard/*` 9개** — Sidebar(usePathname) + 모달 + 검색 + Tweaks.
- [x] **모바일** — 별도 라우트 없이 layout 에서 MobileApp 단일 진입.
- [x] `src/App.tsx`, `src/lib/spa-nav.ts` 제거.

### Phase 3 — 데이터 레이어 재구성 ✅

- [x] DataSource 추상 유지. `getDataSource()` 그대로.
- [x] `src/server/queries/` 8개 도메인 fetcher (`cache()` + `@supabase/ssr`).
- [x] 6개 dashboard 라우트 RSC prefetch + HydrationBoundary (ƒ Dynamic).
- [x] mock 모드 클라 전용. RSC 항상 Supabase, 미인증 시 빈 배열.
- [x] middleware `/dashboard/*` 미인증 → `/login?next=...` redirect.

### Phase 4 — 스타일 마이그레이션 (4a 완료)

**4a (완료)**
- [x] Tailwind v3 도입 — `tailwind.config.ts` 토큰과 `:root` 변수 1:1 매핑, preflight off.
- [x] `next/font` (Plus_Jakarta_Sans, Gaegu, JetBrains_Mono) — Google Fonts `@import` 사고 영구 차단.

**4b (별도 세션 권장 — 페이지별 시각 회귀 검토 필수)**
- [ ] 페이지별 `*.module.css` 로 점진 이전.
- [ ] 글로벌 `src/styles/styles.css` 를 토큰 + reset (~200줄) 로 축소 + preflight 활성화.
- [ ] shadcn/ui 도입 (시안 매핑 비용 검토 후).
- [ ] `next/image` 로 이미지 최적화.

### Phase 5 — 정리·배포

- [x] **main 머지 완료 (2026-05-09)** — Phase 1~4a 본체 + origin PR #19 dead code 정리 통합. main 푸시 완료.
- [ ] vitest 4 rolldown 파서 호환 fix (현재 테스트 깨짐) 또는 vitest 3 다운그레이드.
- [ ] `@ts-nocheck` 전부 제거 (27개, `docs/ts-nocheck-inventory.md` P0~P4 순서).
- [ ] 글로벌 CSS 잔해 삭제 — Phase 4b 와 동시 진행.
- [ ] 배포 — Vercel(권장) 또는 self-host. `.env.production` 의 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정.

---

## 4. 리스크 & 완화

| 리스크                        | 영향                                                      | 완화                                                                         |
| ----------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Supabase 세션 마이그레이션    | localStorage → 쿠키 전환 시 모든 사용자 1회 강제 로그아웃 | 릴리즈 노트 안내. `@supabase/ssr` 표준 패턴 따름.                            |
| 마이그레이션 중 dev 환경 깨짐 | 작업 흐름 차단                                            | `feat/nextjs` 브랜치에서만 진행, main 은 Vite 그대로.                        |
| 번들 사이즈 / hydration 비용  | 초기 로드 느려질 수 있음                                  | RSC 비중 늘리고, 클라 컴포넌트는 leaf 만. `dynamic()` 으로 무거운 위젯 lazy. |
| CSS 회귀                      | 글로벌 → 모듈 전환 중 깨짐                                | 페이지 단위 PR + 시안 스크린샷 비교. Phase 0 에서 글로벌 셀렉터 감사 선행.   |
| mock 모드 SSR 호환            | RSC 에서 mock 흉내 복잡                                   | mock 은 클라 전용 토글로 한정. RSC 는 항상 Supabase.                         |
| `@ts-nocheck` 누락 버그       | 런타임 사고(LandingPage `Landing is not defined` 사례)    | Phase 0 에서 목록화, Phase 5 에서 전부 제거 강제.                            |

---

## 5. 작업 순서 결정 사항

- **인플레이스 전환** 채택. monorepo 분할 안 함.
- **Phase 0 부터 시작** — 글로벌 CSS 감사가 가장 시급(이미 사고 2건). Next 부트스트랩 전에 머지.
- **페이지 단위 PR** — Phase 2 의 5개 라우트는 각각 별도 PR.
- **mock 모드 보존** — 디자인 QA 워크플로 유지. 단 RSC 에선 비활성.

---

## 6. 미정 / 추후 결정

- Tailwind vs CSS Modules 비중 — Phase 4 첫 페이지 옮길 때 결정.
- shadcn/ui 도입 시점 — Phase 4 시작 시 vs 모든 페이지 이식 후. 기본 버튼·모달이 시안과 얼마나 다른지에 달림.
- 배포 타겟 — Vercel(편함, lock-in) vs self-host(런타임 비용 통제). 유저 규모 확인 후.
- i18n — 현 시점 한국어만. 영어 마케팅 페이지 필요해지면 `next-intl` 검토.
