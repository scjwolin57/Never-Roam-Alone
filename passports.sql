-- =====================================================================
-- PASSPORTS.SQL — one-time migration: let a Roamer hold more than one
-- passport (Jeff, 2026-09-23). Extends passport-country.sql, which added
-- the single `passport_country`.
--
-- `passports` is a JSON array of country names, e.g. ["United Kingdom","Canada"].
-- `passport_country` stays and always holds the FIRST one, so everything
-- already reading it (auth.js -> localStorage "nra_passport_country",
-- the travel advisory on city.html) keeps working unchanged.
--
-- PRIVATE, like an email address: never shown on a public profile and never
-- returned by the public_profiles view. That view lists its columns one by
-- one, so leaving it alone is what keeps this column out of it.
-- DO NOT add `passports` or `passport_country` to public_profiles.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste ALL of this
-- -> Run. Safe to run more than once ("if not exists").
-- =====================================================================

alter table public.profiles
  add column if not exists passports jsonb not null default '[]'::jsonb;

comment on column public.profiles.passports is
  'Every citizenship the traveller holds, as a JSON array of country names. Used to pick which government''s travel advisory their guides show. Private: never exposed on public profiles.';

-- Carry the existing single passport over, for anyone who set one before today.
update public.profiles
   set passports = jsonb_build_array(passport_country)
 where passports = '[]'::jsonb
   and passport_country is not null
   and passport_country <> '';

-- Checks afterwards.
-- 1) the column exists:
-- select column_name from information_schema.columns
--  where table_schema='public' and table_name='profiles' and column_name='passports';
-- 2) it is NOT in the public view (this should return no rows):
-- select column_name from information_schema.columns
--  where table_schema='public' and table_name='public_profiles'
--    and column_name in ('passports','passport_country');
