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

create or replace function public.app_update_league_name(p_league_id uuid, p_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_name text := nullif(left(trim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g')), 48), '');
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  if normalized_name is null then
    raise exception 'Skriv ett namn på ligan.';
  end if;

  update public.leagues
    set name = normalized_name
    where id = p_league_id
      and created_by = current_user_id;

  if not found then
    raise exception 'Bara den som skapade ligan kan byta namn.';
  end if;

  return public.app_league_payload(p_league_id, (now() at time zone 'UTC')::date);
end;
$$;

create or replace function public.app_remove_league_member(p_league_id uuid, p_member_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_user_id uuid;
  league_owner_id uuid;
begin
  if current_user_id is null then
    raise exception 'Du behöver en anonym session för ligor.';
  end if;

  select created_by into league_owner_id
  from public.leagues
  where id = p_league_id;

  if league_owner_id is null then
    raise exception 'Ligan finns inte.';
  end if;

  select user_id into target_user_id
  from public.league_members
  where id = p_member_id
    and league_id = p_league_id;

  if target_user_id is null then
    raise exception 'Medlemmen finns inte i ligan.';
  end if;

  if target_user_id = league_owner_id then
    raise exception 'Den som skapade ligan kan inte kickas. Ta bort ligan i stället.';
  end if;

  if current_user_id <> league_owner_id and current_user_id <> target_user_id then
    raise exception 'Du kan bara lämna själv eller kicka från din egen liga.';
  end if;

  delete from public.league_members
  where id = p_member_id
    and league_id = p_league_id;

  if current_user_id = target_user_id then
    return null;
  end if;

  return public.app_league_payload(p_league_id, (now() at time zone 'UTC')::date);
end;
$$;

create or replace function public.app_delete_league(p_league_id uuid)
returns void
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

  delete from public.leagues
  where id = p_league_id
    and created_by = current_user_id;

  if not found then
    raise exception 'Bara den som skapade ligan kan ta bort den.';
  end if;
end;
$$;

revoke execute on function public.app_update_league_name(uuid, text) from public;
revoke execute on function public.app_remove_league_member(uuid, uuid) from public;
revoke execute on function public.app_delete_league(uuid) from public;

grant execute on function public.app_update_league_name(uuid, text) to authenticated;
grant execute on function public.app_remove_league_member(uuid, uuid) to authenticated;
grant execute on function public.app_delete_league(uuid) to authenticated;
