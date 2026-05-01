alter table public.products
add column if not exists weight_prices jsonb not null default '{}'::jsonb;

update public.products
set weight_prices = coalesce(
  nullif(weight_prices, '{}'::jsonb),
  (
    select jsonb_object_agg(weight, case when lower(weight) = '1kg' then price * 2 else price end)
    from unnest(weights) as weight
  )
);
