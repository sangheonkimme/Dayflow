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

### Data layer (`src/data/`)

The data layer is the part that takes time to understand from files alone. It is a **three-tier abstraction designed so the mock → Supabase swap is one line**:

```
component → useXxx() hook → Repository → Store (useSyncExternalStore) → DataSource (mock | supabase)
```

- `data/store.ts` — generic `createStore<T>` factory. Produces an immutable, frozen-array snapshot store with `subscribe / getSnapshot / setAll / upsert / remove` and a `Status` ('idle' | 'loading' | 'success' | 'error'). Every mutation creates a new array reference so React 18 `useSyncExternalStore` re-renders correctly.
- `data/source/types.ts` + `data/source/mock.ts` — `DataSource` is a bag of `Repository<T>` instances (transactions, events, memos, stickyNotes, checklist, subscriptions, pinnedInfo, dailyLog). The mock implementation seeds from `data/seeds/*` and persists to localStorage.
- `data/source/index.ts` — `getDataSource()` singleton. Today it always returns the mock; the Supabase implementation is the explicit `TODO` there. Replacing this returns is intended to be the entire migration on the data side, plus mappers under `data/source/mappers/` (not yet created — see `docs/schema-alignment.md`).
- `data/hooks/useRepository.ts` — base hook every domain hook wraps. Auto-triggers `repo.init()` when status is `idle`, exposes `{ data, status, error, isLoading, upsert, remove }`.
- `data/hooks/useXxx.ts` — thin domain wrappers (`useTransactions`, `useEvents`, `useMemos`, `useStickyNotes`, `useChecklist`, `useSubscriptions`, `usePinnedInfo`, `useDailyLog`, `usePreferences`, `useAuth`).
- `data/selectors/*` — pure derivation (e.g. `inferIcon`, `subscriptionColor`, `formatNextBilling`). Components must call these instead of reading display fields directly off domain rows; this is what lets DB rows omit those fields.
- `data/seeds/*` — initial mock data + lookup constants (including `TWEAK_DEFAULTS`, owned here so `usePreferences` does not import from `App.tsx`).

When adding a new domain entity: add seeds → add a `Repository` to mock source + DataSource type → write `useXxx` hook on top of `useRepository` → derive any display fields in `selectors/`.

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
