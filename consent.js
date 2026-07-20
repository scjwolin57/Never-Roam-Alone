/* Never Roam Alone — cookie consent + affiliate disclosure
   Gates the Travelpayouts (emrld.ltd) script behind an Accept/Decline banner.
   Choice is stored in localStorage under "nra_cookie_consent" ("accepted" | "declined").
   A floating cookie button lets visitors change their choice any time. */
(function () {
  var KEY = 'nra_cookie_consent';
  var TP_SRC = 'https://emrld.ltd/NTQ4MDY2.js?t=548066';
  var tpLoaded = false;

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function loadTP() {
    if (tpLoaded) return;
    tpLoaded = true;
    var s = document.createElement('script');
    s.async = 1;
    s.src = TP_SRC;
    document.head.appendChild(s);
  }

  if (getChoice() === 'accepted') loadTP();

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  var COOKIE_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>' +
    '<circle cx="8.5" cy="10.5" r=".6" fill="currentColor" stroke="none"/>' +
    '<circle cx="16" cy="15.5" r=".6" fill="currentColor" stroke="none"/>' +
    '<circle cx="11" cy="16" r=".6" fill="currentColor" stroke="none"/>' +
    '<circle cx="7" cy="15" r=".6" fill="currentColor" stroke="none"/>' +
    '</svg>';

  ready(function () {
    var css = document.createElement('style');
    css.textContent =
      '#nra-cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:560px;margin:0 auto;' +
        'background:#fffdf7;border:1px solid #d8cdb2;border-top:4px solid #556B2F;border-radius:16px;' +
        'box-shadow:0 12px 30px rgba(43,36,23,.18);' +
        'padding:18px 20px;font-family:"Work Sans",system-ui,sans-serif;color:#2b2417;font-size:14.5px;line-height:1.55;}' +
      '#nra-cc-banner .nra-cc-head{display:flex;align-items:center;gap:9px;margin:0 0 8px;' +
        'font-family:Fraunces,Georgia,serif;font-weight:700;font-size:1.05rem;color:#2b2417;}' +
      '#nra-cc-banner .nra-cc-head svg{color:#556B2F;flex-shrink:0;}' +
      '#nra-cc-banner p{margin:0;}' +
      '#nra-cc-banner a{color:#556B2F;text-decoration:underline;text-underline-offset:2px;}' +
      '#nra-cc-banner a:hover{color:#C04020;}' +
      '#nra-cc-banner .nra-cc-btns{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;}' +
      '#nra-cc-banner button{font:inherit;font-weight:700;font-size:.86rem;letter-spacing:.01em;' +
        'border-radius:999px;padding:9px 22px;cursor:pointer;transition:background .2s,border-color .2s,color .2s;}' +
      '#nra-cc-accept{background:#556B2F;border:1px solid #556B2F;color:#fff;}' +
      '#nra-cc-accept:hover{background:#C04020;border-color:#C04020;}' +
      '#nra-cc-decline{background:transparent;border:1px solid #82755b;color:#2b2417;}' +
      '#nra-cc-decline:hover{border-color:#C04020;color:#C04020;}' +
      '#nra-cc-icon{position:fixed;left:16px;bottom:16px;z-index:99998;width:44px;height:44px;border-radius:50%;' +
        'background:#556B2F;color:#fff;border:none;box-shadow:0 4px 14px rgba(43,36,23,.28);cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;padding:0;transition:background .2s;}' +
      '#nra-cc-icon:hover{background:#C04020;}';
    document.head.appendChild(css);

    var banner = null;

    function hideBanner() {
      if (banner) { banner.remove(); banner = null; }
      showIcon();
    }

    function showBanner() {
      if (banner) return;
      var icon = document.getElementById('nra-cc-icon');
      if (icon) icon.remove();
      banner = document.createElement('div');
      banner.id = 'nra-cc-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Cookie consent');
      banner.innerHTML =
        '<div class="nra-cc-head">' + COOKIE_SVG + '<span>Cookies, they aren\'t all bad</span></div>' +
        '<p>We use a cookie from our travel partner (Travelpayouts) to credit bookings made through our links and help keep this site free. ' +
        'It doesn\'t track you across other sites, and we never sell or share your data with third parties. ' +
        '<a href="privacy.html#cookies">Learn more</a></p>' +
        '<div class="nra-cc-btns">' +
        '<button id="nra-cc-accept" type="button">Accept</button>' +
        '<button id="nra-cc-decline" type="button">Decline</button>' +
        '</div>';
      document.body.appendChild(banner);
      document.getElementById('nra-cc-accept').addEventListener('click', function () {
        setChoice('accepted'); loadTP(); hideBanner();
      });
      document.getElementById('nra-cc-decline').addEventListener('click', function () {
        setChoice('declined'); hideBanner();
      });
    }

    function showIcon() {
      if (document.getElementById('nra-cc-icon')) return;
      var b = document.createElement('button');
      b.id = 'nra-cc-icon';
      b.type = 'button';
      b.title = 'Cookie settings';
      b.setAttribute('aria-label', 'Cookie settings');
      b.innerHTML = COOKIE_SVG;
      b.addEventListener('click', showBanner);
      document.body.appendChild(b);
    }

    if (getChoice()) { showIcon(); } else { showBanner(); }
  });
})();
