-- =====================================================================
-- SUGGESTIONS-UPDATE-2026-10-20.SQL — run this ONCE in Supabase (SQL
-- Editor → New query → paste → Run), after place-suggestions-setup.sql
-- and daytrip-suggestions-setup.sql. Safe to re-run.
--
-- 1. Food & drink recommendations. The "Submit a recommendation" button
--    under each dish or drink in the Food & drink popup on city.html saves
--    to place_suggestions with section = 'food':
--      kind        'dish' or 'drink'
--      kind_label  the dish or drink, e.g. "Pastel de nata"
--      hood_name   the neighborhood chosen, or "Somewhere else in <city>"
--      place_name  the name of the business (new column, food only)
--    Until this is run, a food recommendation is still emailed to you, but
--    the database refuses it, so it does not show on the Admin page.
--
-- 2. Append or replace. On the Admin page every pending submission (place,
--    food, day trip, landmark, calendar event) can be set to "Append" (added
--    beside what the guide already has) or "Replace" one item already there.
--      apply_mode      'append' (default) or 'replace'
--      replace_target  the exact name of the item it replaces (for an event,
--                      the id of the calendar event it replaces)
--    The add command Admin builds carries --replace, and Mark published /
--    Mark added refuse while the replaced item is still on the live guide.
--    Adding an event set to Replace hides the event it replaces.
-- =====================================================================

alter table public.place_suggestions
  add column if not exists place_name text;

alter table public.place_suggestions
  drop constraint if exists place_suggestions_section_check;
alter table public.place_suggestions
  add constraint place_suggestions_section_check
  check (section in ('stay','eat','cafes','bars','food'));

alter table public.place_suggestions
  add column if not exists apply_mode text not null default 'append';
alter table public.place_suggestions
  add column if not exists replace_target text;
alter table public.place_suggestions
  drop constraint if exists place_suggestions_apply_mode_check;
alter table public.place_suggestions
  add constraint place_suggestions_apply_mode_check
  check (apply_mode in ('append','replace'));

alter table public.daytrip_suggestions
  add column if not exists apply_mode text not null default 'append';
alter table public.daytrip_suggestions
  add column if not exists replace_target text;
alter table public.daytrip_suggestions
  drop constraint if exists daytrip_suggestions_apply_mode_check;
alter table public.daytrip_suggestions
  add constraint daytrip_suggestions_apply_mode_check
  check (apply_mode in ('append','replace'));

alter table public.city_events
  add column if not exists apply_mode text not null default 'append';
alter table public.city_events
  add column if not exists replace_target text;
alter table public.city_events
  drop constraint if exists city_events_apply_mode_check;
alter table public.city_events
  add constraint city_events_apply_mode_check
  check (apply_mode in ('append','replace'));
