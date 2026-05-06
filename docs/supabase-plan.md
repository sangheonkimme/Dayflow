# Supabase 작업 플랜 — WorkLife (Dayflow)

> 프론트엔드 시안 작업과 병렬로 진행하는 백엔드(Supabase) 구축 계획입니다.
> 모든 데이터는 사용자별 개인 데이터이므로 RLS(Row Level Security) 기반 멀티 테넌시로 설계합니다.

---

## 1. 목표 및 원칙

- **개인 데이터 보호**: 모든 테이블에 `user_id` 컬럼 + RLS 정책 강제
- **확장성**: 가계부/메모/구독/체크리스트 등 도메인을 독립 스키마로 분리
- **로컬 우선 가능성**: 비로그인 시 localStorage → 로그인 후 Supabase 동기화 가능한 구조
- **타입 안전**: `supabase gen types`로 TS 타입 자동 생성 (JS 프로젝트지만 JSDoc로 활용)

---

## 2. 단계별 로드맵

### Phase 0 — 환경 셋업 (0.5d)

- [ ] Supabase 프로젝트 생성 (region: `ap-northeast-2` Seoul)
- [ ] `@supabase/supabase-js` 설치
- [ ] `.env.local` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] `src/lib/supabase.js` 클라이언트 인스턴스
- [ ] `.gitignore`에 `.env*` 확인

### Phase 1 — 인증 (1d)

- [ ] Email/Password 로그인 활성화
- [ ] (선택) Google OAuth 추가 — 시안에 PC 로그인 화면 있음
- [ ] 비밀번호 재설정 플로우 (`auth-forgot.jsx` 연결)
- [ ] `auth.users` 트리거: 가입 시 `profiles` 자동 생성
- [ ] 세션 관리 훅 `useAuth()` 작성

### Phase 2 — 핵심 도메인 스키마 (2d)

- [ ] `profiles` — 사용자 프로필
- [ ] `sticky_notes` — 스티커 메모 (3개 제한)
- [ ] `notes` — 장문 메모
- [ ] `checklist_items` — 오늘 체크리스트
- [ ] `daily_logs` — 오늘의 한 줄 + 무드
- [ ] `pinned_info` — 자주 쓰는 정보 (WIFI, 계좌 등)
- [ ] 모든 테이블 RLS 활성화 + 정책 작성

### Phase 3 — 가계 / 일정 도메인 (2d)

- [ ] `accounts` — 자산 계정 (현금/카드/통장)
- [ ] `categories` — 수입/지출 카테고리
- [ ] `transactions` — 거래내역
- [ ] `subscriptions` — 정기구독
- [ ] `calendar_events` — 캘린더 이벤트
- [ ] 월별 집계 View 또는 RPC 함수

### Phase 4 — 도구 데이터 (1d)

- [ ] `salary_presets` — 연봉 계산기 저장값
- [ ] `loan_presets` — 대출 계산기 저장값
- [ ] (이미지 도구는 클라이언트 처리 → DB 불필요)

### Phase 5 — 보안 / 운영 (1d)

- [ ] RLS 정책 전수 검수 (anon/authenticated 분리)
- [ ] 민감 정보(`pinned_info`) 컬럼 암호화 검토 — `pgsodium` 또는 클라이언트 암호화
- [ ] Supabase Storage 버킷 (프로필 이미지용) + RLS
- [ ] DB 백업 정책 확인
- [ ] 마이그레이션 파일 `supabase/migrations/` 버전 관리

### Phase 6 — 프론트 통합 (병렬, 시안 완료 후)

- [ ] 각 컴포넌트의 mock 데이터 → Supabase 쿼리 교체
- [ ] 낙관적 업데이트 (optimistic UI)
- [ ] Realtime 구독 (체크리스트, 메모 멀티 디바이스 동기화)

---

## 3. ERD

