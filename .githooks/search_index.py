#!/usr/bin/env python3
"""search-index.js: the names-only list behind the homepage search box.

The homepage search finds landmarks and day trips by name. The full catalogs
(city-landmarks.js, day-trips.js) are about 935 KB compressed because they also
carry every blurb, photo and credit; this list holds only each name and its
city (about 126 KB compressed). It is a COPY, so it is never edited by hand:

    python3 .githooks/search_index.py build     rebuild search-index.js
    python3 .githooks/search_index.py check     is the file on disk current?
    python3 .githooks/search_index.py check --staged
        what .githooks/pre-commit runs: when a commit stages either catalog or
        the list, the list is rebuilt from the STAGED catalogs and compared
        with the STAGED list. A Claude session's commit is refused when they
        differ; a Terminal commit only gets the warning.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = "search-index.js"
SOURCES = (("city-landmarks.js", "NRA_LANDMARKS"), ("day-trips.js", "NRA_DAYTRIPS"))
HEAD = ("/* Never Roam Alone: names for the homepage search box (landmarks and day trips\n"
        "   per city). BUILT by .githooks/search_index.py from city-landmarks.js and\n"
        "   day-trips.js. Never edit by hand: run  python3 .githooks/search_index.py build */\n")


def parse(text, var):
    i = text.index("window." + var)
    return json.loads(text[text.index("{", i):text.rindex("}") + 1])


def build(landmarks_js, daytrips_js):
    lm, dt = parse(landmarks_js, "NRA_LANDMARKS"), parse(daytrips_js, "NRA_DAYTRIPS")
    out = {"l": {}, "d": {}}
    for city, rows in lm.items():
        names = [(r[0] if isinstance(r, list) else r.get("name")) for r in rows or []]
        names = [n for n in names if n]
        if names:
            out["l"][city] = names
    for city, groups in dt.items():
        names = [t.get("name") for k in ("half", "full") for t in (groups or {}).get(k) or []]
        names = [n for n in names if n]
        if names:
            out["d"][city] = names
    return HEAD + "window.NRA_SEARCH=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"


def disk(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as f:
        return f.read()


def staged(name):
    r = subprocess.run(["git", "show", ":" + name], cwd=ROOT, capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def main(argv):
    cmd = argv[1] if len(argv) > 1 else ""
    if cmd == "build":
        text = build(disk(SOURCES[0][0]), disk(SOURCES[1][0]))
        path = os.path.join(ROOT, OUT)
        old = open(path, encoding="utf-8").read() if os.path.exists(path) else None
        if old != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
        d = json.loads(text[text.index("{"):text.rindex("}") + 1])
        print("%s %s: %d landmarks, %d day trips" % (OUT, "unchanged" if old == text else "written",
              sum(map(len, d["l"].values())), sum(map(len, d["d"].values()))))
        return 0
    if cmd == "check":
        if "--staged" in argv:
            r = subprocess.run(["git", "diff", "--cached", "--name-only"], cwd=ROOT, capture_output=True)
            names = set(r.stdout.decode("utf-8").split("\n"))
            if not names & {OUT, SOURCES[0][0], SOURCES[1][0]}:
                return 0
            src = [staged(SOURCES[0][0]), staged(SOURCES[1][0])]
            have = staged(OUT)
        else:
            src = [disk(SOURCES[0][0]), disk(SOURCES[1][0])]
            have = disk(OUT) if os.path.exists(os.path.join(ROOT, OUT)) else None
        if None in src:
            return 0  # a catalog is being removed; nothing to compare against
        if have == build(*src):
            if "--staged" not in argv:
                print(OUT + " is current")
            return 0
        claude = bool(os.environ.get("CLAUDE_CODE_SESSION_ID"))
        print("search-index.js is out of date with city-landmarks.js / day-trips.js.\n"
              "  The homepage search would miss or mis-link a landmark or day trip.\n"
              "  Fix:  python3 .githooks/search_index.py build   then stage search-index.js\n"
              + ("  Commit refused." if claude and "--staged" in argv else "  (warning only)"), file=sys.stderr)
        return 1 if (claude or "--staged" not in argv) else 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
