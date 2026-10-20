-- =====================================================================
-- FOOD-SUGGESTIONS-SETUP.SQL — run this ONCE in Supabase (SQL Editor →
-- New query → paste → Run), after place-suggestions-setup.sql.
--
-- The "Submit a recommendation" button under each dish or drink in the
-- Food & drink popup on city.html (2026-10-20) saves to the same
-- place_suggestions table as "Suggest a place", with section = 'food':
--   kind        'dish' or 'drink'
--   kind_label  the dish or drink, e.g. "Pastel de nata"
--   hood_name   the neighborhood the visitor chose, or "Somewhere else in <city>"
--   place_name  the name of the business (new column, food only)
--
-- Until this is run, a food recommendation is still emailed to you, but
-- the database refuses it, so it does not show on the Admin page.
-- Safe to re-run.
-- =====================================================================

alter table public.place_suggestions
  add column if not exists place_name text;

alter table public.place_suggestions
  drop constraint if exists place_suggestions_section_check;
alter table public.place_suggestions
  add constraint place_suggestions_section_check
  check (section in ('stay','eat','cafes','bars','food'));
