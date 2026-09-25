#!/usr/bin/env python3
"""Task board: which session is changing which file, so parallel sessions never sweep up each other's work.

    python3 .githooks/nra_tasks.py board              # every live task, the files it holds, and orphan changes
    python3 .githooks/nra_tasks.py name "hood picks batch 3"
    python3 .githooks/nra_tasks.py claim <path>...    # a file your script changed that the board missed
    python3 .githooks/nra_tasks.py give <path>... --to <session or task name>
    python3 .githooks/nra_tasks.py release <path>...  # you are not going to commit it after all

WHY (decisions.md 2026-09-24)
Every session shares one folder and one git index. A plain `git commit` takes whatever is staged, so one
session's commit kept carrying another session's files, and a sheet change could land without its citydata
side. CLAUDE.md §8 said "stage by path"; sessions still slipped. This makes the rule mechanical.

HOW
- A claim is "this session changed this file and has not committed it yet". Claims are made automatically:
  the Claude Code hooks in .claude/settings.json claim a file on Edit/Write, and after each Bash command they
  claim the files that command changed. A claim ends by itself when the file is clean again (committed or
  reverted), so there is nothing to release after a commit.
- An Edit of a file another live session holds is refused. Risky git commands (add -A, commit -a, stash,
  reset, checkout of a branch, --no-verify ...) are refused for every Claude session.
- The git pre-commit hook refuses a commit from a Claude session when a staged file belongs to another
  session or to nobody, and when the staged sheet and site data disagree (sheet parity on the STAGED copy).
- NRA-MASTER.xlsx is one binary file git cannot merge, so it has ONE holder at a time (decisions.md
  2026-09-25). sheet_write.py refuses to write it while another session holds it (live: wait for that task to
  commit, or it `give`s the sheet to you; closed, or no holder at all: someone must check its uncommitted
  changes and `claim --adopt` them first). It also refuses a city whose citydata another live session holds.
- Jeff's own commits from Terminal (no session id) are never blocked; they print a warning instead.
  `git commit --no-verify` from Terminal skips everything.

The board lives in <git common dir>/nra-tasks/ (never committed, shared by every worktree of this clone).
A session is live while its Claude process runs and it was active in the last 24 hours.
"""
import fcntl, json, os, re, subprocess, sys, tempfile, time

SHEET = "NRA-MASTER.xlsx"             # one holder at a time (decisions.md 2026-09-25)
LIVE_FOR = 24 * 3600
GRACE = 600
PARITY_PATHS = re.compile(r"^(NRA-MASTER\.xlsx|citydata/|city-photos\.js|hood-photos\.js|city-landmark-photos\.js"
                          r"|day-trips\.js|city-scores\.js|city-seasons\.js)")
TOOL = "python3 .githooks/nra_tasks.py"


# ---------------------------------------------------------------- git helpers

def git(args, cwd=None, check=True):
    r = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return r.stdout


def toplevel(start):
    d = os.path.abspath(start)
    while d and not os.path.isdir(d):
        d = os.path.dirname(d)
    try:
        top = git(["rev-parse", "--show-toplevel"], cwd=d).strip()
    except Exception:
        return None
    return top if os.path.isfile(os.path.join(top, ".githooks", "nra_tasks.py")) else None


def board_dir(top):
    common = git(["rev-parse", "--git-common-dir"], cwd=top).strip()
    d = os.path.join(top, common) if not os.path.isabs(common) else common
    d = os.path.join(d, "nra-tasks")
    os.makedirs(d, exist_ok=True)
    return d


def dirty(top):
    """{path: signature} for every changed, deleted or untracked (not ignored) file in this worktree."""
    out = git(["status", "--porcelain=v1", "-z", "--untracked-files=all", "--no-renames"], cwd=top)
    res = {}
    for ent in out.split("\0"):
        if len(ent) < 4:
            continue
        p = ent[3:]
        try:
            st = os.stat(os.path.join(top, p))
            res[p] = [st.st_mtime_ns, st.st_size]
        except FileNotFoundError:
            res[p] = ["deleted"]
    return res


def ignored(top, rel):
    return subprocess.run(["git", "check-ignore", "-q", "--", rel], cwd=top).returncode == 0


