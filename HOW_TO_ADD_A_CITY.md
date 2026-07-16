# How to add a new city to Never Roam Alone

This is the full process, in plain terms. You don't need to touch any code — you just need to ask, review, and do two small manual steps.

## 1. Ask for it

Tell Claude something like "add Marrakech" or "add Prague, Czechia." If there's more than one real place with that name (e.g. "Valencia" is a city in both Spain and Venezuela), Claude will ask which one you mean before doing anything.

## 2. Let Claude research and install it

Claude will look up the real facts about the city (costs, neighborhoods, airport, transit, day trips, etc.) and then run a script that adds it everywhere the site needs it — the city's own page, the homepage map, the city directory, the destination finder, the sitemap, and so on. This takes a few minutes since it's doing real research, not just filling in a template.

## 3. Read the report

When it's done, Claude will tell you plainly what got added and what still needs your attention. Usually that's just one thing:

## 4. Drop in a real photo

If the report says the photo is missing, save a real photo of the city to the `images/cities/` folder, named to match the city (lowercase, spaces become dashes — e.g. "Cape Town" → `cape-town.jpg`). Claude will tell you the exact filename to use.

That's it — you don't need to do anything else with the photo. The script now automatically hooks it up to the page the moment it sees the file (this used to be a two-step process and caused the Ibiza issue; it's fixed now).

## 5. Push it live

Nothing on this site goes live by itself — every change, including a new city, needs:
1. A `git push` from your project folder, and
2. Letting Netlify finish its redeploy (usually a couple of minutes).

Ask Claude to do the push if you'd like it handled, or do it yourself if you prefer.

## A few things worth knowing

- **It's safe to ask twice.** If you ask for a city that's already on the site, Claude will tell you instead of duplicating it.
- **Optional extras** (day trips, curated "vibe" scores, ferry/train/bus details) get added when real information is available, but aren't required — Claude will flag anything skipped rather than guess or make it up.
- **You never need to hand-edit any of the site's files** for a new city. If you ever see Claude (or anyone) suggest doing that by hand, that's a red flag — it's how a city (Jeddah) once fell out of sync across the site.
