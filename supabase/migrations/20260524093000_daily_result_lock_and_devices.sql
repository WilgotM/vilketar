create table if not exists public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null check (char_length(device_id) between 8 and 120),
  device_name text not null check (char_length(device_name) between 1 and 80),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, device_id)
);

create index if not exists user_devices_user_seen_idx
  on public.user_devices (user_id, last_seen_at desc);

alter table public.user_devices enable row level security;

create policy "Users can read own devices"
  on public.user_devices
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own devices"
  on public.user_devices
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own devices"
  on public.user_devices
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own devices"
  on public.user_devices
  for delete
  to authenticated
  using (user_id = auth.uid());

drop function if exists public.app_submit_daily_result(date, integer, text);

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
  stored_result public.daily_results%rowtype;
begin
  if current_user_id is null then
    return null;
  end if;

  if p_score < 0 or p_score > 100 then
    raise exception 'Felaktig poäng.';
  end if;

  insert into public.daily_results (user_id, date_key, score, result_pattern)
  values (current_user_id, p_date_key, p_score, coalesce(p_result_pattern, ''))
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

create or replace function public.app_register_device(
  p_device_id text,
  p_device_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_device_id text := left(trim(coalesce(p_device_id, '')), 120);
  normalized_device_name text := nullif(left(trim(regexp_replace(coalesce(p_device_name, ''), '\s+', ' ', 'g')), 80), '');
begin
  if current_user_id is null then
    return;
  end if;

  if normalized_device_id = '' then
    raise exception 'Enheten saknar id.';
  end if;

  insert into public.user_devices (user_id, device_id, device_name)
  values (
    current_user_id,
    normalized_device_id,
    coalesce(normalized_device_name, 'Okänd enhet')
  )
  on conflict (user_id, device_id) do update
    set device_name = excluded.device_name,
        last_seen_at = now();
end;
$$;

create or replace function public.app_get_devices(p_current_device_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Du behöver vara inloggad.';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'deviceId', device.device_id,
        'deviceName', device.device_name,
        'createdAt', device.created_at,
        'lastSeenAt', device.last_seen_at,
        'isCurrentDevice', device.device_id = p_current_device_id
      )
      order by device.last_seen_at desc
    )
    from public.user_devices device
    where device.user_id = current_user_id
  ), '[]'::jsonb);
end;
$$;

create or replace function public.app_forget_device(p_device_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Du behöver vara inloggad.';
  end if;

  delete from public.user_devices
  where user_id = current_user_id
    and device_id = p_device_id;
end;
$$;

revoke execute on function public.app_submit_daily_result(date, integer, text) from public;
revoke execute on function public.app_register_device(text, text) from public;
revoke execute on function public.app_get_devices(text) from public;
revoke execute on function public.app_forget_device(text) from public;

grant execute on function public.app_submit_daily_result(date, integer, text) to authenticated;
grant execute on function public.app_register_device(text, text) to authenticated;
grant execute on function public.app_get_devices(text) to authenticated;
grant execute on function public.app_forget_device(text) to authenticated;
