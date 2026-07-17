-- =====================================================================
-- ROAMERS-SETUP.SQL — one-time setup for "Roamers in town".
--
-- What this does, in plain English:
--   1. Adds a "share this trip publicly" switch to every named trip.
--      It starts OFF — nothing becomes visible until a user flips the
--      switch on one of their trips (My Travels page). Sharing also
--      requires their public profile to be ON (the site enforces that
--      with a popup before the switch can be flipped).
--   2. Creates two safe helper functions the city pages call:
--        city_roamers(city)       → who'll be in town + dates
--                                   (signed-in members only)
--        city_roamers_count(city) → just the number, for the
--                                   "sign in to see who" teaser
--      Both only ever reveal people who turned BOTH switches on
--      (public trip + public profile), and only trip stops that have
--      an arrival date that hasn't fully passed yet. Emails and other
--      private columns are never exposed.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- Needs named-itineraries-setup.sql + public-profile-setup.sql +
-- messages-setup.sql to have been run first (they create the tables
-- and switches this builds on).
-- =====================================================================

-- 1. The per-trip switch (off by default for everyone)
alter table public.itineraries
  add column if not exists is_public boolean not null default false;

-- 2. Who will be roaming this city? (signed-in members only)
--    One row per shared, upcoming (or in-progress) stop in that city.
create or replace function public.city_roamers(city_name text)
returns table (
  roamer_id      uuid,
  display_name   text,
  avatar_url     text,
  allow_messages boolean,
  arrive         date,
  depart         date
)
language sql
security definer
set search_path = public
stable
as $$
  select distinct
         pr.id,
         coalesce(nullif(trim(pr.display_name), ''), 'Roamer'),
         pr.avatar_url,
         coalesce(pr.allow_messages, true),
         ip.arrive,
         ip.depart
    from public.itinerary_places ip
    join public.itineraries i  on i.id  = ip.itinerary_id and i.is_public
    join public.profiles    pr on pr.id = i.user_id       and pr.is_public
   where lower(ip.place) = lower(city_name)
     and ip.arrive is not null                      -- undated stops don't show
     and coalesce(ip.depart, ip.arrive) >= current_date   -- hide finished visits
   order by ip.arrive
   limit 60
$$;

-- Members only — signed-out visitors can't call this.
revoke execute on function public.city_roamers(text) from public, anon;
grant  execute on function public.city_roamers(text) to authenticated;

-- 3. Just the head-count, for the signed-out teaser
create or replace function public.city_roamers_count(city_name text)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(distinct i.user_id)::integer
    from public.itinerary_places ip
    join public.itineraries i  on i.id  = ip.itinerary_id and i.is_public
    join public.profiles    pr on pr.id = i.user_id       and pr.is_public
   where lower(ip.place) = lower(city_name)
     and ip.arrive is not null
     and coalesce(ip.depart, ip.arrive) >= current_date
$$;

grant execute on function public.city_roamers_count(text) to anon, authenticated;
