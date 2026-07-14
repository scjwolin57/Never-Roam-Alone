-- =====================================================================
-- FORUM-ADMIN-SETUP.SQL — run this ONCE in Supabase (SQL Editor → New
-- query → paste → Run) to let blog admins delete Ask a Roamer questions
-- and replies from the Manage Posts admin page.
--
-- Why this is needed: the forum's questions/replies tables (created by
-- supabase-setup.sql) only have rules for reading and posting — nobody
-- can delete a row yet, not even the site owner. This adds "admins can
-- delete" rules, reusing the same is_blog_admin() check that already
-- protects the blog's admin pages.
--
-- Run blog-setup.sql FIRST if you haven't already (it's what creates
-- is_blog_admin() and the blog_admins list of who counts as an admin).
--
-- Safe to re-run.
-- =====================================================================

drop policy if exists "admins delete questions" on public.questions;
create policy "admins delete questions" on public.questions
  for delete using (public.is_blog_admin());

drop policy if exists "admins delete replies" on public.replies;
create policy "admins delete replies" on public.replies
  for delete using (public.is_blog_admin());
