# Never Roam Alone — Monetization Plan
*July 8, 2026*

The site isn't publicly launched yet, so the honest starting point: **every option below earns roughly in proportion to traffic.** The good news is most of Tier 1 costs nothing, takes hours not weeks, and just sits there earning as traffic grows. The plan is ranked: do Tier 1 now, Tier 2 once real visitors show up, Tier 3 when the audience justifies the build.

---

## First, one prerequisite: measure traffic

You currently have zero analytics (by design — no cookie banner needed). You can't make monetization decisions blind. Add a **cookieless** analytics tool — **Netlify Analytics (~$9/mo)** or **Plausible (~$9/mo)** — both were already flagged in the July 5 compliance round as options that **don't require a cookie-consent banner**. This tells you when you cross the traffic thresholds in Tier 2.

---

## Tier 1 — Affiliate links on content you already have (do now)

No cost to visitors, no cookie banner required (a link is just a link), and your site is unusually well set up for it — you already built the hard parts. **One legal must-do:** add a short affiliate-disclosure line to pages with affiliate links and a sentence in privacy.html/terms.html (FTC requires it).

**Easiest entry:** join **[Travelpayouts](https://www.travelpayouts.com/en/)** — a free travel-affiliate network with **no traffic minimums** that bundles many of the brands below (hotels, flights, tours, insurance, car rental) under one account and one payout. [Stay22](https://community.stay22.com/top-travel-affiliate-programs-for-2026) is a similar option for lodging. Apply to Booking.com or GetYourGuide directly later if their direct rates beat the network's.

### 1. Hotel & hostel links — your biggest natural earner
Every one of your **101 city pages already lists real, named hotels and hostels at three price tiers** (CITY_LODGING). Right now those names earn you nothing. Turn each name into an affiliate search link (Booking.com pays **up to ~4–5%** of the booking; Expedia ~4%; Hostelworld **5–7%**). A few $150/night bookings a month is real money per thousand visitors — hotels are where travel sites make most of their affiliate income.
**Effort:** one templating change in city.html (name → link). **Earning potential: highest on the site.**

### 2. eSIM links — the slots literally already exist
Your Connectivity banner has a green "Buy an eSIM →" button on all 101 city pages with **empty placeholder URLs (CITY_ESIM) waiting for exactly this**. eSIM programs pay well: **Airalo ~10–15%**, **Holafly ~15–20%**, Saily similar. Join one program, paste one link pattern, done.
**Effort: lowest of anything on this list** — it was built for this.

### 3. Tours & activities
**GetYourGuide (8%+ commission, 30-day cookie)** and **Viator (8%, 30-day cookie)** pay roughly double the hotel rate. Two placements: (a) a "Things to do" link/section on each city page, (b) the **Favorite Travel Activities** finder tool — its results are literally "cities matched to activities," a perfect handoff to a tours link.
**Effort:** low-medium. **Potential:** second only to hotels.

### 4. Car rental
Your airport cards already name rental companies per city. **DiscoverCars pays ~$20+ per booking (or a profit share) with a 365-day cookie** — unusually generous. Swap the plain-text company names for one "Compare rental prices" affiliate link per city.

### 5. Flights
Your flight-search tool (choose.html) shows real prices but the cards don't link to booking. Add a "Book" link via Travelpayouts (Aviasales/WayAway/Kiwi). Flight commissions are the *lowest* in travel (~1–2%), so treat this as a bonus, not a pillar. The `routeUrl()` helper already has a comment marking where a booking link goes.

### 6. Travel insurance
SafetyWing / World Nomads pay per sale or even **per quote**. Best placed in blog posts and a short "Before you go" block on city pages. Small effort, steady trickle.

**⚠️ Technical reminder for all of the above:** any new external script or API host must be added to the CSP allowlist in netlify.toml or the browser silently blocks it. Plain outbound links need no CSP change.

---

## Tier 2 — Once you have real traffic

### 7. Display ads
Realistic ladder, by monthly traffic:

| Network | Minimum | Notes |
|---|---|---|
| Google AdSense | none | lowest pay; fine as a first test |
| **Journey by Mediavine** | **1,000 sessions/mo** + site ≥4 months old | avg ~$11 per 1,000 pageviews; travel pays above average in season |
| Mediavine (full) / Raptive | ~25,000 pageviews/mo | the "real money" tier — many travel blogs earn $20–40 per 1,000 pageviews |

**Important trade-off you already decided on July 5:** adding ads means adding a **cookie-consent banner** and updating privacy.html. That's fine — just budget a small compliance round when you flip this on. With Journey at just 1,000 sessions/month, this could come sooner than you'd think.

### 8. Monetize the mailing list you already built
The list itself is the asset: affiliate offers and (later) sponsored slots in a monthly "destination spotlight" email convert far better than site links. Prereq: **verify neverroamalone.com in Resend** (already on your go-live list) so emails deliver to anyone. Grow it first; monetize at ~500+ subscribers.

### 9. Sponsored content
Hotels, tour operators, and tourism boards pay for sponsored blog posts or "featured" placement on city pages. Your blog editor + trusted-traveler bylines make publishing these easy. Needs traffic numbers to pitch with (another reason for analytics), and each one must be labeled "Sponsored."

---

## Tier 3 — New features worth building for revenue

### 10. Entertainment Calendar with paid listings *(already on your roadmap)*
Events per city where venues/promoters pay for featured slots. Nice fit: it also makes city pages fresher (good for repeat visits and Google). Start free to seed it, charge for "featured" once it has an audience.

### 11. Venue guide (cafes/restaurants/bars/clubs) *(already on your roadmap)*
Monetize via reservation links (e.g. OpenTable affiliate), or later, paid "featured venue" placement.

### 12. Premium membership
Charge (~$3–5/mo) for extras: ad-free, unlimited multi-trip itineraries, price alerts, downloadable/offline city guides. Your Supabase accounts system makes gating easy; Stripe handles payment. **Only worth it once free users are actively using the trip planner** — otherwise there's nothing to upgrade to.

### 13. Digital products
One-time purchases: premium city-guide PDFs, packing checklists, a "first trip abroad" course. No inventory, sells while you sleep, but each one is real authoring work.

### 14. Host listings marketplace *(roadmap)* — **park this for last.** Taking a cut of bookings between strangers means payments, disputes, and liability. Revisit only with serious traction.

---

## Suggested order of attack (next 30 days)

1. Finish the go-live steps in summary.md (push, SQL, Resend domain) — nothing earns until the site is truly live and emails deliver.
2. Add Plausible or Netlify Analytics (no banner needed).
3. Join Travelpayouts + one eSIM program (Airalo or Holafly).
4. Paste eSIM links into CITY_ESIM (hours).
5. Link the hotel names on city pages (the big one).
6. Add GetYourGuide/Viator links to city pages + the Activities finder.
7. Add the affiliate-disclosure line + privacy/terms update.
8. Then focus entirely on **traffic** (SEO, more blog posts, sharing) — at 1,000 sessions/month, apply to Journey for ads.

**Set expectations:** with launch-week traffic, affiliate income will be a trickle ($0–50/mo). The point of doing Tier 1 now is that it's a one-time setup that scales automatically with every new visitor.

---

## Sources
- [Travelpayouts — travel affiliate network](https://www.travelpayouts.com/en/) · [how it works](https://support.travelpayouts.com/hc/en-us/articles/203955593-What-is-Travelpayouts-and-how-it-works)
- [BloggersPassion — 21 Best Travel Affiliate Programs 2026](https://bloggerspassion.com/best-travel-affiliate-programs/) (Booking, Expedia, Hostelworld, Viator, GetYourGuide, DiscoverCars rates)
- [GetYourGuide Partner Program](https://partner.getyourguide.com/) · [Viator affiliate review](https://commissiondex.com/program/viator/)
- [Cellesim — eSIM affiliate payouts (Airalo, Holafly)](https://cellesim.com/en/blog/esim-affiliate-programs-travel-creators) · [Holafly affiliate program](https://esim.holafly.com/affiliate-program/)
- [Productive Blogging — Journey by Mediavine requirements & RPM](https://www.productiveblogging.com/everything-you-need-to-know-about-journey-by-mediavine/) · [Mediavine/Raptive requirements](https://thisweekinblogging.com/mediavine-raptive-requirements/)
- [Stay22 — top travel affiliate programs 2026](https://community.stay22.com/top-travel-affiliate-programs-for-2026)