def city_of(top, rel):
    m = re.fullmatch(r"citydata/([^/]+)\.json", rel)
    if not m or m.group(1).startswith("_"):
        return None
    try:
        idx = json.load(open(os.path.join(top, "citydata", "_index.json"), encoding="utf-8"))["slug"]
    except Exception:
        return None
    for city, slug in idx.items():
        if slug == m.group(1):
            return city
    return None


def slug_of(top, city):
    try:
        return json.load(open(os.path.join(top, "citydata", "_index.json"), encoding="utf-8"))["slug"].get(city)
    except Exception:
        return None


# ---------------------------------------------------------------- the board

def pid_alive(pid):
    try:
        os.kill(int(pid), 0)
        return True
    except PermissionError:
        return True
    except Exception:
        return False


class Board:
    """Load under an exclusive lock, prune, edit, save. Use as `with Board(top) as b:`."""

    def __init__(self, top):
        self.top = top
        self.dir = board_dir(top)
        self.path = os.path.join(self.dir, "board.json")

    def __enter__(self):
        self.lockf = open(os.path.join(self.dir, "board.lock"), "w")
        fcntl.flock(self.lockf, fcntl.LOCK_EX)
        try:
            self.d = json.load(open(self.path, encoding="utf-8"))
        except Exception:
            self.d = {}
        for k in ("sessions", "claims", "rows", "pending"):
            self.d.setdefault(k, {})
        self.now = time.time()
        self._prune()
        return self

    def __exit__(self, *exc):
        if exc[0] is None:
            tmp = self.path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(self.d, f, indent=1, sort_keys=True)
            os.replace(tmp, self.path)
        fcntl.flock(self.lockf, fcntl.LOCK_UN)
        self.lockf.close()
        return False

    # a claim is keyed by worktree + path, so two worktrees never collide on the same relative path
    def key(self, rel, top=None):
        return (top or self.top) + "\t" + rel

    def _prune(self):
        tops = {k.split("\t", 1)[0] for k in self.d["claims"]} | {k.split("\t", 1)[0] for k in self.d["rows"]}
        dirt = {}
        for t in tops:
            try:
                dirt[t] = dirty(t) if os.path.isdir(t) else {}
            except Exception:
                dirt[t] = {}
        # a claim ends once its file is clean again (committed or reverted); a claim made just before the write
        # it covers is kept until the file has been seen dirty, or GRACE has passed
        for group, path_of in (("claims", lambda k: k.split("\t", 1)[1]), ("rows", lambda k: "NRA-MASTER.xlsx")):
            for k in list(self.d[group]):
                c = self.d[group][k]
                if path_of(k) in dirt.get(k.split("\t", 1)[0], {}):
                    c["seen"] = True
                elif c.get("seen") or self.now - c.get("since", 0) > GRACE:
                    del self.d[group][k]
        for k, v in list(self.d["pending"].items()):
            if self.now - v.get("t", 0) > 86400:
                del self.d["pending"][k]
        for sid, s in list(self.d["sessions"].items()):
            held = any(sid in c["owners"] for c in self.d["claims"].values()) or \
                any(r["owner"] == sid for r in self.d["rows"].values())
            if not held and not self.live(sid) and self.now - s.get("last_seen", 0) > 7 * 86400:
                del self.d["sessions"][sid]

    def live(self, sid):
        s = self.d["sessions"].get(sid)
        if not s:
            return False
        if s.get("pid") and not pid_alive(s["pid"]):
            return False
        return self.now - s.get("last_seen", 0) < LIVE_FOR

    def touch(self, sid, pid=None, cwd=None):
        s = self.d["sessions"].setdefault(sid, {"first_seen": self.now, "name": ""})
        s["last_seen"] = self.now
        if pid:
            s["pid"] = pid
        if cwd:
            s["cwd"] = cwd
        return s

    def label(self, sid):
        s = self.d["sessions"].get(sid, {})
        name = s.get("name") or "unnamed task"
        ago = int((self.now - s.get("last_seen", self.now)) / 60)
        state = "live" if self.live(sid) else "NOT live"
        return f"'{name}' (session {sid[:8]}, {state}, last active {ago} min ago)"

    def owners(self, rel, top=None):
        c = self.d["claims"].get(self.key(rel, top))
        return list(c["owners"]) if c else []

    def claim(self, sid, rel, how, top=None):
        k = self.key(rel, top)
        c = self.d["claims"].get(k)
        if c is None:
            self.d["claims"][k] = {"owners": [sid], "since": self.now, "how": how}
        elif sid not in c["owners"]:
            c["owners"] = [sid]
            c["since"], c["how"] = self.now, how

    def row_holders(self, city, top=None):
        """Sessions holding a sheet row (any tab) for this city."""
        t = top or self.top
        return {r["owner"] for k, r in self.d["rows"].items()
                if k.split("\t")[0] == t and k.split("\t")[2] == city}

    def find_session(self, who):
        hits = [s for s in self.d["sessions"] if s.startswith(who)] or \
            [s for s, v in self.d["sessions"].items() if who.lower() in (v.get("name") or "").lower()]
        if len(hits) != 1:
            raise SystemExit(f"'{who}' matches {len(hits)} sessions; use more of the session id from `board`.")
        return hits[0]

    # ---- the text every session sees
    def render(self, me=None, only_others=False):
        by = {}
        for k, c in self.d["claims"].items():
            t, rel = k.split("\t", 1)
            for o in c["owners"]:
                by.setdefault(o, []).append(rel if t == self.top else f"{rel}  [{os.path.basename(t)}]")
        rows = {}
        for k, r in self.d["rows"].items():
            _, sheet, city = k.split("\t")
            rows.setdefault(r["owner"], set()).add(f"{sheet}: {city}")
        lines = []
        for sid in sorted(self.d["sessions"], key=lambda s: -self.d["sessions"][s].get("last_seen", 0)):
            if only_others and sid == me:
                continue
            if not self.live(sid) and sid not in by and sid not in rows:
                continue
            tag = "  <- you" if sid == me else ""
            lines.append(f"- {self.label(sid)}{tag}")
            files = sorted(by.get(sid, []))
            for f in files[:12]:
                lines.append(f"    {f}")
            if len(files) > 12:
                lines.append(f"    ... and {len(files) - 12} more files")
            r = sorted(rows.get(sid, []))
            if r:
                lines.append(f"    sheet rows: {', '.join(r[:10])}" + (f" ... +{len(r) - 10}" if len(r) > 10 else ""))
        try:
            orphans = sorted(set(dirty(self.top)) - {k.split("\t", 1)[1] for k in self.d["claims"]
                                                     if k.split("\t", 1)[0] == self.top})
        except Exception:
            orphans = []
        if orphans:
            lines.append("- uncommitted changes no task has claimed (a session without the hooks, or Jeff):")
            lines += [f"    {o}" for o in orphans[:15]]
            if len(orphans) > 15:
                lines.append(f"    ... and {len(orphans) - 15} more")
        return "\n".join(lines)


