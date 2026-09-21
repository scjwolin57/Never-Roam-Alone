/* Never Roam Alone — shared site footer.
   The footer lives here ONLY. Every page has an empty
   <footer data-site-footer></footer> placeholder and loads this script
   just before nav.js; nav.js then marks the current page's link and keeps
   the © year current. The footer's look lives only in master.css.
   To change the footer site-wide, edit FOOTER_LINKS or the text below. */
(function () {
  "use strict";
  // The one and only footer link list. Order = display order.
  var FOOTER_LINKS = [
    { label: "Home",                    href: "index.html" },
    { label: "Where to Go This Month",  href: "best-time-to-visit.html" },
    { label: "Destination Finder",      href: "choose.html" },
    { label: "City Guides",             href: "cities.html" },
    { label: "Compare Cities",          href: "compare.html" },
    { label: "Contact",                 href: "contact.html" },
    { label: "Feedback",                href: "feedback.html" },
    { label: "Community Contributions", href: "community.html" },
    { label: "Privacy Policy",          href: "privacy.html" },
    { label: "Terms of Service",        href: "terms.html" }
  ];

  var html =
    '<div class="brand"><img class="foot-logo" src="logo-round-sand.png" width="34" height="34" alt="">' +
      '<span>Never Roam Alone</span><span class="foot-copy">&copy; <span data-year>' + new Date().getFullYear() + '</span></span></div>' +
    '<div class="foot-links">' +
      FOOTER_LINKS.map(function (l) { return '<a href="' + l.href + '">' + l.label + '</a>'; }).join("") +
    '</div>' +
    '<small class="foot-disclosure">Some links on this site are affiliate links: if you book through them we may earn a small commission at NO EXTRA COST TO YOU.<br>' +
      'Using our links helps keep the site up to date. <b><em>THANK YOU FOR YOUR CONTRIBUTION.</em></b> ' +
      'Details in our <a href="privacy.html">Privacy Policy</a>.</small>';

  var feet = document.querySelectorAll("footer[data-site-footer]");
  for (var i = 0; i < feet.length; i++) feet[i].innerHTML = html;
})();
