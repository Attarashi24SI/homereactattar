-- Migration: Ensure required foreign key relations for Admin Orders Management
-- Safe to run multiple times (idempotent)

-- 1. Add customerid column to profiles if not exists
alter table public.profiles
  add column if not exists customerid varchar;

-- 2. Add foreign key from profiles.customerid -> customer.customerid
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

-- 3. Add foreign key from order_tracking.order_id -> orders.id
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'order_tracking'
      and constraint_name = 'order_tracking_order_id_fkey'
  ) then
    alter table public.order_tracking
      add constraint order_tracking_order_id_fkey
      foreign key (order_id) references public.orders(id)
      on delete cascade;
  end if;
end $$;

-- 4. Ensure orders.user_id -> profiles.id foreign key exists
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
