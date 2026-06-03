alter table public.daily_games
  add column if not exists card_snapshots jsonb;

comment on column public.daily_games.card_snapshots is
  'Ordered card snapshots for a locked daily game. Used so same-date deploys cannot change today''s card content even if public deck JSON changes.';
