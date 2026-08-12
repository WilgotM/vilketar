create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique check (char_length(endpoint) between 1 and 2048),
  p256dh text not null check (char_length(p256dh) between 1 and 256),
  auth text not null check (char_length(auth) between 1 and 256),
  user_agent text check (user_agent is null or char_length(user_agent) <= 512),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_success_at timestamptz
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id, updated_at desc);

alter table public.push_subscriptions enable row level security;

create table if not exists public.league_push_notifications (
  id uuid primary key default gen_random_uuid(),
  daily_result_id uuid not null references public.daily_results(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  actor_display_name text not null check (char_length(actor_display_name) between 1 and 40),
  date_key date not null,
  score integer not null check (score >= 0 and score <= 100),
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_error text,
  unique (daily_result_id, recipient_user_id)
);

create index if not exists league_push_notifications_pending_idx
  on public.league_push_notifications (sent_at, claimed_at, created_at);

alter table public.league_push_notifications enable row level security;

create or replace function public.app_save_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_endpoint text := left(trim(coalesce(p_endpoint, '')), 2048);
  normalized_p256dh text := left(trim(coalesce(p_p256dh, '')), 256);
  normalized_auth text := left(trim(coalesce(p_auth, '')), 256);
  normalized_user_agent text := nullif(left(trim(coalesce(p_user_agent, '')), 512), '');
begin
  if current_user_id is null then
    raise exception 'Du behöver vara inloggad för att aktivera notiser.';
  end if;

  if normalized_endpoint = '' or normalized_p256dh = '' or normalized_auth = '' then
    raise exception 'Push-prenumerationen saknar information.';
  end if;

  insert into public.push_subscriptions (
    user_id,
    endpoint,
    p256dh,
    auth,
    user_agent
  )
  values (
    current_user_id,
    normalized_endpoint,
    normalized_p256dh,
    normalized_auth,
    normalized_user_agent
  )
  on conflict (endpoint) do update
    set user_id = excluded.user_id,
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent,
        updated_at = now(),
        last_success_at = null;
end;
$$;

create or replace function public.app_remove_push_subscription(p_endpoint text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.push_subscriptions
  where user_id = auth.uid()
    and endpoint = left(trim(coalesce(p_endpoint, '')), 2048);
end;
$$;

create or replace function public.app_enqueue_league_push_notifications()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.league_push_notifications (
    daily_result_id,
    recipient_user_id,
    actor_user_id,
    actor_display_name,
    date_key,
    score
  )
  select distinct
    new.id,
    recipient_member.user_id,
    new.user_id,
    coalesce(actor_profile.display_name, actor_member.display_name, 'En spelare'),
    new.date_key,
    new.score
  from public.league_members actor_member
  join public.league_members recipient_member
    on recipient_member.league_id = actor_member.league_id
   and recipient_member.user_id <> new.user_id
  left join public.profiles actor_profile
    on actor_profile.id = new.user_id
  where actor_member.user_id = new.user_id
  on conflict (daily_result_id, recipient_user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists daily_result_league_push_notification_trigger
  on public.daily_results;

create trigger daily_result_league_push_notification_trigger
after insert on public.daily_results
for each row
execute function public.app_enqueue_league_push_notifications();

revoke execute on function public.app_save_push_subscription(text, text, text, text) from public;
revoke execute on function public.app_remove_push_subscription(text) from public;

grant execute on function public.app_save_push_subscription(text, text, text, text) to authenticated;
grant execute on function public.app_remove_push_subscription(text) to authenticated;
