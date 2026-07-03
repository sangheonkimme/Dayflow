-- 0010: calendar_events 상세 필드 보강
-- 일정 모달이 입력받는 카테고리/장소/알림이 스키마에 없어 저장 시 유실되던 문제.
-- repeat 는 기존 recurrence_rule 컬럼을 사용 (mapper 에서 매핑).

alter table public.calendar_events
  add column if not exists cat text,
  add column if not exists place text,
  add column if not exists alarm integer;

comment on column public.calendar_events.cat is '일정 카테고리 (업무/개인/운동/금융/기타)';
comment on column public.calendar_events.place is '장소';
comment on column public.calendar_events.alarm is '알림 (분 단위, null = 알림 없음)';
