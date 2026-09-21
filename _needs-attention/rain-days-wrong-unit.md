# Rain figures: 253 cities show impossible "days/mo"

Found 2026-09-19 during the overflow scan. Not changed.

## What's wrong

The Season card shows rain as "N days/mo". The page takes the `rain` value for each quarter and divides by 3, because `CITY_SCHEMA.md` defines `rain` as "rainy days, one number per quarter".

In **253 of 893 cities**, at least one quarter holds a number above 92. A quarter can't have more than 92 days, so these can't be rainy days. They look like millimetres of rainfall.

| City | Stored q1 / q2 / q3 / q4 | Page shows |
|---|---|---|
| Kingstown | 90 / 140 / 190 / 200 | up to "67 days/mo" |
| Baguio | 30 / 500 / 1800 / 700 | up to "600 days/mo" |
| Tofino | 900 / 250 / 80 / 700 | up to "300 days/mo" |
| Lisbon (correct, for comparison) | 27 / 17 / 5 / 29 | 2 to 10 days/mo |

Another 18 cities have a quarter between 81 and 92. That's possible but unlikely, so they need checking too.

One column is mixing two units (days and millimetres), which the data rules forbid (CLAUDE.md §4.2).

## Question for Jeff

Re-research rainy days for these cities, using the schema's definition and one source for all? It would be the usual batches of 25, sheet and site together.

The alternative is to switch the whole column to millimetres, but that changes the definition for all 893 cities.

The full list comes from a script that flags any `rain` quarter above 92 in `citydata/`.
