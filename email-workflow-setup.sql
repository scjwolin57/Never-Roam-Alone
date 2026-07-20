-- =====================================================================
-- EMAIL-WORKFLOW-SETUP.SQL — one-time setup for sending emails to the
-- mailing list (newsletters + "new blog post" announcements).
--
-- Adds two columns to the existing mailing_list table:
--   unsubscribed - true once someone clicks the unsubscribe link
--   interests    - optional list of regions they said they care about
-- and one new table, email_broadcasts, that records every email blast
-- so the same post is never accidentally sent twice.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- =====================================================================

alter table public.mailing_list
  add column if not exists unsubscribed boolean not null default false;

alter table public.mailing_list
  add column if not exists interests text[];

-- ---------------------------------------------------------------------
-- A log of every email blast that went out (one row per send).
--   kind    - "post" (blog announcement) or "custom" (manual newsletter)
--   ref     - for posts, the post slug — used to block double-sends
-- ---------------------------------------------------------------------
create table if not exists public.email_broadcasts (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null default 'custom',
  ref         text,
  subject     text not null,
  sent_count  integer not null default 0,
  sent_by     text,
  created_at  timestamptz not null default now()
);

alter table public.email_broadcasts enable row level security;

-- Admins (the blog_admins list) can view the send history from the
-- Admin page. Nobody can insert/update from the browser — only the
-- server function (service key) writes rows.
drop policy if exists "admins can view broadcasts" on public.email_broadcasts;
create policy "admins can view broadcasts" on public.email_broadcasts
  for select using (
    lower(coalesce(auth.jwt() ->> 'email', '')) in
      (select lower(email) from public.blog_admins)
  );

-- ---------------------------------------------------------------------
-- Tiny key/value settings table — currently holds one switch:
--   notify_new_subscriber = 'on' | 'off'
-- ('on' when missing.) Toggled from the Admin page Emails tab.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "admins read settings" on public.site_settings;
create policy "admins read settings" on public.site_settings
  for select using (
    lower(coalesce(auth.jwt() ->> 'email', '')) in
      (select lower(email) from public.blog_admins)
  );

drop policy if exists "admins add settings" on public.site_settings;
create policy "admins add settings" on public.site_settings
  for insert with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) in
      (select lower(email) from public.blog_admins)
  );

drop policy if exists "admins change settings" on public.site_settings;
create policy "admins change settings" on public.site_settings
  for update using (
    lower(coalesce(auth.jwt() ->> 'email', '')) in
      (select lower(email) from public.blog_admins)
  );
