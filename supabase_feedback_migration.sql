-- BrightWash Order Feedback & Customer Review migration
-- Run this in Supabase SQL editor after the existing schema is available.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure one feedback per order
create unique index if not exists idx_feedback_order_id
  on public.feedback(order_id);

-- Enable faster lookups by user
create index if not exists idx_feedback_user_id
  on public.feedback(user_id);

-- Enable faster lookups for approved testimonials
create index if not exists idx_feedback_approved
  on public.feedback(is_approved)
  where is_approved = true;

-- Auto-update updated_at trigger
drop trigger if exists set_feedback_updated_at on public.feedback;
create trigger set_feedback_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();
