# Two _guidebuild edits to apply in the main folder (2026-09-19)

`_guidebuild/` is not in git and lives only in the main folder, which this session could not
edit. The site data was produced with the patched copy below, so the main folder's copy must get
the same change or the next laundry sync will drop the 26 price ranges again.

## 1. `_guidebuild/laundry/sync_laundry.py`: keep researched price ranges

A sheet price such as "6.5-8.5" is stored as `usd` (low) plus `usdMax` (high) instead of being dropped.

```diff
--- _guidebuild/laundry/sync_laundry.py	2026-09-19 13:58:33
+++ _guidebuild/laundry/sync_laundry.py	2026-09-19 13:58:33
@@ -4,7 +4,8 @@
 Edits each minified JSON by character span (never re-dumps the file).
 
   laundry = { usd, avail, self, pay, note, conf, scope, asof, src }
-    usd   wash + one dry, USD (null when no price is known)
+    usd   wash + one dry, USD (null when no price is known); the LOW end when the sheet has a range
+    usdMax  the HIGH end when the sheet price is a range such as "6.5-8.5" (omitted otherwise)
     avail self-service availability judgement: common / some / rare / none
     self  self-service laundries mapped by OSM within 12 km
     pay   payment methods (free text)     note  one-line note
@@ -25,7 +26,10 @@
 def clean(k, v):
     if v in (None, ""): return None
     if k in ("usd",):
-        try: return round(float(str(v).replace(",", "")), 2)
+        s = str(v).replace(",", "").strip()
+        m = re.fullmatch(r"([\d.]+)\s*[-\u2013]\s*([\d.]+)", s)   # a researched range, e.g. "6.5-8.5"
+        if m: return (round(float(m.group(1)), 2), round(float(m.group(2)), 2))
+        try: return round(float(s), 2)
         except ValueError: return None
     if k == "self": return int(v)
     return str(v).strip()
@@ -40,6 +44,7 @@
         if name not in slugs: skipped += 1; continue
         rec = {k: clean(k, r[i]) for k, i in idx.items()}
         rec = {k: v for k, v in rec.items() if v is not None}
+        if isinstance(rec.get("usd"), tuple): rec["usd"], rec["usdMax"] = rec["usd"]   # range: low + high
         fn = os.path.join(ROOT, "citydata", slugs[name] + ".json")
         s = open(fn, encoding="utf-8").read()
         d = json.loads(s)
```

## 2. `_guidebuild/CITY_SCHEMA.md`, `laundry` row

Add `"usdMax":N|omit` after `"usd":N|omit`, defined as: the high end when the researched wash + dry
price is a range (then `usd` is the low end). city.html shows it as "low–high" in the hotel card
and the laundry popup.

## 3. `_guidebuild/add_city_to_sheet.py`: write the range back

`build_row` writes `ln.get("usd")` only, so a new city with a range would lose the high end.
Replace the Laundry Wash+Dry line with:

```python
    S("Laundry Wash+Dry (USD)", f"{ln['usd']}-{ln['usdMax']}" if ln.get("usdMax") is not None else ln.get("usd"))
```