# ---------------------------------------------------------------- risky commands

GIT = r"(?:^|[;&|(`\s])git(?:\s+(?:-C\s+\S+|-c\s+\S+|--[\w-]+(?:=\S+)?))*\s+"
SEG_END = r"[^;&|\n]*"


def _flags_before_message(seg):
    """The part of a git commit command before its message, so words in the message are not read as flags."""
    return re.split(r"\s(?:-m|-F|--message|--file|-C|-c)\b|\$\(|[\"']", seg, maxsplit=1)[0]


def risky(cmd):
    """Return a reason string when a Bash command would touch other sessions' work, else None."""
    c = cmd.replace("\\\n", " ")
    if re.search(r"CLAUDE_CODE_SESSION_ID\s*=|unset\s+CLAUDE_CODE_SESSION_ID|env\s+(-\S+\s+)*-u\s*CLAUDE_CODE_SESSION_ID", c):
        return "changing CLAUDE_CODE_SESSION_ID would hide which session is committing."
    if re.search(r"nra_tasks\.py" + SEG_END + r"\s--as\b", c):
        return "`--as` is for Jeff in Terminal only; a session acts as itself. Ask the owner to `give` the file."
    if re.search(r"(\b(rm|mv|cp|tee|truncate|touch)\b|sed\s+-i|>)[^;&|\n]*nra-tasks", c):
        return "the board is written only by nra_tasks.py."
    if re.search(r"core\.hooksPath[\s=]+(?!\.githooks\b)[^\s`'\")]", c) and "--get" not in c:
        return "the hooks path must stay .githooks (it holds the commit check)."
    for m in re.finditer(GIT + r"(add|commit|stash|reset|checkout|switch|restore|clean)\b(" + SEG_END + ")", c):
        verb, rest = m.group(1), " " + m.group(2) + " "
        if verb == "add" and re.search(r"\s(-[a-zA-Z]*[Au][a-zA-Z]*|--all|--update|\.|\./|:/|\*)\s", rest):
            return "`git add -A / . / -u` stages other sessions' files. Stage your own files by path."
        if verb == "commit":
            head = _flags_before_message(rest)
            if re.search(r"\s(-[a-zA-Z]*[an][a-zA-Z]*|--all|--no-verify|--include)\b", head) or "--no-verify" in rest:
                return "`git commit -a / -n / --no-verify` sweeps in or skips checks on other sessions' work."
        if verb == "stash" and not re.match(r"\s+(list|show)\b", rest):
            return "`git stash` moves every session's uncommitted changes, not just yours."
        if verb == "reset" and " -- " not in rest:
            return "`git reset` without `-- <your paths>` unstages or discards other sessions' work."
        if verb == "checkout":
            if " -- " not in rest or re.search(r"\s--\s+(\.|:/)\s", rest):
                return "`git checkout <branch>` moves every session's working folder; `checkout -- .` discards their work."
        if verb == "switch":
            return "`git switch` moves every session's working folder. Use a worktree for branch work."
        if verb == "restore" and re.search(r"\s(\.|:/|\./)\s", rest):
            return "`git restore .` discards other sessions' work. Restore your own files by path."
        if verb == "clean":
            return "`git clean` deletes other sessions' new files."
    return None


