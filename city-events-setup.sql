-- =====================================================================
-- CITY-EVENTS-SETUP.SQL — run this ONCE in Supabase (SQL Editor → New
-- query → paste → Run). It creates everything the city-page event
-- calendar needs:
--
--   1. A "city_events" table where approved events live. Everyone can
--      READ published events; only admins (the same blog_admins list)
--      can create/edit/delete them from the events-admin page.
--   2. A public "event-images" storage folder for the event posters
--      that visitors upload with the "Submit an event" form. Anyone may
--      upload a poster and anyone may view it; only admins can delete.
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql, so run blog-setup.sql first (or at least once).
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

-- Safety net: make sure the admin list + helper exist even if
-- blog-setup.sql hasn't been run yet, so this file works on its own.
create table if not exists public.blog_admins (
  email text primary key
);
-- Lock the admin list down: Row Level Security ON, and (below) only admins
-- may read it. Without this, anon/authenticated keys could read the list.
alter table public.blog_admins enable row level security;

insert into public.blog_admins (email) values ('jcwolinsky@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.blog_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_blog_admin() to anon, authenticated;

-- Admins may read the admin list itself; nobody else can.
drop policy if exists "admins can read admin list" on public.blog_admins;
create policy "admins can read admin list" on public.blog_admins
  for select using (public.is_blog_admin());

-- ---------- 1. The events table ----------
create table if not exists public.city_events (
  id          uuid primary key default gen_random_uuid(),
  city        text not null,                         -- must match the city name on city.html
  name        text not null,                         -- event title
  location    text,                                  -- venue / address text
  map_link    text,                                  -- optional Google Maps (or any) link
  event_date  date not null,                         -- the day it shows on the calendar
  start_time  time,                                  -- optional start
  end_time    time,                                  -- optional end
  link        text,                                  -- optional tickets / info link
  poster_url  text,                                  -- optional poster image URL
  contact_type  text,                                -- optional "event questions" contact: 'email' | 'phone' | 'social'
  contact_value text,                                -- optional "event questions" contact value
  allow_contact boolean not null default false,      -- show the contact to attendees on the calendar?
  submitter_name  text,                              -- who submitted it (visitor form) — not shown publicly
  submitter_email text,                              -- notified when the event is approved
  notified    boolean not null default false,        -- has the submitter been emailed that it's live?
  published   boolean not null default true,         -- admin adds them already-approved
  pending     boolean not null default false,        -- true = visitor submission awaiting review
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- If the table already existed from an earlier run, make sure the newer
-- columns are there too (safe to re-run).
alter table public.city_events add column if not exists pending boolean not null default false;
alter table public.city_events add column if not exists contact_type text;
alter table public.city_events add column if not exists contact_value text;
alter table public.city_events add column if not exists allow_contact boolean not null default false;
alter table public.city_events add column if not exists submitter_name text;
alter table public.city_events add column if not exists submitter_email text;
alter table public.city_events add column if not exists notified boolean not null default false;

-- Fast lookup of a city's events by day.
create index if not exists city_events_city_date_idx
  on public.city_events (city, event_date);

alter table public.city_events enable row level security;

-- Keep updated_at current automatically.
create or replace function public.city_events_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists city_events_touch on public.city_events;
create trigger city_events_touch before update on public.city_events
  for each row execute function public.city_events_touch();

-- Everyone (even signed-out visitors) can read PUBLISHED events.
drop policy if exists "anyone reads published events" on public.city_events;
create policy "anyone reads published events" on public.city_events
  for select using (published = true or public.is_blog_admin());

-- Only admins can create, edit, or delete.
drop policy if exists "admins insert events" on public.city_events;
create policy "admins insert events" on public.city_events
  for insert with check (public.is_blog_admin());

drop policy if exists "admins update events" on public.city_events;
create policy "admins update events" on public.city_events
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete events" on public.city_events;
create policy "admins delete events" on public.city_events
  for delete using (public.is_blog_admin());

-- ---------- 2. Poster storage for visitor-submitted images ----------
-- A separate bucket from blog-images so we can let ANYONE upload a poster
-- (the submit form is open to signed-out visitors). Posters are just held
-- here so the review email can link to them; admins clean up as needed.
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads event images" on storage.objects;
create policy "public reads event images" on storage.objects
  for select using (bucket_id = 'event-images');

-- Anyone (including signed-out visitors) may upload a poster.
drop policy if exists "anyone uploads event images" on storage.objects;
create policy "anyone uploads event images" on storage.objects
  for insert with check (bucket_id = 'event-images');

-- Only admins may delete posters.
drop policy if exists "admins delete event images" on storage.objects;
create policy "admins delete event images" on storage.objects
  for delete using (bucket_id = 'event-images' and public.is_blog_admin());
