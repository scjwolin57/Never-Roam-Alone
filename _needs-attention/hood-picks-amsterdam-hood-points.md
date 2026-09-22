# Amsterdam: two neighborhood map points are in the wrong place (found 2026-09-21, hood-picks batch 1)

The independent checker found that Amsterdam's picks landed in the wrong districts because two `hood_geo` points are off.

| Hood | Point in citydata | Where that point actually is |
|---|---|---|
| Canal Ring | 52.387732, 4.887173 | Haarlemmerbuurt / IJdok, north-west of the ring |
| Centrum | 52.358896, 4.910405 | Oost (east of the centre) |

Effect on the run: 10 of Amsterdam's 21 picks were marked WRONG for being in Oost, Bickerseiland or Haarlemmerbuurt. **All of Amsterdam is held out of batch 1** (nothing loaded).

These points also feed the Find laundry & gyms modal and the laundromat lists, so the fix helps those too.

**Question for Jeff:** re-geocode Canal Ring and Centrum (`_guidebuild/hoods/geocode_hoods.py`), or give me a pin for each. I have not changed anything. After the points are fixed, Amsterdam's Google searches are redone (about 28 calls) and it goes into a later batch.

Other cities may have the same fault. The picks agents noted borderline hood fits in Osaka (Tennoji ward point), Seoul (Insadong) and Madrid (Chueca); the checker's neighborhood rule was strict, so those picks were dropped rather than kept.


## RESOLVED 2026-09-21
Both re-geocoded by hand (the automated query landed on the same wrong point twice, so a better query was picked manually and checked):
- **Canal Ring**: the plain query returned a mismatched point of interest. `Grachtengordel, Amsterdam, Netherlands` (the Dutch name for "Canal Ring") returns an exact `neighborhood` match, 1.0 km from the city centre → 52.365577, 4.889361.
- **Centrum**: the plain query fell back to the city's own centroid. The site's own `hood_landmark` for this hood is "Dam Square"; `Dam Square, Amsterdam, Netherlands` returns an exact match, 1.0 km from the city centre → 52.373031, 4.893253.
Checked: all 5 Amsterdam hood points are now 0.9–2.5 km apart with no overlap, and the new points sit inside the neighborhoods their `hood_desc` describes. Written into `citydata/amsterdam.json` (`hood_geo`) and the geocode cache. `laundromats` and `gyms` were built from the old points and were not re-run for Amsterdam; if you want them refreshed, say so.
