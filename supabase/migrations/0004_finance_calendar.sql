-- ============================================================
-- 0004_finance_calendar.sql — accounts, categories, transactions, subscriptions, calendar_events
-- + handle_new_user 확장 (기본 카테고리 21개 시드)
-- ============================================================

-- accounts
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text check (type in ('cash','bank','card','savings','invest')),
  balance numeric(14,2) not null default 0,
  currency text not null default 'KRW',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index accounts_user_id_idx on public.accounts(user_id);
alter table public.accounts enable row level security;
create policy "select own" on public.accounts for select using (auth.uid() = user_id);
create policy "insert own" on public.accounts for insert with check (auth.uid() = user_id);
create policy "update own" on public.accounts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.accounts for delete using (auth.uid() = user_id);

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense', 'subscription')),
  icon text,
  color text,
  parent_id uuid references public.categories(id) on delete set null,
  position int not null default 0,
  unique (user_id, kind, name)
);
create index categories_user_kind_idx on public.categories(user_id, kind);
alter table public.categories enable row level security;
create policy "select own" on public.categories for select using (auth.uid() = user_id);
create policy "insert own" on public.categories for insert with check (auth.uid() = user_id);
create policy "update own" on public.categories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.categories for delete using (auth.uid() = user_id);

-- transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  kind text not null check (kind in ('income','expense','transfer')),
  amount numeric(14,2) not null,
  memo text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index transactions_user_occurred_idx on public.transactions(user_id, occurred_at desc);
create index transactions_user_category_idx on public.transactions(user_id, category_id);
alter table public.transactions enable row level security;
create policy "select own" on public.transactions for select using (auth.uid() = user_id);
create policy "insert own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "update own" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.transactions for delete using (auth.uid() = user_id);

-- subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(14,2) not null,
  cycle text not null check (cycle in ('monthly','yearly','weekly')),
  next_billing_at date not null,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index subscriptions_user_billing_idx on public.subscriptions(user_id, next_billing_at);
alter table public.subscriptions enable row level security;
create policy "select own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "insert own" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "update own" on public.subscriptions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.subscriptions for delete using (auth.uid() = user_id);

-- calendar_events
create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  color text,
  recurrence_rule text,
  created_at timestamptz not null default now()
);
create index calendar_events_user_starts_idx on public.calendar_events(user_id, starts_at);
alter table public.calendar_events enable row level security;
create policy "select own" on public.calendar_events for select using (auth.uid() = user_id);
create policy "insert own" on public.calendar_events for insert with check (auth.uid() = user_id);
create policy "update own" on public.calendar_events for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.calendar_events for delete using (auth.uid() = user_id);

-- handle_new_user 확장: profiles + 기본 카테고리 21개 시드
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.categories (user_id, name, kind, color, position) values
    (new.id, '급여',   'income',  '#4a8d5a', 0),
    (new.id, '부수입', 'income',  '#4a8d5a', 1),
    (new.id, '환불',   'income',  '#4a8d5a', 2);

  insert into public.categories (user_id, name, kind, color, position) values
    (new.id, '식비', 'expense', '#e89aac', 0),
    (new.id, '외식', 'expense', '#e25c4d', 1),
    (new.id, '주거', 'expense', '#1f1d18', 2),
    (new.id, '교통', 'expense', '#8ec0d6', 3),
    (new.id, '쇼핑', 'expense', '#e8c84a', 4),
    (new.id, '여가', 'expense', '#a8d09b', 5),
    (new.id, '구독', 'expense', '#a259ff', 6),
    (new.id, '건강', 'expense', '#4a8d5a', 7),
    (new.id, '도서', 'expense', '#2c5e8b', 8),
    (new.id, '기타', 'expense', '#c9bd9f', 9);

  insert into public.categories (user_id, name, kind, color, position) values
    (new.id, '업무 도구',     'subscription', '#a259ff', 0),
    (new.id, '엔터테인먼트',  'subscription', '#e25c4d', 1),
    (new.id, '음악',          'subscription', '#4a8d5a', 2),
    (new.id, '클라우드',      'subscription', '#3a8dde', 3),
    (new.id, '쇼핑',          'subscription', '#e8c84a', 4),
    (new.id, '독서',          'subscription', '#2c5e8b', 5),
    (new.id, '건강',          'subscription', '#a8d09b', 6),
    (new.id, '기타',          'subscription', '#c9bd9f', 7);

  return new;
end; $$;
