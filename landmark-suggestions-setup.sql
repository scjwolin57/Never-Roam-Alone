-- =====================================================================
-- LANDMARK-SUGGESTIONS-SETUP.SQL — "Suggest a landmark" and the approve
-- step for day trip and landmark suggestions (Jeff, 2026-10-02).
--
-- Landmark suggestions share the daytrip_suggestions table with day trips
-- (same form, same Admin list, same approve step), told apart by `kind`.
-- Requires daytrip-suggestions-setup.sql to have been run first.
--
--   kind        'daytrip' (default, every existing row) or 'landmark'
--   maps_url    landmarks: the Google Maps link (required by the form)
--   why         landmarks: why it's worth seeing (required by the form)
--   added_name  the exact name the trip or landmark has on the guide, set by
--               approve-trip-suggestion.js when Jeff marks it added; its vote
--               key ("<city>:<name>") links thumbs up / down on it to the
--               member who suggested it (contribution-rating-setup.sql)
--   distance, how_to_get   now only required for day trips
--
-- In Supabase: SQL Editor -> New query -> paste ALL of this -> Run.
-- Safe to re-run (idempotent).
-- =====================================================================

alter table public.daytrip_suggestions add column if not exists kind text not null default 'daytrip';
alter table public.daytrip_suggestions drop constraint if exists daytrip_suggestions_kind_check;
alter table public.daytrip_suggestions add constraint daytrip_suggestions_kind_check check (kind in ('daytrip', 'landmark'));

alter table public.daytrip_suggestions add column if not exists maps_url   text;
alter table public.daytrip_suggestions add column if not exists why        text;
alter table public.daytrip_suggestions add column if not exists added_name text;

alter table public.daytrip_suggestions alter column distance   drop not null;
alter table public.daytrip_suggestions alter column how_to_get drop not null;
alter table public.daytrip_suggestions drop constraint if exists daytrip_suggestions_distance_check;
alter table public.daytrip_suggestions add constraint daytrip_suggestions_distance_check
  check (distance is null or distance in ('half', 'full'));

-- A day trip still needs both; a landmark needs its map link and reason.
alter table public.daytrip_suggestions drop constraint if exists daytrip_suggestions_fields_check;
alter table public.daytrip_suggestions add constraint daytrip_suggestions_fields_check check (
  (kind = 'daytrip'  and distance is not null and how_to_get is not null) or
  (kind = 'landmark' and maps_url is not null and why is not null)
);
