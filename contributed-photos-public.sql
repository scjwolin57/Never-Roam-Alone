-- Never Roam Alone — let the site read approved contributed photos.
-- Pairs with contributed-photos.js and netlify/functions/approve-photo.js.
--
-- Run in the Supabase SQL editor, after landmark-contributions-approval.sql.
-- Safe to run more than once.
--
-- HOW TO RUN: Supabase -> SQL Editor -> New query -> paste -> Run.

-- The browser reads THIS VIEW, never the table. That matters: the table also
-- holds the licence record — the contributor's typed legal name, the wording
-- they signed, the page they submitted from — and none of that belongs on the
-- public web. The view exposes only what it takes to put a photo on the page
-- and credit it, and only for rows you have approved.
--
-- The view is deliberately NOT security_invoker: it runs as its owner, so it
-- can read the table while the table's own row-level security keeps everyone
-- else out. (Supabase's linter flags this pattern; here it is the point.)
create or replace view public.published_photos as
select
  c.id,
  c.city,
  c.country,
  c.subject_kind,
  c.landmark        as subject,     -- the subject's name, whatever the slot
  c.landmark_idx,
  c.subject_context,
  c.published_path,
  c.taken_year,
  c.credit_mode,
  -- A name credit shows what they typed; a profile credit shows the display
  -- name on their profile, so it follows them if they rename themselves.
  case c.credit_mode
    when 'name'    then c.credit_name
    when 'profile' then p.display_name
  end as credit_name,
  case when c.credit_mode = 'profile' then c.submitted_by end as credit_profile_id,
  c.work_url,
  c.reviewed_at
from public.landmark_photo_contributions c
left join public.profiles p on p.id = c.submitted_by
where c.status = 'approved'
  and c.published_path is not null;

grant select on public.published_photos to anon, authenticated;

-- The underlying table's policies are unchanged: contributors still see only
-- their own submissions, and every write still goes through the Netlify
-- functions with the service key.
