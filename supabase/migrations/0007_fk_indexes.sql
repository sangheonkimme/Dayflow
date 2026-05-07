-- ============================================================
-- 0007_fk_indexes.sql
-- ============================================================
--
-- Supabase advisor `unindexed_foreign_keys` 처리.
-- FK 컬럼 단일 lookup이 발생할 때(예: ON DELETE 캐스케이드 검증, join filter)
-- 시퀀셜 스캔이 도는 것을 방지한다.
--
-- 기존 복합 인덱스(예: transactions(user_id, category_id))는 첫 번째 키가
-- user_id 라 category_id 단독 lookup에는 쓰이지 않으므로 별도 인덱스가 필요.
-- ============================================================

create index if not exists categories_parent_id_idx
  on public.categories (parent_id);

create index if not exists subscriptions_account_id_idx
  on public.subscriptions (account_id);

create index if not exists subscriptions_category_id_idx
  on public.subscriptions (category_id);

create index if not exists transactions_account_id_idx
  on public.transactions (account_id);

create index if not exists transactions_category_id_idx
  on public.transactions (category_id);
