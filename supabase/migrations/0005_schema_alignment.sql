-- ============================================================
-- 0005_schema_alignment.sql — schema-alignment.md A 분류 컬럼 추가
-- ============================================================

alter table public.notes        add column folder text;
alter table public.notes        add column starred boolean not null default false;
alter table public.sticky_notes add column emoji text;
alter table public.transactions add column description text;
