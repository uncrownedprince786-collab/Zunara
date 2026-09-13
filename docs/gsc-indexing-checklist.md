# Zunara — Google Search Console: Verification & Indexing Runbook

**Status:** operational · **Last updated:** 2026-09-13 · **Property:** `https://zunara.vercel.app`

A step-by-step runbook for getting Zunara fully verified, its sitemap processed, and its core pages indexed in Google Search Console (GSC). Everything here is checked against the **real** repo setup — no placeholder routes.

> Scope note: this is the *indexing* runbook (get pages into the index). Ongoing query/CTR/position optimization lives in `docs/gsc-growth-loop.md`.

---

## 0. What is already in place (verify, don't rebuild)

| Asset | Where it lives | State |
| --- | --- | --- |
| Site verification file | `public/google9df2010af91f142c.html` (committed, live) | ✅ deployed |
| Dynamic sitemap | `src/app/sitemap.ts` → served at `/sitemap.xml` | ✅ ~130+ URLs |
| robots directives | `src/app/robots.ts` → served at `/robots.txt` | ✅ allows all, disallows `/api/ /admin/ /_next/`, points to sitemap |
| Canonical tags | every page via `metadata.alternates.canonical` | ✅ universal |
| Structured data | `WebSite`+`Organization` (home), `SoftwareApplication` (birthchart/synastry/sky-map), `ItemList`/`Person` (birthdays), `FAQPage` (horoscope) | ✅ live |

**Do not** replace the sitemap with a hand-written route list — it is generated from real data (all 12 signs × 5 period pages, all planets, houses, astrology topics, birthday dates, tools, library, legal). A static list would silently drop pages.

---

## 1. Confirm verification (one-time)

