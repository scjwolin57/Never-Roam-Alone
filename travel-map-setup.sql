-- =====================================================================
-- TRAVEL-MAP-SETUP.SQL — one-time setup for the Personal Travel Map
-- and Bucket List progress bar on profile.html / roamer.html.
--
-- What this does, in plain English:
--   1. Adds two new profile fields: visited_places (every city/place
--      you've marked "been there" on your personal map, including
--      ones you typed in yourself that aren't on the map) and
--      visited_bucket (which of the 100 Bucket List landmarks you've
--      checked off as visited).
--   2. Refreshes the safe public "window" so your travel map and
--      bucket-list progress can show on your public profile page too.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- =====================================================================

alter table public.profiles
  add column if not exists visited_places jsonb not null default '[]'::jsonb,
  add column if not exists visited_bucket jsonb not null default '[]'::jsonb;

drop view if exists public.public_profiles;
create view public.public_profiles as
  select id,
         display_name,
         bio,
         home_city,
         home_country,
         travel_style,
         travel_company,
         website,
         instagram,
         avatar_url,
         cover_url,
         created_at,
         age,
         fav_destination,
         no_return_destination,
         bucket_list_destination,
         best_story,
         scary_story,
         extra_details,
         facebook,
         twitter,
         tiktok,
         youtube,
         travel_photos,
         avatar_caption,
         last_trip,
         next_trip,
         travel_goals,
         visited_places,
         visited_bucket
    from public.profiles
   where is_public = true;

grant select on public.public_profiles to anon, authenticated;
