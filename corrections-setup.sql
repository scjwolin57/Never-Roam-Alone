-- =====================================================================
-- CORRECTIONS-SETUP.SQL — run this ONCE in Supabase (SQL Editor →
-- New query → paste → Run). It creates the approve step for corrections
-- (Jeff, 2026-10-09: "check for an approval step, if none present, create
-- one"). A correction is 5 contribution points (contribution-points-setup.sql).
--
--   1. A "corrections" table. When a visitor picks "Something in a city
--      guide is wrong or out of date" on the feedback page, the message is
--      saved here as PENDING by netlify/functions/feedback.js (it is still
--      emailed too). Only admins (the blog_admins list) can read, change or
--      delete rows; there is no public view.
--   2. Admin → Suggestions → Corrections: "Mark fixed" goes through
--      netlify/functions/approve-correction.js once the guide (citydata and
--      the sheet) has been fixed and pushed. It records what was changed,
--      gives a signed-in member their 5 points once, and thanks the sender.
--
-- This REUSES the admin list + is_blog_admin() helper created by
-- blog-setup.sql / city-events-setup.sql, so run one of those first.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

create table if not exists public.corrections (
  id            uuid primary key default gen_random_uuid(),
  page          text,                                -- the page URL the visitor gave (optional)
  message       text not null,                       -- what is wrong
  name          text,                                -- optional
  email         text not null,                       -- required by the feedback form; NEVER public
  has_screenshot boolean not null default false,     -- the screenshot itself is only in the email
  user_id       uuid references auth.users(id) on delete set null,   -- the signed-in member who sent it, if any
  status        text not null default 'pending' check (status in ('pending','fixed','declined')),
  fix_note      text,                                -- what the admin changed (typed at "Mark fixed")
  fixed_at      timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists corrections_status_idx
  on public.corrections (status, created_at desc);

alter table public.corrections enable row level security;

create or replace function public.corrections_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  if new.status = 'fixed' and old.status is distinct from 'fixed' then new.fixed_at = now(); end if;
  return new;
end;
$$;
drop trigger if exists corrections_touch on public.corrections;
create trigger corrections_touch before update on public.corrections
  for each row execute function public.corrections_touch();

-- Admins only, for everything. Submissions come in through the Netlify
-- function with the service key, which bypasses these policies.
drop policy if exists "admins read corrections" on public.corrections;
create policy "admins read corrections" on public.corrections
  for select using (public.is_blog_admin());

drop policy if exists "admins update corrections" on public.corrections;
create policy "admins update corrections" on public.corrections
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete corrections" on public.corrections;
create policy "admins delete corrections" on public.corrections
  for delete using (public.is_blog_admin());
