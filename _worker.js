// bpaau.org Worker entrypoint.
// - Enforces HTTPS
// - Redirects www -> apex
// - Redirects .html URLs to clean URLs (301, SEO-friendly)
// - Normalises trailing slashes
// - Serves static assets from ./public via the ASSETS binding
//   (ASSETS natively serves clean URLs: /about -> about.html)

// Files that must remain accessible at their .html URL (e.g. search-engine verification).
const VERIFICATION_FILES = new Set([
  "/google6c4a857337176f53.html",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Enforce HTTPS on any host.
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // 2. Redirect www -> apex (preserve path + query).
    if (url.hostname === "www.bpaau.org") {
      url.hostname = "bpaau.org";
      return Response.redirect(url.toString(), 301);
    }

    let path = url.pathname;

    // 3. Allow verification files to pass through untouched.
    if (VERIFICATION_FILES.has(path)) {
      return env.ASSETS.fetch(request);
    }

    // 4. Redirect .html URLs to their clean equivalent (301 for SEO).
    if (path.endsWith(".html")) {
      let clean = path.slice(0, -5); // strip ".html"
      if (clean === "/index") clean = "/";
      url.pathname = clean;
      return Response.redirect(url.toString(), 301);
    }

    // 5. Normalise trailing slashes: /about/ -> /about (root stays "/").
    if (path.length > 1 && path.endsWith("/")) {
      url.pathname = path.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // 6. Serve from ASSETS. Clean URLs (/about) are natively resolved to
    //    about.html by the ASSETS binding — no manual rewrite needed.
    //    If a clean URL 404s, fall back to trying the .html file directly.
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !path.includes(".") && path !== "/") {
      const htmlUrl = new URL(request.url);
      htmlUrl.pathname = path + ".html";
      const htmlRequest = new Request(htmlUrl.toString(), request);
      const htmlResponse = await env.ASSETS.fetch(htmlRequest);
      if (htmlResponse.status !== 404) {
        response = htmlResponse;
      }
    }

    // 7. Post-process response: add SEO/security headers that ASSETS doesn't set.
    return addResponseHeaders(response, path);
  },
};

// Add security + SEO headers. Cloudflare Workers' ASSETS binding doesn't
// consistently apply _headers, so we set them here on every response.
function addResponseHeaders(response, path) {
  const h = new Headers(response.headers);
  const ct = h.get("content-type") || "";

  // Always-on security headers
  if (!h.has("strict-transport-security"))
    h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  if (!h.has("x-content-type-options"))
    h.set("X-Content-Type-Options", "nosniff");
  if (!h.has("referrer-policy"))
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!h.has("permissions-policy"))
    h.set("Permissions-Policy", "interest-cohort=(), browsing-topics=()");
  if (!h.has("x-frame-options"))
    h.set("X-Frame-Options", "SAMEORIGIN");

  // Content Security Policy: safe defaults for a static content site.
  // Inline styles/scripts are used in this codebase (theme + tiny inline JS),
  // and Google Fonts is the only external asset host, so allow those.
  if (!h.has("content-security-policy") && ct.includes("text/html")) {
    h.set(
      "Content-Security-Policy",
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'self'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "upgrade-insecure-requests"
    );
  }

  // Add charset to HTML Content-Type if missing
  if (ct.startsWith("text/html") && !ct.toLowerCase().includes("charset")) {
    h.set("Content-Type", "text/html; charset=utf-8");
  }

  // Cache-Control for HTML: short cache with stale-while-revalidate.
  // ASSETS' default is often max-age=0 for HTML; override so repeat visits are fast.
  if (ct.includes("text/html") && response.status === 200) {
    h.set("Cache-Control", "public, max-age=600, stale-while-revalidate=86400");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: h,
  });
}
