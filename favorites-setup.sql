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
