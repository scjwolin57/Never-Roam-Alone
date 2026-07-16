-- =====================================================================
-- WISHLIST-SETUP.SQL — one-time setup for the trip Wishlist.
-- The Wishlist is a dated-less "someday" list: cities saved from city
-- guides / the Destination Finder that can later be moved into a real
-- trip (see named-itineraries-setup.sql for the trips tables).
--
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to re-run (everything is "if not exists" / drop-then-create).
-- =====================================================================

-- One row per city on a user's wishlist.
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place text not null check (char_length(place) <= 80),
  country text not null default '' check (char_length(country) <= 60),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.wishlist_items enable row level security;

-- Only you can see or change your own wishlist.
drop policy if exists "read own wishlist" on public.wishlist_items;
create policy "read own wishlist"   on public.wishlist_items for select using (auth.uid() = user_id);

drop policy if exists "add to own wishlist" on public.wishlist_items;
create policy "add to own wishlist" on public.wishlist_items for insert with check (auth.uid() = user_id);

drop policy if exists "update own wishlist" on public.wishlist_items;
create policy "update own wishlist" on public.wishlist_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "remove from own wishlist" on public.wishlist_items;
create policy "remove from own wishlist" on public.wishlist_items for delete using (auth.uid() = user_id);
