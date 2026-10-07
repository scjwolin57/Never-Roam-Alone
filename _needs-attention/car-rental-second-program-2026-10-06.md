# No second car rental program covers the 226; a car-with-driver partner covers 39 of them

*Checked 2026-10-06 for the 226 city guides DiscoverCars does not cover (`discovercars-coverage-2026-10-05.csv`, result "Not covered"). Two questions for Jeff at the bottom.*

## The answer

**No other self-drive rental site has cars in these places.** Rentalcars.com (Booking Holdings, 60,000 locations) was searched for real, for 11 to 14 November 2026, at the airport of every one of the 226 cities (210 airports). It had cars at **2**: Lombok (LOP, for Mataram, 3 cars) and Surabaya (SUB, 2 cars). Every other airport answered "We couldn't find any cars". The test worked at both ends: Lisbon showed 603 cars before the run and Barcelona 563 after it.

A second rental program for 2 cities with 2 or 3 cars each is not worth an application. **Recommendation: no second rental program.**

**What does exist in many of these places is a car with a driver.** Mainland China does not accept foreign licences or the international permit, and Vietnam accepts only the 1968-convention permit (the US and Canada issue the 1949 kind). In China, Vietnam, Cambodia and Bhutan, travelers mostly hire a driver. **Kiwitaxi** sells exactly that: airport transfers and hourly chauffeur hire, booked online at a fixed price. It has priced routes in **39** of the 226 cities.

## What was checked

| Program | How it was tested | Result for the 226 |
|---|---|---|
| Rentalcars.com | Real search at each city's airport (210 airports), dates fixed | Cars at 2 airports (Mataram via LOP, Surabaya) |
| Europcar | Its sitemap lists pages for 8 of the cities (Bamako, Cotonou, Brazzaville, Siem Reap, Phnom Penh, Baghdad, Erbil, Karbala) | The pages read show no station, address, hours or phone: templates, not rental desks |
| QEEQ | Its sitemap lists airport pages for 64 of the cities | Includes Kabul, Tehran, Damascus, Juba and Sana'a: search-engine pages, not proof of cars. Main route is Travelpayouts (dropped 2026-09-18) |
| EconomyBookings | Sitemap and pages refuse automated reads (HTTP 403) | Not testable; same suppliers as DiscoverCars |
| VIP Cars | Sitemap has 200 pages, none for these cities | Nothing |
| **Kiwitaxi** (car with driver) | Its priced route pages (32,600 English pages); one opened to confirm real fares (Da Nang airport to Hue, from $59) | **39 cities** |

Lesson recorded for later passes: a broker having a *page* for a city proves nothing (Rentalcars.com has a Sana'a page and none of these places had cars). Only a real search or a priced listing counts.

## The 39 Kiwitaxi cities

| Country | Cities |
|---|---|
| China (17) | Chengdu, Chongqing, Guangzhou, Guilin, Hangzhou, Harbin, Nanjing, Qingdao, Sanya, Shanghai, Shaoxing, Shenzhen, Suzhou, Xi'an, Xiamen, Zhangjiajie, Zhoushan |
| Vietnam (8) | Da Lat, Da Nang, Hoi An, Huế, Hạ Long, Nha Trang, Phu Quoc, Sa Pa |
| Cambodia (4) | Battambang, Phnom Penh, Siem Reap, Sihanoukville |
| Indonesia (3) | Banyuwangi, Surabaya, Yogyakarta |
| India (3) | Amritsar, Thiruvananthapuram, Varanasi |
| Kyrgyzstan (2) | Bishkek, Karakol |
| Turkmenistan (1) | Ashgabat |
| Algeria (1) | Oran |

The other 187 have neither: mostly Russia, Iran, Cuba, Syria, Yemen, North Korea (sanctions or closed to self-drive), most of Central and West Africa, the Pacific islands, and smaller Chinese, Indian and Indonesian cities.

## Kiwitaxi terms (read 2026-10-06 on kiwitaxi.com/en/partner/webmaster)

Direct program (not Travelpayouts). Half of Kiwitaxi's income per booking, about 12 to 15% of the fare, around €10 a booking on average; 30-day cookie; paid monthly (10th to 20th) by SEPA, SWIFT, Payoneer (€50 minimum) or card; 110+ countries, 7,000+ cities, 800+ airports; products: transfers and hourly chauffeur hire. Alternative for Asia only: **Klook** (through Involve Asia; 5% on car rental and transport, 7-day cookie for car rentals; strong in China and Vietnam). Klook was not tested city by city.

## How it would show (your popup rule, 2026-10-06)

Your rule: where something must be known before renting, the Car rental card keeps "More info →", and the popup gives that information first, then the affiliate link(s). For these cities the popup would read, for example (Shanghai):

> **Before you rent.** Mainland China does not accept foreign licences or the international driving permit. To drive you need a Chinese temporary driving permit from a local vehicle office (passport, licence with official translation, a photo; about an hour). Most visitors hire a car with a driver instead.
>
> **Car with a driver:** Book a transfer or driver in Shanghai → on Kiwitaxi

Every country's "before you rent" text would be researched and sourced first, never written from memory.

## Questions for Jeff

1. **Apply to Kiwitaxi** for the car-with-driver link in the 39 cities? (It could later also go in the popup for other cities where a driver is the better choice, after its own coverage check.)
2. **Approve the "before you rent" definition** below, so the country notes can be researched:
   - *What it is:* one short note per country (rarely per city) for anything a traveler must know **before** booking a rental car that the card's three rows (drives on, international permit, day price) do not say. Examples: a licence that is not accepted (mainland China), a permit-convention rule (Vietnam takes only the 1968 permit; Japan only the 1949 one, with a JAF translation for French, German, Swiss, Belgian and Taiwanese licences), self-drive not allowed to tourists (Bhutan, North Korea), rental cars that cannot cross into an area (Israeli cars into Palestinian-run areas), or international booking sites not operating (sanctions).
   - *Source rule:* the country's own transport or police authority, or a government travel-advice page, dated; a rental company's own terms only for company rules.
   - *Shape:* country-keyed file (like `city-holidays.js`), site-only; the card shows "More info →" only for cities whose country has a note.
   - *Later:* passport-aware wording (the site already stores passports), since the Vietnam and Japan rules depend on where the licence was issued.
