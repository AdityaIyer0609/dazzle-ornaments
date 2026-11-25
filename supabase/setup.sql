-- Run this once in the Supabase SQL editor (Dashboard → SQL).
-- Then run supabase/auth.sql for login, saved carts, and order history.

create table if not exists public.products (
  id text primary key,
  name text not null,
  code text not null,
  family text not null,
  image text not null,
  note text not null default '',
  weight numeric not null,
  moq integer not null,
  wastage numeric not null default 8,
  labeled boolean not null default false
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text unique not null,
  customer_name text not null,
  company text,
  email text not null,
  phone text not null,
  note text,
  upload_path text,
  total_pcs integer not null,
  billable_grams numeric not null,
  wastage_rate numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  product_code text not null,
  weight numeric not null,
  pcs integer not null,
  wastage_rate numeric not null,
  net_grams numeric not null,
  wastage_grams numeric not null,
  billable_grams numeric not null
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company text,
  email text not null,
  enquiry_type text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert enquiries" on public.enquiries;
create policy "public insert enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
  code text;
  item jsonb;
begin
  code := 'DO-' || upper(substr(replace(new_id::text, '-', ''), 1, 6));

  insert into public.orders (
    id, public_code, customer_name, company, email, phone, note, upload_path,
    total_pcs, billable_grams, wastage_rate
  ) values (
    new_id,
    code,
    payload->>'name',
    nullif(payload->>'company', ''),
    payload->>'email',
    payload->>'phone',
    nullif(payload->>'note', ''),
    nullif(payload->>'upload_path', ''),
    (payload->>'total_pcs')::integer,
    (payload->>'billable_grams')::numeric,
    (payload->>'wastage_rate')::numeric
  );

  for item in select value from jsonb_array_elements(payload->'items')
  loop
    insert into public.order_items (
      order_id, product_id, product_name, product_code, weight, pcs,
      wastage_rate, net_grams, wastage_grams, billable_grams
    ) values (
      new_id,
      item->>'product_id',
      item->>'product_name',
      item->>'product_code',
      (item->>'weight')::numeric,
      (item->>'pcs')::integer,
      (item->>'wastage_rate')::numeric,
      (item->>'net_grams')::numeric,
      (item->>'wastage_grams')::numeric,
      (item->>'billable_grams')::numeric
    );
  end loop;

  return jsonb_build_object('id', code, 'uuid', new_id);
end;
$$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert on table public.enquiries to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('references', 'references', false)
on conflict (id) do nothing;

drop policy if exists "anon upload references" on storage.objects;
create policy "anon upload references"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'references');