```
┌─────────────────┐
│  auth.users     │  (Supabase 내장)
│  - id (uuid)    │
│  - email        │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────────────┐
│  profiles               │
│  - id (PK, FK→users.id) │
│  - display_name         │
│  - avatar_url           │
│  - timezone             │
│  - created_at           │
└────────┬────────────────┘
         │ 1:N (모든 도메인 테이블)
         │
         ├──► sticky_notes
         ├──► notes
         ├──► checklist_items
         ├──► daily_logs
         ├──► pinned_info
         ├──► accounts ───► transactions
         ├──► categories ──► transactions
         ├──► subscriptions
         ├──► calendar_events
         ├──► salary_presets
         └──► loan_presets
```

### 도메인 그룹

```
┌────────────── 기록 (Records) ──────────────┐
│  sticky_notes, notes, daily_logs,          │
│  checklist_items, pinned_info              │
└────────────────────────────────────────────┘

┌────────────── 가계 (Finance) ──────────────┐
│  accounts ──┐                              │
│             ├──► transactions              │
│  categories┘                               │
│  subscriptions                             │
└────────────────────────────────────────────┘

┌────────────── 일정 (Schedule) ─────────────┐
│  calendar_events                           │
└────────────────────────────────────────────┘

┌────────────── 도구 (Tools) ────────────────┐
│  salary_presets, loan_presets              │
└────────────────────────────────────────────┘
```

---

## 4. 테이블 정의

### 4.1 profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text default 'Asia/Seoul',
  theme text default 'light' check (theme in ('light', 'dark')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 4.2 sticky_notes (스티커 메모)

```sql
create table sticky_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  color text not null check (color in ('yellow', 'pink', 'blue')),
  title text,
  body text,
  position int not null default 0,  -- 0,1,2 (최대 3개)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on sticky_notes(user_id);
```

### 4.3 notes (장문 메모)

```sql
create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  body text,
  tags text[] default '{}',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on notes(user_id, created_at desc);
```

### 4.4 checklist_items (오늘 체크리스트)

```sql
create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  done boolean default false,
  due_at timestamptz,                -- "오전 10:00" 등
  date date not null default current_date,
  position int default 0,
  created_at timestamptz default now()
);
create index on checklist_items(user_id, date);
```

### 4.5 daily_logs (오늘의 한 줄 + 무드)

```sql
create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  mood text check (mood in ('happy', 'calm', 'sleepy', 'fire', 'tired', 'sad')),
  one_line text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);
```

### 4.6 pinned_info (자주 쓰는 정보)

```sql
create table pinned_info (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,               -- "사무실 WIFI"
  value text not null,               -- "WL_office / coffee2024"
  category text,                     -- 'wifi','account','password','etc'
  is_secret boolean default false,   -- true면 클라이언트 암호화 권장
  position int default 0,
  created_at timestamptz default now()
);
create index on pinned_info(user_id);
```

### 4.7 accounts (자산 계정)

```sql
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                -- "신한 주거래"
  type text check (type in ('cash','bank','card','savings','invest')),
  balance numeric(14,2) default 0,
  currency text default 'KRW',
  archived boolean default false,
  created_at timestamptz default now()
);
```

### 4.8 categories (카테고리)

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense')),
  icon text,
  color text,
  parent_id uuid references categories(id) on delete set null,
  position int default 0
);
```

### 4.9 transactions (거래내역)

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  kind text not null check (kind in ('income','expense','transfer')),
  amount numeric(14,2) not null,
  memo text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz default now()
);
create index on transactions(user_id, occurred_at desc);
create index on transactions(user_id, category_id);
```

