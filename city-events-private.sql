-- =====================================================================
-- CITY-EVENTS-PRIVATE.SQL — run this in Supabase (SQL Editor → New
-- query → paste → Run). Run it AFTER city-events-setup.sql.
--
-- Why: city-events-setup.sql let anyone read every column of a
-- published event, including the submitter's name and email and the
-- organizer's contact even when they said "don't show it". This file
-- closes that:
--
--   1. A "city_events_public" view: published events only, and only the
--      columns the calendar shows. The organizer's contact comes through
--      only when allow_contact is on. No submitter name or email, ever.
--      city.html and itinerary.html read this view.
--   2. The table itself becomes admins-only to read. admin.html keeps
--      full access (it signs in as an admin). The Netlify functions
--      (submit-event, approve-event) use the service key and are not
--      affected.
--
-- Order: run this, then push the site change that reads the view. In
-- between, the calendar is empty for a few minutes; nothing is exposed.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

-- ---------- 1. The public view ----------
-- A view runs with its owner's rights, so it can read the table even
-- though visitors can't; the WHERE clause and column list are the whole
-- of what the public ever sees.
create or replace view public.city_events_public as
  select id,
         city,
         name,
         location,
         map_link,
         event_date,
         start_time,
         end_time,
         link,
         poster_url,
         allow_contact,
         case when allow_contact then contact_type  end as contact_type,
         case when allow_contact then contact_value end as contact_value
    from public.city_events
   where published = true;

grant select on public.city_events_public to anon, authenticated;

-- ---------- 2. The table: admins only ----------
drop policy if exists "anyone reads published events" on public.city_events;
drop policy if exists "admins read events" on public.city_events;
create policy "admins read events" on public.city_events
  for select using (public.is_blog_admin());
