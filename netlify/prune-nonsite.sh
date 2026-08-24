#!/usr/bin/env bash
#
# PRUNE-NONSITE.SH — drop non-website files from the deploy before upload.
#
# In plain English: netlify.toml publishes the whole project folder
# (publish = "."), so anything tracked in git that isn't part of the
# website — internal notes, spreadsheets, database setup scripts, build
# artifacts — used to get uploaded to the CDN and was downloadable by
# anyone who guessed the filename. netlify.toml already returns 404 for
# those paths; this script goes one step further and stops them being
# uploaded at all.
#
# WHERE THIS RUNS: only inside Netlify's build, on a throwaway copy of
# the repo that Netlify clones fresh for every deploy. It never touches
# your Mac, and it never changes anything in git — the files stay in the
# repository exactly as they are.
#
# WHAT IT DELIBERATELY KEEPS:
#   netlify/  — Netlify bundles the serverless functions (netlify/functions)
#               and the edge functions (netlify/edge-functions) AFTER this
#               script runs. Deleting them here would ship a site with no
#               working backend and no city link-previews. Their source
#               stays hidden the other way, via the /netlify/* rule in
#               netlify.toml.
#
# The 404 rules in netlify.toml are kept as well, on purpose: if this
# script is ever removed or skipped, those rules still keep the files off
# the public web. Two layers, either one sufficient.
#
# To keep a file public again, remove it from the lists below AND delete
# its rule from netlify.toml.

set -euo pipefail

# --- safety catch -----------------------------------------------------
# Netlify sets NETLIFY=true during a build. Anywhere else — someone's
# laptop, a CI experiment — this script does nothing, because there it
# would be deleting real, irreplaceable work.
if [ "${NETLIFY:-}" != "true" ]; then
  echo "prune-nonsite: NETLIFY is not \"true\" — this is not a Netlify build, so nothing was deleted."
  exit 0
fi

# The publish directory is the repo root, one level up from this script.
cd "$(dirname "$0")/.."

removed=0
kept_bytes=0

drop() {
  local target
  for target in "$@"; do
    # A glob that matched nothing arrives here as the literal pattern,
    # and -e is false for it, so unmatched patterns are simply skipped.
    if [ -e "$target" ]; then
      rm -rf -- "$target"
      removed=$((removed + 1))
      echo "  removed  $target"
    fi
  done
}

echo "prune-nonsite: removing files that are not part of the website"

# Whole folders: city-guide build artifacts, and internal working notes
# and data backups.
drop outputs _needs-attention

# Project notes and editor config.
drop CLAUDE.md README.md SETUP-LOGIN.md HOW_TO_ADD_A_CITY.md \
     citypagesummary.md monetization-plan.md summary.md \
     never-roam-alone.code-workspace outputs_tmp_ignore.txt

# Database setup scripts. Globbed rather than listed, so a new *.sql file
# added later is pruned automatically instead of quietly going public.
drop ./*.sql

# Spreadsheets, data exports, and the local-only data build script.
drop ./*.xlsx ./*.numbers world-cities-master.csv world-cities-data.json \
     poi-density.mjs "Pyramids Pic.HEIC"

echo "prune-nonsite: done — $removed item(s) removed from the deploy."

# Sanity check: the site's own entry points must have survived. If any of
# these is missing, something in this script is wrong, and failing the
# build is much better than publishing a broken site (Netlify keeps the
# previous deploy live when a build fails).
for required in index.html city.html cities.html auth.js nav.js \
                citydata/_index.json netlify/functions netlify/edge-functions; do
  if [ ! -e "$required" ]; then
    echo "prune-nonsite: ERROR — $required is missing after pruning. Failing the build." >&2
    exit 1
  fi
done
echo "prune-nonsite: site entry points and netlify/ verified present."
