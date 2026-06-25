-- BrightWash Member Portal laundry migration
-- Run this in Supabase SQL editor after the existing public schema is available.

alter table public.products
  add column if not exists category text,
  add column if not exists unit text,
  add column if not exists estimated_duration text,
  add column if not exists icon text,
  add column if not exists color text,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

alter table public.orders
  add column if not exists invoice_number text unique,
  add column if not exists service_type text,
  add column if not exists pickup_method text,
  add column if not exists estimated_finish timestamptz,
  add column if not exists payment_status text not null default 'Unpaid',
  add column if not exists current_step text not null default 'Pending',
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  add column if not exists customerid varchar;

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

create unique index if not exists idx_profiles_customerid
  on public.profiles(customerid)
  where customerid is not null;

create table if not exists public.order_tracking (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  title text not null,
  description text,
  updated_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_tracking_order_id_created_at
  on public.order_tracking(order_id, created_at);

create index if not exists idx_orders_user_id_created_at
  on public.orders(user_id, created_at desc);

create index if not exists idx_orders_invoice_number
  on public.orders(invoice_number);

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'profiles'
      and constraint_name = 'profiles_customerid_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_customerid_fkey
      foreign key (customerid) references public.customer(customerid);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'interaction'
      and constraint_name = 'interaction_customerid_fkey'
  ) then
    alter table public.interaction
      add constraint interaction_customerid_fkey
      foreign key ("customerId") references public.customer(customerid);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'orders'
      and constraint_name = 'orders_user_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_user_id_fkey
      foreign key (user_id) references public.profiles(id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'order_items'
      and constraint_name = 'order_items_order_id_fkey'
  ) then
    alter table public.order_items
      add constraint order_items_order_id_fkey
      foreign key (order_id) references public.orders(id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'order_items'
      and constraint_name = 'order_items_product_id_fkey'
  ) then
    alter table public.order_items
      add constraint order_items_product_id_fkey
      foreign key (product_id) references public.products(id);
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
