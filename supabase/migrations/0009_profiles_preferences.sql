-- 0009_profiles_preferences.sql
-- profiles 에 preferences(jsonb) 컬럼 추가.
-- 사용자 환경설정(usePreferences/Tweaks)을 기기 간 동기화하기 위한 저장소.
-- 기기 종속/개발용 키(authed/forceMobile/authPreview)는 클라가 push 전에 제외.
-- RLS 는 기존 profiles_*_own 정책(0006)이 행 단위로 이미 보호하므로 별도 정책 불필요.

alter table public.profiles
  add column if not exists preferences jsonb not null default '{}'::jsonb;

comment on column public.profiles.preferences is
  '사용자 UI 환경설정(Tweaks) 동기화 blob. ephemeral 키 제외. 충돌은 최신 업데이트 우선.';
