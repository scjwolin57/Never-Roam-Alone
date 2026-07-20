-- =====================================================================
-- TRIP-TIPS-SETUP.SQL — one-time setup for the "Email me tips" box on
-- Upcoming trip cards (itinerary.html).
--
-- Adds two columns to the itineraries table:
--   receive_tips  - the checkbox state on the trip card
--   tips_sent_at  - when the tips email last went out (stops repeat
--                   sends more than once a day per trip)
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once. Requires named-itineraries-setup.sql
-- to have been run first (it creates the itineraries table).
-- =====================================================================

alter table public.itineraries
  add column if not exists receive_tips boolean not null default false;

alter table public.itineraries
  add column if not exists tips_sent_at timestamptz;
