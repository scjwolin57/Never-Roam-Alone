-- =====================================================================
-- PROFILE-EXTRAS-SETUP.SQL — one-time setup for the expanded profile.
--
-- What this does, in plain English:
--   1. Adds the new optional profile fields: age, favorite / wouldn't-
--      go-back / bucket-list destinations, best travel story, weirdest
--      or scariest moment, "anything else about me", and four more
--      social links (Facebook, X/Twitter, TikTok, YouTube).
--   2. Adds a place to keep each Roamer's favorite travel photos
--      (up to 10, with taglines — the limit is enforced by the site).
--   3. Creates the online photo storage: a "travel-photos" folder
--      where each person can only add/delete photos in their OWN
--      space, but anyone can view them (they only appear on
--      profiles that were switched to public).
--   4. Refreshes the safe public "window" so the new fields show on
--      public profile pages. Email is still never exposed.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- =====================================================================

-- 1 + 2. New profile columns (all optional)
alter table public.profiles
  add column if not exists cover_url               text,   -- custom profile banner photo
  add column if not exists age                     text,
  add column if not exists fav_destination         text,
  add column if not exists no_return_destination   text,
  add column if not exists bucket_list_destination text,
  add column if not exists best_story              text,
  add column if not exists scary_story             text,
  add column if not exists extra_details           text,
  add column if not exists facebook                text,
  add column if not exists twitter                 text,
  add column if not exists tiktok                  text,
  add column if not exists youtube                 text,
  add column if not exists travel_photos           jsonb not null default '[]'::jsonb;

-- 3. Photo storage: public to view, but people can only manage photos
--    inside a folder named after their own account id. Photos are
--    capped at 5 MB each and must be images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('travel-photos', 'travel-photos', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "travel photos are public"      on storage.objects;
drop policy if exists "upload own travel photos only" on storage.objects;
drop policy if exists "delete own travel photos only" on storage.objects;

create policy "travel photos are public" on storage.objects
  for select using (bucket_id = 'travel-photos');

create policy "upload own travel photos only" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'travel-photos'
              and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete own travel photos only" on storage.objects
  for delete to authenticated
  using (bucket_id = 'travel-photos'
         and (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Refresh the public window with the new fields (still no email,
--    still only rows where the person turned "public profile" on).
--    We rebuild it from scratch: a view stores no data — it's just a
--    saved way of looking at the profiles table — so dropping and
--    recreating it is harmless, and it sidesteps the database rule
--    that view columns can only be added at the end.
drop view if exists public.public_profiles;
create view public.public_profiles as
  select id,
         display_name,
         bio,
         home_city,
         home_country,
         travel_style,
         travel_company,
         website,
         instagram,
         avatar_url,
         cover_url,
         created_at,
         age,
         fav_destination,
         no_return_destination,
         bucket_list_destination,
         best_story,
         scary_story,
         extra_details,
         facebook,
         twitter,
         tiktok,
         youtube,
         travel_photos
    from public.profiles
   where is_public = true;

grant select on public.public_profiles to anon, authenticated;
