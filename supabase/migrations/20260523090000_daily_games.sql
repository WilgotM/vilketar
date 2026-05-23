create table if not exists public.daily_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_games (
  date_key date primary key,
  card_qids text[] not null check (array_length(card_qids, 1) between 2 and 100),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists daily_games_updated_at_idx
  on public.daily_games (updated_at desc);

alter table public.daily_admins enable row level security;
alter table public.daily_games enable row level security;

create policy "Admins can read own admin row"
  on public.daily_admins
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Public can read daily games"
  on public.daily_games
  for select
  to anon, authenticated
  using (true);

create policy "Admins can insert future daily games"
  on public.daily_games
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.daily_admins admin
      where admin.user_id = auth.uid()
    )
    and date_key > ((now() at time zone 'UTC')::date)
    and updated_by = auth.uid()
  );

create policy "Admins can update future daily games"
  on public.daily_games
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.daily_admins admin
      where admin.user_id = auth.uid()
    )
    and date_key > ((now() at time zone 'UTC')::date)
  )
  with check (
    exists (
      select 1
      from public.daily_admins admin
      where admin.user_id = auth.uid()
    )
    and date_key > ((now() at time zone 'UTC')::date)
    and updated_by = auth.uid()
  );

create policy "Admins can delete future daily games"
  on public.daily_games
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.daily_admins admin
      where admin.user_id = auth.uid()
    )
    and date_key > ((now() at time zone 'UTC')::date)
  );
