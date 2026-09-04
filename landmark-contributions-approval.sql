-- Never Roam Alone — one-click photo review from the submission email.
-- Pairs with netlify/functions/approve-photo.js.
--
-- Run in the Supabase SQL editor, after landmark-contributions-any-photo.sql.
-- Purely additive and safe to run more than once.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. What the review decision leaves behind. `published_path` is the file's
--    key in the public bucket; it stays null for anything turned down, so the
--    column doubles as "is this photo actually live".
alter table public.landmark_photo_contributions
  add column if not exists reviewed_at    timestamptz,
  add column if not exists published_path text,
  add column if not exists notified       boolean not null default false;

create index if not exists lpc_published_idx
  on public.landmark_photo_contributions (city, status)
  where status = 'approved';

-- 2. The public bucket approved photos are copied into. The review bucket
--    (landmark-contributions) stays private: submissions are only readable by
--    the service key until you publish them, and a photo you turn down is
--    never copied here at all.
insert into storage.buckets (id, name, public)
values ('landmark-photos', 'landmark-photos', true)
on conflict (id) do update set public = true;

-- Anyone may read the published bucket; nobody but the service key may write
-- to it. `public = true` covers reads, so this only needs to NOT grant writes.
drop policy if exists lp_public_read on storage.objects;
create policy lp_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'landmark-photos');

-- Note: the site cannot see approved rows yet. Reading them from the browser
-- needs a select policy for status = 'approved', which comes with the change
-- that puts contributed photos on the page. Until then, approving copies the
-- file into the public bucket and marks the row, and nothing else changes.
