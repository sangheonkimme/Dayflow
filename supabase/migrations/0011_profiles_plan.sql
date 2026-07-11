-- 0011_profiles_plan.sql
-- profiles 에 결제 플랜 상태 컬럼 추가.
-- 실제 결제 연동(webhook → plan 갱신)은 다음 스프린트. 여기선 컬럼·제약만 준비.
-- SKU 는 docs/monetization-plan.md 기준 free / pro 2-tier.
--   → 향후 티어 추가(pro_plus 등)는 check 제약을 갱신하는 1줄 마이그레이션으로 처리:
--     alter table public.profiles drop constraint profiles_plan_check,
--       add constraint profiles_plan_check check (plan in ('free','pro','pro_plus'));
-- RLS 는 기존 profiles_*_own 정책(0006)이 행 단위로 이미 보호하므로 별도 정책 불필요.

alter table public.profiles
  add column if not exists plan text not null default 'free';

-- 제약은 별도로(if not exists 미지원 → 존재 여부 가드).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_plan_check'
  ) then
    alter table public.profiles
      add constraint profiles_plan_check check (plan in ('free', 'pro'));
  end if;
end $$;

alter table public.profiles
  add column if not exists plan_updated_at timestamptz;

comment on column public.profiles.plan is
  '결제 플랜 상태. free|pro. 결제 webhook 이 갱신. 기본 free.';
comment on column public.profiles.plan_updated_at is
  '마지막 plan 변경 시각. webhook 처리 시 now() 로 설정. 미변경이면 null.';
