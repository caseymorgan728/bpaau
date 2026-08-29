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

    return response;
  },
};
