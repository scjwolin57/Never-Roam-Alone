-- =====================================================================
-- PLACE-SUGGESTIONS-SETUP.SQL — run this ONCE in Supabase (SQL Editor →
-- New query → paste → Run). It creates what the "Suggest a place" button
-- at the bottom of each neighborhood card on city.html needs (Where to
-- stay / eat / coffee & takeaway / drink):
--
--   1. A "place_suggestions" table. Every suggestion a visitor sends is
--      saved here as PENDING by netlify/functions/submit-suggestion.js.
--      Only admins (the blog_admins list) can read, change or delete rows.
--      There is no public view: a suggestion is never shown on the site.
--      A venue reaches the guide only through the normal hood-picks checks
--      and the sheet; "published" here just records that it did, and
--      triggers the thank-you (approve-suggestion.js).
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql / city-events-setup.sql, so run one of those first.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

create table if not exists public.place_suggestions (
  id            uuid primary key default gen_random_uuid(),
  city          text not null,                       -- the city name on city.html
  hood_idx      integer,                             -- which neighborhood (0-4, CITY_HOODS order)
  hood_name     text not null,
  section       text not null check (section in ('stay','eat','cafes','bars')),
  kind          text not null,                       -- the listing it is for: a lodging tier key (High-end / Mid-range / Budget) or an eat / cafes / bars kind key
  kind_label    text,                                -- what the visitor saw in the dropdown, e.g. "Cocktail bar"
  maps_url      text not null,                       -- Google Maps link to the place (required)
  website_url   text,                                -- optional
  info          text,                                -- optional notes from the visitor
  contact       boolean not null default false,      -- wants to hear when it is published
  email         text,                                -- only for a visitor who is NOT signed in and asked to be contacted; NEVER public
  user_id       uuid references auth.users(id) on delete set null,   -- the signed-in member who sent it, if any
  status        text not null default 'pending' check (status in ('pending','published','declined')),
  notified      boolean not null default false,      -- has the "it's live" message/email gone out?
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists place_suggestions_status_idx
  on public.place_suggestions (status, created_at desc);

alter table public.place_suggestions enable row level security;

create or replace function public.place_suggestions_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists place_suggestions_touch on public.place_suggestions;
create trigger place_suggestions_touch before update on public.place_suggestions
  for each row execute function public.place_suggestions_touch();

-- Admins only, for everything. Visitor submissions come in through the
-- Netlify function with the service key, which bypasses these policies.
drop policy if exists "admins read suggestions" on public.place_suggestions;
create policy "admins read suggestions" on public.place_suggestions
  for select using (public.is_blog_admin());

drop policy if exists "admins update suggestions" on public.place_suggestions;
create policy "admins update suggestions" on public.place_suggestions
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete suggestions" on public.place_suggestions;
create policy "admins delete suggestions" on public.place_suggestions
  for delete using (public.is_blog_admin());
