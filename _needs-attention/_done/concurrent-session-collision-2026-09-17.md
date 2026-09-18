# Concurrent-session commit collision, 2026-09-17

While running the gym-research batch job (never-roam-alone-63), I committed
`5f9d5b1d` ("Gym research resume note: batch 26 done, 650/893") intending to
touch only `_needs-attention/RESUME_gym-research.md`. I ran `git status
--short -- _needs-attention/RESUME_gym-research.md` (scoped to that one path)
instead of a full `git status --short`, so I didn't see that another
concurrent session had already staged a deletion of `coming-soon.html` and
`netlify/edge-functions/gatekeeper.js.disabled` in the shared index. `git
commit` commits whatever is staged, not just the path I `git add`ed, so both
deletions rode along into my commit under my message.

Fixed in `af67e7e9`: restored both files byte-identical to their
pre-deletion content (confirmed via `git diff --cached HEAD^` showing no
diff after re-adding).

**If you are the session that was deleting these two files on purpose**
(disabling the site-wide coming-soon gate) — sorry for the whiplash. Your
change is reverted, not lost: re-delete them whenever you're ready to land
that deliberately, and it'll go out under your own commit as intended.

**Lesson for future sessions:** before any commit, run unscoped `git status
--short` (no path filter), not `git status --short -- <my file>`. The
pathspec-scoped form only shows whether *your* path is dirty — it hides
other paths staged by a concurrent session that would still get swept into
your commit.
