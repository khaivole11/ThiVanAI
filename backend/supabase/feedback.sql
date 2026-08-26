create extension if not exists pgcrypto;

create table if not exists public.generation_feedback (
  id uuid primary key default gen_random_uuid(),
  generation_id text not null,
  rating integer not null check (rating between 1 and 5),
  labels text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists generation_feedback_generation_id_idx
  on public.generation_feedback (generation_id);

create index if not exists generation_feedback_created_at_idx
  on public.generation_feedback (created_at desc);

alter table public.generation_feedback enable row level security;

-- The backend inserts with a Supabase admin key, which bypasses RLS.
-- Do not expose SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY to the frontend.
