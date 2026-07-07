-- =====================================================================
-- MAILING-LIST-SETUP.SQL — one-time setup for the email mailing list.
--
-- Creates one table, "mailing_list", that holds the email addresses
-- people sign up with (from the forms on the site and the opt-in
-- checkbox on sign-up / their profile).
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once ("if not exists" skips anything
-- that's already there).
--
-- TO SEE / EXPORT YOUR LIST later: Supabase → Table Editor →
-- mailing_list. The list is private — only you (through the Supabase
-- dashboard) can read it; visitors can add themselves but can't see
-- who else is on it.
-- =====================================================================

create table if not exists public.mailing_list (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,          -- stored lower-cased so we don't get duplicates
  source      text,                          -- which form they used (e.g. "index", "profile", "signup")
  user_id     uuid references auth.users(id) on delete set null,  -- set if they were signed in
  confirmed   boolean not null default false, -- reserved for future double opt-in
  created_at  timestamptz not null default now()
);

alter table public.mailing_list enable row level security;

-- Anyone (signed in or not) can add an email address. They cannot read
-- the list back, so the form can't be used to see who's subscribed.
drop policy if exists "anyone can subscribe" on public.mailing_list;
create policy "anyone can subscribe" on public.mailing_list
  for insert with check (true);

-- A signed-in person can see, update, and remove ONLY their own row —
-- this powers the mailing-list checkbox on their profile page.
drop policy if exists "see own subscription" on public.mailing_list;
create policy "see own subscription" on public.mailing_list
  for select using (auth.uid() = user_id);

drop policy if exists "update own subscription" on public.mailing_list;
create policy "update own subscription" on public.mailing_list
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "remove own subscription" on public.mailing_list;
create policy "remove own subscription" on public.mailing_list
  for delete using (auth.uid() = user_id);
