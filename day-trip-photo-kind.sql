-- Never Roam Alone: let a visitor contribute a photo for a day trip card.
-- Pairs with contribute-photo.js (kind "daytrip"), netlify/functions/contribute-photo.js
-- and contributed-photos.js.
--
-- Run ONCE in the Supabase SQL editor. Safe to run more than once.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- It only widens the list of photo kinds the contributions table accepts; no
-- existing row changes. Until it has been run, a day-trip photo is still saved
-- (filed as kind "other" with the context "Day trip") and still shows on the card
-- once approved, so nothing is lost by running it late.
alter table public.landmark_photo_contributions
  drop constraint if exists lpc_subject_kind_chk;
alter table public.landmark_photo_contributions
  add constraint lpc_subject_kind_chk check (
    subject_kind in ('landmark','city-hero','neighborhood-hero','food-dish','daytrip','other'));
