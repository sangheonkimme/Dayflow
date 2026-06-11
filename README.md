# Dayflow

가계부 · 캘린더 · 메모 · 구독 관리를 한곳에 모은 개인 생산성 웹 앱.
홈 대시보드에서 자산 흐름, 일정, 스티키 메모, 체크리스트, 미니 캘린더를 한눈에 보고,
이미지 크롭·PDF 같은 부가 도구까지 제공한다.

## 기술 스택

- **Next.js 16** (App Router, Turbopack 기본) + **React 19** + **TypeScript**
- **Supabase** (`@supabase/ssr`) — 인증(Google OAuth/PKCE) + DB(RLS)
- **TanStack Query** (서버 상태) + **Zustand** (클라 상태/환경설정)
- **Tailwind CSS v3** (preflight off, 글로벌 CSS 와 점진 공존) + CSS Modules
- **TipTap** (메모 에디터), **react-easy-crop / pdf-lib** (이미지 도구)
- 배포: **Vercel** (`vercel.json`, region `icn1`)

> Supabase env 미설정 시 mock 모드(in-memory 시드)로 동작하므로, 키 없이도 로컬에서 바로 띄울 수 있다.

## 빠른 시작

패키지 매니저는 **pnpm 10** (corepack 으로 활성화). npm/yarn 사용 금지.

```bash
corepack enable
pnpm install
cp .env.example .env   # 필요 시 Supabase 키 채우기 (비워두면 mock 모드)
pnpm dev               # http://localhost:3000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 (포트 3000) |
| `pnpm build` | 프로덕션 빌드 (타입 에러 시 실패) |
| `pnpm start` | 프로덕션 서버 |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint (`--max-warnings 0`) |
| `pnpm verify` | typecheck + lint + build 일괄 — **커밋 전 게이트** |

## 환경 변수

`.env` 에 Supabase 키를 채우면 실 인증/데이터로 전환된다. 비워두면 mock 모드로 동작.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

키 발급: [Supabase 대시보드](https://app.supabase.com) → 프로젝트 → Settings → API

## 폴더 구조

```
app/                  Next.js App Router (라우트·layout·RSC prefetch)
├ (auth)/             login / signup / forgot / onboarding
├ auth/callback/      Supabase OAuth(PKCE) 콜백
├ dashboard/          ledger · calendar · memo · subs · txns · settings ...
├ tools/              crop · pdf
└ page.tsx            랜딩
proxy.ts              /dashboard/* 진입 가드 (Next 16 컨벤션, 레포 루트)
src/
├ screens/            라우트별 클라이언트 UI (1 파일 1 페이지)
├ server/             RSC fetcher · 세션 헬퍼 · prefetch
├ data/               3-tier 데이터 레이어 (Query → Repository → Store → DataSource)
├ lib/supabase/       브라우저 / 서버 / legacy 클라이언트
└ styles/             글로벌 CSS (Phase 4b 점진 마이그레이션 중)
supabase/migrations/  적용된 SQL 마이그레이션
docs/                 마이그레이션·스키마·수익화 기획 문서
```

> 데이터 흐름: `component → useXxx() (TanStack Query) → Repository → Store → DataSource (mock | supabase)`

## 배포

Vercel 에 연결돼 있으며 `framework: nextjs`, region `icn1` (서울). main 브랜치 푸시 시 자동 배포.
Vercel 프로젝트 환경 변수에 `NEXT_PUBLIC_SUPABASE_*` 를 동일하게 설정해야 한다.

## 문서

상세 설계·진행 상황은 [`CLAUDE.md`](./CLAUDE.md) 와 `docs/` 참고:

- `docs/nextjs-migration-plan.md` — Next.js 마이그레이션 Phase 0~5
- `docs/supabase-plan.md` / `docs/schema-alignment.md` — DB 스키마 · 도메인 매핑
- `docs/monetization-plan.md` — 추가기능 로드맵 + 수익화 기획
- `docs/css-global-audit.md` — 글로벌 CSS leak 감사
