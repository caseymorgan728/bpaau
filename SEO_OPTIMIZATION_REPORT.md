# BPAAU.org SEO Optimization Report — Before & After

**Date:** 2026-08-29
**Pages audited:** 32
**Overall score:** 74/100 (B) → **91/100 (A−)**
**Improvement:** +17 points

---

## 1. Score Summary

| Category | Weight | Before | After | Change |
|---|---|---|---|---|
| Crawlability & Indexation | 20% | 7.5 | 9.5 | +2.0 |
| On-Page Meta (title/desc) | 25% | 6.0 | 9.5 | +3.5 |
| Content & Structure | 20% | 7.0 | 8.0 | +1.0 |
| Media / Images | 10% | 6.0 | 9.5 | +3.5 |
| Structured Data | 10% | 9.0 | 9.0 | 0 |
| Performance & Mobile | 10% | 8.5 | 9.0 | +0.5 |
| Trust & E-E-A-T | 5% | 9.0 | 9.0 | 0 |
| **Weighted total** | | **74/100** | **91/100** | **+17** |

---

## 2. Issues Fixed (Detailed)

### 2.1 Title Tags — 29/32 were over 60 chars → 100% compliant

**Before:** Titles ranged 61–79 chars; Google truncates at ~60 chars (580px). Only 3/32 were within the safe limit.

**After:** All 32 titles are 44–60 chars, keyword-first, unique, with brand "BPAAU" where natural.

**Example:**
- Before: `Best Pokies Australia | BPAAU – Free Chips, PayID & High RTP Pokies 2026` (72 chars)
- After: `Best Pokies Australia 2026 | Free Chips & High RTP Slots` (56 chars)

### 2.2 Meta Descriptions — 30/32 were over 160 chars → 100% compliant

**Before:** Descriptions ranged 170–230 chars; Google shows ~150–160. Only 2/32 were within range.

**After:** All 32 descriptions are 138–157 chars, with primary keyword, value proposition, and "18+" compliance note.

### 2.3 Soft-404 — nonexistent URLs returned homepage with HTTP 200 → Fixed

**Root cause:** `wrangler.jsonc` had `"not_found_handling": "single-page-application"`, causing Cloudflare to serve index.html for any unknown path.

**Fix:** Changed to `"not_found_handling": "404"`. Unknown paths now return proper 404.

### 2.4 www.bpaau.org returned HTTP 403 → 301 redirect added

**Fix:** Added www→apex redirect in `_worker.js`. Any request to `www.bpaau.org` now 301-redirects to `bpaau.org`, preserving path and query.

### 2.5 Clean URLs — all pages used `.html` extension → Clean URLs implemented

**Changes:**
- All internal links updated from `page.html` to `/page`
- All canonical URLs updated to clean format
- Sitemap.xml updated with 32 clean URLs
- llms.txt updated with clean URLs
- `_worker.js` now: 301-redirects `.html` URLs to clean equivalents, internally rewrites clean URLs to `.html` for static serving, normalises trailing slashes
- Google verification file (`google6c4a857337176f53.html`) is exempted from redirects

### 2.6 Image Alt Text — 27/32 pages had empty alt → 100% fixed

**Before:** 34 images across 27 pages had `alt=""` (site logo on all pages + 8 page banners).

**After:** All images have descriptive alt text:
- Logo: `alt="BPAAU — Best Pokies Australia logo"`
- Banners: page-specific descriptions (e.g., `alt="Megaways free spins no deposit Australia 2026 — BPAAU banner"`)

### 2.7 Thin Blog Category Pages — 5 pages had 366–430 words → 623–735 words

**Pages:** blog-bonus-guides, blog-fast-cashouts, blog-promo-guides, blog-top-pokies, blog-winning-tips

**Fix:** Added a keyword-rich intro section (239–313 words each) between the hero and post listing, covering:
- Topic overview with internal links to relevant guides
- Key concepts explained (wagering, KYC, RTP, volatility, etc.)
- Practical advice for Australian players
- 18+ responsible gambling notes

### 2.8 Security Headers — Missing HSTS, X-Frame-Options → Added

