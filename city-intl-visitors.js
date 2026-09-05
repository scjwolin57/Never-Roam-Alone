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
  {city:"Hong Kong", country:"China (SAR)", visitors:26.7},
  {city:"Bangkok", country:"Thailand", visitors:22.8},
  {city:"Macau", country:"China (SAR)", visitors:20.6},
  {city:"Singapore", country:"Singapore", visitors:19.8},
  {city:"London", country:"United Kingdom", visitors:19.6},
  {city:"Paris", country:"France", visitors:19.1},
  {city:"Dubai", country:"UAE", visitors:17.5},
  {city:"New York", country:"United States", visitors:13.6},
  {city:"Mecca", country:"Saudi Arabia", visitors:13.5, est:true},
  {city:"Istanbul", country:"Türkiye", visitors:13.4},
  {city:"Tokyo", country:"Japan", visitors:12.9},
  {city:"Antalya", country:"Türkiye", visitors:12.4},
  {city:"Seoul", country:"South Korea", visitors:11.3},
  {city:"Osaka", country:"Japan", visitors:10.1},
  {city:"Rome", country:"Italy", visitors:10.1},
  {city:"Phuket", country:"Thailand", visitors:9.9},
  {city:"Kuala Lumpur", country:"Malaysia", visitors:9.5, est:true},
  {city:"Barcelona", country:"Spain", visitors:9.1},
  {city:"Amsterdam", country:"Netherlands", visitors:9},
  {city:"Medina", country:"Saudi Arabia", visitors:9, est:true},
  {city:"Milan", country:"Italy", visitors:8.8},
  {city:"Los Angeles", country:"United States", visitors:7.5},
  {city:"Prague", country:"Czechia", visitors:7, est:true},
  {city:"Madrid", country:"Spain", visitors:7, est:true},
  {city:"Taipei", country:"Taiwan", visitors:7, est:true},
  {city:"Vatican City", country:"Vatican", visitors:6.8, est:true},
  {city:"Vienna", country:"Austria", visitors:6.5, est:true},
  {city:"Athens", country:"Greece", visitors:6.5, est:true},
  {city:"Manama", country:"Bahrain", visitors:6.5, est:true},
  {city:"Hanoi", country:"Vietnam", visitors:6.3, est:true},
  {city:"Denpasar", country:"Indonesia", visitors:6.3, est:true},
  {city:"Cancún", country:"Mexico", visitors:6.1},
  {city:"Miami", country:"United States", visitors:6, est:true},
  {city:"Ho Chi Minh City", country:"Vietnam", visitors:6, est:true},
  {city:"Las Vegas", country:"United States", visitors:5.5, est:true},
  {city:"Dublin", country:"Ireland", visitors:5.5, est:true},
  {city:"Venice", country:"Italy", visitors:5.5},
  {city:"Orlando", country:"United States", visitors:5.5},
  {city:"Florence", country:"Italy", visitors:5.1},
];
