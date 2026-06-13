grant usage on schema public to anon, authenticated;
grant insert on table public.orders to anon, authenticated;

drop policy if exists "public can create orders" on public.orders;
create policy "public can create orders"
on public.orders
for insert
to anon, authenticated
with check (true);
