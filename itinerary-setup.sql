-- =====================================================================
-- ITINERARY-SETUP.SQL — one-time setup for the trip planner
-- (itinerary.html: Past trips & Upcoming trips on the profile page).
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- =====================================================================

-- One row per saved place, per user, per list (past / upcoming)
-- arrive/depart = trip dates for that stop; sort_order = the drag order.
create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_type text not null check (trip_type in ('past','upcoming')),
  place text not null check (char_length(place) <= 80),
  country text not null default '' check (char_length(country) <= 60),
  arrive date,
  depart date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Already had this table from before? These add the new columns safely.
alter table public.itinerary_items add column if not exists arrive date;
alter table public.itinerary_items add column if not exists depart date;
alter table public.itinerary_items add column if not exists sort_order integer not null default 0;

alter table public.itinerary_items enable row level security;

-- Only you can see or change your own itinerary.
-- (drop-then-create makes this safe to re-run.)
drop policy if exists "read own itinerary" on public.itinerary_items;
create policy "read own itinerary"   on public.itinerary_items for select using (auth.uid() = user_id);

drop policy if exists "add to own itinerary" on public.itinerary_items;
create policy "add to own itinerary" on public.itinerary_items for insert with check (auth.uid() = user_id);

drop policy if exists "update own itinerary" on public.itinerary_items;
create policy "update own itinerary" on public.itinerary_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "remove from own itinerary" on public.itinerary_items;
create policy "remove from own itinerary" on public.itinerary_items for delete using (auth.uid() = user_id);
