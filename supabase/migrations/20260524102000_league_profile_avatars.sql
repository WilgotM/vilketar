alter table public.profiles
  add column if not exists avatar_data_url text
  check (
    avatar_data_url is null
    or (
      char_length(avatar_data_url) <= 65536
      and avatar_data_url ~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$'
    )
  );

create or replace function public.app_get_profile()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  profile_row public.profiles%rowtype;
begin
  if current_user_id is null then
    return null;
  end if;

  select * into profile_row
  from public.profiles
  where id = current_user_id;

  if profile_row.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', profile_row.id,
    'displayName', profile_row.display_name,
    'avatarDataUrl', profile_row.avatar_data_url
  );
end;
$$;

create or replace function public.app_set_profile(
  p_display_name text,
  p_avatar_data_url text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_name text := public.app_normalize_display_name(p_display_name);
  normalized_avatar text := nullif(trim(coalesce(p_avatar_data_url, '')), '');
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  if normalized_name is null then
    raise exception 'Skriv ett namn först.';
  end if;

  if normalized_avatar is not null and (
    char_length(normalized_avatar) > 65536
    or normalized_avatar !~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$'
  ) then
    raise exception 'Profilbilden är för stor.';
  end if;

  insert into public.profiles (id, display_name, avatar_data_url)
  values (current_user_id, normalized_name, normalized_avatar)
  on conflict (id) do update
    set display_name = excluded.display_name,
        avatar_data_url = excluded.avatar_data_url,
        updated_at = now();

  update public.league_members
    set display_name = normalized_name
    where user_id = current_user_id;

  return public.app_get_profile();
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
    'canManage', league_row.created_by = current_user_id,
    'currentWeekStartsAt', week_start,
    'currentWeekEndsAt', week_end,
    'firstWeekIsShort', league_row.created_at::date > week_start,
    'previousWeekWinner', previous_winner,
    'members', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'memberId', member_scores.member_id,
          'displayName', member_scores.display_name,
          'avatarDataUrl', member_scores.avatar_data_url,
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
          profile.avatar_data_url,
          today.score as today_score,
          today.result_pattern as today_result_pattern,
          coalesce(sum(week_result.score), 0)::int as week_score,
          count(week_result.id)::int as days_played
        from public.league_members member
        left join public.profiles profile
          on profile.id = member.user_id
        left join public.daily_results today
          on today.user_id = member.user_id
         and today.date_key = p_today
        left join public.daily_results week_result
          on week_result.user_id = member.user_id
         and week_result.date_key between week_start and week_end
        where member.league_id = p_league_id
        group by member.id, member.user_id, member.display_name, profile.avatar_data_url, today.score, today.result_pattern
      ) member_scores
    ), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.app_get_profile() from public;
grant execute on function public.app_get_profile() to authenticated;

revoke execute on function public.app_set_profile(text, text) from public;
grant execute on function public.app_set_profile(text, text) to authenticated;
