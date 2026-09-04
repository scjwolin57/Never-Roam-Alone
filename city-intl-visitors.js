/* Never Roam Alone — cities with >5M annual INTERNATIONAL visitors.
   Pulled from the same "visitors" figures index.html's CITIES array uses
   for the homepage globe (documented there as approximate annual
   INTERNATIONAL arrivals, sourced/approximated from Euromonitor's "Top
   100 City Destinations" and the Mastercard Global Destination Cities
   Index — see README.md).

   A handful of secondary Chinese cities carry a "visitors" figure in
   that array that is really a total (overwhelmingly domestic) tourism
   count, not international arrivals — e.g. Suzhou/Xiamen/Chongqing/
   Kunming/Hangzhou/Xi'an/Nanjing/Harbin/Tai'an/Qingdao were all listed
   at 8-100M, which would dwarf China's entire measured inbound-foreign-
   visitor total (~30M/year nationally). Those are intentionally left
   out of this international-only list rather than repeated here.

   Used by top-visited.html. Sorted highest first; regenerate by
   filtering index.html's CITIES array to visitors > 5 and re-checking
   for the same domestic/international mix-ups. */
window.NRA_CITY_INTL_VISITORS = [
  {city:"Bangkok", country:"Thailand", visitors:26},
  {city:"Hong Kong", country:"China (SAR)", visitors:22.5},
  {city:"London", country:"United Kingdom", visitors:20.9},
  {city:"Paris", country:"France", visitors:19.1},
  {city:"Dubai", country:"UAE", visitors:18.7},
  {city:"Istanbul", country:"Türkiye", visitors:18.6},
  {city:"Antalya", country:"Türkiye", visitors:17.3},
  {city:"Tokyo", country:"Japan", visitors:17},
  {city:"Mecca", country:"Saudi Arabia", visitors:17},
  {city:"Singapore", country:"Singapore", visitors:16.5},
  {city:"Macau", country:"China (SAR)", visitors:16},
  {city:"Osaka", country:"Japan", visitors:14.6},
  {city:"New York", country:"United States", visitors:13},
  {city:"Seoul", country:"South Korea", visitors:12.3},
  {city:"Kuala Lumpur", country:"Malaysia", visitors:12.1},
  {city:"Kyoto", country:"Japan", visitors:10.9, est:true},
  {city:"Rome", country:"Italy", visitors:10.1},
  {city:"Medina", country:"Saudi Arabia", visitors:10, est:true},
  {city:"Shenzhen", country:"China", visitors:9.8, est:true},
  {city:"Barcelona", country:"Spain", visitors:9.1},
  {city:"Saint Petersburg", country:"Russia", visitors:9},
  {city:"Pattaya-Chonburi", country:"Thailand", visitors:9, est:true},
  {city:"Milan", country:"Italy", visitors:8.8},
  {city:"Marne-la-Vallée", country:"France", visitors:8, est:true},
  {city:"Amsterdam", country:"Netherlands", visitors:7.5},
  {city:"Prague", country:"Czechia", visitors:7.2},
  {city:"Jeddah", country:"Saudi Arabia", visitors:7},
  {city:"Phuket", country:"Thailand", visitors:7},
  {city:"Los Angeles", country:"United States", visitors:7},
  {city:"Madrid", country:"Spain", visitors:7, est:true},
  {city:"Athens", country:"Greece", visitors:7, est:true},
  {city:"Vatican City", country:"Vatican", visitors:6.8},
  {city:"Shanghai", country:"China", visitors:6.7},
  {city:"Chengdu", country:"China", visitors:6.5},
  {city:"Manama", country:"Bahrain", visitors:6.5},
  {city:"Vienna", country:"Austria", visitors:6.5},
  {city:"Taipei", country:"Taiwan", visitors:6.5, est:true},
  {city:"Miami", country:"United States", visitors:6.5, est:true},
  {city:"Hanoi", country:"Vietnam", visitors:6.3, est:true},
  {city:"Denpasar", country:"Indonesia", visitors:6.3, est:true},
  {city:"Cancún", country:"Mexico", visitors:6.1},
  {city:"Mumbai", country:"India", visitors:6},
  {city:"Ho Chi Minh City", country:"Vietnam", visitors:6, est:true},
  {city:"Budapest", country:"Hungary", visitors:5.8, est:true},
  {city:"Venice", country:"Italy", visitors:5.5},
  {city:"Orlando", country:"United States", visitors:5.3},
  {city:"Florence", country:"Italy", visitors:5.1}
];
