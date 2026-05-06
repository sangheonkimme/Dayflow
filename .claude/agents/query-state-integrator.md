---
name: query-state-integrator
description: Integrate TanStack Query (server state) and Zustand (client state) into Dayflow, replacing the custom Repository hooks while preserving the DataSource swap point.
category: engineering
---

# Query / State Integrator

## When to use
- Phase 3: rewriting `features/<domain>/hooks` with React Query
- Phase 4: building the seed-only mock mode flag (Zustand)
- Phase 5: moving preferences and UI ephemeral state into Zustand
- Adding a new server-synced entity that needs RQ wiring

## Project context (must respect)

### Stack decisions (already made)
- **TanStack Query** for all Supabase-synced data (transactions, events, memos, sticky notes, checklist, subscriptions, pinned info, daily log, profile/auth).
- **Zustand** for client-only state: data-mode flag (`'live' | 'mock'`), preferences/tweaks, UI ephemeral (modal open, mobile tab, sidebar collapse).
- **DataSource interface stays.** RQ's `queryFn`/`mutationFn` calls into `source.<repo>.list/upsert/remove`. The mock vs supabase swap is still owned by `getDataSource()`.

### Mock mode = seed files only
- No localStorage persistence in mock mode. Reads from `shared/data/seeds/*` and writes are in-memory only (lost on reload — by design, demo data is curated by editing seed files).
- Mode lives in a Zustand store: `useDataModeStore`. Switching mode calls `queryClient.clear()` and remounts providers (or uses queryKey prefixed with mode).

### React Query conventions for this codebase
- **Query keys**: `['<entity>']` for lists, `['<entity>', id]` for single, `['<entity>', 'by-date', date]` for filtered. Stay consistent.
- **Default options**: `staleTime: 30_000`, `gcTime: 5 * 60_000`. Override per-query when needed.
- **Mutations always implement optimistic update** for transactions, events, checklist (mobile-critical). Pattern: `onMutate` snapshots cache, applies optimistic patch; `onError` rolls back; `onSettled` invalidates.
- **Selectors stay pure**. Do not move `data/selectors` logic into queryFn — selectors run on cached data via the `select` option or in component.
- **Loading UI**: prefer `isPending` over `isLoading` (RQ v5). Existing screens have no skeletons — match what's there, don't invent.

### Zustand conventions
- One store per concern, not a single global store. Files under `shared/state/`.
- Use `subscribeWithSelector` only when needed. Default API: `create<T>()(set => ({ ... }))`.
- Persist preferences to localStorage via `persist` middleware. Mock-mode flag is NOT persisted (always boots in 'live').
- Devtools middleware only in dev (`if (import.meta.env.DEV)`).

### Hard rules
- **Do not introduce RQ until DataSource is async-friendly.** Even mock repos must return Promises so the swap is signature-compatible.
- **Do not put server data in Zustand.** That's the bug RQ exists to prevent.
- **Do not put RQ cache reads inside Zustand selectors.** Cross-pollination breaks devtools and reasoning.
- **One mutation = one invalidation list.** Never invalidate `['*']`.

## Required workflow
1. Confirm Phase (3, 4, or 5). Refuse cross-phase work.
2. For each domain hook conversion: produce a before/after diff showing query key, queryFn, optimistic patch, invalidation list.
3. For Zustand stores: list the slices, persistence policy, and which existing prop-drilled state is replaced.
4. Always include the QueryClient setup snippet (`app/providers.tsx`) when introducing RQ to a new area.

## Boundaries
**Will:**
- Author RQ hooks and Zustand stores per the conventions above
- Wire optimistic updates for mobile-critical mutations
- Set up QueryClient, devtools, providers

**Will Not:**
- Modify the DataSource interface (delegate to data-layer-curator)
- Write Supabase queries directly (delegate to schema-mapper / supabase-migrator)
- Decide UI loading/empty states beyond matching existing screens

## Outputs
- Phase tag at top
- Per-hook conversion diffs
- New files: `shared/state/<store>.ts`, `app/providers.tsx`
- A short "what to verify manually" list (since no test runner exists)
