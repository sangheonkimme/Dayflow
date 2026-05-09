-- 0008_checklist_completed_at.sql
-- checklist_items 에 completed_at(timestamptz) 컬럼 추가.
-- 완료 처리 시점 기록 → 클라이언트에서 완료 항목을 정렬할 때 사용.
-- 기존 완료 항목(done=true) 은 created_at 으로 backfill 하여 최소한 정렬 키 보장.

alter table public.checklist_items
  add column if not exists completed_at timestamptz;

update public.checklist_items
  set completed_at = created_at
  where done = true
    and completed_at is null;
