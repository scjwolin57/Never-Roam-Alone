-- =====================================================================
-- CITY-INSIGHTS-SETUP.SQL — run this ONCE in Supabase (SQL Editor → New
-- query → paste → Run). It creates what the city-page Insights section
-- (Plate 08: Traveler's Take / Local's Perspective) needs:
--
--   1. A "city_insights" table. Every interview a visitor shares is saved
--      here as PENDING by netlify/functions/submit-interview.js. Only
--      admins (the blog_admins list) can read, edit or delete rows.
--   2. A "city_insights_public" view: the APPROVED interviews only, and
--      only the columns safe to show (never the submitter's email). This
--      is what city.html reads.
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql / city-events-setup.sql, so run one of those first.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

-- ---------- 1. The interviews table ----------
create table if not exists public.city_insights (
  id            uuid primary key default gen_random_uuid(),
  city          text not null,                       -- must match the city name on city.html
  type          text not null check (type in ('traveler','local')),
  name          text not null,                       -- shown on the published interview (the form says so)
  email         text not null,                       -- NEVER public; used for the "you're live" note
  answers       jsonb not null default '[]'::jsonb,  -- [{ "q": question, "a": answer }], answered ones only
  response      text,                                -- free-text fallback for a type with no questions
  published     boolean not null default false,
  pending       boolean not null default true,       -- true = waiting for review
  notified      boolean not null default false,      -- has the submitter been emailed that it's live?
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists city_insights_city_idx
  on public.city_insights (city, type, published);

alter table public.city_insights enable row level security;

create or replace function public.city_insights_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists city_insights_touch on public.city_insights;
create trigger city_insights_touch before update on public.city_insights
  for each row execute function public.city_insights_touch();

-- Admins only, for everything. Visitor submissions come in through the
-- Netlify function with the service key, which bypasses these policies.
drop policy if exists "admins read insights" on public.city_insights;
create policy "admins read insights" on public.city_insights
  for select using (public.is_blog_admin());

drop policy if exists "admins update insights" on public.city_insights;
create policy "admins update insights" on public.city_insights
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete insights" on public.city_insights;
create policy "admins delete insights" on public.city_insights
  for delete using (public.is_blog_admin());

-- ---------- 2. The public view: approved interviews, no email ----------
-- A view runs with its owner's rights, so it can read the table even though
-- visitors can't; the WHERE clause and column list are the whole of what
-- the public ever sees.
create or replace view public.city_insights_public as
  select id, city, type, name, answers, response, published_at, created_at
  from public.city_insights
  where published = true;

grant select on public.city_insights_public to anon, authenticated;
