-- =====================================================================
-- PASSPORT-COUNTRY.SQL — one-time migration: the traveller's passport
-- country, used to pick which government's travel advisory their city
-- guides show (Jeff, 2026-09-22; decisions.md).
--
-- It is NOT the same as home_country: that is where someone lives, and
-- citizenship is what decides whose advisory applies.
--
-- PRIVATE. Never shown on a public profile and never returned by the
-- public profile view, like an email address. If public_profiles is a
-- view with a column list, this column is simply left out of it, which
-- is why nothing below touches that view.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste ALL of this
-- -> Run. Safe to run more than once ("if not exists").
-- =====================================================================

alter table public.profiles
  add column if not exists passport_country text;   -- e.g. 'United Kingdom'; null = prefer not to say

comment on column public.profiles.passport_country is
  'Citizenship, for choosing which government''s travel advisory to show. Private: never exposed on public profiles.';

-- Check afterwards: this should list passport_country as one row.
-- select column_name from information_schema.columns
--  where table_schema='public' and table_name='profiles' and column_name='passport_country';
