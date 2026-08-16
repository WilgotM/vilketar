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
    with previous_scores as (
      select
        member.id as member_id,
        member.display_name,
        coalesce(sum(result.score), 0)::int as total_score,
        coalesce(max(result.score), 0)::int as best_day_score,
        coalesce(
          array_agg(result.score order by result.score desc)
            filter (where result.id is not null),
          '{}'::int[]
        ) as score_card,
        max(result.completed_at) as last_completed_at
      from public.league_members member
      left join public.daily_results result
        on result.user_id = member.user_id
       and result.date_key between greatest(
         previous_week_start,
         league_row.created_at::date,
         member.joined_at::date
       ) and previous_week_end
      where member.league_id = p_league_id
      group by member.id, member.display_name
      having coalesce(sum(result.score), 0) > 0
    ), ranked_previous_scores as (
      select
        previous_scores.*,
        row_number() over (
          order by total_score desc,
            score_card desc,
            last_completed_at asc nulls last,
            display_name asc,
            member_id asc
        ) as position
      from previous_scores
    )
    select jsonb_build_object(
      'displayName', winner.display_name,
      'totalScore', winner.total_score,
      'bestDayScore', winner.best_day_score,
      'scoreCard', to_jsonb(winner.score_card),
      'lastCompletedAt', winner.last_completed_at,
      'runnerUp', case
        when runner_up.member_id is null then null
        else jsonb_build_object(
          'displayName', runner_up.display_name,
          'totalScore', runner_up.total_score,
          'bestDayScore', runner_up.best_day_score,
          'scoreCard', to_jsonb(runner_up.score_card),
          'lastCompletedAt', runner_up.last_completed_at
        )
      end
    )
    into previous_winner
    from ranked_previous_scores winner
    left join ranked_previous_scores runner_up
      on runner_up.position = 2
    where winner.position = 1;
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
          'bestDayScore', member_scores.best_day_score,
          'scoreCard', to_jsonb(member_scores.score_card),
          'lastCompletedAt', member_scores.last_completed_at,
          'daysPlayed', member_scores.days_played
        )
        order by member_scores.week_score desc,
          member_scores.score_card desc,
          member_scores.last_completed_at asc nulls last,
          member_scores.display_name asc,
          member_scores.member_id asc
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
          coalesce(max(week_result.score), 0)::int as best_day_score,
          coalesce(
            array_agg(week_result.score order by week_result.score desc)
              filter (where week_result.id is not null),
            '{}'::int[]
          ) as score_card,
          max(week_result.completed_at) as last_completed_at,
          count(week_result.id)::int as days_played
        from public.league_members member
        left join public.profiles profile
          on profile.id = member.user_id
        left join public.daily_results today
          on today.user_id = member.user_id
         and today.date_key = p_today
         and today.date_key >= greatest(
           league_row.created_at::date,
           member.joined_at::date
         )
        left join public.daily_results week_result
          on week_result.user_id = member.user_id
         and week_result.date_key between greatest(
           week_start,
           league_row.created_at::date,
           member.joined_at::date
         ) and week_end
        where member.league_id = p_league_id
        group by member.id, member.user_id, member.display_name, profile.avatar_data_url, today.score, today.result_pattern
      ) member_scores
    ), '[]'::jsonb)
  );
end;
$$;
