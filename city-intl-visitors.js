/* Never Roam Alone — cities with >5M annual INTERNATIONAL visitors.

   DERIVED LIST — do not hand-edit the figures here. Every number is a
   straight copy of the "visitors" field in destinations.js, which is the
   single source of truth for annual international arrivals across the
   site (the Destination Finder, the homepage globe and this page all
   read the same figures). Domestic tourism is excluded there, as are
   cruise day-callers and border day-trippers, so cities that are huge
   domestically (Suzhou, Chicago, Gyeongju, Tirupati) or that count
   frontier crossings (Gibraltar, Monaco) do not appear here.

   Regenerate by filtering destinations.js to visitors > 5, sorted
   highest first. Used by top-visited.html. */
window.NRA_CITY_INTL_VISITORS = [
  {city:"Bangkok", country:"Thailand", visitors:26, est:true},
  {city:"Hong Kong", country:"China (SAR)", visitors:22.5},
  {city:"London", country:"United Kingdom", visitors:20.9},
  {city:"Paris", country:"France", visitors:19.1},
  {city:"Dubai", country:"UAE", visitors:18.7},
  {city:"Istanbul", country:"Türkiye", visitors:18.6},
  {city:"Antalya", country:"Türkiye", visitors:17.3},
  {city:"Mecca", country:"Saudi Arabia", visitors:17},
  {city:"Tokyo", country:"Japan", visitors:17, est:true},
  {city:"Singapore", country:"Singapore", visitors:16.5},
  {city:"Macau", country:"China (SAR)", visitors:16},
  {city:"Osaka", country:"Japan", visitors:14.6},
  {city:"New York", country:"United States", visitors:13},
  {city:"Seoul", country:"South Korea", visitors:12.3},
  {city:"Kuala Lumpur", country:"Malaysia", visitors:12.1},
  {city:"Kyoto", country:"Japan", visitors:10.9},
  {city:"Rome", country:"Italy", visitors:10.1},
  {city:"Medina", country:"Saudi Arabia", visitors:10, est:true},
  {city:"Shenzhen", country:"China", visitors:9.8},
  {city:"Barcelona", country:"Spain", visitors:9.1},
  {city:"Pattaya-Chonburi", country:"Thailand", visitors:9, est:true},
  {city:"Milan", country:"Italy", visitors:8.8},
  {city:"Marne-la-Vallée", country:"France", visitors:8},
  {city:"Amsterdam", country:"Netherlands", visitors:7.5},
  {city:"Prague", country:"Czechia", visitors:7.2},
  {city:"Athens", country:"Greece", visitors:7, est:true},
  {city:"Jeddah", country:"Saudi Arabia", visitors:7, est:true},
  {city:"Los Angeles", country:"United States", visitors:7},
  {city:"Madrid", country:"Spain", visitors:7},
  {city:"Phuket", country:"Thailand", visitors:7, est:true},
  {city:"Vatican City", country:"Vatican", visitors:6.8},
  {city:"Shanghai", country:"China", visitors:6.7},
  {city:"Manama", country:"Bahrain", visitors:6.5},
  {city:"Miami", country:"United States", visitors:6.5, est:true},
  {city:"Taipei", country:"Taiwan", visitors:6.5, est:true},
  {city:"Vienna", country:"Austria", visitors:6.5},
  {city:"Denpasar", country:"Indonesia", visitors:6.3},
  {city:"Hanoi", country:"Vietnam", visitors:6.3},
  {city:"Cancún", country:"Mexico", visitors:6.1, est:true},
  {city:"Ho Chi Minh City", country:"Vietnam", visitors:6},
  {city:"Budapest", country:"Hungary", visitors:5.8},
  {city:"Venice", country:"Italy", visitors:5.5},
  {city:"Orlando", country:"United States", visitors:5.3},
  {city:"Florence", country:"Italy", visitors:5.1}
];
