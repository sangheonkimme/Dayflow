# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server on port 5173.
- `npm run build` — `tsc -b && vite build`. Type errors fail the build.
- `npm run typecheck` — `tsc --noEmit` (use this for fast type validation).
- `npm run lint` — ESLint with `--max-warnings 0`; warnings fail.
- `npm run preview` — serve the production build locally.

There is no test runner configured.

Path alias `@/*` → `src/*` is set in both `tsconfig.json` and `vite.config.ts`; always import via `@/...`, not relative paths.

## Environment

`.env` provides `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Both empty → app falls back to a localStorage-backed mock data source and a guest auth session. Both filled → real Supabase auth + data. The toggle is checked at runtime via `isSupabaseConfigured` in `src/lib/supabase.ts`.

The directory `WLD (4)/` at the repo root is a **design mockup (시안) only** — not part of the build, excluded from `tsconfig` and ESLint. **Do not read, edit, scan, or grep it.** Skip it in any directory traversal or codebase exploration.

## Architecture

The app is a single-page React 18 + TypeScript dashboard ("Dayflow") that renders **three top-level surfaces** chosen by `App.tsx` based on auth state and viewport:

1. **Auth screens** (`auth-login.tsx`, `auth-flows.tsx`, `auth-forgot.tsx`, `auth-pc.tsx`) — shown when `useAuth()` returns `status === 'guest'`. Mobile vs PC variants are picked by `useMediaQuery('(max-width: 768px)')` (override-able by the `forceMobile` tweak).
2. **Mobile dashboard** (`mobile-app.tsx`).
3. **Desktop dashboard** — `Sidebar` + `main` with a router-by-`active`-string switch in `App.renderPage()` (no react-router). Heavy pages (memo, subs, salary, loan, image tools, mobile, all auth screens) are `React.lazy()`-loaded.

A floating `TweaksPanel` is always mounted; its state lives in the `preferences` repository and drives runtime CSS variables (`--yellow` accent, `dark` body class).

### Data layer (`src/shared/data/` + `src/features/<domain>/`)

The data layer follows the Bulletproof React lite layout (Phase 1, 2026-05). Domain-agnostic infrastructure lives in `shared/data/`; per-domain hooks/selectors/seeds live under `features/<domain>/`. It is a **three-tier abstraction designed so the mock → Supabase swap is one line**:

```
component → useXxx() hook → Repository → Store (useSyncExternalStore) → DataSource (mock | supabase)
```

Infrastructure (`src/shared/data/`):
- `shared/data/store.ts` — generic `createStore<T>` factory. Produces an immutable, frozen-array snapshot store with `subscribe / getSnapshot / setAll / upsert / remove` and a `Status` ('idle' | 'loading' | 'success' | 'error'). Every mutation creates a new array reference so React 18 `useSyncExternalStore` re-renders correctly.
- `shared/data/source/types.ts` + `shared/data/source/mock.ts` — `DataSource` is a bag of `Repository<T>` instances (transactions, events, memos, stickyNotes, checklist, subscriptions, pinnedInfo, dailyLog). The mock implementation seeds from each feature's `seeds.ts` and is **in-memory only** — `upsert`/`remove` update the store but do not persist; refreshes reset to seeds. (Note: `usePreferences` and `useAuth` use their own localStorage keys; that persistence is hook-local, not in the mock repos.)
- `shared/data/source/index.ts` — `getDataSource()` singleton. Today it always returns the mock; the Supabase implementation is the explicit `TODO` there. Replacing this return is intended to be the entire migration on the data side, plus mappers under `shared/data/source/mappers/` (not yet created — see `docs/schema-alignment.md`).
- `shared/data/hooks/useRepository.ts` — base hook every domain hook wraps. Auto-triggers `repo.init()` when status is `idle`, exposes `{ data, status, error, isLoading, upsert, remove }`.
- `shared/data/seeds/{index,types,lookups}.ts` — cross-domain types (`Mood`, `PinnedInfo`, `DailyLog`), lookup constants (`MOODS`, `TIMER_PRESETS`, `ACCENT_OPTIONS`, `TWEAK_DEFAULTS`), and the seeds barrel that aggregates each feature's `seeds.ts`.

Per-domain (`src/features/<domain>/`):
- `features/<domain>/hooks/useXxx.ts` — thin domain wrappers (`useTransactions`, `useEvents`, `useMemos`, `useStickyNotes`, `useChecklist`, `useSubscriptions`, `usePinnedInfo`, `useDailyLog`, `usePreferences`, `useAuth`). One per feature folder.
- `features/<domain>/selectors/*` — pure derivation (e.g. `features/transactions/selectors/derived.ts` exports `inferIcon`/`inferPayday`). Components must call these instead of reading display fields directly off domain rows; this is what lets DB rows omit those fields.
- `features/<domain>/seeds.ts` — initial mock rows for the domain.

Cross-feature import is forbidden by convention — features may import from `shared/` only. Lift shared bits to `shared/data/seeds/` (constants/types) or compose at the page level instead of feature → feature imports.

When adding a new domain entity: create `features/<domain>/seeds.ts` → extend `DataSource` in `shared/data/source/types.ts` → wire a mock repo in `shared/data/source/mock.ts` → register the seed in `shared/data/seeds/index.ts` → write `features/<domain>/hooks/useXxx.ts` on top of `useRepository` → derive any display fields in `features/<domain>/selectors/`.

### Auth gate

`App.tsx` short-circuits on `auth.status === 'unknown'` (initial session restore) by rendering a fallback to prevent flashing the login screen. With Supabase unconfigured, `useAuth` yields `'guest'` so the dev experience always lands on the auth screens unless you bypass via the tweaks panel's "auth preview" radio.

### Domain ↔ DB schema mapping

`docs/schema-alignment.md` is the authoritative reference for domain-type ↔ Supabase-column mismatches. It classifies each field as **A** (add column), **B** (derive in selector — do not store), or **C** (rename/transform in mapper). Treat the DB shape as the source of truth; before adding a field to a domain type check whether a selector should derive it instead. Currently no mappers exist (mock-only), so the spec lives only in that doc.

`docs/supabase-plan.md` has the full table DDL, RLS template (`auth.uid() = user_id` per-table), and the `handle_new_user` trigger that creates `profiles` on signup.

## Conventions specific to this repo

- The codebase is mid-migration from JSX to TSX; ESLint disables `@typescript-eslint/no-explicit-any` and `react/prop-types` accordingly. Prefer real types in new code, but `any` casts on the legacy edges (e.g. `Screen: any` in `App.tsx`) are intentional during migration — don't aggressively retype them as a side quest.
- Component files often export multiple named components (e.g. `pages.tsx` exports `LedgerPage`, `CalendarPage`, `SettingsPage`). Lazy imports use `.then(m => ({ default: m.X }))` — keep this pattern when adding lazy routes.
- All copy is Korean. Match the existing tone for new UI strings.
- Styles are plain CSS files under `src/styles/`, imported once via `main.tsx`. There is no CSS modules / Tailwind setup.

## Commit message convention

- **본문은 한국어로 작성.** Conventional Commits 접두사(`feat:`, `fix:`, `chore:`, `refactor:`, `docs:` 등)는 영어 그대로 유지. 예: `feat: 사이드바 스크롤 + 로그아웃 버튼 정리`.
- 마이그레이션 Phase 커밋은 `chore(phase-N): ...` 형태로 통일.
- 본문/푸터 한국어. `Co-Authored-By` / `🤖 Generated with` 풋터는 추가하지 않음 (전역 룰).
