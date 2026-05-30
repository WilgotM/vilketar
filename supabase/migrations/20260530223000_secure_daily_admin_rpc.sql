drop function if exists public.app_admin_upsert_daily_game(text, date, text[]);
drop function if exists public.app_admin_delete_daily_game(text, date);

create or replace function public.app_admin_upsert_daily_game(
  p_date_key date,
  p_card_qids text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not exists (
    select 1
    from public.daily_admins admin
    where admin.user_id = current_user_id
  ) then
    raise exception 'Du saknar adminbehörighet.';
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
  values (p_date_key, p_card_qids, current_user_id, now())
  on conflict (date_key) do update
    set card_qids = excluded.card_qids,
        updated_by = current_user_id,
        updated_at = now();
end;
$$;

create or replace function public.app_admin_delete_daily_game(
  p_date_key date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not exists (
    select 1
    from public.daily_admins admin
    where admin.user_id = current_user_id
  ) then
    raise exception 'Du saknar adminbehörighet.';
  end if;

  if p_date_key <= ((now() at time zone 'UTC')::date) then
    raise exception 'Dagens spel är låst.';
  end if;

  delete from public.daily_games
  where date_key = p_date_key;
end;
$$;

revoke execute on function public.app_admin_upsert_daily_game(date, text[]) from public;
revoke execute on function public.app_admin_delete_daily_game(date) from public;

grant execute on function public.app_admin_upsert_daily_game(date, text[]) to authenticated;
grant execute on function public.app_admin_delete_daily_game(date) to authenticated;
