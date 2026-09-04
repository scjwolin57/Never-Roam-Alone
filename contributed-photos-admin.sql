-- Never Roam Alone — let admins see the contributed-photo queue on admin.html.
-- Pairs with the Photos tab in admin.html.
--
-- Run in the Supabase SQL editor, after contributed-photos-public.sql.
-- Safe to run more than once.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- READ ONLY, on purpose. These two policies let an admin LOOK at the queue and
-- at the photos still under review. Deciding on one still goes through the
-- approve-photo function with the service key, exactly as the email buttons do,
-- so there is one code path that publishes a photo and one place to change it.
-- Nothing here grants insert, update or delete to anybody.

-- 1. The queue itself. Contributors keep seeing only their own submissions
--    (lpc_read_own, unchanged); this adds admins seeing all of them.
drop policy if exists lpc_read_admin on public.landmark_photo_contributions;
create policy lpc_read_admin on public.landmark_photo_contributions
  for select to authenticated
  using (public.is_blog_admin());

-- 2. The photos still under review. They live in the private bucket, so the
--    admin page asks Supabase for a short-lived signed link to show a
--    thumbnail — which needs read access to the object. Admins only: the
--    bucket stays closed to everyone else, and stays closed to writes.
drop policy if exists lpc_read_admin_files on storage.objects;
create policy lpc_read_admin_files on storage.objects
  for select to authenticated
  using (bucket_id = 'landmark-contributions' and public.is_blog_admin());
