-- ============================================================
-- 0006_rls_initplan_fix.sql
-- ============================================================
--
-- Supabase advisor `auth_rls_initplan` 경고 처리:
-- 모든 RLS 정책에서 `auth.uid()` 함수 호출이 row마다 재평가되어 대용량
-- 쿼리 성능을 떨어뜨린다. `(select auth.uid())` 로 감싸면 옵티마이저가
-- initPlan 으로 한 번만 평가한다.
--
-- 정책 이름은 기존과 동일하게 유지 (drop + recreate).
-- ============================================================

-- ─── profiles (id = auth.users.id) ───────────────────────────
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_delete_own on public.profiles;

create policy profiles_select_own on public.profiles
  for select using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles
  for insert with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete_own on public.profiles
  for delete using ((select auth.uid()) = id);

-- ─── 도메인 테이블 9개 (user_id = auth.users.id) ──────────────
do $$
declare
  t text;
  tables text[] := array[
    'sticky_notes', 'notes', 'checklist_items', 'daily_logs', 'pinned_info',
    'accounts', 'categories', 'transactions', 'subscriptions', 'calendar_events'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists "select own" on public.%I', t);
    execute format('drop policy if exists "insert own" on public.%I', t);
    execute format('drop policy if exists "update own" on public.%I', t);
    execute format('drop policy if exists "delete own" on public.%I', t);

    execute format(
      'create policy "select own" on public.%I for select using ((select auth.uid()) = user_id)',
      t
    );
    execute format(
      'create policy "insert own" on public.%I for insert with check ((select auth.uid()) = user_id)',
      t
    );
    execute format(
      'create policy "update own" on public.%I for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      t
    );
    execute format(
      'create policy "delete own" on public.%I for delete using ((select auth.uid()) = user_id)',
      t
    );
  end loop;
end $$;