# ---------------------------------------------------------------- hooks (Claude Code)

def out(event, context=None, deny=None):
    h = {"hookEventName": event}
    if deny:
        h["permissionDecision"] = "deny"
        h["permissionDecisionReason"] = deny
    if context:
        h["additionalContext"] = context
    print(json.dumps({"hookSpecificOutput": h}))


def hook(event):
    try:
        inp = json.load(sys.stdin)
    except Exception:
        return
    sid, cwd = inp.get("session_id"), inp.get("cwd") or os.getcwd()
    pid = os.environ.get("CLAUDE_PID")
    if not sid:
        return
    tool, ti = inp.get("tool_name", ""), inp.get("tool_input") or {}

    if event == "PreToolUse" and tool == "Bash":
        why = risky(ti.get("command", ""))
        if why:
            return out(event, deny=f"Blocked by the task board: {why} (CLAUDE.md §8; `{TOOL} board` shows who "
                                   "holds what.) If Jeff really wants this, he runs it himself in Terminal.")

    if tool in ("Edit", "Write", "NotebookEdit"):
        p = ti.get("file_path") or ti.get("notebook_path")
        if not p:
            return
        p = os.path.abspath(os.path.join(cwd, p))
        top = toplevel(os.path.dirname(p))
        if not top:
            return
        rel = os.path.relpath(p, top)
        if rel.startswith(".git" + os.sep) or rel == ".git":
            return out(event, deny="Blocked by the task board: files inside .git are not edited by hand.")
        if event != "PreToolUse" or ignored(top, rel):
            return
        with Board(top) as b:
            b.touch(sid, pid, cwd)
            others = [o for o in b.owners(rel) if o != sid]
            live = [o for o in others if b.live(o)]
            city = city_of(top, rel)
            rowlive = [o for o in (b.row_holders(city) if city else ()) if o != sid and b.live(o)]
            if live:
                return out(event, deny=f"Blocked by the task board: {rel} has uncommitted changes from task "
                                       f"{b.label(live[0])}. Do not edit it; tell Jeff. The owner can hand it over "
                                       f"with `{TOOL} give {rel} --to {sid[:8]}`.")
            if rowlive:
                return out(event, deny=f"Blocked by the task board: task {b.label(rowlive[0])} has uncommitted "
                                       f"sheet rows for {city}; changing {rel} now would split that city between "
                                       "two commits. Tell Jeff, or wait until that task commits.")
            note = None
            was_dirty = rel in dirty(top)
            if others:
                note = (f"Task board: {rel} was held by {b.label(others[0])}, which is no longer live. It is yours "
                        f"now; check `git diff -- {rel}` for their unfinished changes before you commit it.")
            elif was_dirty and not b.owners(rel):
                note = (f"Task board: {rel} already had uncommitted changes that no task claimed (another session or "
                        f"Jeff). They will ride in your commit if you commit this file; check `git diff -- {rel}` "
                        "first and tell Jeff if they are not yours.")
            b.claim(sid, rel, "edit")
        if note:
            out(event, context=note)
        return

    if tool == "Bash" and event in ("PreToolUse", "PostToolUse"):
        top = toplevel(cwd)
        if not top:
            return
        tid = inp.get("tool_use_id") or ""
        with Board(top) as b:
            b.touch(sid, pid, cwd)
            pk = sid + ":" + tid
            if event == "PreToolUse":
                b.d["pending"][pk] = {"t": b.now, "top": top, "dirty": dirty(top)}
                return
            before = b.d["pending"].pop(pk, None)
            if before is None:
                return
            after = dirty(top)
            changed = [p for p, sig in after.items() if before["dirty"].get(p) != sig]
            warn = []
            took = []
            for rel in changed:
                others = [o for o in b.owners(rel) if o != sid]
                live = [o for o in others if b.live(o)]
                if live:
                    warn.append(f"{rel} (held by {b.label(live[0])})")
                    continue
                if others:
                    took.append(f"{rel} (was {b.label(others[0])})")
                b.claim(sid, rel, "bash")
        msgs = []
        if warn:
            msgs.append("Task board: these files changed while your command ran, but another live task holds them. "
                        "Either your command wrote them or that task did at the same moment. Do not commit them; "
                        "tell Jeff which it was:\n  " + "\n  ".join(warn))
        if took:
            msgs.append("Task board: your command changed files a closed task still held; they are yours now, with "
                        "its unfinished changes inside. Check `git diff` on each before committing:\n  "
                        + "\n  ".join(took))
        if msgs:
            out(event, context="\n".join(msgs))
        return

    if event in ("SessionStart", "UserPromptSubmit"):
        top = toplevel(cwd)
        if not top:
            return
        with Board(top) as b:
            s = b.touch(sid, pid, cwd)
            if event == "UserPromptSubmit" and not s.get("name"):
                words = (inp.get("prompt") or "").split()
                if len(words) >= 3:
                    s["name"] = " ".join(words)[:70]
            others = sorted(o for o in b.d["sessions"] if o != sid and b.live(o))
            seen = s.get("seen_others", [])
            s["seen_others"] = others
            if event == "UserPromptSubmit" and set(others) <= set(seen):
                return
            text = b.render(me=sid, only_others=True)
        head = ("Task board (CLAUDE.md §8): other sessions share this folder. Files you change are claimed for you "
                "automatically; commit only what you changed, staged by path. The pre-commit hook refuses files "
                f"another task holds. Name this task once work starts: `{TOOL} name \"<short task>\"`.")
        if event == "UserPromptSubmit":
            head = "Task board: another session started work in this folder since you last looked."
        out(event, context=head + ("\n" + text if text else "\nNo other live tasks right now."))