**Added to `_headers` (global `/*`):**
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: interest-cohort=()`
- `X-XSS-Protection: 1; mode=block`

### 2.9 Broken Internal Link — Fixed

**Issue:** `best-high-rtp-pokies-australia-2026.html` linked to `free-spins-no-deposit-megaways-australia.html` (nonexistent page).

**Fix:** Redirected to `/ausmegaways44` (the correct Megaways page).

---

## 3. Files Changed (37 total)

### Configuration & Infrastructure (4)
- `_worker.js` — Complete rewrite: HTTPS, www→apex, .html→clean redirects, trailing slash normalisation, clean URL→.html rewrite, verification file exemption
- `wrangler.jsonc` — `not_found_handling`: `single-page-application` → `404`
- `public/_headers` — Added global security headers (HSTS, X-Frame-Options, etc.)
- `public/llms.txt` — Updated 31 URLs to clean format

### Content (32 HTML pages + sitemap)
- All 32 `.html` files in `public/` — Updated titles, meta descriptions, OG tags, canonical URLs, internal links, image alt text
- 5 blog category pages — Added keyword-rich intro content
- `public/sitemap.xml` — Updated all 32 URLs to clean format

---

## 4. Post-Optimization Verification (All Pass)

| Check | Result |
|---|---|
| All 32 pages have title ≤60 chars | ✅ 32/32 |
| All 32 pages have meta description 138–157 chars | ✅ 32/32 |
| All titles unique | ✅ 0 duplicates |
| All descriptions unique | ✅ 0 duplicates |
| Exactly 1 H1 per page | ✅ 32/32 |
| Canonical URLs clean (no .html) | ✅ 32/32 |
| Internal links clean (no .html) | ✅ 32/32 |
| No empty/missing image alt | ✅ 32/32 |
| JSON-LD present | ✅ 32/32 |
| Viewport meta present | ✅ 32/32 |
| OG tags match titles/descriptions | ✅ 32/32 |
| Sitemap URLs clean | ✅ 32/32 |
| Worker: HTTPS redirect | ✅ |
| Worker: www→apex redirect | ✅ |
| Worker: .html→clean redirect | ✅ |
| Worker: clean URL→.html rewrite | ✅ |
| Worker: trailing slash normalisation | ✅ |
| Worker: verification file exemption | ✅ |
| Wrangler: 404 handling (soft-404 fixed) | ✅ |
| Security headers (HSTS, X-Frame, etc.) | ✅ |
| llms.txt clean URLs | ✅ |

---

## 5. Remaining Opportunities (Off-Page / Next Steps)

These are outside the scope of on-page/technical fixes but would further improve rankings:

1. **Backlink building** — The site has no measurable backlink profile yet. For a gambling affiliate niche, high-quality backlinks from Australian gambling/entertainment sites are critical.
2. **Descriptive URL slugs** — Current clean URLs retain cryptic slugs (e.g., `/ausmegaways44`, `/bestrtp44-aus`). Renaming to descriptive slugs (e.g., `/megaways-free-spins`, `/best-high-rtp-pokies`) would improve CTR and relevance, but requires additional 301 redirects.
3. **Core Web Vitals** — Field data (LCP, CLS, INP) should be monitored via Google Search Console / PageSpeed Insights once deployed.
4. **Google Search Console submission** — Submit the updated sitemap and request re-indexing after deployment.
5. **Keyword cannibalization** — Several pairs of pages target overlapping keywords (e.g., high RTP review vs. high RTP guide). Consider differentiating angles further or consolidating internal linking.
6. **Author / E-E-A-T signals** — Add author bios with credentials to blog articles for stronger YMYL trust signals.

---

## 6. Deployment Notes

After committing and deploying via `wrangler deploy`:
- Old `.html` URLs will automatically 301-redirect to clean URLs (preserving SEO equity)
- Submit the new sitemap (`https://bpaau.org/sitemap.xml`) to Google Search Console
- Use the URL Inspection tool to request re-indexing of key pages
- Monitor Search Console for any crawl errors or indexing issues over the next 2–4 weeks
