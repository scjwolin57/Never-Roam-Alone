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

  ready(function () {
    var css = document.createElement('style');
    css.textContent =
      '#nra-cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:560px;margin:0 auto;' +
        'background:#fffdf7;border:1px solid #d8cdb2;border-radius:14px;box-shadow:0 8px 30px rgba(43,36,23,.18);' +
        'padding:16px 18px;font-family:"Work Sans",system-ui,sans-serif;color:#2b2417;font-size:14.5px;line-height:1.5;}' +
      '#nra-cc-banner a{color:#556B2F;text-decoration:underline;}' +
      '#nra-cc-banner .nra-cc-btns{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;}' +
      '#nra-cc-banner button{font:inherit;font-weight:600;border-radius:999px;padding:8px 20px;cursor:pointer;}' +
      '#nra-cc-accept{background:#556B2F;border:1px solid #556B2F;color:#fff;}' +
      '#nra-cc-accept:hover{background:#C04020;border-color:#C04020;}' +
      '#nra-cc-decline{background:transparent;border:1px solid #82755b;color:#2b2417;}' +
      '#nra-cc-decline:hover{border-color:#C04020;color:#C04020;}' +
      '#nra-cc-icon{position:fixed;left:14px;bottom:14px;z-index:99998;width:40px;height:40px;border-radius:50%;' +
        'background:#fffdf7;border:1px solid #d8cdb2;box-shadow:0 3px 12px rgba(43,36,23,.18);cursor:pointer;' +
        'font-size:20px;line-height:38px;text-align:center;padding:0;}';
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
        '🍪 <strong>Cookies, anyone?</strong> We use cookies from our travel partner ' +
        '(Travelpayouts) to help keep this site free — they track bookings made through our links. ' +
        'Decline and the site works just the same. <a href="privacy.html#cookies">Learn more</a>' +
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
      b.textContent = '🍪';
      b.addEventListener('click', showBanner);
      document.body.appendChild(b);
    }

    if (getChoice()) { showIcon(); } else { showBanner(); }
  });
})();