# ---------------------------------------------------------------- pre-commit (git)

def parity_on_index(top):
    """Run the sheet parity checker against the STAGED copies of the sheet and the site data."""
    common = os.path.dirname(os.path.join(top, git(["rev-parse", "--git-common-dir"], cwd=top).strip()))
    guide = next((g for g in (os.path.join(top, "_guidebuild"), os.path.join(os.path.realpath(common), "_guidebuild"))
                  if os.path.isfile(os.path.join(g, "check_sheet_parity.py"))), None)
    if not guide:
        return None, "sheet parity not checked (no _guidebuild/check_sheet_parity.py here)"
    files = git(["ls-files", "-z", "--", "NRA-MASTER.xlsx", "citydata", ":(glob)*.js"], cwd=top)
    with tempfile.TemporaryDirectory(prefix="nra-parity-") as tmp:
        subprocess.run(["git", "checkout-index", "--stdin", "-z", "--prefix=" + tmp + "/"], cwd=top,
                       input=files, text=True, check=True, capture_output=True)
        os.symlink(guide, os.path.join(tmp, "_guidebuild"))
        env = dict(os.environ, GUIDE_ROOT=tmp)
        r = subprocess.run([sys.executable, os.path.join(tmp, "_guidebuild", "check_sheet_parity.py"), "--quiet"],
                           cwd=tmp, env=env, capture_output=True, text=True)
    text = (r.stdout + r.stderr).strip()
    return ("0 differing cells in 0 cities" in text), text


