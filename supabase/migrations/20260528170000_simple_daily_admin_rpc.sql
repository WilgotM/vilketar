create or replace function public.app_admin_upsert_daily_game(
  p_admin_key text,
  p_date_key date,
  p_card_qids text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_admin_key <> 'Wilgot10:Elfsborg10' then
    raise exception 'Fel adminnyckel.';
  end if;

  if p_date_key <= ((now() at time zone 'UTC')::date) then
    raise exception 'Dagens spel är låst.';
  end if;

  if array_length(p_card_qids, 1) is null
    or array_length(p_card_qids, 1) < 2
    or array_length(p_card_qids, 1) > 100 then
    raise exception 'Fel antal kort.';
  end if;

  insert into public.daily_games (date_key, card_qids, updated_by, updated_at)
  values (p_date_key, p_card_qids, null, now())
  on conflict (date_key) do update
    set card_qids = excluded.card_qids,
        updated_by = null,
        updated_at = now();
end;
$$;

create or replace function public.app_admin_delete_daily_game(
  p_admin_key text,
  p_date_key date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_admin_key <> 'Wilgot10:Elfsborg10' then
    raise exception 'Fel adminnyckel.';
  end if;

  if p_date_key <= ((now() at time zone 'UTC')::date) then
    raise exception 'Dagens spel är låst.';
  end if;

  delete from public.daily_games
  where date_key = p_date_key;
end;
$$;

revoke execute on function public.app_admin_upsert_daily_game(text, date, text[]) from public;
revoke execute on function public.app_admin_delete_daily_game(text, date) from public;

grant execute on function public.app_admin_upsert_daily_game(text, date, text[]) to anon, authenticated;
grant execute on function public.app_admin_delete_daily_game(text, date) to anon, authenticated;
