-- =====================================================================
-- NAMED-ITINERARIES-SETUP.SQL — one-time setup for multiple, named trips.
-- Powers the "My Itineraries" tab on itinerary.html and the
-- "Add to itinerary" button on every city guide page (city.html).
--
-- This is SEPARATE from the older single Upcoming/Past/Favorites lists
-- (itinerary-setup.sql / itinerary_items). Those keep working as-is.
--
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to re-run (everything is "if not exists" / drop-then-create).
-- =====================================================================

-- One row per named itinerary a user creates (e.g. "Summer Europe").
create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My itinerary' check (char_length(name) <= 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- One row per city placed inside a named itinerary.
-- Deleting an itinerary auto-removes its cities (on delete cascade).
create table if not exists public.itinerary_places (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  place text not null check (char_length(place) <= 80),
  country text not null default '' check (char_length(country) <= 60),
  arrive date,
  depart date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.itineraries      enable row level security;
alter table public.itinerary_places enable row level security;

-- ---- Only you can see or change your own itineraries ----
drop policy if exists "read own itineraries" on public.itineraries;
create policy "read own itineraries"   on public.itineraries for select using (auth.uid() = user_id);

drop policy if exists "add own itineraries" on public.itineraries;
create policy "add own itineraries"    on public.itineraries for insert with check (auth.uid() = user_id);

drop policy if exists "update own itineraries" on public.itineraries;
create policy "update own itineraries" on public.itineraries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own itineraries" on public.itineraries;
create policy "delete own itineraries" on public.itineraries for delete using (auth.uid() = user_id);

-- ---- Only you can see or change the cities inside your itineraries ----
drop policy if exists "read own itinerary places" on public.itinerary_places;
create policy "read own itinerary places"   on public.itinerary_places for select using (auth.uid() = user_id);

drop policy if exists "add own itinerary places" on public.itinerary_places;
create policy "add own itinerary places"    on public.itinerary_places for insert with check (auth.uid() = user_id);

drop policy if exists "update own itinerary places" on public.itinerary_places;
create policy "update own itinerary places" on public.itinerary_places for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own itinerary places" on public.itinerary_places;
create policy "delete own itinerary places" on public.itinerary_places for delete using (auth.uid() = user_id);
