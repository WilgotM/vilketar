create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 48),
  join_code text not null unique check (join_code ~ '^[A-Z2-9]{6}$'),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  joined_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table if not exists public.daily_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date_key date not null,
  score integer not null check (score >= 0 and score <= 100),
  result_pattern text not null check (result_pattern ~ '^[01]{0,100}$'),
  completed_at timestamptz not null default now(),
  unique (user_id, date_key)
);

create index if not exists leagues_join_code_idx
  on public.leagues (join_code);

create index if not exists league_members_user_id_idx
  on public.league_members (user_id, joined_at desc);

create index if not exists league_members_league_id_idx
  on public.league_members (league_id, joined_at asc);

create index if not exists daily_results_user_date_idx
  on public.daily_results (user_id, date_key desc);

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.daily_results enable row level security;

create policy "Profiles can read own row"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Profiles can upsert own row"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "Profiles can update own row"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can read own daily results"
  on public.daily_results
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can write own daily results"
  on public.daily_results
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own daily results"
  on public.daily_results
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.app_normalize_display_name(p_display_name text)
returns text
language sql
immutable
as $$
  select nullif(left(trim(regexp_replace(coalesce(p_display_name, ''), '\s+', ' ', 'g')), 40), '')
$$;

create or replace function public.app_generate_join_code()
returns text
language plpgsql
volatile
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  index int;
begin
  for index in 1..6 loop
    code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;

  return code;
end;
$$;

