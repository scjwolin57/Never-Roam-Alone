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
