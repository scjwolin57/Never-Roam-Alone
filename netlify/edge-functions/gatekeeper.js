// Site-wide "coming soon" gate.
//
// In plain English: while this is active, any visitor who does NOT have the
// secret bypass link sees the coming-soon page, no matter which page they
// try to visit. Jeff visits the site once with ?preview=ibiza in the address
// bar, which sets a cookie in his own browser so he never sees the gate
// again on that device. Nobody else can get past it without that link.
//
// To turn the gate off later: delete this file (or just this function's
// entry in netlify.toml) and redeploy — nothing else on the site needs to
// change.

const SECRET = "ibiza";
const COOKIE_NAME = "nra_pass";

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Let the coming-soon page itself, Netlify functions/API calls, and plain
  // asset files (images, fonts, css, js) load normally — only real content
  // pages get gated.
  const isBypassPath =
    path === "/coming-soon.html" ||
    path.startsWith("/.netlify/") ||
    path.startsWith("/api/") ||
    /\.(css|js|mjs|png|jpe?g|gif|svg|webp|ico|woff2?|json|webmanifest|map|sql|md)$/i.test(path);

  if (isBypassPath) {
    return context.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const hasPass = cookieHeader
    .split(";")
    .some((c) => c.trim() === `${COOKIE_NAME}=${SECRET}`);

  const previewParam = url.searchParams.get("preview");

  if (previewParam === SECRET) {
    // Correct secret link: set the cookie, then redirect to the clean URL
    // (without the ?preview= part showing) so it doesn't linger in the
    // address bar or get accidentally shared.
    const dest = new URL(path, url.origin);
    return new Response(null, {
      status: 302,
      headers: {
        Location: dest.toString(),
        "Set-Cookie": `${COOKIE_NAME}=${SECRET}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
      },
    });
  }

  if (hasPass) {
    // Already unlocked this browser — show the real site.
    return context.next();
  }

  // No pass: serve the coming-soon page, but keep whatever URL the visitor
  // actually typed (so it works the same for every page, not just the
  // homepage).
  const comingSoon = await fetch(new URL("/coming-soon.html", url.origin));
  const body = await comingSoon.text();
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

export const config = { path: "/*" };