def precommit():
    top = git(["rev-parse", "--show-toplevel"]).strip()
    sid = os.environ.get("CLAUDE_CODE_SESSION_ID")
    staged = [p for p in git(["diff", "--cached", "--name-only", "-z", "--no-renames"], cwd=top).split("\0") if p]
    problems, notes = [], []
    with Board(top) as b:
        if sid:
            b.touch(sid, os.environ.get("CLAUDE_PID"))
        for rel in staged:
            owners = b.owners(rel)
            others = [o for o in owners if o != sid]
            live = [o for o in others if b.live(o)]
            if not sid:
                if live:
                    notes.append(f"{rel}: task {b.label(live[0])} holds it")
                continue
            if live:
                problems.append(f"{rel}: belongs to task {b.label(live[0])}")
            elif sid not in owners:
                if others:
                    problems.append(f"{rel}: held by {b.label(others[0])}. If you are finishing its work, "
                                    f"`{TOOL} claim --adopt {rel}` first")
                else:
                    problems.append(f"{rel}: no task claimed it. If your own command made this change, "
                                    f"`{TOOL} claim {rel}`; if not, unstage it with `git restore --staged -- {rel}`")
    if notes:
        print("pre-commit WARNING (manual commit): these staged files are held by a live Claude task:")
        print("  " + "\n  ".join(notes))
    if problems:
        print("pre-commit BLOCKED by the task board (CLAUDE.md §8). Staged files that are not this session's:")
        print("  " + "\n  ".join(problems))
        print(f"`{TOOL} board` shows every task. Nothing was committed.")
        return 1
    if any(PARITY_PATHS.match(p) for p in staged):
        ok, text = parity_on_index(top)
        if ok is None:
            print("pre-commit: " + text)
        elif ok:
            print("pre-commit: staged " + text)
        elif sid:
            print("pre-commit BLOCKED: the staged sheet and site data disagree (CLAUDE.md §3.5):")
            print("  " + text)
            print("  Stage both sides of the change (sheet and citydata/catalog), or finish the sync first.")
            print("  If another task holds the other side, ask it to `give` you its files so one commit carries both.")
            return 1
        else:
            print("pre-commit WARNING: staged sheet and site data disagree: " + text)
    return 0


# ---------------------------------------------------------------- sheet rows (called by sheet_write.py)

def rows_claim(sheet, keys, top):
    """Refuse (exit 3) unless this session may write the sheet: nobody else holds it (one holder at a time,
    decisions.md 2026-09-25), it has no unclaimed changes, and no other live task holds these cities' citydata.
    Otherwise record the rows and the sheet as this session's."""
    sid = os.environ.get("CLAUDE_CODE_SESSION_ID")
    if not sid:
        return 0
    with Board(top) as b:
        b.touch(sid, os.environ.get("CLAUDE_PID"))
        others = [o for o in b.owners(SHEET) if o != sid]
        live = [o for o in others if b.live(o)]
        if live:
            print(f"Task board: the sheet is held by task {b.label(live[0])}. One task changes the sheet at a time.\n"
                  "Nothing was written. Wait until that task commits, or ask it to hand the sheet over with "
                  f"`{TOOL} give {SHEET} --to {sid[:8]}` (its sheet rows move with it).")
            return 3
        if others or (SHEET in dirty(top) and sid not in b.owners(SHEET)):
            who = f"closed task {b.label(others[0])}" if others else "no task (Jeff, or a session without the hooks)"
            print(f"Task board: the sheet has uncommitted changes from {who}.\nNothing was written. Those changes "
                  "would ride in your commit. Tell Jeff; after checking them, "
                  f"`{TOOL} claim --adopt {SHEET}` takes them over.")
            return 3
        clash = []
        for city in keys:
            for o in b.row_holders(city):
                if o != sid and b.live(o):
                    clash.append(f"sheet rows for {city}: {b.label(o)}")
            slug = slug_of(top, city)
            if slug:
                for o in b.owners(f"citydata/{slug}.json"):
                    if o != sid and b.live(o):
                        clash.append(f"citydata/{slug}.json: {b.label(o)}")
        if clash:
            print("Task board: another live task has uncommitted changes for these cities:\n  "
                  + "\n  ".join(sorted(set(clash))) + "\nNothing was written. Tell Jeff, or wait for that task to commit.")
            return 3
        for city in keys:
            b.d["rows"][f"{top}\t{sheet}\t{city}"] = {"owner": sid, "since": b.now}
        b.claim(sid, "NRA-MASTER.xlsx", "sheet_write")
    return 0


