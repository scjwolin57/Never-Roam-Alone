-- FIX: remove the anonymous write policies created by the FIRST version of
-- landmark-contributions-setup.sql.
--
-- Why this is needed: the first version granted anon INSERT on the table and
-- anon upload on the bucket, because the browser wrote submissions directly.
-- Once submissions moved to the contribute-photo Netlify function (which uses
-- the service key), those grants became unnecessary — but the revised setup
-- file only stopped CREATING them, it never DROPPED the ones already in place.
-- Re-running the setup file therefore cannot close the hole. This does.
--
-- Verified live 2026-09-01: an anon key could insert a row (HTTP 201) and
-- upload a file into the bucket (HTTP 200) without going through the function.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once.

-- 1. Close the write holes.
drop policy if exists lpc_insert on public.landmark_photo_contributions;
drop policy if exists lpc_upload on storage.objects;

-- 2. Clear the rows left by the live test.
delete from public.landmark_photo_contributions
 where credit_name = 'TEST SUBMISSION - please delete'
    or (city = 'x' and landmark = 'y');

-- Reading is unchanged: contributors see their own rows, nobody else.
-- (Anon SELECT already returned an empty set — that part was working.)
--
-- NOTE: storage files are NOT deleted here. Supabase blocks direct deletes
-- from storage.objects ("Use the Storage API instead"), and that error aborts
-- the whole script. Remove the two test files by hand instead:
--   Storage -> landmark-contributions ->
--     probe/anon-test.jpg   (from the security probe)
--     agadez/<timestamp>.jpg (the real test submission)
