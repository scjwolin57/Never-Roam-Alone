-- =====================================================================
-- DESTINATION-REQUESTS-SETUP.SQL — run this ONCE in Supabase (SQL Editor →
-- New query → paste → Run). It creates what the Admin page's "Destination
-- requests" list needs (Jeff, 2026-11-16).
--
--   1. A "destination_requests" table. Every request for a place that has
--      no guide is saved here as PENDING by netlify/functions/request-guide.js:
--      the homepage search's "Request destination" form, and the "Request
--      city guide" buttons on the itinerary and profile pages.
--      Only admins (the blog_admins list) can read, change or delete rows.
--      There is no public view. A request never adds anything to the site:
--      a city is added only through the add-city research, and the request
--      is then marked added by netlify/functions/approve-destination-request.js.
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql / city-events-setup.sql, so run one of those first.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

create table if not exists public.destination_requests (
  id              uuid primary key default gen_random_uuid(),
  place           text not null,                       -- what they asked for, as typed
  country         text,                                -- required on the homepage form; may be empty from the itinerary / profile buttons
  maps_url        text,                                -- optional Google Maps link (homepage form)
  source          text not null default 'search' check (source in ('search','upcoming','past','home')),
  requester_name  text,
  requester_email text,                                -- NEVER public; used once to say the guide is live
  status          text not null default 'pending' check (status in ('pending','added','declined')),
  added_city      text,                                -- the guide's name on the site once it is added
  added_at        timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists destination_requests_status_idx
  on public.destination_requests (status, created_at desc);

alter table public.destination_requests enable row level security;

create or replace function public.destination_requests_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.status = 'added' and old.status is distinct from 'added' then new.added_at = now(); end if;
  return new;
end;
$$;
drop trigger if exists destination_requests_touch on public.destination_requests;
create trigger destination_requests_touch before update on public.destination_requests
  for each row execute function public.destination_requests_touch();

-- Admins only, for everything. Requests come in through the Netlify
-- function with the service key, which bypasses these policies.
drop policy if exists "admins read destination requests" on public.destination_requests;
create policy "admins read destination requests" on public.destination_requests
  for select using (public.is_blog_admin());

drop policy if exists "admins update destination requests" on public.destination_requests;
create policy "admins update destination requests" on public.destination_requests
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete destination requests" on public.destination_requests;
create policy "admins delete destination requests" on public.destination_requests
  for delete using (public.is_blog_admin());

-- Table privileges for signed-in users (the policies above still limit rows to admins).
grant select, update, delete on public.destination_requests to authenticated;
grant all on public.destination_requests to service_role;
