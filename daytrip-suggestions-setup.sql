-- =====================================================================
-- DAYTRIP-SUGGESTIONS-SETUP.SQL — run this ONCE in Supabase (SQL Editor →
-- New query → paste → Run). It creates what the "Suggest a day trip"
-- button on city.html needs. The button shows under "No day trips
-- available" on a city page that has no day trips (Jeff, 2026-09-30).
--
--   1. A "daytrip_suggestions" table. Every suggestion a visitor sends is
--      saved here as PENDING by netlify/functions/submit-daytrip-suggestion.js.
--      Only admins (the blog_admins list) can read, change or delete rows.
--      There is no public view: a suggestion is never shown on the site by
--      itself. A trip reaches the guide only after the normal day-trip
--      checks (real place, outside the city, within the time limits, not a
--      guide city) and goes into day-trips.js, citydata and the sheet.
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql / city-events-setup.sql, so run one of those first.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

create table if not exists public.daytrip_suggestions (
  id            uuid primary key default gen_random_uuid(),
  city          text not null,                       -- the city page it was sent from
  place_name    text not null,                       -- "Name of place visiting"
  how_to_get    text not null,                       -- "How to get there"
  distance      text not null check (distance in ('half','full')),   -- half = up to 1.5 hours each way, full = 3+ hours
  website_url   text,                                -- "Website for more information or booking links" (optional)
  show_profile  boolean not null default false,      -- signed-in member agreed to show their Roamer profile with it
  contact       boolean not null default false,      -- agreed to be contacted by email with questions
  email         text,                                -- only when contact = true; NEVER public
  user_id       uuid references auth.users(id) on delete set null,   -- the signed-in member who sent it, if any
  status        text not null default 'pending' check (status in ('pending','added','declined')),
  added_at      timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists daytrip_suggestions_status_idx
  on public.daytrip_suggestions (status, created_at desc);

alter table public.daytrip_suggestions enable row level security;

create or replace function public.daytrip_suggestions_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.status = 'added' and old.status is distinct from 'added' then new.added_at = now(); end if;
  return new;
end;
$$;
drop trigger if exists daytrip_suggestions_touch on public.daytrip_suggestions;
create trigger daytrip_suggestions_touch before update on public.daytrip_suggestions
  for each row execute function public.daytrip_suggestions_touch();

-- Admins only, for everything. Visitor submissions come in through the
-- Netlify function with the service key, which bypasses these policies.
drop policy if exists "admins read daytrip suggestions" on public.daytrip_suggestions;
create policy "admins read daytrip suggestions" on public.daytrip_suggestions
  for select using (public.is_blog_admin());

drop policy if exists "admins update daytrip suggestions" on public.daytrip_suggestions;
create policy "admins update daytrip suggestions" on public.daytrip_suggestions
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete daytrip suggestions" on public.daytrip_suggestions;
create policy "admins delete daytrip suggestions" on public.daytrip_suggestions
  for delete using (public.is_blog_admin());
