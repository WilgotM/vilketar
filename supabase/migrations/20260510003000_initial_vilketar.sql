create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('daily', 'free-play')),
  deck_id text,
  deck_title text,
  difficulty text not null check (difficulty in ('easy', 'normal', 'hard')),
  score integer not null check (score >= 0 and score <= 100),
  result_pattern text check (result_pattern is null or result_pattern ~ '^[01]{0,100}$'),
  player_name text check (player_name is null or char_length(player_name) <= 40),
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_created_at_idx
  on public.leaderboard_scores (created_at desc);

create index if not exists leaderboard_scores_mode_deck_score_idx
  on public.leaderboard_scores (mode, deck_id, difficulty, score desc, created_at desc);

create table if not exists public.card_reports (
  id uuid primary key default gen_random_uuid(),
  qid text not null,
  card_title text not null check (char_length(card_title) <= 120),
  reason text not null check (reason in ('wrong-year', 'bad-text', 'bad-image', 'duplicate', 'other')),
  details text check (details is null or char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists card_reports_status_created_at_idx
  on public.card_reports (status, created_at desc);

create table if not exists public.content_builds (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'wikimedia',
  card_count integer not null check (card_count >= 0),
  deck_count integer not null check (deck_count >= 0),
  manifest jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists content_builds_created_at_idx
  on public.content_builds (created_at desc);

alter table public.leaderboard_scores enable row level security;
alter table public.card_reports enable row level security;
alter table public.content_builds enable row level security;

create policy "Public leaderboard read"
  on public.leaderboard_scores
  for select
  to anon, authenticated
  using (true);

create policy "Public leaderboard insert"
  on public.leaderboard_scores
  for insert
  to anon, authenticated
  with check (
    score >= 0
    and score <= 100
    and (player_name is null or char_length(player_name) <= 40)
  );

create policy "Public card report insert"
  on public.card_reports
  for insert
  to anon, authenticated
  with check (
    char_length(card_title) <= 120
    and (details is null or char_length(details) <= 1000)
  );

create policy "Public content build read"
  on public.content_builds
  for select
  to anon, authenticated
  using (true);
