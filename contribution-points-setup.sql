-- =====================================================================
-- CONTRIBUTION-POINTS-SETUP.SQL — one-time setup for the "contribution
-- score" shown on a signed-in visitor's profile. Every approved piece
-- of user-submitted content writes one row here; profiles.contribution_
-- points is a cached, trigger-maintained sum of it (derived, never
-- hand-typed, per CLAUDE.md's "counts are derived" rule).
--
-- Points scale (Jeff, 2026-09-22):
--   traveler's take / local's perspective  = 20
--   photo contribution                     = 10
--   approved restaurant/bar/takeout/coffee  = 5
--   approved day trip or landmark           = 10
--   approved event                          = 5
--   approved correction                     = 5
--
-- Rows are written server-side only (Netlify functions, service key),
-- the same moment an admin approves the underlying submission — e.g.
-- inside approve-insight.js, approve-photo.js, and the recommendation/
-- day-trip/event/correction approval functions still to be built.
-- No client-side inserts, same rule as city_insights/events/photos.
--
-- An admin un-approving something later flips the row to 'reversed'
-- instead of deleting it, so the running total and the history both
-- stay honest.
--
-- In Supabase: SQL Editor -> New query -> paste ALL of this -> Run.
-- Requires blog-setup.sql / city-events-setup.sql (is_blog_admin()) to
-- already exist. Safe to re-run (idempotent).
-- =====================================================================

-- ---------- 1. The ledger ----------
create table if not exists public.contribution_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  kind          text not null check (kind in (
    'insight', 'photo', 'recommendation', 'daytrip_landmark', 'event', 'correction'
  )),
  points        integer not null,
  source_table  text,     -- e.g. 'city_insights', 'landmark_photo_contributions'
  source_id     uuid,     -- the row in source_table this event was earned for
  city          text,
  status        text not null default 'approved' check (status in ('approved', 'reversed')),
  created_at    timestamptz not null default now()
);

create index if not exists contribution_events_user_idx
  on public.contribution_events (user_id, status);

alter table public.contribution_events enable row level security;

-- Admins manage everything (approve functions use the service key and
-- bypass RLS entirely; these policies are for admin.html's own queries,
-- same shape as city_insights). A signed-in visitor can read their own
-- history for their profile page, nothing else.
drop policy if exists "admins read contribution events" on public.contribution_events;
create policy "admins read contribution events" on public.contribution_events
  for select using (public.is_blog_admin());

drop policy if exists "admins update contribution events" on public.contribution_events;
create policy "admins update contribution events" on public.contribution_events
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "own contribution events select" on public.contribution_events;
create policy "own contribution events select" on public.contribution_events
  for select using (auth.uid() = user_id);

-- ---------- 2. profiles.contribution_points, kept in sync by trigger ----------
alter table public.profiles add column if not exists contribution_points integer not null default 0;

create or replace function public.contribution_events_apply()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    if new.status = 'approved' then
      update public.profiles set contribution_points = contribution_points + new.points where id = new.user_id;
    end if;
  elsif TG_OP = 'UPDATE' and new.status is distinct from old.status then
    if old.status = 'approved' and new.status = 'reversed' then
      update public.profiles set contribution_points = contribution_points - old.points where id = old.user_id;
    elsif old.status = 'reversed' and new.status = 'approved' then
      update public.profiles set contribution_points = contribution_points + new.points where id = new.user_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists contribution_events_apply on public.contribution_events;
create trigger contribution_events_apply after insert or update on public.contribution_events
  for each row execute function public.contribution_events_apply();
