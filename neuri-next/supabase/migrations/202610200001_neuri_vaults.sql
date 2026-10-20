create table public.neuri_vaults (
  owner uuid primary key references auth.users(id) on delete cascade,
  payload text not null check (octet_length(payload) <= 2100000),
  revision integer not null default 1 check (revision > 0)
);
alter table public.neuri_vaults enable row level security;
revoke all on public.neuri_vaults from anon;
grant select, insert, update, delete on public.neuri_vaults to authenticated;
create policy neuri_select_own on public.neuri_vaults for select to authenticated using ((select auth.uid()) = owner);
create policy neuri_insert_own on public.neuri_vaults for insert to authenticated with check ((select auth.uid()) = owner);
create policy neuri_update_own on public.neuri_vaults for update to authenticated using ((select auth.uid()) = owner) with check ((select auth.uid()) = owner);
create policy neuri_delete_own on public.neuri_vaults for delete to authenticated using ((select auth.uid()) = owner);