create or replace function public.app_set_profile(p_display_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_name text := public.app_normalize_display_name(p_display_name);
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  if normalized_name is null then
    raise exception 'Skriv ett namn först.';
  end if;

  insert into public.profiles (id, display_name)
  values (current_user_id, normalized_name)
  on conflict (id) do update
    set display_name = excluded.display_name,
        updated_at = now();

  update public.league_members
    set display_name = normalized_name
    where user_id = current_user_id;

  return jsonb_build_object('id', current_user_id, 'displayName', normalized_name);
end;
$$;

create or replace function public.app_league_payload(p_league_id uuid, p_today date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  league_row public.leagues%rowtype;
  week_start date := p_today - (extract(isodow from p_today)::int - 1);
  week_end date := week_start + 6;
  previous_week_start date := week_start - 7;
  previous_week_end date := week_start - 1;
  previous_winner jsonb := null;
begin
  select * into league_row
  from public.leagues
  where id = p_league_id;

  if league_row.id is null then
    raise exception 'Ligan finns inte.';
  end if;

  if not exists (
    select 1
    from public.league_members
    where league_id = p_league_id
      and user_id = current_user_id
  ) then
    raise exception 'Du är inte med i den ligan.';
  end if;

  if extract(isodow from p_today)::int = 1 then
    select jsonb_build_object(
      'displayName', previous_scores.display_name,
      'totalScore', previous_scores.total_score
    )
    into previous_winner
    from (
      select
        member.display_name,
        coalesce(sum(result.score), 0)::int as total_score,
        max(result.completed_at) as last_completed_at
      from public.league_members member
      left join public.daily_results result
        on result.user_id = member.user_id
       and result.date_key between previous_week_start and previous_week_end
      where member.league_id = p_league_id
      group by member.id, member.display_name
      having coalesce(sum(result.score), 0) > 0
      order by total_score desc, last_completed_at asc nulls last, member.display_name asc
      limit 1
    ) previous_scores;
  end if;

  return jsonb_build_object(
    'id', league_row.id,
    'name', league_row.name,
    'joinCode', league_row.join_code,
    'createdAt', league_row.created_at,
    'currentWeekStartsAt', week_start,
    'currentWeekEndsAt', week_end,
    'firstWeekIsShort', league_row.created_at::date > week_start,
    'previousWeekWinner', previous_winner,
    'members', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'memberId', member_scores.member_id,
          'displayName', member_scores.display_name,
          'isCurrentUser', member_scores.user_id = current_user_id,
          'todayScore', member_scores.today_score,
          'todayResultPattern', member_scores.today_result_pattern,
          'weekScore', member_scores.week_score,
          'daysPlayed', member_scores.days_played
        )
        order by member_scores.week_score desc,
          member_scores.today_score desc nulls last,
          member_scores.display_name asc
      )
      from (
        select
          member.id as member_id,
          member.user_id,
          member.display_name,
          today.score as today_score,
          today.result_pattern as today_result_pattern,
          coalesce(sum(week_result.score), 0)::int as week_score,
          count(week_result.id)::int as days_played
        from public.league_members member
        left join public.daily_results today
          on today.user_id = member.user_id
         and today.date_key = p_today
        left join public.daily_results week_result
          on week_result.user_id = member.user_id
         and week_result.date_key between week_start and week_end
        where member.league_id = p_league_id
        group by member.id, member.user_id, member.display_name, today.score, today.result_pattern
      ) member_scores
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.app_get_leagues(p_today date default ((now() at time zone 'UTC')::date))
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  return coalesce((
    select jsonb_agg(public.app_league_payload(member.league_id, p_today) order by league.created_at desc)
    from public.league_members member
    join public.leagues league on league.id = member.league_id
    where member.user_id = current_user_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.app_create_league(p_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  profile_name text;
  normalized_name text := nullif(left(trim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g')), 48), '');
  new_league_id uuid;
  new_code text;
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  if normalized_name is null then
    raise exception 'Skriv ett namn på ligan.';
  end if;

  select display_name into profile_name
  from public.profiles
  where id = current_user_id;

  if profile_name is null then
    raise exception 'Skriv ditt namn först.';
  end if;

  loop
    new_code := public.app_generate_join_code();
    begin
      insert into public.leagues (name, join_code, created_by)
      values (normalized_name, new_code, current_user_id)
      returning id into new_league_id;
      exit;
    exception when unique_violation then
      new_code := null;
    end;
  end loop;

  insert into public.league_members (league_id, user_id, display_name)
  values (new_league_id, current_user_id, profile_name);

  return public.app_league_payload(new_league_id, (now() at time zone 'UTC')::date);
end;
$$;

create or replace function public.app_join_league(p_join_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  profile_name text;
  target_league_id uuid;
  normalized_code text := upper(trim(coalesce(p_join_code, '')));
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  select display_name into profile_name
  from public.profiles
  where id = current_user_id;

  if profile_name is null then
    raise exception 'Skriv ditt namn först.';
  end if;

  select id into target_league_id
  from public.leagues
  where join_code = normalized_code;

  if target_league_id is null then
    raise exception 'Hittar ingen liga med den koden.';
  end if;

  insert into public.league_members (league_id, user_id, display_name)
  values (target_league_id, current_user_id, profile_name)
  on conflict (league_id, user_id) do update
    set display_name = excluded.display_name;

  return public.app_league_payload(target_league_id, (now() at time zone 'UTC')::date);
end;
$$;

create or replace function public.app_submit_daily_result(
  p_date_key date,
  p_score integer,
  p_result_pattern text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return;
  end if;

  if p_score < 0 or p_score > 100 then
    raise exception 'Felaktig poäng.';
  end if;

  insert into public.daily_results (user_id, date_key, score, result_pattern)
  values (current_user_id, p_date_key, p_score, coalesce(p_result_pattern, ''))
  on conflict (user_id, date_key) do update
    set score = excluded.score,
        result_pattern = excluded.result_pattern,
        completed_at = now();
end;
$$;

revoke execute on function public.app_set_profile(text) from public;
revoke execute on function public.app_normalize_display_name(text) from public;
revoke execute on function public.app_generate_join_code() from public;
revoke execute on function public.app_league_payload(uuid, date) from public;
revoke execute on function public.app_get_leagues(date) from public;
revoke execute on function public.app_create_league(text) from public;
revoke execute on function public.app_join_league(text) from public;
revoke execute on function public.app_submit_daily_result(date, integer, text) from public;

grant execute on function public.app_set_profile(text) to authenticated;
grant execute on function public.app_get_leagues(date) to authenticated;
grant execute on function public.app_create_league(text) to authenticated;
grant execute on function public.app_join_league(text) to authenticated;
grant execute on function public.app_submit_daily_result(date, integer, text) to authenticated;
