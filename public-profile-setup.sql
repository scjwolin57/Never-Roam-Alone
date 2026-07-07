-- =====================================================================
-- PUBLIC-PROFILE-SETUP.SQL — one-time setup for viewable profile pages.
--
-- What this does, in plain English:
--   1. Adds a "make my profile public" switch to every profile.
--      It starts OFF for everyone — nobody's info becomes visible
--      until they flip the switch on their own profile page.
--   2. Creates a safe "window" (a database view) that shows ONLY the
--      harmless profile fields (name, bio, home city, travel style,
--      socials) and ONLY for people who flipped the switch on.
--      Email addresses and settings are never exposed.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- =====================================================================

-- 1. The switch (off by default for everyone)
alter table public.profiles
  add column if not exists is_public boolean not null default false;

-- 2. The safe public window. Because the view is owned by the database
--    admin, it can read past the "only you can see your own profile"
--    rule — but it only ever shows the columns listed here, and only
--    rows where is_public is on. Email is deliberately NOT included.
create or replace view public.public_profiles as
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
         created_at
    from public.profiles
   where is_public = true;

-- Let everyone (signed in or not) read through the window
grant select on public.public_profiles to anon, authenticated;
