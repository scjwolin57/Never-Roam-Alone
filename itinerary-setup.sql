-- =====================================================================
-- ITINERARY-SETUP.SQL — one-time setup for the trip planner
-- (itinerary.html: Past trips & Upcoming trips on the profile page).
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- =====================================================================

-- One row per saved place, per user, per list (past / upcoming)
create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_type text not null check (trip_type in ('past','upcoming')),
  place text not null check (char_length(place) <= 80),
  country text not null default '' check (char_length(country) <= 60),
  created_at timestamptz not null default now()
);

alter table public.itinerary_items enable row level security;

-- Only you can see or change your own itinerary
create policy "read own itinerary"   on public.itinerary_items for select using (auth.uid() = user_id);
create policy "add to own itinerary" on public.itinerary_items for insert with check (auth.uid() = user_id);
create policy "remove from own itinerary" on public.itinerary_items for delete using (auth.uid() = user_id);
