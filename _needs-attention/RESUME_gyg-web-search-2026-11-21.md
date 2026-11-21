# Resume: day-trip place pages by web search (2026-11-21)

State: 1,919 of 3,127 trips have a GetYourGuide place page; about 1,208 are hidden (no `gyg`).
Method: WebSearch (standard, allowed_domains getyourguide.com) "getyourguide <place> <country>"; accept only a
place page (`-l<id>/`) in the trip's country sharing a non-generic word with the trip name. Tour pages, region pages
and differently named places are skipped. Apply with a hand file (`_guidebuild/daytrips/gyg_hand_*.json`) through
`apply_gyg_places.py <file> --cities "A;B"`, check `node --check day-trips.js`, parity 0, commit by path.
Hit rate: ~85% for well-known places (passes 1-8), ~50% for the rest (passes 9-10). Budget is ~200 searches per session.
Done to pass 10 (commits 'Day-trip tour links, web-search pass N'). Searched, no page: Bacardi, Rostov Veliky, Borodino,
Liwa, Bo Sang, Kampinos, Vall de Sorteny; Babylon only has a region page.
Next: smaller towns by visitor rank (Seven Springs Rhodes has tour pages only; Tonle Bati, Jinyun, Taichung, Helsinki
towns, Chalki). Expect fewer hits; stop when the rate is under ~30%.
