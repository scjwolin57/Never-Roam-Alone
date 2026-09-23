-- =====================================================================
-- FAVORITES-SETUP.SQL — one-time setup for the "heart a city" Favorites
-- list (separate from Past/Upcoming trips, same underlying table).
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to re-run (idempotent).
-- =====================================================================

-- Allow a third trip_type value: 'favorite'
alter table public.itinerary_items drop constraint if exists itinerary_items_trip_type_check;
alter table public.itinerary_items add constraint itinerary_items_trip_type_check
  check (trip_type in ('past','upcoming','favorite'));

-- ---------- 2. Public per-city favorite count (2026-09-22) ----------
-- Counts signed-in favorites only — a guest's heart lives in their own
-- localStorage and was never in this table, so this is "times favorited
-- by a signed-in visitor", not a literal total. city.html shows it as
-- such under the Favorite button.
create or replace view public.city_favorite_counts as
  select place as city, count(*) as favorites
  from public.itinerary_items
  where trip_type = 'favorite'
  group by place;

grant select on public.city_favorite_counts to anon, authenticated;
