-- 0012_webhook_events.sql
-- 결제 webhook 강멱등(dedup) 저장소.
--
-- 배경: 현재 plan 갱신은 latest-wins 라 같은 이벤트가 재전송되면 매번 update 가
--       돌고, out-of-order 재전송 시 이론상 플랜이 플립될 수 있다. 처리 전에
--       이벤트를 "선점(claim)" 해서 중복 전달을 원천 차단한다.
--
-- 선점 방식: insert 를 그대로 시도하고 unique violation(23505)이면 중복으로 판단.
--            select-then-insert 는 동시 전달 시 레이스가 나므로 쓰지 않는다.
--
-- PK 는 (provider, event_id) 복합키. 결제사마다 id 체계가 달라 event_id 단독
-- 전역 유니크를 가정하면 서로 다른 결제사 이벤트가 충돌할 수 있다.
--
-- 접근 주체는 service-role webhook 라우트뿐이다. RLS 를 켜되 정책은 만들지
-- 않는다(= 일반 유저 전면 차단, service-role 만 우회).

create table if not exists public.webhook_events (
  provider    text        not null,
  event_id    text        not null,
  event_type  text,
  received_at timestamptz not null default now(),
  constraint webhook_events_pkey primary key (provider, event_id),
  constraint webhook_events_provider_check
    check (provider in ('lemonsqueezy', 'toss'))
);

alter table public.webhook_events enable row level security;

-- 보존 정리(오래된 행 삭제) 배치용. 미사용 인덱스가 아니라 아래 주석의
-- 정리 쿼리가 실제로 쓴다.
create index if not exists webhook_events_received_at_idx
  on public.webhook_events (received_at);

comment on table public.webhook_events is
  '결제 webhook 멱등 키 저장소. 처리 전 insert 로 선점하고, unique violation 이면 중복 전달로 보고 스킵한다.';
comment on column public.webhook_events.provider is
  '결제사. lemonsqueezy | toss.';
comment on column public.webhook_events.event_id is
  '결제사가 준 이벤트 id. 없으면 라우트가 raw body 의 sha256 을 sha256:<hex> 형태로 채운다.';
comment on column public.webhook_events.event_type is
  '이벤트명(진단용). 멱등 판정에는 쓰지 않는다.';
comment on column public.webhook_events.received_at is
  '선점 시각. 보존 정리 기준.';

-- 보존 정책: 결제사 재전송 윈도우(길어야 수일)를 크게 넘기면 의미가 없다.
-- 운영에서 주기 실행할 정리 쿼리(예: 90일):
--   delete from public.webhook_events where received_at < now() - interval '90 days';
