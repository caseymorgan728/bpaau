# BPAAU — Australian Pokies & Free Chips Portal

SEO-optimized static site targeting the Australian online pokies market for 2026.

- **Live domain:** https://bpaau.org
- **Pages:** 27 (1 home, 7 brand landing, 1 blog hub, 5 category, 13 SEO articles)
- **Stack:** Static HTML + a single shared CSS file. No build step.

## Structure

- `index.html` — homepage
- `blog.html` + `blog-*.html` — blog hub and 5 category pages
- 14 SEO articles (slug-based filenames, e.g. `best-high-rtp-pokies-australia-2026.html`)
- 7 brand landing pages (`ausmegaways44.html`, `bestrtp44-aus.html`, …)
- `assets/theme.css` — shared stylesheet
- `assets/`, `banners home/`, `blog banner/`, `logo app/`, `popout banner/`, `popout vertical/` — image assets
- `sitemap.xml`, `robots.txt` — crawl configuration

## SEO

- Every page has a unique title (≤60), meta description (≤170), single H1, canonical, viewport
- Structured data: Organization, WebSite, BreadcrumbList, FAQPage, Article (where applicable)
- All internal URLs, canonicals, og:url, JSON-LD `url` / `item` fields and the sitemap use the absolute domain
- All images have `alt` text and `loading="lazy"` (except the header logo, which is eager)

## Deploying

The site is static — any host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages, a plain web server). No server-side code required.