1. Open [Google Search Console](https://search.google.com/search-console) with the account that owns the property.
2. Confirm the **URL-prefix property** `https://zunara.vercel.app` shows **Ownership verified**.
   - Verification method: **HTML file** — Google fetches `https://zunara.vercel.app/google9df2010af91f142c.html`.
   - Sanity check it resolves: open that URL in a browser; it must return the single line `google-site-verification: google9df2010af91f142c.html`.
3. Do **not** delete `public/google9df2010af91f142c.html` — removing it un-verifies the property.

> Optional hardening: also add the same site as a **Domain property** (`zunara.vercel.app`) via a DNS TXT record if you control DNS. A domain property aggregates http/https and all subpaths. Not required; the URL-prefix property is sufficient.

---

## 2. Submit the sitemap

1. GSC → **Indexing → Sitemaps**.
2. In "Add a new sitemap", enter: `sitemap.xml` (GSC prepends the property origin) → **Submit**.
   - Full URL for reference: `https://zunara.vercel.app/sitemap.xml`
3. Expected result within minutes–hours: **Status = Success**, "Discovered URLs" ≈ the count `sitemap.ts` emits (12 signs × 5 + planets + houses + topics + birthday dates + tools + library + legal + rss).
4. If Status = "Couldn't fetch": re-open `/sitemap.xml` directly to confirm it renders XML (200), wait, then click **Refresh** in GSC. A fresh deploy can take a few minutes to propagate on Vercel.

---

## 3. Prioritized indexing (URL Inspection → Request Indexing)

Google indexes the sitemap on its own schedule; **URL Inspection** nudges your most important pages to the front of the queue. Do these **money/entry pages first** (real routes):

**Tier 1 — core entry + tools**
- `https://zunara.vercel.app/`
- `https://zunara.vercel.app/birthchart`
- `https://zunara.vercel.app/synastry`
- `https://zunara.vercel.app/sky-now`
- `https://zunara.vercel.app/horoscope`
- `https://zunara.vercel.app/famous-birthdays`

**Tier 2 — high-intent SEO surfaces**
- `https://zunara.vercel.app/horoscope/aries` (repeat for the 11 other signs as capacity allows)
- `https://zunara.vercel.app/horoscope/aries/today`
- `https://zunara.vercel.app/sky-events`
- `https://zunara.vercel.app/astrology` (+ a few `/astrology/[topic]` pages)

For each URL:
1. Paste it into the **URL Inspection** bar (top of GSC).
2. If "URL is not on Google" → click **Request Indexing** → wait for the live test → **Request Indexing** confirmed.
3. If "URL is on Google" → done; only re-request after a **material** content change.

> Quota reality: "Request Indexing" is rate-limited (roughly a dozen or so per property per day). Spend it on Tier 1/2 above; let the sitemap carry the long tail (period pages, birthday dates, library, planets, houses). Requesting indexing does **not** guarantee or speed guaranteed inclusion — it only queues a crawl.

---

## 4. Weekly monitoring (first 4–6 weeks)

| GSC report | What to watch | Healthy signal |
| --- | --- | --- |
| **Pages** (Indexing) | "Indexed" count climbing; "Not indexed" reasons | Indexed trending up toward sitemap total |
| **Sitemaps** | Status stays **Success**; discovered ≈ emitted | No fetch errors |
| **Page indexing → reasons** | "Crawled – currently not indexed", "Discovered – currently not indexed", "Duplicate without user-selected canonical", "Alternate page with proper canonical tag" | Few/none; investigate spikes |
| **Experience / Core Web Vitals** | Mobile CWV status | "Good" (see `brain.md` Sprint #41b Lighthouse work) |
| **Enhancements** | Any structured-data errors for the emitted schema types | Zero errors |

**Common "Not indexed" reasons and the real fix here:**
- *Crawled – currently not indexed* → usually thin/duplicate content or low authority. Normal for deep long-tail (individual birthday dates); prioritize internal links + unique copy, don't spam re-index requests.
- *Duplicate without user-selected canonical* → shouldn't occur (every page emits a self-canonical). If it does, confirm the reported URL's `<link rel="canonical">` matches its address.
- *Alternate page with proper canonical* → expected/benign for any intentional canonical consolidation.

---

## 5. Validate structured data separately

1. [Rich Results Test](https://search.google.com/test/rich-results) → test `https://zunara.vercel.app/birthchart` (expect **SoftwareApplication**), `https://zunara.vercel.app/` (**WebSite**/**Organization**), a `/birthday/MM-DD` URL (**ItemList**/**Person**), `https://zunara.vercel.app/horoscope` (**FAQ**).
2. Fix any flagged **errors** (warnings are usually optional-field notices and safe to leave).
3. Re-test after any change to `src/lib/seo/jsonld.ts`.

---

## 6. Known limitations (so expectations are honest)

- **hreflang is same-URL.** Zunara serves all six locales (`en, ur, ar, es, zh, hi`) at the *same* URL via a client-side language switcher, so `alternateLanguages()` points every language code + `x-default` at one canonical URL. Google largely treats this as a single (English) page. **True multilingual indexing would require locale-routed, server-rendered pages** (`/es/...`, `/ar/...` with translated HTML) — a separate architecture project, not a metadata tweak. Until then, do not expect per-language ranking in non-English markets from metadata alone.
- **No `SearchAction` (sitelinks search box).** The site has no server-rendered `/search?q=` results endpoint, so a `WebSite.potentialAction` SearchAction would point at a non-existent target and fail validation. Add it only if/when a real search results route ships.
- **`Event` schema on `/sky-events` is deferred.** Events are computed client-side and their title/description fields hold i18n keys (not display text), so server-side `Event` markup would need the dictionary-resolution + conjunction-title logic duplicated on the server. Marginal rich-result value for non-attendable astronomical events; revisit only if event rich results become a goal.

---

## 7. One-glance checklist

- [ ] Property `https://zunara.vercel.app` shows **Ownership verified** (HTML file resolves)
- [ ] `/sitemap.xml` returns XML (200) in a browser
- [ ] Sitemap submitted in GSC → **Success**, discovered count ≈ emitted
- [ ] `/robots.txt` returns rules + `Sitemap:` line
- [ ] Tier 1 URLs individually **Request Indexing**'d
- [ ] Tier 2 URLs requested as quota allows
- [ ] Rich Results Test passes for birthchart / home / birthday / horoscope
- [ ] Weekly: Pages-indexed count trending up, Sitemaps still Success, zero structured-data errors
