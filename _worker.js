// bpaau.org Worker entrypoint.
// - Enforces HTTPS
// - Redirects www -> apex
// - Redirects .html URLs to clean URLs (301)
// - Internally rewrites clean URLs to .html for static asset serving
// - Serves static assets from ./public via the ASSETS binding

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

    // 4. Redirect .html URLs to their clean equivalent.
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

    // 6. Internally rewrite clean URLs to .html for the static asset handler.
    //    Paths with a file extension (e.g. .css, .png, .webp, .txt, .xml) pass through.
    let assetPath = path;
    if (path === "/" || path === "") {
      assetPath = "/index.html";
    } else if (!path.includes(".")) {
      assetPath = path + ".html";
    }

    // Build a new request pointing at the asset path, preserving method + headers.
    const assetUrl = new URL(request.url);
    assetUrl.pathname = assetPath;
    const assetRequest = new Request(assetUrl.toString(), request);

    return env.ASSETS.fetch(assetRequest);
  },
};
