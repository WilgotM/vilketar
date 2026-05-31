comment on table public.daily_games is
  'Locked daily card queues. The app reads card_qids from here so same-date deck deploys do not change already locked daily games.';

comment on column public.daily_games.card_qids is
  'Ordered card QIDs for a daily game. Card content still comes from deployed public/decks JSON files.';
