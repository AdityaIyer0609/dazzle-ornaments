-- Run this in the Supabase SQL editor after setup.sql.
-- Dashboard → Authentication → Providers: Email enabled.
-- For wholesale testing, turn off "Confirm email" under Auth → Providers → Email.

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.order_items
  add column if not exists custom boolean not null default false;

create index if not exists orders_user_id_idx on public.orders (user_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.carts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lines jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile"
  on public.profiles for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "own cart" on public.carts;
create policy "own cart"
  on public.carts for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "own orders" on public.orders;
create policy "own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "own order items" on public.order_items;
create policy "own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    company = excluded.company,
    phone = excluded.phone;

  insert into public.carts (user_id, lines)
  values (new.id, '[]'::jsonb)
  on conflict (user_id) do nothing;

  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now())
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
    id, public_code, user_id, customer_name, company, email, phone, note, upload_path,
    total_pcs, billable_grams, wastage_rate
  ) values (
    new_id,
    code,
    auth.uid(),
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
      wastage_rate, net_grams, wastage_grams, billable_grams, custom
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
      (item->>'billable_grams')::numeric,
      coalesce((item->>'custom')::boolean, false)
    );
  end loop;

  if auth.uid() is not null then
    update public.carts set lines = '[]'::jsonb, updated_at = now()
    where user_id = auth.uid();
  end if;

  return jsonb_build_object('id', code, 'uuid', new_id);
end;
$$;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.carts to authenticated;
grant select on table public.orders to authenticated;
grant select on table public.order_items to authenticated;

-- Confirm existing accounts and copy company/phone from signup metadata.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

update public.profiles p
set
  full_name = coalesce(nullif(p.full_name, ''), u.raw_user_meta_data->>'full_name', p.full_name),
  company = coalesce(nullif(p.company, ''), u.raw_user_meta_data->>'company', p.company),
  phone = coalesce(nullif(p.phone, ''), u.raw_user_meta_data->>'phone', p.phone)
from auth.users u
where u.id = p.id;
