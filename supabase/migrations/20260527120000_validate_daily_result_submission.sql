create or replace function public.app_submit_daily_result(
  p_date_key date,
  p_score integer,
  p_result_pattern text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_pattern text := coalesce(p_result_pattern, '');
  expected_score integer;
  stored_result public.daily_results%rowtype;
begin
  if current_user_id is null then
    return null;
  end if;

  if p_date_key <> ((now() at time zone 'UTC')::date) then
    raise exception 'Dagens resultat kan bara skickas in för dagens spel.';
  end if;

  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Felaktig poäng.';
  end if;

  if normalized_pattern !~ '^[01]{2,100}$' then
    raise exception 'Felaktigt resultat.';
  end if;

  expected_score := greatest(length(replace(normalized_pattern, '0', '')) - 1, 0);
  if p_score <> expected_score then
    raise exception 'Poängen matchar inte resultatet.';
  end if;

  insert into public.daily_results (user_id, date_key, score, result_pattern)
  values (current_user_id, p_date_key, p_score, normalized_pattern)
  on conflict (user_id, date_key) do nothing;

  select * into stored_result
  from public.daily_results
  where user_id = current_user_id
    and date_key = p_date_key;

  return jsonb_build_object(
    'dateKey', stored_result.date_key,
    'score', stored_result.score,
    'resultPattern', stored_result.result_pattern
  );
end;
$$;

revoke execute on function public.app_submit_daily_result(date, integer, text) from public;
grant execute on function public.app_submit_daily_result(date, integer, text) to authenticated;
