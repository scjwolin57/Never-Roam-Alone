-- =====================================================================
-- PROFILE-FIELDS.SQL — one-time migration to add profile page fields.
--
-- Your database already has a "profiles" table. This adds the extra
-- columns the profile page uses (bio, home city/country, travel style,
-- socials, and a spot for a future avatar photo).
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. It's safe to run more than once ("if not exists" skips columns
-- that are already there).
-- =====================================================================

alter table public.profiles
  add column if not exists bio            text,
  add column if not exists home_city      text,
  add column if not exists home_country   text,
  add column if not exists travel_style   text,   -- e.g. Budget / Mid-range / Luxury
  add column if not exists travel_company text,   -- e.g. Solo / Couple / Group / Family
  add column if not exists website        text,
  add column if not exists instagram      text,
  add column if not exists avatar_url     text;    -- reserved for a future uploaded photo (unused for now)