### 4.10 subscriptions (정기구독)

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                -- "Netflix"
  amount numeric(14,2) not null,
  cycle text not null check (cycle in ('monthly','yearly','weekly')),
  next_billing_at date not null,
  account_id uuid references accounts(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  active boolean default true,
  created_at timestamptz default now()
);
create index on subscriptions(user_id, next_billing_at);
```

### 4.11 calendar_events (캘린더)

```sql
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean default false,
  color text,
  recurrence_rule text,              -- RFC 5545 RRULE
  created_at timestamptz default now()
);
create index on calendar_events(user_id, starts_at);
```

### 4.12 salary_presets / loan_presets (계산기 저장값)

```sql
create table salary_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  annual_salary numeric(14,2) not null,
  dependents int default 0,
  non_taxable numeric(14,2) default 0,
  result jsonb,                      -- 계산 스냅샷
  created_at timestamptz default now()
);

create table loan_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  principal numeric(14,2) not null,
  rate numeric(6,3) not null,
  months int not null,
  method text check (method in ('equal_payment','equal_principal','bullet')),
  result jsonb,
  created_at timestamptz default now()
);
```

---

## 5. RLS 정책 템플릿

모든 사용자 테이블에 동일한 패턴 적용:

```sql
alter table <table_name> enable row level security;

create policy "select own"
  on <table_name> for select
  using (auth.uid() = user_id);

create policy "insert own"
  on <table_name> for insert
  with check (auth.uid() = user_id);

create policy "update own"
  on <table_name> for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own"
  on <table_name> for delete
  using (auth.uid() = user_id);
```

`profiles`는 `id = auth.uid()` 기준으로 동일 패턴.

---

## 6. 트리거 / 함수

### 6.1 가입 시 profile 자동 생성

```sql
create function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

### 6.2 updated_at 자동 갱신

```sql
create function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- 각 테이블에 트리거 부착
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
-- (sticky_notes, notes, daily_logs 등 동일)
```

### 6.3 스티커 메모 3개 제한 트리거

```sql
create function enforce_sticky_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from sticky_notes where user_id = new.user_id) >= 3 then
    raise exception '스티커 메모는 최대 3개까지 추가할 수 있습니다.';
  end if;
  return new;
end; $$;

create trigger trg_sticky_limit before insert on sticky_notes
  for each row execute function enforce_sticky_limit();
```

---

## 7. 디렉토리 구조 (제안)

```
Dayflow/
├── docs/
│   └── supabase-plan.md              ← 이 문서
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 0001_init_profiles.sql
│   │   ├── 0002_records.sql           (sticky_notes, notes, ...)
│   │   ├── 0003_finance.sql           (accounts, transactions, ...)
│   │   ├── 0004_calendar.sql
│   │   ├── 0005_tools.sql
│   │   └── 0006_rls_policies.sql
│   └── seed.sql
└── src/
    └── lib/
        ├── supabase.js                ← 클라이언트
        └── queries/                   ← 도메인별 쿼리 모듈
            ├── notes.js
            ├── transactions.js
            └── ...
```

---

## 8. 보안 체크리스트

- [ ] 모든 테이블 RLS 활성화 확인 (`select * from pg_tables where schemaname='public' and rowsecurity=false`)
- [ ] anon key는 클라이언트 노출 OK, **service_role key는 절대 클라이언트에 두지 않기**
- [ ] `pinned_info.is_secret = true`인 항목은 클라이언트 측 AES 암호화 권장 (사용자 파생 키)
- [ ] Auth 이메일 템플릿 한국어화
- [ ] Rate limiting (Supabase Pro 이상) — 무료 플랜이면 최소한 클라이언트 디바운싱
- [ ] CORS 설정 — 프로덕션 도메인만 허용

---

## 9. 다음 단계 액션

1. Supabase 프로젝트 생성 후 URL/anon key 공유
2. `supabase/migrations/0001_init.sql`부터 순차 작성 → CLI로 적용
3. 시안 작업과 별개로 먼저 **인증 + profiles**까지 끝내고, 도메인 테이블은 시안 확정되는 순서대로 추가
4. 프론트 통합은 시안 컴포넌트가 안정화된 후 한 번에 mock → Supabase 교체

---

_작성일: 2026-05-06_