# ---------------------------------------------------------------- command line

def main(argv):
    if len(argv) >= 2 and argv[0] == "hook":
        try:
            hook(argv[1])
        except Exception as e:     # the board must never stop a session from working; log and carry on
            try:
                with open(os.path.join(board_dir(toplevel(os.getcwd()) or "."), "errors.log"), "a") as f:
                    f.write(f"{time.ctime()} {argv[1]} {type(e).__name__}: {e}\n")
            except Exception:
                pass
        return 0
    if argv[:1] == ["precommit"]:
        return precommit()
    if argv[:1] == ["postcommit"]:      # loading the board prunes the claims of files the commit made clean
        top = toplevel(os.getcwd())
        if top:
            with Board(top):
                pass
        return 0
    top = toplevel(os.getcwd())
    if not top:
        print("not inside the never-roam-alone repo")
        return 2
    if argv[:1] == ["rows-claim"]:
        return rows_claim(argv[1], argv[2:], top)
    sid = os.environ.get("CLAUDE_CODE_SESSION_ID")
    args = list(argv[1:])
    as_ = None
    if "--as" in args:
        i = args.index("--as")
        as_ = args[i + 1]
        del args[i:i + 2]
    to = None
    if "--to" in args:
        i = args.index("--to")
        to = args[i + 1]
        del args[i:i + 2]
    adopt = "--adopt" in args
    args = [a for a in args if a != "--adopt"]
    cmd = argv[0] if argv else "board"

    with Board(top) as b:
        if as_:
            if sid:
                print("--as is for Jeff in Terminal only.")
                return 2
            sid = b.find_session(as_)
        if cmd == "board":
            text = b.render(me=sid)
            print(text or "No live tasks and no uncommitted changes.")
            return 0
        if not sid:
            print("No session id: run this from a Claude session, or from Terminal with --as <session>.")
            return 2
        b.touch(sid, None if as_ else os.environ.get("CLAUDE_PID"))
        if cmd == "whoami":
            print(sid, b.d["sessions"][sid].get("name", ""))
            return 0
        if cmd == "name":
            b.d["sessions"][sid]["name"] = " ".join(args)[:70]
            print("task name:", b.d["sessions"][sid]["name"])
            return 0
        rels = [os.path.relpath(os.path.abspath(a), top) for a in args]
        d = dirty(top)
        rc = 0
        for rel in rels:
            owners = b.owners(rel)
            if cmd == "claim":
                if rel not in d:
                    print(f"{rel}: no uncommitted change, nothing to claim"); continue
                live = [o for o in owners if o != sid and b.live(o)]
                stale = [o for o in owners if o != sid and not b.live(o)]
                if live:
                    print(f"{rel}: refused, task {b.label(live[0])} holds it. Ask it to `give` it to you.")
                    rc = 1; continue
                if stale and not adopt:
                    print(f"{rel}: held by {b.label(stale[0])}. Check `git diff -- {rel}`, then `claim --adopt`.")
                    rc = 1; continue
                b.claim(sid, rel, "manual")
                print(f"{rel}: claimed")
            elif cmd == "release":
                c = b.d["claims"].get(b.key(rel))
                if c and sid in c["owners"]:
                    c["owners"].remove(sid)
                    if not c["owners"]:
                        del b.d["claims"][b.key(rel)]
                    print(f"{rel}: released (the change is still in the folder, unclaimed)")
            elif cmd == "give":
                if not to:
                    print("give needs --to <session id or task name>"); return 2
                dest = b.find_session(to)
                if sid not in owners:
                    print(f"{rel}: not yours to give"); rc = 1; continue
                c = b.d["claims"][b.key(rel)]
                c["owners"] = [o for o in c["owners"] if o != sid]
                if dest not in c["owners"]:
                    c["owners"].append(dest)
                if rel == "NRA-MASTER.xlsx":
                    for r in b.d["rows"].values():
                        if r["owner"] == sid:
                            r["owner"] = dest
                print(f"{rel}: given to {b.label(dest)}")
            else:
                print(__doc__); return 2
        return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]) or 0)
