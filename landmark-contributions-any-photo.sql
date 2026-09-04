-- Never Roam Alone — widen the photo-contribution table beyond landmarks,
-- and keep a proper record of the licence each contributor signed.
--
-- Run in the Supabase SQL editor. Purely additive: every column is new and
-- nullable (or has a default), so existing rows and the existing function
-- keep working while the new form rolls out. Safe to run more than once.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. Which photo slot the contribution is for. The `landmark` column keeps
--    holding the subject's name whatever the slot is, so nothing that already
--    reads this table needs to change.
alter table public.landmark_photo_contributions
  add column if not exists subject_kind    text not null default 'landmark',
  add column if not exists subject_label   text,
  add column if not exists subject_context text;

-- Drop first so re-running with a changed list actually takes effect.
alter table public.landmark_photo_contributions
  drop constraint if exists lpc_subject_kind_chk;
alter table public.landmark_photo_contributions
  add constraint lpc_subject_kind_chk check (
    subject_kind in ('landmark','city-hero','neighborhood-hero','food-dish','other'));

-- 2. The signed licence grant. Storing the wording itself (not just a version
--    string) is the point: it proves what a contributor agreed to on the day,
--    even after the wording is rewritten. Never edit these rows.
alter table public.landmark_photo_contributions
  add column if not exists signature       text,
  add column if not exists license_version text,
  add column if not exists license_text    text,
  add column if not exists agreed_at       timestamptz,
  add column if not exists page_url        text;

-- 3. A profile credit is only meaningful when it points at a real account.
--    submitted_by is filled by the contribute-photo function after it verifies
--    the visitor's access token with Supabase — the browser never asserts it.
alter table public.landmark_photo_contributions
  drop constraint if exists lpc_profile_credit_chk;
alter table public.landmark_photo_contributions
  add constraint lpc_profile_credit_chk check (
    credit_mode <> 'profile' or submitted_by is not null) not valid;
-- `not valid` on purpose: the rule applies to every new row, but older rows
-- from before profile credits required an account are left alone rather than
-- blocking the migration.

create index if not exists lpc_kind_idx on public.landmark_photo_contributions (subject_kind, status);

-- Reading is unchanged: contributors see their own rows, nobody else, and all
-- writes still go through the Netlify function with the service key.
