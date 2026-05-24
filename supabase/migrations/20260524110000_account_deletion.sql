create or replace function public.app_delete_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Du behöver vara inloggad för att ta bort kontot.';
  end if;

  delete from auth.users
  where id = current_user_id;
end;
$$;

revoke execute on function public.app_delete_account() from public;
grant execute on function public.app_delete_account() to authenticated;
