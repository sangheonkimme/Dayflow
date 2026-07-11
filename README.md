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

### 관측 · 결제 (선택)

전부 비워두면 완전 no-op — 로컬/미설정 환경에서 아무 영향 없음.

```env
# Sentry (에러 관측). DSN 비우면 SDK 전송·빌드 래핑 모두 스킵.
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=          # 소스맵 업로드용 (빌드 시에만)

# 결제 webhook 서명 시크릿 (HMAC-SHA256). 비우면 해당 라우트 503.
TOSS_WEBHOOK_SECRET=
LEMONSQUEEZY_WEBHOOK_SECRET=

# 결제 처리·시작. service-role 은 webhook 이 plan 갱신에 사용(⚠️ 클라 노출 금지).
# LEMONSQUEEZY_* 비우면 /api/checkout 은 501(준비 중).
SUPABASE_SERVICE_ROLE_KEY=
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_ID=
LEMONSQUEEZY_VARIANT_ID_YEARLY=
```

- **샘플링**: dev 트레이스 100% / prod 10%. Session Replay 미포함.
- **PII**: `sendDefaultPii: false`. 로그인 사용자 `id`/`email` 만 명시적으로 컨텍스트에 부착.
- **environment 태그**: Vercel `VERCEL_ENV`(preview/production) 우선, 로컬은 `NODE_ENV`.

### 플랜 컬럼 마이그레이션 적용 (P6)

`supabase/migrations/0011_profiles_plan.sql` 은 `profiles` 에 `plan`(free|pro) + `plan_updated_at` 을 추가한다.
**자동 적용 안 됨** — 검토 후 아래 중 하나로 적용:

```bash
# Supabase CLI (로컬 → 원격 push)
supabase db push

# 또는 대시보드 SQL Editor 에 0011_profiles_plan.sql 내용 붙여넣기
```

적용 후 `useUserPlan()`(클라) / `fetchUserPlan()`(RSC) 이 실제 값을 읽는다.

### 결제 플로우 (LemonSqueezy)

```
업그레이드 버튼 → POST /api/checkout (인증 유저, user_id 를 custom_data 에)
  → LemonSqueezy hosted checkout 로 redirect → 결제
  → LS webhook(POST /api/webhooks/lemonsqueezy, 서명검증) → profiles.plan = 'pro'
  → /dashboard?upgraded=1 복귀 → plan 캐시 무효화 → UI 반영(배지/배너)
```

LemonSqueezy 설정: **Store ID · Variant ID**(Products → Variant), **API Key**(Settings → API),
**Webhook**(Settings → Webhooks → URL `https://<도메인>/api/webhooks/lemonsqueezy`, signing secret → `LEMONSQUEEZY_WEBHOOK_SECRET`).
Toss 는 수신부(webhook) stub 만 — 발신(체크아웃)은 LS 우선.

### 결제 webhook 테스트

서명 시크릿을 `.env` 에 넣고 dev 서버(`pnpm dev`) 기동 후:

```bash
# 서명 생성 → 요청 (Toss 예시, LemonSqueezy 는 X-Signature + /lemonsqueezy)
BODY='{"eventType":"PAYMENT.DONE","data":{"metadata":{"user_id":"<UUID>"}}}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$TOSS_WEBHOOK_SECRET" | awk '{print $2}')
curl -i -X POST http://localhost:3000/api/webhooks/toss \
  -H "Content-Type: application/json" -H "Toss-Signature: $SIG" -d "$BODY"
# → 200 {"received":true}.  서명 불일치 401 · JSON 파싱 실패 400 · 시크릿 미설정 503.
# user_id 없거나 service-role 미설정이면 200 ack + 서버 로그 경고(plan 미변경).
```

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
