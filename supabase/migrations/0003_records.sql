-- ============================================================
-- 0003_records.sql — sticky_notes, notes, checklist_items, daily_logs, pinned_info
-- ============================================================

-- sticky_notes
create table public.sticky_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  color text not null check (color in ('yellow', 'pink', 'blue')),
  title text,
  body text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sticky_notes_user_id_idx on public.sticky_notes(user_id);
alter table public.sticky_notes enable row level security;
create policy "select own" on public.sticky_notes for select using (auth.uid() = user_id);
create policy "insert own" on public.sticky_notes for insert with check (auth.uid() = user_id);
create policy "update own" on public.sticky_notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.sticky_notes for delete using (auth.uid() = user_id);
create trigger trg_sticky_notes_updated before update on public.sticky_notes
  for each row execute function public.set_updated_at();

-- notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  body text,
  tags text[] not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notes_user_created_idx on public.notes(user_id, created_at desc);
alter table public.notes enable row level security;
create policy "select own" on public.notes for select using (auth.uid() = user_id);
create policy "insert own" on public.notes for insert with check (auth.uid() = user_id);
create policy "update own" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.notes for delete using (auth.uid() = user_id);
create trigger trg_notes_updated before update on public.notes
  for each row execute function public.set_updated_at();

-- checklist_items
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  done boolean not null default false,
  due_at timestamptz,
  date date not null default current_date,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index checklist_items_user_date_idx on public.checklist_items(user_id, date);
alter table public.checklist_items enable row level security;
create policy "select own" on public.checklist_items for select using (auth.uid() = user_id);
create policy "insert own" on public.checklist_items for insert with check (auth.uid() = user_id);
create policy "update own" on public.checklist_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.checklist_items for delete using (auth.uid() = user_id);

-- daily_logs
create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  mood text check (mood in ('happy','calm','sleepy','fire','tired','sad')),
  one_line text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);
alter table public.daily_logs enable row level security;
create policy "select own" on public.daily_logs for select using (auth.uid() = user_id);
create policy "insert own" on public.daily_logs for insert with check (auth.uid() = user_id);
create policy "update own" on public.daily_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.daily_logs for delete using (auth.uid() = user_id);
create trigger trg_daily_logs_updated before update on public.daily_logs
  for each row execute function public.set_updated_at();

-- pinned_info
create table public.pinned_info (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  value text not null,
  category text,
  is_secret boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index pinned_info_user_id_idx on public.pinned_info(user_id);
alter table public.pinned_info enable row level security;
create policy "select own" on public.pinned_info for select using (auth.uid() = user_id);
create policy "insert own" on public.pinned_info for insert with check (auth.uid() = user_id);
create policy "update own" on public.pinned_info for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.pinned_info for delete using (auth.uid() = user_id);
