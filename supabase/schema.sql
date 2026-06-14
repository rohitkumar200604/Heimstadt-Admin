-- ============================================================
-- Heimstadt · Supabase Schema
-- Run this in the Supabase SQL editor on your project.
-- This schema is SHARED between heimstadt.com and this admin panel.
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- -------------------------------------------------------
-- Profiles table for role management
-- -------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text check (role in ('admin', 'employee')) default 'employee',
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile row on user sign-up
create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'employee')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- -------------------------------------------------------
-- Properties
-- -------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  address text not null,
  city text not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'occupied')),
  price_per_month numeric not null default 0,
  size_sqm numeric not null default 0,
  image_url text
);

-- -------------------------------------------------------
-- Bookings
-- -------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  property_name text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  check_in date,
  check_out date
);

-- -------------------------------------------------------
-- Conversations
-- -------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  user_name text,
  user_email text,
  subject text,
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  assigned_to uuid references auth.users(id) on delete set null
);

-- -------------------------------------------------------
-- Chat Messages
-- -------------------------------------------------------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('user', 'employee', 'admin')),
  sender_id uuid references auth.users(id) on delete set null,
  content text not null
);

-- -------------------------------------------------------
-- Documents
-- -------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  document_type text, -- 'income_proof', 'id_verification', etc.
  file_path text,
  context text not null check (context in ('booking', 'profile')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz
);

-- -------------------------------------------------------
-- Row-Level Security (RLS)
-- -------------------------------------------------------

-- Profiles RLS
alter table public.profiles enable row level security;
create policy "Authenticated read profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Self update profile" on public.profiles for update using (auth.uid() = id);

-- Properties RLS
alter table public.properties enable row level security;
create policy "Public read properties" on public.properties for select using (true);
create policy "Admin write properties" on public.properties for all using (auth.role() = 'authenticated');

-- Bookings RLS
alter table public.bookings enable row level security;
create policy "Authenticated read bookings" on public.bookings for select using (auth.role() = 'authenticated');
create policy "Public insert bookings" on public.bookings for insert with check (true);
create policy "Admin update bookings" on public.bookings for update using (auth.role() = 'authenticated');

-- Conversations RLS
alter table public.conversations enable row level security;
create policy "Authenticated read conversations" on public.conversations for select using (auth.role() = 'authenticated');
create policy "Public insert conversations" on public.conversations for insert with check (true);
create policy "Admin update conversations" on public.conversations for update using (auth.role() = 'authenticated');

-- Chat Messages RLS
alter table public.chat_messages enable row level security;
create policy "Authenticated read chat_messages" on public.chat_messages for select using (auth.role() = 'authenticated');
create policy "Anyone insert chat_messages" on public.chat_messages for insert with check (true);

-- Documents RLS
alter table public.documents enable row level security;
create policy "Authenticated read documents" on public.documents for select using (auth.role() = 'authenticated');
create policy "Public insert documents" on public.documents for insert with check (true);
create policy "Admin update documents" on public.documents for update using (auth.role() = 'authenticated');

-- -------------------------------------------------------
-- Realtime publications
-- -------------------------------------------------------
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.documents;
alter publication supabase_realtime add table public.bookings;
