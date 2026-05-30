-- Migration: Create daily active sessions table and update result submission
-- Created: 2026-05-30

create table if not exists public.daily_active_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  date_key date not null,
  snapshot jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, date_key)
);

alter table public.daily_active_sessions enable row level security;

-- Policies for RLS
create policy "Users can read own active session"
  on public.daily_active_sessions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own active session"
  on public.daily_active_sessions
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own active session"
  on public.daily_active_sessions
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own active session"
  on public.daily_active_sessions
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Grant execute and permissions
grant select, insert, update, delete on public.daily_active_sessions to authenticated;

-- Update the app_submit_daily_result function to automatically clean up active sessions on completion
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

  -- Delete active session on successful game completion
  delete from public.daily_active_sessions
  where user_id = current_user_id
    and date_key = p_date_key;

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
