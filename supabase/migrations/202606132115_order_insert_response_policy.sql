grant select on table public.orders to anon, authenticated;

drop policy if exists "public can read inserted order response" on public.orders;
create policy "public can read inserted order response"
on public.orders
for select
to anon, authenticated
using (current_setting('request.method', true) = 'POST');
