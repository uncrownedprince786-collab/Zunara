# ZUNARA — BRAIN & ARCHITECTURE SPECIFICATION
**Project Single Source of Truth (SSOT)**
*Version:* 1.0.0-PROD
*Canonical Tagline:* "Written in the stars."

---

## 1. Product Vision
Zunara is an automation-first, premium modern astrology publication delivering mathematically calculated, reproducible daily, weekly, monthly, and yearly horoscopes for all 12 zodiac signs. Designed for continuous long-term operation on Vercel with zero manual daily maintenance, zero recurring AI API dependencies for core features, and a strict human editorial aesthetic.

---

## 2. Brand Identity
- **Product Name:** Zunara (strictly capitalized as Zunara or ZUNARA in wordmarks).
- **Positioning:** *Written in the stars.*
- **Identity:** Editorial, celestial, timeless, human, trustworthy.
- **Negative Constraints:** Zero AI buzzwords, no "AI-powered", no robot visuals, no purple gradient cliches, no fortune-teller stereotypes, no exaggerated claims of certainty.

---

## 3. UX/UI Principles
- **Editorial Tone:** High-end publication styling (Kinfolk/Monocle meets refined celestial geometry).
- **Theme Palette:** Deep space monochrome (#090A0F void background, #12151F obsidian cards, #E2E8F0 starlight text, #C5A880 celestial warm gold accent, #64748B subdued border tones).
- **Typography:** Refined serif display typography for headings (Playfair Display / Cormorant Garamond style) paired with clean geometric sans-serif for body readability (Inter / Plus Jakarta Sans).
- **Visual Restraint:** Restrained vector accents, crisp astronomical symbols, fine constellation line-work. No cluttered decorative noise or heavy animations that hurt Core Web Vitals.

---

## 4. Zodiac Visual System
- **12 Custom SVG Glyphs:** Dedicated vector icons for Aries (♈), Taurus (♉), Gemini (♊), Cancer (♋), Leo (♌), Virgo (♍), Libra (♎), Scorpio (♏), Sagittarius (♐), Capricorn (♑), Aquarius (♒), Pisces (♓).
- **Consistency Standard:** Unified 1.5px/2px vector stroke weight, monochrome-first rendering (crisp in light and dark contexts from 16px to 256px).
- **Component Interface:** `<ZodiacSymbol sign="leo" size="sm|md|lg|xl" className="..." />`
- **Accessibility & Semantics:** SVG elements always paired with semantic text labels, `aria-label`, schema markup, and standard HTML headings.

---

## 5. Planetary Visual System
- **10 Core Celestial Bodies:** Sun (☉), Moon (☽), Mercury (☿), Venus (♀), Mars (♂), Jupiter (♃), Saturn (♄), Uranus (♅), Neptune (♆), Pluto (♇), plus Lunar Nodes (☊/☋).
- **Deterministic UI Integration:** Every planetary UI element reflects real calculated ecliptic longitudes, zodiac degrees/minutes, and motion status (Direct vs. Retrograde). Zero purely decorative/fake astronomical positions.

---

## 6. Technical Stack
- **Framework:** Next.js 15 (App Router, React Server Components, Server Actions).
- **Language:** TypeScript 5+ (Strict mode, zero `any` types).
- **Styling:** Tailwind CSS 4 + custom celestial design tokens.
- **Astronomical Calculation:** `astronomy-engine` (Don Cross / cosinekitty, MIT License).
- **Database & ORM:** Neon Serverless PostgreSQL + Drizzle ORM.
- **Date & Calendar Engine:** Native UTC Date arithmetic + `date-fns` v4.
- **Testing Suite:** Vitest + React Testing Library + Playwright.
- **Hosting & CI/CD:** Vercel (Edge/Serverless) + GitHub Actions.

---

## 7. Application Architecture
```
┌────────────────────────────────────────────────────────────┐
│                    ASTRONOMY LAYER                         │
│  astronomy-engine (VSOP87 / IAU models, MIT, local Node.js)│
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│                 ASTROLOGY RULES ENGINE                     │
│  Western Tropical Zodiac, Aspect Orbs, Transit Matrices    │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│             DETERMINISTIC CONTENT PIPELINE                 │
│  Multi-fragment template synthesis + date/aspect seeding   │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│              VALIDATION & INTEGRITY GATE                   │
│  Section presence, duplicate check, medical/legal safety   │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│               STORAGE & CACHING (ISR)                      │
│  Neon PostgreSQL persistence + Next.js Edge CDN caching    │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│                   PUBLIC WEB ROUTES                        │
│  Sub-second Core Web Vitals, Schema.org JSON-LD, Sitemap   │
└────────────────────────────────────────────────────────────┘
```

---

## 8. Astronomy Engine
- **Selected Library:** `astronomy-engine` (npm: `astronomy-engine`).
- **License:** **MIT License** — fully permissive for commercial, proprietary, and open-source applications. Zero copyleft / source disclosure requirements.
- **Scientific Foundation:** Implements VSOP87 analytical planetary theory for major planets, combined with IAU precession, nutation, and aberration models.
- **Supported Calculations:**
  - Ecliptic coordinates (geocentric and heliocentric longitude $\lambda$, latitude $\beta$)
  - Tropical zodiac sign: $\lfloor \lambda / 30^\circ \rfloor$
  - Degree and minute within sign: $(\lambda \bmod 30^\circ)$
  - Apparent motion / retrograde detection: sign of $\Delta \lambda / \Delta t$ over small intervals
  - Angular separations and major aspects ($0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ$)
  - Lunar phases, equinoxes, solstices, and Moon node passages
- **Known Limitations:**
  - Does not bundle astrological house systems (Whole Sign houses calculated via straightforward $30^\circ$ coordinate projection; Placidus requires standard trigonometry).
  - Accuracy is on the order of arc-minutes (more than sufficient for zodiac sign placement where precision of $0.01^\circ$ is standard).
- **Reproducibility:** Version is strictly pinned in `package.json`. Every calculation snapshot records calculation timestamp, engine version, and Julian Date.

---

## 9. Astronomical Accuracy Strategy
- **No LLM Calculation:** Mathematical calculations are strictly executed by deterministic algorithms. Under no circumstances does an LLM generate planetary coordinates, aspect matrices, or transit timings.
- **Validation Suite:** Automated unit tests cross-verify computed longitudes against published NASA JPL Horizons ephemerides benchmarks for solar system bodies across multiple historical, current, and future epochs (2020–2040).
- **Consistency Verification:** Edge-case cusp testing ensures signs transition cleanly at exact $30^\circ$ ecliptic increments without roundoff drift.

---

## 10. Astrology Methodology
- **Zodiac System:** Western Tropical Astrology (0° Aries defined by the Vernal Equinox).
- **Aspects & Orb Matrix:**
  - Conjunction ($0^\circ$, orb $\pm 8^\circ$)
  - Sextile ($60^\circ$, orb $\pm 6^\circ$)
  - Square ($90^\circ$, orb $\pm 7^\circ$)
  - Trine ($120^\circ$, orb $\pm 8^\circ$)
  - Opposition ($180^\circ$, orb $\pm 8^\circ$)
- **Planetary Rulerships:** Structured lookup tables mapping both traditional and modern planetary rulers for all 12 signs.

---

## 11. Astrology Rules Engine
- **Engine Design:** Pure TypeScript functional pipeline.
- **Input:** `PlanetarySnapshot` (positions, velocities, aspects).
- **Evaluation:** Evaluates active transits, aspect patterns, retrograde status, element balances, and sign house dynamics.
- **Output:** Structured interpretation object detailing dominant themes (Love, Career, Money, Energy, Advice), influence intensity (`strong` | `moderate` | `subtle`), and relevant transit notes.

---

## 12. Deterministic Content Engine
- **Primary Generator:** Template-based combinatorial synthesis driven by deterministic pseudo-random hashing (`hash(sign + period_type + period_key + transit_fingerprint)`).
- **Quality & Variety Assurance:**
  - Over 200+ distinct, curated prose fragments across all themes.
  - Measurable deduplication check: Automated tests ensure n-gram / Jaccard similarity across simultaneous sign forecasts remains below defined thresholds.
  - Zero duplicate paragraph blocks across signs for any given period.
- **Optional Editorial Abstraction:** Pluggable `ContentInterpreter` interface allows an optional LLM layer to refine prose in future updates, while always preserving the deterministic engine as the instant, zero-cost fallback.

---

## 13. Automation (Daily, Weekly, Monthly, Yearly)
- **Vercel Cron Schedule:** Daily scheduled job triggered at `04:00 UTC` via `/api/cron/daily`.
- **Dynamic Rollover Logic:**
  - **Daily:** Runs every UTC day to compute planetary data and publish 12 daily horoscopes.
  - **Weekly:** Detects Monday UTC boundary ($\text{day} = 1$) to generate 12 weekly forecasts for the upcoming 7-day span.
  - **Monthly:** Detects 1st day of the month ($\text{date} = 1$) to generate 12 monthly deep-dive forecasts.
  - **Yearly:** Detects Jan 1 ($\text{month} = 0, \text{date} = 1$) to generate 12 annual forecasts for the new year.
- **Future-Proofing:** Zero hardcoded year assumptions (e.g., no static "2026" strings in core logic). Date math dynamically operates for any year $Y \in [2026, 2040+]$.

---

## 14. Date & Timezone Strategy
- **Canonical Publication Timezone:** UTC (`Etc/UTC`).
- **Standardized Period Keys:**
  - Daily: `YYYY-MM-DD`
  - Weekly: `YYYY-Www` (ISO week)
  - Monthly: `YYYY-MM`
  - Yearly: `YYYY`
- **Client Presentation:** UI components display canonical UTC publication dates with optional localized display formatting.

---

## 15. Database Strategy
- **Database:** Neon Serverless PostgreSQL with pooled connections (`@neondatabase/serverless` / `pg`).
- **ORM:** Drizzle ORM with schema migrations tracked in source control.
- **Tables:**
  - `zodiac_signs`: Reference metadata (slug, name, glyph, element, modality, ruler, date range).
  - `planetary_snapshots`: Computed planetary positions with timestamp and engine version.
  - `horoscopes`: Published horoscope records with composite unique key `(sign_slug, period_type, period_key)`.
  - `generation_jobs`: Execution telemetry, status, duration, and error logs.
  - `system_health`: Stale data alerts, coverage records, and operational flags.
- **Idempotency:** Composite unique constraints guarantee safe re-execution of cron jobs without duplicating data.

---

## 16. Caching & ISR (Incremental Static Regeneration)
- **Strategy:** Next.js ISR caches public HTML at Vercel's Edge network.
- **Revalidation TTL:**
  - Daily horoscopes: 3600 seconds (1 hour) or on-demand via `revalidatePath` / `revalidateTag` inside cron route.
  - Weekly / Monthly / Yearly: 86400 seconds (24 hours).
  - Evergreen astrology guides: 604800 seconds (7 days).
- **Database Protection:** End-user page visits are served directly from the Edge cache without hitting PostgreSQL on every request.

---

## 17. SEO Architecture
- **URL Structure:**
  - `/horoscope/[sign]` (Sign overview hub)
  - `/horoscope/[sign]/today` (Canonical daily horoscope)
  - `/horoscope/[sign]/weekly` (Canonical weekly horoscope)
  - `/horoscope/[sign]/monthly` (Canonical monthly horoscope)
  - `/horoscope/[sign]/yearly` (Canonical yearly horoscope)
  - `/astrology` (Evergreen astrology knowledge base)
  - `/astrology/[topic]` (Topic guides: birth chart, transits, retrogrades, aspects, signs)
- **Canonicalization:** Every page sets an explicit, absolute canonical URL avoiding query string parameters, trailing slash mismatches, or staging domains.

---

## 18. Google Search Central Alignment
- **Policy Compliance:** Strictly adheres to Google Search Central quality guidelines (useful, original, high-intent editorial content).
- **Prohibited Tactics:** Zero doorway pages, zero keyword stuffing, zero mass-generated thin pages, zero deceptive clickbait headlines.
- **E-E-A-T & Trust:** Clear editorial methodology, transparent astronomical calculation documentation, clear astrological entertainment disclaimers, and structured author/publisher entity metadata.

---

## 19. Structured Data (Schema.org)
- **Format:** JSON-LD script blocks embedded via Server Components.
- **Schema Types:**
  - `WebSite` with SearchAction on homepage.
  - `Organization` with brand identity and legal details.
  - `Article` / `BlogPosting` on all horoscope and educational pages with `datePublished`, `dateModified`, `headline`, and `publisher`.
  - `BreadcrumbList` across all hierarchical routes.
- **No Invalid Markup:** No deprecated FAQ schema, no fabricated star ratings, no fake reviews.

---

## 20. Sitemap & Robots
- **Dynamic Sitemap (`/sitemap.xml`):** Generated via Next.js App Router `sitemap.ts`. Includes all valid indexable routes with genuine `lastModified` timestamps reflecting content updates.
- **Robots Configuration (`/robots.txt`):** Allows all major search engines to crawl public content while disallowing `/api/`, `/admin/`, and private endpoints. Points directly to canonical `/sitemap.xml`.

---

## 21. Internal Linking Strategy
- **Topology:**
  - Homepage links to all 12 signs.
  - Sign detail pages provide bidirectional navigation (switch between Daily, Weekly, Monthly, Yearly).
  - Horizontal carousel/grid links each sign to the adjacent zodiac signs for the same time period.
  - Educational articles contextually link to relevant sign and transit pages.
  - Breadcrumb navigation rendered on all deep pages.

---

## 22. Accessibility (WCAG 2.1 AA)
- **Semantic Structure:** Native HTML5 landmark elements (`<main>`, `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>`).
- **Contrast:** Minimum 4.5:1 text-to-background contrast across dark theme.
- **Assistive Technology:** Every vector symbol includes accessible `aria-label` and `role="img"`. All interactive controls have visible focus rings and full keyboard navigability.

---

## 23. Performance & Core Web Vitals
- **Target Metrics:** LCP $\le 2.0\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$.
- **Optimization:** Next.js font optimization (`next/font`), zero client-side calculation overhead, minimal client JavaScript, full React Server Component rendering.

---

## 24. Security & Compliance
- **Secret Isolation:** Database connection strings, `CRON_SECRET`, and internal tokens are restricted strictly to server-side environments and never leaked to the client bundle.
- **Endpoint Security:** `/api/cron/*` strictly requires `Authorization: Bearer ${CRON_SECRET}`.
- **HTTP Headers:** Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options configured in `next.config.ts`.
- **Legal Requirements:** Clear Privacy Policy, Terms of Service, and Astrology Disclaimer (astrology is not a substitute for professional medical, legal, or financial advice).

---

## 25. Free Data & External API Policy
- **Core Engine:** **Zero external API dependency** for planetary calculations (runs 100% locally via `astronomy-engine`).
- **Optional Services:**
  - Neon PostgreSQL: Free tier (0.5 GB storage, 100 compute hours/month) — ample for thousands of horoscope snapshots.
  - Vercel Analytics: Free tier / privacy-friendly web analytics.
- **Resilience:** The website will never experience an outage due to a 3rd-party astrology API outage or rate-limit expiration.

---

## 26. Monitoring & Self-Healing
- **Health Check Endpoint (`/api/health`):** Validates database connectivity, planetary data freshness ($< 36\text{h}$ old), and 12-sign daily horoscope coverage.
- **Graceful Fallback:** If scheduled cron fails, Next.js ISR continues serving the last valid cached content while logging the incident in `generation_jobs`. On-demand serverless regeneration serves as a secondary self-healing layer.

---

## 27. Future Personalized Astrology Architecture
- **Foundation Design:** Data models and calculation modules are structured to support:
  - Input: Date of birth, exact UTC birth time, geographic coordinates (latitude, longitude).
  - Computation: Geocentric natal planet longitudes, Whole Sign / Placidus house cusps, natal aspect matrices, and natal-to-transit aspect transpositions.
  - Zero rework needed for the core calculation layer.

---

## 28. Testing Strategy
- **Unit Tests:**
  - Astronomy: Planetary positions vs. JPL Horizons ephemerides benchmarks, cusp transitions, retrograde velocity checks.
  - Date Engine: Month rollovers, leap years, Dec 31 $\rightarrow$ Jan 1 year transitions, UTC alignment.
  - Content: Deduplication checks, required sections validation, disclaimer presence.
  - SEO: Canonical URLs, metadata generator, schema markup validation.
- **Integration Tests:** End-to-end cron generation lifecycle and database upserts.
- **Build Verification:** Strict TypeScript typecheck (`tsc --noEmit`), linting (`eslint`), and production build verification (`next build`).

---

## 29. Definition of Done
The product is production-ready when:
1. All 12 zodiac signs display real, mathematically calculated daily, weekly, monthly, and yearly horoscopes.
2. The site operates continuously across future dates and years without human code edits.
3. Vercel Cron runs reliably, securely, and idempotently.
4. Core Web Vitals and SEO audit pass with clean scores.
5. All automated unit, integration, and build tests pass.
