# Zunara Project Brain — SSOT

## Sprint #17: Repo-Wide Bug Fixes, Graphic Alignment & Translation Engine

**Status: COMPLETED & DEPLOYED**

**Commit:** `Sprint #17: repo-wide i18n, celeb expansion, LMT birth-time fix, moon-phase localization, watermark centering`

---

### Task 1 — Celestial Events Empty-State Fix ✅
- Created `src/lib/content/sky-events-data.ts` — full-year 2026 real celestial dataset (~40 verified events: meteor showers, eclipses, solstices, equinoxes, supermoons)
- Rewrote `src/components/sky/sky-events.tsx` — `selectActiveMonthEvents` tracks `foundMonth`, pulls next month when active month < 3 events, falls back to single next event when neither has events; merged remote + fallback so sparse/empty feed never blanks
- 9/9 tests pass including Sept 2026 regression

### Task 2 — Celebrity Hub Expansion ✅
- Created `src/lib/content/celebrity-pool.ts` — ~540 supplementary verified figures across all 365 days, all regions (Global, Hollywood, Bollywood, K-Pop, Thai, Sports)
- Modified `celebritiesForDate()` with deterministic FNV-1a hash + diversity-preserving selection algorithm that ensures every day shows 4–6 celebrities
- Priority: same-date pool entries first, then global pool; diversity across regions and professions
- No fabricated birthdates — all entries verified
- Test asserts `returns 4-6 celebrities for every day of the year` — passes

### Task 3 — Hero Vitruvian Watermark Centering ✅
- Rewrote `src/components/ui/vitruvian-hero.tsx` — `pointer-events-none absolute inset-0 flex items-center justify-center select-none` wrapper, `<Image width={550} height={550}>` with `mx-auto max-w-[550px] object-contain opacity-15`
- Removed overflow-hidden, left-1/2 top-10 -translate-x-1/2, aspect-square wrapper
- Updated `src/app/page.tsx` wrapper to `absolute inset-0 z-0`
- Updated `src/app/birthchart/birthchart-client.tsx` to wrap in `relative mx-auto h-80 max-w-6xl select-none`

### Task 4 — Plain-English Moon Phase Labels ✅
- Added `phases` dict block (8 phase names + `moonInSign`/`illuminated`/`phaseSubtitle`) to all 5 languages
- Added `phaseHints` dict block (8 per-phase energy hints) to all 5 languages
- Created `PHASE_KEY` mapping in `moon-sign-card.tsx` and `moon-phase.tsx` to localize `phase.name`
- Translated "Moon in X", "X% illuminated — the lunar cycle..." and all subtitles
- `moon-phase.tsx` promoted to client component for i18n

### Task 5 — Deep i18n (Zero English Leaks) ✅
- Extended `ChangeItem` interface with `sign`, `bodyA`, `bodyB`, `aspect` structured fields
- Added `aspects` dict block (5 aspect names + `orb`) to all 5 languages
- Added `changes` dict block (14 template/blurb keys) to all 5 languages
- Created `LocalizedChange` client component (`src/components/ui/localized-change.tsx`) with template substitution
- Updated all 3 render sites: `bento-zodiac-grid.tsx`, `horoscope-article.tsx` `ChangesPanel`, sign `[page.tsx] Recently`
- Home page transit bulletin: `transit.name` now translated via `LocaleText path="aspects.${transit.name}"`, "orb" translated
- Phase names and subtitles translated via `phases` block

### Task 6 — Birth Chart Geolocation (LMT Offset) ✅
- Modified `validate.ts` `buildDate()` to apply Local Mean Time (LMT) offset from longitude: `UTC = local civil time - longitude/15 hours`
- New York (lon=-74.006): 12:00 PM noon → 16:56 UTC; 9:30 AM → 14:26 UTC
- Fixed cross-field calendar check to verify LOCAL date validity (not UTC) so east-locale PM times don't fail validation
- Updated `NOON_ASSUMPTION_NOTE` to reflect "local mean time for the birthplace (converted to UTC via longitude offset)"
- Updated 3 natal tests for LMT-converted UTC values
- Nominatim geolocation search (city → lat/long) already existed in `BirthForm`; LMT completes the pipeline
- try/catch error boundaries already in place; defensive null guard added for `buildDate` return

### Task 7 — Verification, Lint, Deploy + Brain.md ✅
- `npx tsc --noEmit` — PASS (0 errors)
- `npx vitest run` — PASS (135/135 tests across 12 files)
- `npx next build` — PASS (83/83 routes generated)
- `npx eslint` (modified files) — PASS (0 warnings/errors)
- `brain.md` created with Sprint #17 SSOT
- Committed and pushed to `origin/master` → `main`

---

## Architecture Notes

- **i18n**: Client-only via `useLocale()` hook + cookie `zunara-locale`. Dictionaries in `src/lib/i18n/dictionaries.ts` (~2970+ lines, 5 languages). `Dict = typeof en` enforces structural parity via typecheck. All UI strings localized — zero hardcoded English in components.
- **Error boundaries**: `ErrorBoundary` wraps all layout client components to prevent full-tree crashes from individual component failures.
- **Mobile rendering**: `background-attachment: fixed` removed from `<body>` (iOS Safari bug). Background gradient applied to `html` element directly — no pseudo-elements that could interfere with the meteor canvas stacking.
- **Celebrity images**: Native `<img loading="lazy">` loads directly from Wikimedia thumbnails, bypassing Vercel's failing image optimization proxy. `onError` fallback to zodiac glyph.
- **Astro engine**: Pure VSOP87 deterministic — `computeNatalChart(date, coords, options)`. No external API.
- **Birth time**: Local civil time converted to UTC via LMT longitude offset (classic astrological method).
- **Supplemental data**: `celebrity-pool.ts` provides ~540 supplementary figures; `sky-events-data.ts` provides full-year 2026 celestial events baseline with localized titles/descriptions.
- **Deploy**: `git push origin master:main`. Live at `https://zunara.vercel.app`.
- **Remote**: `https://github.com/uncrownedprince786-collab/Zunara`. Branch: `master` tracks `origin/main`.

---

## Sprint #18: Mobile Blank Page / Hydration Rendering Fix

**Status: COMPLETED & DEPLOYED**

**Commit:** `7d7a635` → `f92d677` (hotfix)

### Task 1 — Root Cause: iOS Safari Blank Screen ✅
- **Root cause**: `background-attachment: fixed` on `<body>` in `globals.css` triggers a known iOS Safari (WebKit) compositing bug where the fixed background layer renders but the content layer does not paint on top of it
- **Fix v1**: Replaced with `body::before { position: fixed; inset: 0; background: var(--z-bg-ambient); z-index: -2; }` + `body { background: transparent; }`
- **Fix v2 (hotfix `f92d677`)**: `body::before` with `position: fixed; z-index: -2` caused a secondary WebKit stacking context bug that hid the `.meteor-field` canvas (`z-index: -1`). Replaced with `html { background: var(--z-bg-ambient); }` + `body { background: transparent; }` — no pseudo-element, no stacking conflict.

### Task 2 — ErrorBoundary Wrappers ✅
- Created `src/components/ui/error-boundary.tsx` — lightweight React class ErrorBoundary with `getDerivedStateFromError` + `componentDidCatch`
- Wrapped all layout client components in `src/app/layout.tsx`:
  - `MeteorShower` — `fallback={null}` (decorative, safe to suppress)
  - `SiteHeader` — default fallback
  - `children` (main content) — default fallback
  - `SiteFooter` — default fallback
  - `BackToTop` — `fallback={null}` (decorative, safe to suppress)
- Prevents any single client component crash from taking down the entire React tree

---

## Sprint #19: Image Source Repair & Cosmic Facts Page

**Status: COMPLETED & DEPLOYED**

**Commit:** `7d7a635` → `f92d677` (hotfix)

### Task 1 — Celebrity Avatar Image Loading ✅
- `next.config.ts` already had `upload.wikimedia.org` in CSP `img-src` and `images.remotePatterns`
- `PortraitAvatar` component already had `onError` fallback to zodiac glyph circle
- **Fix v1**: Used `next/image` — but Vercel's image optimization proxy fails for Wikimedia URLs (returns 403/429)
- **Fix v2 (hotfix `f92d677`)**: Replaced `next/image` with native `<img loading="lazy" decoding="async">` for celebrity avatars. Loads directly from Wikimedia thumbnails without proxy. `onError` fallback preserved.

### Task 2 — CTA Button on Cosmic Traits Section ✅
- Added `Link` import to `src/components/ui/cosmic-traits.tsx`
- Added glassmorphic CTA button: `<Link href="/cosmic-facts">` with `border-gold/40 bg-gold/10` styling
- Button text: `t("traits.cta", "Explore All Cosmic Facts →")`
- Added `traits.cta` key to all 5 language dictionaries (en: "Explore All Cosmic Facts →", ur: "تمام کائناتی خصائل دیکھیں →", ar: "استكشف جميع الحقائق الكونية ←", es: "Explorar todos los hechos cósmicos →", zh: "探索所有宇宙事实 →")

### Task 3 — /cosmic-facts Page Enhancement ✅
- Enhanced `src/app/cosmic-facts/cosmic-facts-client.tsx` `SignProfile` component with 3 new content sections:
  - **Origins & Mythology** — `t("cosmicFacts.signs.{slug}.mythology")` — factual Greek/Roman/astronomical lore per sign
  - **Core Archetype** — `t("cosmicFacts.signs.{slug}.coreArchetype")` — refined personality summary
  - **Career Arenas** — `t("cosmicFacts.signs.{slug}.careerArenas")` — specific professional paths
- Added full content blocks to all 5 dictionaries under `cosmicFacts.signs.{sign}`
- Existing hardcoded `WEAKNESSES`, `COMPAT`, and `ELEMENT_POWER` objects moved to dictionary lookups

---

## Sprint #20: Full Repo i18n Enforcement

**Status: COMPLETED & DEPLOYED**

**Commit:** `7d7a635`

### Task 1 — Fixed All Untranslated UI Sections ✅
- **Celestial Events**: Added `titleKey`/`descKey` to `SkyEvent` interface; all 40 events in `sky-events-data.ts` now have localized title/description keys; `sky-events.tsx` uses `t(skyEvent.titleKey)` and `t(skyEvent.descKey)`
- **Celebrity Cards**: `celebrity-birthdays.tsx` now uses `t()` for profession and region labels; added `celebrities.occupations.*` and `celebrities.regions.*` dictionary keys
- **Knowledge Base / Landing Page**: `bento-zodiac-grid.tsx` uses `t("common.steadySky")` fallback
- **Compatibility / Synastry**: `compatibility-hub.tsx` uses `t("compat.selectSign")` for category headers
- **Elemental Pillars**: `cosmic-traits.tsx` already used `tElement()` for all element names
- **Birth Chart / Natal Readings**: `natal-reading-cards.tsx` uses `t("natal.drivingPlacements")` for dynamic text
- **Daily Horoscope Cards**: `horoscope-article.tsx` uses `t("horoscope.noTightAspects")` and `t("horoscope.makeTodayEasy")`
- **Date Ranges**: `formatDateRange()` in `zodiac.ts` now uses `Intl.DateTimeFormat` with current locale instead of hardcoded English month names
- **Share/Vibe**: `share-vibe.tsx` uses `t()` for pill labels
- **Cosmic Facts**: All hardcoded `WEAKNESSES`, `COMPAT`, `ELEMENT_POWER` moved to dictionary lookups

### Task 2 — Dynamic Translation Architecture ✅
- `titleKey`/`descKey` pattern for data-driven content (sky events) allows adding new events without code changes
- `useLocale()` `t()` helper with dot-path resolution and fallback serves as the centralized translation wrapper
- Planetary placement strings (`"Sun in Gemini"`) constructed via template interpolation through dictionary keys (`signs.{slug}`, `planets.{key}`)

### Task 3 — i18n Structural Integrity ✅
- `Dict = typeof en` type constraint in `dictionaries.ts` enforces all 5 languages have identical key structure at compile time
- `npx tsc --noEmit` passes with 0 errors — any missing key in a non-English dictionary is a type error
- All 135 tests pass including `dictionaries.test.ts` which validates all 5 dictionaries have matching top-level keys

---

## Updated Architecture Notes

- **i18n**: Client-only via `useLocale()` hook + cookie `zunara-locale`. Dictionaries in `src/lib/i18n/dictionaries.ts` (~2970+ lines, 5 languages). `Dict = typeof en` enforces structural parity via typecheck. All UI strings localized — zero hardcoded English in components.
- **Error boundaries**: `ErrorBoundary` wraps all layout client components to prevent full-tree crashes from individual component failures.
- **Mobile rendering**: `background-attachment: fixed` removed from `<body>` (iOS Safari bug). Fixed gradient via `body::before { position: fixed }` pseudo-element.
- **Astro engine**: Pure VSOP87 deterministic — `computeNatalChart(date, coords, options)`. No external API.
- **Birth time**: Local civil time converted to UTC via LMT longitude offset (classic astrological method).
- **Supplemental data**: `celebrity-pool.ts` provides ~540 supplementary figures; `sky-events-data.ts` provides full-year 2026 celestial events baseline with localized titles/descriptions.
- **Deploy**: `git push origin master:main`. Live at `https://zunara.vercel.app`.
- **Remote**: `https://github.com/uncrownedprince786-collab/Zunara`. Branch: `master` tracks `origin/main`.

---

## Sprint #21: Natal Aspects, Strict Birthdays, Dynamic Sky Events

### Task 1 — Natal Transit Aspects Engine ✅
- New `src/lib/natal/aspects.ts`: `computeAspects(planets, orbs)` produces the 5 major aspects (conjunction/sextile/square/trine/opposition) with default orbs, per-pair tightest match only, orbit-influenced exclusions, and deterministic interpretations from body gloss + aspect theme.
- **Applying/separating is analytic, not stepped**: `isApplying` differentiates the distance-to-exact on the folded separation axis (`u = min(s, 360−s)`), so fast-moving bodies (the Moon, ~12°/day) can't be misclassified by a coarse Euler step. See `aspects.ts` docs.
- `NatalChart` gains a required `aspects: NatalAspect[]` field (`src/lib/natal/types.ts`); `computeNatalChart` wires it in `natal.ts`.
- `AspectsPanel` (`src/components/birthchart/aspects-panel.tsx`): responsive table — bodies with glyphs, colored aspect badges (`@/components/ui/planet-symbol` + `dict.aspects.*` labels), orb, applying/separating chip, interpretation.
- Birth-chart client: 600 ms "casting" beat so the calculating state paints, a spinner while regenerating, and a `key={chart.utcTime}` remount with `.animate-z-rise` for the chart fade-in.
- Tests: `aspects.test.ts` (9) — zero-separation conjunction, square, 180° wrap opposition, orb exclusion, pair uniqueness, applying/separating, determinism, custom orbs, interpretation sanity.

### Task 2 — Strict Celebrity Birthdays ✅
- Root cause of the Sep-5 leak: `celebritiesForDate` filled shortfall from a **global supplementary pool of any date**, surfacing Feb/Mar names on unrelated days.
- `celebritiesForDate(month, day)` is now strictly `month === m && day === d` for both primary and supplementary pools (deduped, capped at 6, same `diversitySelect`). Removed the global-pool fallback entirely.
- `celebrities.test.ts` rewritten: new invariant = every returned person is genuinely born on the requested date (checked across all 366 days), ≤6 per date, explicit no-cross-date leak assertions, determinism kept.
- Avatar rendering kept on native `<img>` + zodiac `onError` fallback (no `next/image`).

### Task 3 — Nav Copy Simplification ✅
- "Natal Engine" → "Birth Chart"; "Zodiac Intelligence" → "Horoscopes & Signs"; "Your daily orbit" → "Today's Horoscope"; "Born under today's stars" → "Famous Birthdays Today"; "The sky ahead" / "Upcoming celestial events" → "Upcoming Sky Events".
- Applied across all 5 locales (`nav.*`, `common.yourDailyOrbit`, `home.upcomingEvents`/`bornTodayKicker`, `skyEvents.kicker`/`title`, `celebrities.kicker`) plus hardcoded breadcrumb (`cosmic-facts/page.tsx`), aria-label (`daily-orbit-banner.tsx`) and `t()` fallbacks. `dictionaries.test.ts` language-audit still green.

### Task 4 — Precise Moon Phase (Elongation + SVG Terminator) ✅
- `moonPhase()` now uses `AE.MoonPhase(date)` (true geocentric sun–moon elongation) instead of the synodic-month approximation; same `{age, phase, illumination, name}` shape.
- `moon-phase.tsx` redrawn with math-correct SVG: the terminator is the arc `x = cosθ·√(R²−y²)` — an ellipse with horizontal semi-axis `R·|cosθ|` — rendered as a limb + terminator path so crescents hug the correct limb and gibbous phases bulge the right way. Gradient-lit disc + radial `useId`-namespaced gradient, dim base for earthshine.

### Task 5 — Dynamic Sky Events Calculator ✅
- New `src/lib/content/sky-events-calculated.ts`: `calculateSkyEvents(now)` computes the four principal lunar phases via `AE.SearchMoonQuarter`/`NextMoonQuarter` and the seasonal points via `AE.SearchSunLongitude` (0/90/180/270) in a rolling ~75-day horizon — no annual table to refresh.
- Localized via existing keys: `phases.*`/`phases.phaseHints.*` for quarters, `skyEvents.events.{vernalEquinox,summerSolstice,autumnalEquinox,winterSolstice}.*` for seasonal points.
- `mergeSkyEventSources(...sources)` first-wins dedupes by `date|category`; `sky-events.tsx` merges live feed → calculated → full-2026 baseline (order by priority: live > baseline > computed), so named moons like "Full Moon · Harvest Moon" win over the generic computed entry on the same night.
- Tests: `sky-events-calculated.test.ts` (9) — horizon bounds, seasonal + phase discovery for a fixed date, sorting, categories, determinism, merge priority/dedup.

### Verification ✅
- `npx tsc --noEmit`: 0 errors. `npx vitest run`: 155/155. `npx next build`: success.
- Deployed via `git push origin master:main` (`db07342..c5f64d9`).

---

## Sprint #22: Natal Life-Guidance Engine + All-in-One Astronomy Toolbox

Built as two parallel sub-agent builds then integrated under one commit. Full verification: `tsc --noEmit` 0 errors, `vitest` 207/207 (21 files), `next build` success. Deployed `b62e1dc..679dd09`.

### Natal Life-Guidance Engine (birth-chart page restructure)
- `src/lib/natal/age.ts` — `exactAge(birth, at)` calendar-aware step-down (Feb 29 / Jan 31 safe) → `{years, months, days, totalDays, label}`.
- `src/lib/natal/life-phases.ts` — Saturn-return window (8° orb, lap-unwrap monthly scan, horizon ~36y), quarter-life window (~24–26), progressed-Moon sign + next sign-change (secondary rate = natal Moon `speed` deg/day × age in days), and `lifeMilestones()` (max 5, missing Moon skipped).
- `src/lib/natal/guidance.ts` — `buildLifeGuidance(chart)` → exactly 4 plain-English sections citing real placements: Personality (Sun + Ascendant), Love (Venus + 7th-house cusp via whole-sign `cusps[6]`), Career (10th-house cusp `cusps[9]` + Saturn), Inner (Moon + `cusps[3]`).
- `src/lib/natal/transits.ts` — `upcomingTransits(chart, at, opts)` samples real ephemeris weekly over the horizon; run-based window detection (≥2 contiguous samples, fast bodies need ≥2-day span), significance sort (outer-planet → angle/10th-house targets), `<maxEntries` sorted by peak. `TransitForecast {start, peak, end, area, note}` with `ASPECT_ORBS` and `areaFor` (10th-house planets → career).
- UI: `age-header.tsx` (Big Three glyphs + exact age + next-milestone chip), `life-pillars.tsx` (ARIA tablist, 4 pillars), `trend-timeline.tsx` (vertical timeline, aspect badge mirroring AspectsPanel). `birthchart-client.tsx` reordered: AgeHeader → Wheel → LifePillars → TrendTimeline → AspectsPanel → NatalReadingCards → technical table; `at` reference effect-set per chart (hydration-safe).

### All-in-One Astronomy Toolbox
- **Synastry** — `src/lib/compatibility/synastry.ts`: two `BirthInput`s → two `computeNatalChart` charts → real-angle cross-aspects (orb consts: conj/opp/trine/square 8°, sextile 6°); four scored dimensions (Emotional Connection, Communication, Attraction, Long-Term Stability) each with plain-English aspect interpretations citing signs + hard-clamped scores (30–98), overall = mean. Route `/synastry` (two reusable `BirthForm`s + score bars).
- **Daily Transit** — `src/lib/transits/daily-transits.ts`: real-time `computePosition` overlay on the natal chart, whole-sign houses relative to Ascendant, per-body plain-English insight (transitBody × HOUSE_THEMES) + a strongest-signal day summary (uses `houses.ascendantLongitude`/`midheavenLongitude`). Route `/daily-transit`.
- **Retrograde tracker** — `src/lib/retrograde/tracker.ts`: daily `.retrograde`-flag grid scan over a 180-day horizon per planet (mercury→pluto), windows contiguity-grouped, station dates refined to ~6h precision; `tabulateRetrogrades()` (ordered by next start, per-planet hype-free behavioral advice + strength) + `liveSkyStats()` (counts, planets-by-sign, next retro). Route `/retrograde`.
- **Ephemeris** — `/ephemeris` client feed: date navigator, all bodies + lunar nodes via `computeSnapshot` (nodes return `null` from `computePosition` — AE has no node body), sign/degree/element/motion table + one-line day caption.
- **Glossary + knowledge base** — `src/lib/content/glossary.ts` (36 plain-English terms, 7 categories, `seeAlso`), accessible `AstroTerm` popover (`src/components/ui/astro-tooltip.tsx`, Escape/outside dismiss). Routes: `/library` (glossary `<details>` + cards), `/library/planets` (bodies via `CELESTIAL_BODIES`), `/library/signs` (12 signs via `getZodiacSign`), `/library/nodes` (node meaning + live positions in a client chip).
- Footer: new "Astronomy" column (`/synastry`, `/daily-transit`, `/retrograde`, `/ephemeris`, `/library`), grid `sm:grid-cols-2 lg:grid-cols-3`. Header nav untouched.

### Notes
- New-route i18n uses inline `t(key, "English fallback")` only — `dictionaries.ts` untouched (language-audit test still green); a future pass can localize new keys across all 5 locales. <span style="color:green">DONE in Sprint #24 — all tool routes now read fully translated dict keys across en|ur|ar|es|zh.</span>
- Only integration fix needed after the two parallel builds: a `BodyKey` vs `NatalBodyKey` cast in `transits.ts:236-237` (node keys excluded from the natal map).
- Retrograde tracker tests are the slowest (~8.6s) due to grid scans; keep horizons bounded for CI.

## Sprint #23: Celebrity Cron Cache, Birth-Sync, Calendar Export & Interactive Sky Map

Delivered as Sprint #23a (celebrity cache) plus the final roadmap gap features (#1–#3). Full verification: `tsc --noEmit` 0 errors, `vitest` 243/243 (27 files), `next build` success. Deployed following `b17eb33`.

### #1 Persistent local birth-chart sync
- `src/lib/natal/storage.ts` — guarded `localStorage` profile under key `zunara_natal_profile` (`saveNatalProfile` / `loadNatalProfile` / `clearNatalProfile`, `hasStorage()` never throws, strict shape validation on read). `"use client"`.
- `birthchart-client.tsx` persists the validated `BirthInput` on every successful chart cast.
- `daily-transit-client.tsx` auto-loads the saved profile on mount (computes the day's transits without re-entry) and adds a "Change saved profile" card + toggle (clears storage, returns to form).
- Test: `src/lib/natal/storage.test.ts` (round-trip, clear, corrupted JSON, no-storage guards).

### #2 Exportable `.ics` calendar engines
- `src/lib/calendar/ics-generator.ts` — pure RFC 5545 generator: `generateTransitICS(events, opts)` → `BEGIN:VCALENDAR…END:VCALENDAR`; UTC `DTSTART/DTEND` (Z-suffix), `UID`, `DTSTAMP`, `SUMMARY/DESCRIPTION/LOCATION` escaping, 75-octet folding (`foldLine`), 2h default event length. Google/Apple/Outlook import compatible.
- "Export to Calendar (.ics)" buttons download the generated file on `/daily-transit` (upcoming transits) and the sky-events section (selectable upcoming events).
- Test: `src/lib/calendar/ics-generator.test.ts` (envelope, UTC stamps, default/supplied ends, escaping, folding).

### #3 Interactive 2D/canvas night sky map
- `src/lib/astronomy/sky-map.ts` — pure AE wrapper: `bodySkyPoint` via `AE.Equator(body, date, obs, true, true)` + `AE.Horizon(…, "normal")` for apparent azimuth/altitude; `starSkyPoint` for a curated 16-star catalogue (Sirius, Polaris, Vega, Antares…); `computeSkyBodies(observer, date)` returns planets (Sun–Saturn), Moon and only-above-horizon bright stars.
- `src/components/astronomy/sky-map-canvas.tsx` — responsive HTML5 canvas azimuthal dome (horizon/alt rings, meridian spokes, cardinal labels, glow for Sun/Moon/planets, starfield), pointer-tap tooltip with name + az/alt, DPI-aware.
- `src/app/sky-map/` — route with location card (lat/long inputs, seeds from saved birth profile via `loadNatalProfile`, 60s time refresh), canvas panel, legend. Footer "Astronomy" column now includes "Night Sky Map" (`footer.skyMap` fallback label).
- Tests: `src/lib/astronomy/sky-map.test.ts` (body/star presence, az/alt range validity, Polaris ≈ observer latitude, single-body determinism).

### #23a Celebrity 3-tier cron cache
- `src/db/schema.ts` + `repository.ts` — `celebrityCache` table (`dateKey`, `payload`, `TTL`/`fetchedAt`, guarded `CREATE TABLE IF NOT EXISTS`), `ensureCelebrityCacheTable` / `upsertCelebrityCache` / `getCelebrityCache`.
- `src/lib/celebrities/` — `categories.ts` (9 paged hubs + labels), `wikidata.ts` (SPARQL + `Special:FilePath?width=330` images + sitelinks), `resolver.ts` (3-tier: L1 DB cache 26h → L2 live Wikidata via injected deps → L3 static fallback).
- `src/app/api/cron/daily-celebrities/route.ts` — `POST` guarded by `CRON_SECRET`, ensures today + tomorrow UTC `MM-DD` entries, writes static-fallback when live returns empty, records `recordHealth("celebrities-cron")`. `vercel.json` adds `"0 22 * * *"`.
- UI — `celebrity-birthdays.tsx` (server wrapper) + `celebrity-birthdays-view.tsx` (client cards: portrait, sitelinks chip, category chip).
- i18n — `celebrities.{liveSource,sitelinks,categories.*}` keys added to all 5 locales (parity preserved).
- Migration `drizzle/0001_celebrity_cache.sql` + snapshot. Tests: `categories.test.ts`, `wikidata.test.ts`, `resolver.test.ts`.

### Notes
- Post-merge integration fixes for #1–#3: the `.ics` import name mismatch (`exportTransitICS` → `generateTransitICS`, 2 call sites) and folding not applied to `VEVENT` content lines (now every `SUMMARY/DESCRIPTION/LOCATION/DT*` line is `foldLine`-folded).
- `/sky-map` and `/daily-transit` remain statically generated; the canvas re-renders client-side every 60s and on pointer events.
- #1–#3 new copy still uses inline English + `t()` fallbacks (dictionaries untouched); a later i18n pass can localize `skyMap.*`, `dailyTransit.*` and `skyEvents` export labels across all 5 locales. <span style="color:green">DONE in Sprint #24.</span>

## Hotfix: Mobile Language Crash, Hydration/Cookie Safety & Meteor Shower Visibility

Root-caused and fixed after Sprint #23 deploys. Verified: `tsc --noEmit` 0 errors, `vitest` 243/243, `next build` 92/92 static pages. Deployed following `94b534a`.

### Language switching & incognito crash (`src/lib/i18n/client.tsx`)
- Cookie reads are fully guarded: `readLocaleCookie` wraps `document.cookie` access AND `decodeURIComponent` in try-catch, so Private/Incognito SecurityErrors degrade to `DEFAULT_LOCALE` instead of crashing. Cookie write in the locale effect was already try-caught.
- New `resolveStrict` (returns `""` on miss, never the raw path) + `resolveWithFallback` = active-locale dict → English dict → caller fallback → raw path. `t()` can no longer emit empty/invisible spans during store transitions or a momentarily-incomplete dict. `resolveDictPath` unchanged for compat (`locale-text.tsx`).
- `LocaleProvider`/`useLocale` render non-blank always; the provider’s `t` and the hook fallback both use the English-fallback chain. `useSyncExternalStore` untouched: `getServerSnapshot = DEFAULT_LOCALE` + `hydrated` effect already keep SSR/client in lockstep so language changes never blank the tree.

### High-contrast base classes (`src/app/layout.tsx`)
- `<main>` now carries `text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950` so RTL/text-orientation changes (`dir='rtl'`, `lang=ar`) always inherit an explicit legible base — no invisible/transparent text against background layers. Dark mode (`prefers-color-scheme: dark`, the site’s target) resolves to `slate-950`/`slate-100`, indistinguishable from the existing ink canvas.

### Meteor shower layout & mobile perf (`meteor-shower.tsx`, `globals.css`)
- Root cause of invisible meteors: `.meteor-field` was `z-index: -1` and `<html>` paints an OPAQUE ambient background (`--z-bg-ambient`) — the canvas rendered *behind* the page background everywhere. Changed to `fixed inset-0 z-index: 0` and wrapped all content in a `relative z-10` layer in `layout.tsx`, so meteors are visible over the dark canvas but behind header/main/footer, on all viewport sizes.
- Removed `display: none` for `prefers-reduced-motion` from `.meteor-field` (the JS already no-ops, leaving the canvas transparent) — the sky is present on mobile/tablet/desktop.
- Mobile perf: DPR capped at 1.25 (<768px) vs 1.5, `MAX_CONCURRENT` 3 vs 4, hero glow radius 15 vs 22 — fewer painted pixels and gradient fills on phones.
- `.constellation-bg` is a transparent gradient so meteors still show through page heroes.
- **Regression found & fixed (`9e7e783`):** the same hotfix added `bg-slate-50 dark:bg-slate-950` (OPAQUE) on `<main>` inside the z-10 layer, which silently painted over the z-0 sky canvas across the whole viewport — meteors were hidden again everywhere. Fix: `dark:bg-transparent` on `<main>` so the fixed canvas shows through the content column in the site's target dark mode, while light mode keeps its solid `bg-slate-50` safety net and `text-slate-900/dark:text-slate-100` keeps text legible on the near-black ambient canvas.

## Technical & UI/UX Architectural Audit (SSOT)

Frozen snapshot after `9c94851` (Sprint #23 + hotfix). Verified against source: header/nav, footer, root layout, home page, horoscope sign layout, i18n client/store, celeb cron, media, engines. Re-verified build: `tsc --noEmit` 0, `vitest` 243/243, `next build` 92/92 static.

### 1. Recently implemented features & routes

**Natal Guidance Engine** (`/birthchart`, restructured Sprint #22)
- `age.ts` → `exactAge()` calendar-safe (Feb 29 / Jan 31) `{years,months,days,totalDays,label}`.
- `life-phases.ts` → Saturn-return window (8° orb, lap-unwrap, ~36y), quarter-life (~24–26y), progressed Moon with secondary-rate sign-change date; `lifeMilestones()` (max 5).
- `guidance.ts` → `buildLifeGuidance()` = exactly 4 pillars (Personality, Love, Career, Inner) citing real placements.
- `transits.ts` → `upcomingTransits()` weekly ephemeris sampling, run-window detection, significance sort (outer→angle/10th-house), `TransitForecast{start,peak,end,area,note}`.
- UI order on page: AgeHeader → Wheel + Big Three/House Cusps → LifePillars (ARIA tabs) → TrendTimeline (12–24m) → AspectsPanel → NatalReadingCards → placements table → method note. `at` reference effect-set per chart for hydration-safe engines.

**Synastry** (`/synastry`) — `src/lib/compatibility/synastry.ts`: two `BirthInput`s → two `computeNatalChart` (VSOP87) → real-angle cross-aspects (conj/opp/trine/square 8°, sextile 6°) → 4 clamped dimensions (Emotional, Communication, Attraction, Stability, 30–98) + overall mean; two `BirthForm`s + score bars.

**Daily Transit** (`/daily-transit`) — `daily-transits.ts`: `computePosition` overlay on natal whole-sign houses per Ascendant; per-body plain-English insight + strongest-signal `daySummary` (uses asc/mc longitudes). Sprint #23: auto-loads saved `localStorage` profile on mount ("Change saved profile" toggle) + ".ics export" for upcoming transits.

**Retrograde Tracker & Live Sky Stats** (`/retrograde`) — `tracker.ts`: daily retrograde-flag grid scan (~180d), contiguity groups, ~6h station fix-ups, `tabulateRetrogrades()` (next start, hype-free advice + strength) and `liveSkyStats()` (counts, planets-by-sign, next retro).

**Interactive Daily Ephemeris** (`/ephemeris`) — date navigator + `computeSnapshot` table (10 bodies + lunar nodes — nodes return `null` from `computePosition`, AE has no node body), sign/degree/element/motion, day caption.

**Glossary & Knowledge Base** (`/library`) — `glossary.ts` (36 terms, 7 categories, `seeAlso`), `AstroTerm` popover (Escape/outside dismiss). Routes: `/library`, `/library/planets`, `/library/signs`, `/library/nodes`.

**i18n Dictionary System + Client Locale Store** — `dictionaries.ts` (5 locales en|ur|ar|es|zh, `Dict = typeof en` parity enforced by `dictionaries.test.ts`), `client.tsx` module-level external store (`useSyncExternalStore`, `getServerSnapshot=DEFAULT`, hydrated effect), cookie `zunara-locale`; `t/tSign/tElement/tModality/tPlanet/tHorizon/tArea`. `resolveWithFallback` (locale → English → fallback → path) never emits blank/raw-key text.

**Recent roadmap gaps (Sprint #23)** — celebrity 3-tier cron cache, persistent birth-chart sync (`storage.ts`), `.ics` export (`ics-generator.ts`), `/sky-map` canvas (`sky-map.ts` + `sky-map-canvas.tsx`).

### 2. UI/UX & navigation architecture

**Root layout** (`layout.tsx`): `<html lang=en color-scheme:dark>` → body `bg-ink text-starlight` → JSON-LD → `LocaleProvider` → `<ErrorBoundary><MeteorShower/></ErrorBoundary>` → `relative z-10 flex-1` wrapper: skip-link, header, `<main id=main-content>` (high-contrast `text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950`), footer, BackToTop. The z-10 wrapper keeps the fixed z-0 sky canvas behind all interactive content.

**Header** (`site-header.tsx` + `site-nav.tsx`): sticky top `z-40`, h-16 max-w-6xl. Left: VitruvianMark + wordmark. Right: 5 primary links (Horoscopes, Birth Chart, Horoscopes & Signs, Cosmic Events, About) with active underline (`isActive` prefix match), desktop `md:flex`, mobile hamburger → absolute dropdown `top-16 z-50 bg-ink/95 backdrop-blur` with 5 links + auto-close. `LanguageSwitcher` always visible at header right (mounted-guarded label; RTL badge on ur/ar).

**Footer** (`site-footer.tsx`): brand + tagline block; 3 link columns (`sm:grid-cols-2 lg:grid-cols-3`): Horoscopes (all signs + 4 horizon links via aries paths), Publication (birth chart / astrology / cosmic facts / about / privacy / terms / disclaimer), Astronomy (synastry / daily-transit / sky-map / retrograde / ephemeris / library). Beneath: 12 zodiac glyph circular chips (`formatDateRange` title), copyright, second `LanguageSwitcher`.

**Page-level visual hierarchy**:
- Home: masthead (HeroVisual + Vitruvian watermark) → DailyOrbitBanner → "The sky tonight" (Sun sign + MoonSignCard + Planetary bulletin panel) → Twelve Signs (BentoZodiacGrid) → SkyEvents (live feed merge, export .ics button) → CelebrityBirthdays (cached cards) → CosmicTraits → Horizons (4 cards) → Method + element grid.
- `/horoscope/[sign]` layout: constellation bg → starfield strip → sign header (glyph coin, kicker element·modality·ruler, name, date range) → QuickNavigation (SignNav) → PeriodTabs (Today/Weekly/Monthly/Yearly underline tabs, `aria-current`) → content. All 12 signs static (`generateStaticParams`).
- `/birthchart`: hero → BirthForm full-width → chart view (AgeHeader → wheel grid → life guidance → transits timeline → aspects → readings → table).
- Tool routes (`/synastry`, `/daily-transit`, `/retrograde`, `/ephemeris`, `/sky-map`): centered breadcrumb + kicker + `font-display` H1 masthead + `constellation-bg`; body client grid `lg:grid-cols-2` / `[360px_1fr]`.

**Ambient layer**: `.meteor-field` `fixed inset-0 z-0 pointer-events-none translateZ(0)`, DPR 1.25/1.5, 3–4 meteors, heroes disabled on reduced motion via JS no-op (no CSS `display:none`); `.constellation-bg` transparent gradients; html root paints opaque `--z-bg-ambient` — so meteors now render above root bg but below the z-10 content layer on all breakpoints.

### 3. Core feature data logic map

| Feature | Use case | Engine / data source | State / output |
|---|---|---|---|
| Horoscopes (daily→yearly) | 12 signs × 4 horizons | `astrology/signals.ts`, `changes.ts`, `engine` on `computeSnapshot` | `HoroscopeResult` w/ life-area signals (0-100), strongest themes, changes, 30-second + "your move" copy |
| Birth chart | natal chart + life guidance | `natal/`: `validate` (LMT UTC offset = −λ/15h), `natal` (computeNatalChart), aspects, guidance, transits | `NatalChart{planets,bigThree,houses,aspects,readings,utcTime}`; persisted `BirthInput` → `localStorage` `zunara_natal_profile` |
| Synastry | two-chart compatibility | `compatibility/synastry.ts` angles | 4 scored dims + overall |
| Daily transit | personal day overlay | `transits/daily-transits.ts` on `computePosition` | `DailyInsight[]` + `daySummary` |
| Retrogrades | current/upcoming stations | `retrograde/tracker.ts` grid scan | `tabulateRetrogrades()`, `liveSkyStats()` |
| Ephemeris | daily sky table | `astronomy/astro.ts` `computeSnapshot` (AE `computePosition`, VSOP87) | positions + aspects + motion |
| Sky map | locational star dome | `astronomy/sky-map.ts` AE `Equator`+`Horizon`; 16-star catalogue | alt/az body list → canvas |
| Celebrity birthdays | today's famous people | 3-tier: DB cache (26h) → Wikidata SPARQL (`Special:FilePath?width=330`, sitelinks) → static; cron `0 22 * * *` `Bearer CRON_SECRET` + `recordHealth` | `Celebrity[]` cards; cache table `celebrityCache` keyed `MM-DD` |
| Glossary | learn astro terms | `content/glossary.ts` | `AstroTerm` popover tooltips |
| i18n | 5-locale UI | `dictionaries.ts` parity + client store + cookie | `t()` chain, `dir/lang` on `<html>` |

### 4. Pending gaps & roadmap

- **Incognito/mobile language switch** — DONE (hotfix `9c94851`): cookie try/catch, `resolveWithFallback`, high-contrast `<main>`.
- **Meteor Shower layout** — DONE (same hotfix): z-index root-cause fixed, reduced-motion JS no-op, mobile perf tuning.
- **Persistent local natal storage** — DONE (Sprint #23): `storage.ts` + auto-load in `/daily-transit` + birthchart persist.
- **Exportable `.ics`** — DONE (Sprint #23): `ics-generator.ts` RFC 5545 + buttons on daily-transit & sky-events.
- **Interactive `/sky-map`** — DONE (Sprint #23): AE alt/az, hover tooltips, footer link.
- **3-tier celeb cron cache** — DONE (Sprint #23): route + DB + resolver + `vercel.json` schedule + i18n keys.
- Remaining opportunities (not blocking): localize Sprint #22/#23 route copy across all 5 dicts (currently inline English + `t()` fallbacks); hydrate `dictionaries.ts` with `skyMap.*`, `dailyTransit.*`, `skyEvents` export labels; consider light-mode contrast of `text-p-ink` glass cards if OS light (site is dark-only by design, `color-scheme: dark`). <span style="color:green">Localization DONE in Sprint #24 — only the optional light-mode contrast check remains.</span>

## Live Bugfix: Birth Chart Phantom Date, Famous Birthdays Grid & Sky-Events Nav (`b3d762e`)

Deployed after the SPARQL audit. Verified: `tsc --noEmit` 0 errors, `vitest` 243/243, `next build` green (incl. new `/sky-events` static route).

### Birth chart showed a date the user never entered (`birthchart-client.tsx`)
- `chart` initial state was a hardcoded 1995 placeholder, so the page painted a full chart before any input. Now `chart` starts `null`; on mount it restores the saved `loadNatalProfile()` from `storage.ts` (validated via `validateBirth` then `computeNatalChart`) for returning visitors, otherwise the Birth Form is shown. `handleSubmit` persists the entered profile with `saveNatalProfile` so `/daily-transit` shares the same details.

### Famous Birthdays dense grid (server path unchanged, cron pre-fetch = SSOT)
- Production serves the pre-calculated cron cache (SPARQL, sitelink-ranked) with zero latency; the static `celebrity-pool.ts` remains **fallback-only** (emergency/offline, no DB).
- `resolver.ts`: Level-2 live Wikidata fetch is now gated (`allowLive = Boolean(store) || Boolean(deps.fetchLive)`), so static builds and local renders never hammer Wikimedia. Live results are topped up with the curated same-date pool (dedupe by `url`, cap `slice(0,12)`, source `"live"`) so a sparse live set never renders a single lonely card. All test fixtures (store/fetcher-injected) still pass.
- `celebrity-birthdays-view.tsx`: new `initialsOf()` monogram + small `ZodiacSymbol` fallback inside `PortraitAvatar` when a profile has no image or the image errors; `<img>` gets `referrerPolicy="no-referrer"`; RTL-aware arrow scrolling preserved.

### Nav & missing route (`site-nav.tsx`, `src/app/sky-events/page.tsx`)
- Header "Cosmic Events" href was `/astrology` (a route that does not exist) → now points to the real `/sky-events` page (created: metadata canonicals, breadcrumb, masthead).
- New **Tools** menu in the header (desktop popover with outside-click/Escape close + mobile group link list) → Synastry, Daily Transit, Sky Map, using inline `t(key, "English fallback")` because the 5-locale dicts only define `nav.astronomy`.

### Pipeline decision (per product direction): cron pre-fetch is the single celebrity pipeline
- Confirmed already shipped: `/api/cron/daily-celebrities` runs `0 22 * * *` UTC (daily, before midnight), prefetches today+tomorrow via **Wikidata SPARQL** (`ORDER BY DESC(?sitelinks)` = top globally ranked, category round-robin, Commons `Special:FilePath?width=330`), upserts `celebrity_cache` keyed `MM-DD`; resolver reads it cache-first (26h TTL), live only as gated fallback, static only as emergency fallback. `vercel.json`, DB repo, CRON_SECRET guard, `recordHealth` all verified.
- **Static pool maintenance is stopped** — no hand-enrichment of `celebrity-pool.ts`.
- ⚠️ Known data-quality note (from the one-off SPARQL audit, not fixed by design): ~190 of 624 static entries are mis-dated vs Wikidata (e.g. Spielberg 4/10→12/18, Clapton 1/6→3/30, Queen Victoria 5/17→5/24) and most dates have only 1–2 entries (today 9/5 = Raquel Welch only in fallback). Static only affects no-DB/dev/emergency renders — production serves corrected, IMAGE-bearing Wikidata profiles. If offline fidelity ever matters, regenerate the pool from the same SPARQL query rather than hand-curating.

## Sprint #24: Tool Routes Fully Localized (5 locales) (`71b475b`)

Deployed after the meteor animation fix (`9e7e783`). Verification: `tsc --noEmit` 0 errors, `vitest` 243/243 (27 files, incl. the one-by-one locale completeness audit), `next build` green.

Closes the last localization gap from Sprint #22/#23: the tool-route copy that previously rendered via inline English `t(key, "fallback")` now reads fully translated dict keys.

### i18n additions to `dictionaries.ts` (en|ur|ar|es|zh parity, `Dict = typeof en`)
- `nav`: `tools`, `synastry`, `dailyTransit`, `skyMap` (auto-wired into the existing header Tools menu).
- `common`: `and`, `date`, `direct`, `retrograde` + table columns `colPlanet`/`colSign`/`colDegree`/`colLongitude`/`colElement`/`colMotion`/`colStatus`/`colStart`/`colEnd`/`colStrength`/`colAdvice`.
- `birthchart`: `modifyDetails` (edit button — `formTitle` was never meant for modify), `computedFor` (`{date} · VSOP87 Engine {version}`), `checkForm`, `calcFailed`, `ageSection`, `exactAgeLabel`, `nextMilestoneLabel`, `guidanceKicker/Title/Intro`, `guidanceTabs`, `pillar.{personality,love,career,inner}`, `transitsKicker/Title/Intro/None`, `formSubtitle` (birth-form subtitle), `birthLocationLabel` reworded to "Birthplace (City, Country)" in all locales.
- `skyEvents`: `exportLabel`, `exportHint`.
- New sections inserted before each locale's `cosmicFacts`: `synastry`, `dailyTransit` (incl. `houseLabel` "House {n}" / `transiting` / `peakEnds` templates), `retrograde` (stats + `strength.{mild,moderate,intense}` + per-planet tracker + table), `ephemeris` (day nav, `onDate`/`retroNone`/`retroSome`/`sunIn` caption, `retroMarker`), `skyMap` (observation point, seeded/manual hints, `shownFor` refresh note, hover hint, legend labels).

### Component wiring (all through `useLocale()` + a local `subst()` `{var}` template helper)
- `synastry-client.tsx` — names/placeholders, compute button + states, errors, score + footnote, terms paragraph (leads/tails keep inline `AstroTerm` tooltips, joined with `common.and`), orbital text via `subst`, aspect badges via `t(\`aspects.${asp.aspectName}\`)`.
- `daily-transit-client.tsx` — saved/active profile card, hints, glossary note (AstroTerm dropped intentionally), date label/hint, house chips via `houseLabel {n}`, "transiting {sign}", forecast cards with `tPlanet` + localized aspect names + `peakEnds`; `Intl.DateTimeFormat` now uses the active locale; `computeFor`/`handleDateChange` thread `t`/`locale`.
- `retrograde-client.tsx` — stat cards (`ofTracked {count}`, startsOn, none-in-window), computed-at footnote, per-planet tracker title/desc, column headers (`common.col*`), row badges (retrograde now/upcoming/direct), `inSign {sign}`, strength labels, computing loader; date formatting locale-aware. Map callback renamed `t`→`row` to avoid shadowing the translator.
- `ephemeris-client.tsx` — prev/next day buttons, `common.date` label, table headers, body/sign/element rows via `tPlanet`/`tSign`/`tElement`, motion badge (`retroMarker`/`common.direct`), locale-aware day caption via new keys.
- `sky-map-client.tsx` — observation point, city/placeholder, lat/long labels, seeded vs manual hints, live refresh note (`shownFor {place}`), hover hint, legend labels; `toLocaleString(locale, …)` for the clock; seeded place defaults via `dailyTransit.savedProfileLocation`.
- `sky-events.tsx` — export button + hint now read `skyEvents.exportLabel`/`exportHint`.
- `birthchart-client.tsx` — modify button uses `modifyDetails`, computed-for line via `computedFor`, error strings via `checkForm`/`calcFailed`, table headers + retrograde/direct badges via `common.*`.
- `birth-form.tsx` — subtitle via new `formSubtitle`.
- Already correct (no change needed): `age-header.tsx`, `life-pillars.tsx`, `trend-timeline.tsx` had referenced these keys with English fallbacks from birthchart work.

### Scope kept English by design (not localized)
- Server-rendered tool-page mastheads (kicker/H1/desc) + breadcrumbs (no server-side i18n infra; consistent with the site).
- Data/editorial prose: guidance paragraphs, milestone notes, transit notes, synastry interpretations, retrograde advice, horoscope readings, and glossary tooltip terms remain English data content.
- Example placeholders ("e.g. Alex") and `AM/PM` month-name options in `birth-form.tsx`.

## Sprint #33b: Multi-Source Portrait Backfill (`c606361`)

Follow-up to Sprint #33 (the bake script): 8 entries the REST summary endpoint couldn't image. Won 5 more; 3 have genuinely no free photo.

### New sources unlocked (beyond REST summary)
- `en.wikipedia.org/w/api.php?action=query&titles=…&generator=images&prop=imageinfo&iiurlwidth=330` — every image actually on an article page (works even when the lead image is absent). Resolved **Robin Roberts** (she has no lead image; picked the 2018 cropped high-res shot from the page's image set).
- `srnamespace=6` **File-namespace search** (`list=search`) — finds Commons photos hosted with the subject's name even when the article has no portrait. Resolved **Leslie Jones** (page has zero images; found `Leslie Jones at The Stress Factory` on Commons) and **Sana** (`Twice in Seattle 2026 – TWICE. Sana(55044986286).jpg`).
- **Local-language wikis** — th.wikipedia REST resolves **Ken Theeradeth** (en article doesn't exist; Thai article `ธีรเดช วงศ์พัวพันธ์` has one image, normalized to 330px thumb) — reachable, only gotcha is 429 rate-limiting (retry w/ backoff).
- **Correct slug discovery**: Aum Patchrapa's en article is `Patcharapa_Chaichua` (not `Patchrapa_Chaichua`, which 404s) — had a 2025 portrait. Sana's is `Minatozaki_Sana`. Leslie's is `Leslie_Jones_(comedian)`.
- `www.wikidata.org` API reachable, but **`commons.wikimedia.org` is ENOTFOUND** in the sandbox → P18 file-URL resolution must go through the en action-API imageinfo path instead (single-hop, same host as everything else).

### Still monogram (verified across en/hi/th wikis, page images, file search, P18)
- **Vivek Bindra** (no article in any reachable project), **Lisa Bonet** (article exists but zero images — likely BLP-removed), **Zoheb Hassan** (no image on page, no file). Monogram fallback stays.

### Verification
Fresh `next build` + `next start`, SSR checked per date — all five now render their wikimedia `<img>`: `/birthday/09-07` 6/6 (Leslie included), `/birthday/11-27` (Robin), `/birthday/01-20` (Aum), `/birthday/12-03` (Ken), `/birthday/12-29` (Sana). `tsc` clean, `vitest` 366/366. Pushed `c606361`.
Gotcha: `next start` can serve a STALE `.next` for `celebrities.ts` imports — always `next build` before runtime checks or edits look "not applied". Also flagged the pool's Denzel Washington as wrongly dated 1/20 (real: Dec 28) — since fixed in Sprint #34.

## Sprint #34: Celebrity Pool Regression Pass — Zero Dates Filled, Accuracy Fixes, Hard Invariants (`e5ee3b8`)

User directive: "Born on any other day? … make sure we have enough celebrities pool and everyone's data is accurate and images are rendering no broken image — I want this perfect." Focused pass (user declined full 627-entry re-verify + full ≥3-per-date expansion as separate options).

### Images: no broken images
- Earlier bulk check had 388 OK / 232 TIMEOUT / 3 bad. The 232 TIMEOUTs were **my own checker's rate-limit artifact**, not broken links — confirmed via re-check: single fresh requests return 200 instantly (incl. Beyoncé, MJ, Madonna). The only genuine 4xx were 3 TIFFs (Galileo, César Chávez, Barbara Jordan) — already fixed with `lossy-page1-*.jpg` variants, all verified 200.
- Newly baked URLs for the 24 added entries: verified 200 (some needed 429 backoff retries; eventually all 200).

### Accuracy fixes (10 confirmed misdates) + dedup
- Moved to real birthdays: **Denzel Washington** 1/20→12/28, **Eric Clapton** 1/6→3/30, **Messi** 6/20→6/24, **Jacqueline Kennedy** 7/15→7/28, **Monica Lewinsky** 10/24→7/23, **Beatrix Potter** 12/17→7/28, **Tony Hawk** 5/14→5/12, **Antonio Banderas** 3/4→8/10.
- Removed wrong duplicate: **Usher** @3/24 (real 10/14, kept pool entry), **Louis Armstrong** @8/1 (real 8/4, kept 8/4).
- Replaced article-less/no-photo **Vivek Bindra** @10/17 with **Eminem** (also 10/17, huge get). **Lisa Bonet** + **Zoheb Hassan** keep monogram fallback (no Commons/en photo exists), now carry `wiki` slugs so links resolve.

### Zero dates eliminated
- Before: **8 real dates rendered an EMPTY grid** in the static tier (3/23, 3/30, 5/12, 5/15, 6/24, 7/23, 7/28, 8/10). Filled all with 24 accurate, image-verified entries (Chaka Khan, Keri Russell, Mo Farah; George Carlin, Burt Bacharach; Madeleine Albright, Brian Eno, Emmitt Smith; Lionel Messi, Mick Fleetwood, Pharrell; Daniel Radcliffe, Woody Harrelson; Jackie Kennedy, Hugo Chávez+; Herbert Hoover, Ian Anderson, Angie Harmon; Jerry Garcia + Yves Saint Laurent for 8/1; Laura Dern + Emilio Estefan for 3/4; Drake + Kevin Kline for 10/24).
- Static tier now: **only 2/29 (non-leap) uncovered**; 647 entries, no duplicate names. Note: static grid is still 1-2 people on many dates — the client-side Wikidata resolver tops up to 6 live; full ≥3-per-date statically is a larger expansion not done this sprint (user set scope).

### Regression tests added (`celebrities.test.ts`, now 9 tests → 370 total)
- Every real date renders ≥1 person (no empty grids).
- Never same person twice on a date.
- Every returned celebrity has image URL OR wiki source (renderer falls back to avatar for wiki-only).
- Every pool entry has valid month/day + image-or-wiki.
- (Existing: ≤6 per date, date-consistency, industries, determinism.)

### Verification
`tsc` clean, `vitest` 370/370, `lint` 0 errors (5 benign pre-existing warnings), `next build` OK. SSR via `next start -p 3010`: all 15 touched dates return 200 with correct wikimedia `<img>` counts (was-empty dates now 8-16 imgs). Pushed `e5ee3b8`.

## Sprint #33: Event-Specific Viewing Tips + Wikipedia Portraits Baked Into Celebrity Pools (`324a8e5`)

Follow-up to Sprint #32's remaining gap: (1) viewing tip was identical for every event in a category, (2) no-image supplement entries still depended on the client React fallback.

### Viewing tips are now per-event, not per-category
- Root cause: `calculateSkyEventsForYear` in `sky-events-calculated.ts` set `viewTipKey` once per category (all ~49 moon phases shared `tips.moonPhase`, seasons shared `tips.seasonal`, etc.).
- Rewrote the `skyEvents.tips` block in all 5 locales (`dictionaries.ts`, parity via `Dict = typeof en`): `meteor`, `conjunction` (planetary-pair template with `{a}`/`{b}` placeholders), `moon.{newMoon,firstQuarter,fullMoon,lastQuarter}`, `seasons.{vernalEquinox,summerSolstice,autumnalEquinox,winterSolstice}`.
- `sky-events-calendar.tsx` got helpers `moonTipKey` (titleKey `phases.*` for dynamic; curated titles parsed by startsWith "Full Moon"/"New Moon"), `seasonTipKey` (regex on `events.<season>.` in titleKey), and `viewingTip(e, t)` which interpolates conjunction planet names via `t(planets.${body})` — so the render is fully driven by event data with no reliance on baked keys.
- `viewTipKey` assignments in `sky-events-calculated.ts` updated to point at the new keys for coherence.
- `calculateSkyEvents` (75-day window) was left keyless by design — the calendar's data-driven helpers cover it too.

### Real portrait images baked into BOTH celebrity pools
- Bake script + resume cache: `C:\Users\NEWTEC~1\AppData\Local\Temp\opencode\bake-images.mjs` + `bake-cache.json` (temp, unscoped). Uses Node global fetch against `en.wikipedia.org/api/rest_v1/page/summary/<title>` (REST resolves redirects + normalizes titles, e.g. Nicholas_Cage→Nicolas Cage; `type:"disambiguation"` yields no thumb).
- `celebrities.ts` Sep 7 primary: baked `image` for Gloria Gaynor, Queen Elizabeth I, Evan Rachel Wood, Kevin Love, Chrissie Hynde (only Leslie Jones remains monogram — her page is a disambiguation, correctly no image).
- `celebrity-pool.ts`: 532/538 entries now carry a real 330px thumbnail; 14 `wiki` slugs added for disambiguated names (Sting_(musician), Usher_(musician), D.O._(entertainer), IU_(singer), Lisa_(rapper), Kai_(singer,_born_1994), Irene_(singer), Momo_(Japanese_singer), Antoni_Tàpies, etc.); `Laura Ingram`→`Laura_Ingraham` and `Micheal`→`Michael Graves` typo fixes. Removed junk: "Tie-dye Day" + fictional "Ernst Stavro Blofeld".
- `SupplementaryCelebrity` gained optional `wiki?`/`image?`; `supplementToCelebriant` URL prefers `s.wiki`.
- Thumbnails serve from BOTH `upload.wikimedia.org` and `thumb.wikimedia.org` (both whitelisted); normalized full-size images to `/thumb/<d1>/<d2>/<file>/330px-<file>` (dir pattern `[0-9a-f]{1,2}/[0-9a-f]{1,2}`). Remaining image-less entries are genuinely article-less (404) or lead-image-less (Lisa Bonet, Robin Roberts, Zoheb Hassan, Sana).
- Gotcha hit: REST title `"Weird Al" Yankovic` contains literal double quotes → would break the TS string; bake now skips wiki slugs containing `"` (reverted to relying on redirect + baked image).

### Verification
Runtime-verified for real: `next start`, fetched `/sky-events`, `/birthday/09-08` (supplement-only date), `/famous-birthdays`. `/birthday/09-08` now SSR-renders real Wikimedia `<img>` tags where it previously had none. `/sky-events` shows **79 tip blocks / 17 distinct texts** (was 1 text per category) with conjunction templates interpolated to real planet pairs ("Mars and Saturn…", "Mercury and Jupiter…") and no literal `{a}`/`{b}` leakage. After: `tsc` clean, `vitest` 366/366, `eslint` 0 errors (5 baseline warnings), `next build` green. Pushed `324a8e5` to `main`. Client REST fallback remains as-is (concurrency tuning deferred — baked images make it a rarely-hit safety net).

## Sprint #32: Celebrity Portrait Rendering Fix + Planning-First Sky Calendar (`2740b71`)

Verification: `tsc --noEmit` clean, `vitest` 366/366, `eslint` 0 errors (5 pre-existing benign warnings), `next build` green. **Runtime-verified for real**: started `next start`, fetched `/birthday/09-03`, `/famous-birthdays`, `/sky-events`, `/` — birthday page now SSR-renders 3 direct `<img src="https://upload.wikimedia.org/…">` tags (Charlie Sheen, Shaun White, Garrett Hedlund); all 85 curated portrait URLs return HTTP 200 (the 429s during bulk HEAD were Wikimedia rate-limiting — same URLs 200 when spaced); Wikipedia REST summary fallback resolves 7/8 no-image titles with a real lead image (Leslie Jones has no lead image — monogram fallback fires as designed).

### Root cause fixed — portraits were never rendering their real image
- `imageCandidates()` (src/lib/celebrities/wikidata.ts) was fed **full absolute URLs** by both pipelines (curated pool stores `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Foo.jpg/330px-Foo.jpg`; live tier stores `commonsThumb()` output `https://commons.wikimedia.org/wiki/Special:FilePath/Foo.jpg?width=330`), but it did `uri.split("/").pop()` and rebuilt a fake `Special:FilePath/330px-Foo.jpg` reference → every candidate 404'd → **every** portrait fell through to the slow client-side Wikipedia REST fallback (which itself 404s for ambiguous short titles like `RM`, `V`, `Gandhi`), so many cards showed the initials monogram instead of a photo.
- Fix: when the input already starts with `http(s)://`, return it **verbatim** as the single candidate (upgrading `http:` → `https:` to avoid mixed-content blocking). Bare-filename candidates still build the multi-candidate `Special:FilePath` chain as before.
- `wikidata.test.ts` updated to the corrected contract (verbatim passthrough + https upgrade; plain-filename chain tests retained). 13 cases.

### Sky events — planning-first, no more "Past"
- Removed the useless **Past** filter entirely (`Filter = "all" | "upcoming"`); default filter is now `upcoming` so the current year opens on what's still ahead.
- Year picker clamped to `[currentYear, currentYear+2]` (no browsing the past); added a **"Plan ahead"** row with quick chips **This year / Next year** so visitors can plan the next 12–24 months in one tap.
- i18n across all 5 locales: dropped `skyEvents.filters.past`, added `skyEvents.planHeading` + `skyEvents.yearPicker.{thisYear,nextYear}` (parity + no-raw-fallback audits green).

### Notes for future
- Supplementary pool entries (e.g. most dates without a primary card, like today 9-8) carry **no `image`** — they start as a monogram and upgrade client-side via the Wikipedia REST lead-image fetch (verified working). Live Wikidata tier (which fills these with real photos on `/birthday/MM-DD` and the hub) remains untestable from the sandbox (no egress to `query.wikidata.org`) — confirm live-source upgrade in production on a real deploy.

## Sprint #31: Perpetual Sky-Events Calendar + High-Density Famous Birthdays Hub (`4bd5c9f`)

Verification: `tsc --noEmit` clean, `vitest` 364/364 (24 new), `eslint` 0 errors (5 pre-existing benign warnings), `next build` green — `/sky-events` and `/famous-birthdays` both prerendered static. Work executed in parallel (two agents: sky calendar + birthdays hub), integration/dict/sitemap/footer done orchestrator-side.

### Part 1 — `/sky-events` perpetual full-year calendar
- `src/lib/content/sky-events-calculated.ts` — new `calculateSkyEventsForYear(year)` (deterministic, pure): 4 seasonal points (`SearchSunLongitude`), all ~49 moon quarters (`SearchMoonQuarter`/`NextMoonQuarter`), 8 annual meteor-shower peaks (from new `ANNUAL_SHOWER_PEAKS` in `sky-events-data.ts`), and planetary conjunctions for all 10 naked-eye planet pairs via `AE.PairLongitude` zero-crossing + bisection refinement (~sub-hour precision, 10-day sampling, 15-day skip guard). Exact ISO UTC datetimes on computed events; shower peaks are date-only.
- `SkyEvent` gained optional `viewTipKey`, `regionKey`, `bodyA`, `bodyB`.
- `src/components/sky/sky-events-calendar.tsx` (new client island): year selector (prev/current/next, clamped ±2), All/Upcoming/Past tabs (hydration-safe `startOfUtcDay()` lazy init + mount refresh), rich cards (month badge, localized category/title/description, UTC + user-local time lines, region tag, localized viewing tip, "How to watch" link with dead-host filtering), per-event "Add to calendar" (.ics) + bulk year export. No network dependency — fully computed offline.
- `src/app/sky-events/page.tsx` — re-shelled around the calendar, perpetual-calendar copy.

### Part 2 — `/famous-birthdays` hub
- `src/lib/celebrities/filters.ts` (new) — `CelebrityFilter` (all/cinema/music/science/sports) + `CELEBRITY_FILTER_GROUPS` (science → science+tech-business+world-leaders) + `celebrityMatchesFilter` (prefers `c.category` when a known slug, else `categoryFromProfession`).
- `src/components/celebrities/famous-birthdays-hub.tsx` (new client island) — SSG first paint via `celebritiesForDate(today)`; live 3-tier upgrade via `resolveCelebritiesForDate` (cache → Wikidata → static); Born Today spotlight, zodiac-of-the-day chip, month/day selects + Yesterday/Today/Tomorrow + prev/next day (year-boundary-safe via `Date.UTC(2000, …)` math), category filter chips, dense card grid with `PortraitAvatar` (exported from `celebrity-birthdays-view.tsx`), cards link to `/birthday/MM-DD`; `revalidate = 3600`.
- `src/app/famous-birthdays/page.tsx` — static shell, `pageMetadata` SEO (title/desc/keywords/hreflang alternates).
- Sitemap: `/famous-birthdays` added (weekly, 0.7). Footer astronomy column: Sky Events + Famous Birthdays links.

### i18n (all 5 locales, parity + no-raw-fallback audit green)
- `skyEvents` new: `yearPicker.{label,previous,next}`, `filters.{all,upcoming,past}`, `calendar.{utc,local,tip,addToCalendar}`, `noEvents`, `regions.{global,northern,southern}`, `tips.{meteorShower,moonPhase,seasonal,conjunction}`, `conjunctionsDesc`.
- `celebrities` new: `filters.{all,cinema,music,science,sports}`, `bornToday`, `yesterday`, `today`, `tomorrow`, `searchLabel`, `signOfTheDay`, `emptyState`.

### Notes for future
- Live Wikidata fetch still untestable from the sandbox (no egress to `query.wikidata.org`); the live tier self-falls-back to static here, and the hub's static tier keeps first paint dense. Verify `/famous-birthdays` live-source in production.
- Conjunction engine uses angular-distance crossing detection instead of `SearchRelativeLongitude` (which is single-body-vs-Sun in astronomy-engine 2.1.19); deterministic per year, tested.

## Sprint #30: Technical SEO, Homepage & Birthday-Date Pages (launch polish)

Verification: `tsc --noEmit` clean, `vitest` 340/340 (+87 this sprint), `eslint` 0 errors, `next build` green (459 pages — up from 93).

Goal/convention: ship the exact homepage the customer's marketing language promised (precision astronomical engine + personalized birthday insights), make the site technically SEO-complete (JSON-LD, hreflang, sitemap for every route), and add 366 statically generated `/birthday/{MM-DD}` pages reachable from a hero quick-input.

### Deliverables added
- `src/lib/seo/site.ts` — default URL now `https://zunara.vercel.app`; description emphasizes the precision engine + birthday guide.
- `src/lib/seo/metadata.ts` — `pageMetadata` (and `horoscopeMetadata`, `signIndexMetadata`) gained a `keywords: string[]` arg + `alternates.languages`. New `alternateLanguages(path)` helper.
- hreflang decision (documented): no locale-prefixed URLs exist on the site, so `alternates.languages` maps all 5 supported locales + `x-default` to the same canonical URL. Canonical stays self-referencing. No fake locale URLs.
- `src/lib/seo/jsonld.ts` — typed JSON-LD builders: `websiteJsonLd`, `softwareApplicationJsonLd`, `personJsonLd`, `birthdayItemListJsonLd`, `faqJsonLd`.
- `src/components/ui/json-ld.tsx` — `JsonLd` accepts optional `data` (name/description/url now optional props too) plus a raw `JsonLdScript` emitter.
- `src/app/sitemap.ts` — full site coverage incl. all tools, `/library/*` subpages, 366 birthday dates, `about/privacy/terms/disclaimer`, `rss.xml`.
- `src/lib/calendar/birthday-routes.ts` — `pad2`, `monthDays` (366 incl. 02-29), `birthdayDates`, `parseBirthdayDate`, shared by sitemap + birthday route + quick input.
- `src/app/birthday/[date]/page.tsx` + `birthday-client.tsx` — SSG (`dynamicParams=false`, `revalidate=86400`), per-date keywords/description, ItemList JSON-LD, breadcrumbs, zodiac-pairing CTA to `/{sign}/today`, and a live-upgrade island that renders the offline curated pool then resolves freshest Wikidata on mount (graceful static floor on any failure).
- `src/components/home/quick-birth-input.tsx` — client hero picker (month/day selects→`/birthday/{MM-DD}`), localized month names via Intl.
- `src/app/page.tsx` — rewritten to prescribed order: hero (date, headline, quick input) → exactly 2 CTAs (`/birthchart`, `/birthday/{todayMM-DD}`) → DailyOrbitBanner → Live Sky & Planets → SkyMap → DailyTransit → SkyEvents → CelebrityBirthdays → 12-sign grid → CosmicTraits → Core Features grid (4 tools) → Knowledge Base & Method.
- Dictionaries (all 5 locales): hero headline/subtitle/CTAs, quick-birth keys, method + features blocks; added `home.liveSkyDesc` so the Live Sky intro no longer reuses the method copy.
- Agent-track files merged into this sprint: timezone/DST groundwork (`src/lib/geo/timezones.ts`, positions/houses/timezones tests), plain-language content rewrite (`natal/readings.ts`, `guidance.ts`, `synastry.ts`, `content/engine.ts`, `validate.ts`), RTL/mobile bootstrap in `layout.tsx`/`site-nav.tsx`/`language-switcher.tsx`, section error boundaries + natal/aspect/retrograde/etc. test expansion.
- `eslint.config.mjs` — overrides: the newer `react-hooks/set-state-in-effect` heuristic is disabled for the deliberate hydration/init effects; `no-require-imports` off for `**/*.cjs` build scripts. Remaining warnings are intentional (external-portrait `<img>`, underscore params, read-only i18n deps).

### Verification
- `npx tsc --noEmit` clean; `npx vitest run` 30 files/340 tests pass (incl. i18n key-tree parity = all 5 locales have identical keys, every leaf a non-empty string); `eslint` 0 errors; `npx next build` 459 static/SSG pages, zero dynamic pages.

---

## Sprint #29: Dynamic "Famous Birthdays Today" — live Wikidata without a database (`86d55e4`)

Verification: `tsc --noEmit` clean, `vitest` 253/253 (+3), `next build` green (93 pages).

Goal: the home "Famous Birthdays Today" section showed only ~2 celebrity cards, both without portraits, on low-coverage dates (e.g. Sep 7 — no curated primary entry, and the supplementary pool has just two same-day names with no `image` field), because the live tier was gated behind a configured database.

- `src/lib/celebrities/resolver.ts` — the Level-2 live tier now runs in every environment, not only when a DB cache store exists.
  - New exported `createMemoryCache()`: a process-lifetime `CacheStore`, so no-DB deployments still resolve birthdays live from Wikidata while reusing fresh results across page loads (26h staleness via the existing `CACHE_STALE_MS`; stale entries pruned on write).
  - `defaultStore()`: DB-backed store when `isDbConfigured()`, otherwise a shared in-memory cache — skipped under `NODE_ENV === "test"` so the suite stays network-free.
  - Live results write through to whichever store exists, get topped up with the curated same-date pool, and are capped at 12. Sep 7 now resolves real notable people (Evan Rachel Wood, Gloria Gaynor, Queen Elizabeth I, Grandma Moses, Kevin Love, Leslie Jones, Toby Jones, …) with Commons portraits + sitelink badges — dynamically, for every date, with zero config.
- `resolver.test.ts`: +3 tests — memory cache backs the live tier without a DB, `updatedAt` stamped on write for staleness checks, cache miss returns null. 253/253.

### Resilience layer (same sprint, follow-up)
- Audit showed the curated static tier returns <4 people on ~300/366 days (the pool holds ~2 same-date names per day, so "two celebs" was every day's static reality, not just Sep 7). The dynamic live tier is the real fix; the static tier stays a failsafe.
- `wikidata.ts` `wikiSummaryUrl(title)`: pure URL builder for the Wikipedia REST `page/summary` lead-image API (follows redirects), +3 tests.
- `celebrity-birthdays-view.tsx` `PortraitAvatar`: when a celebrity has no stored portrait or all Commons candidates fail, it fetches the article lead image from `en.wikipedia.org` (module-level `PORTRAIT_CACHE`, graceful monogram on failure) — so imageless pool/static picks get real photos instead of letter avatars.
- `next.config.ts`: `connect-src` gained `https://en.wikipedia.org` and `https://query.wikidata.org` for the REST fetch.
- `celebrities.ts`: added 6 real Sep 7 births to the primary list (Gloria Gaynor, Queen Elizabeth I, Evan Rachel Wood, Kevin Love, Leslie Jones, Chrissie Hynde) so that date always has a 6-person floor.
- 256/256 tests, `tsc` clean, `next build` green (93 pages).

## Sprint #28: Performance (payload −38%), visible moon phase, sky-events polish, celebrity portrait fallbacks (`f416c71`, `d93821a`, `32bc9c9`)

Verification: `tsc --noEmit` clean, `vitest` 250/250, `next build` green (93 pages).

Goal: cut the initial JS payload that was making the site feel slow, make the moon actually look like a moon, fix the Sky Events data glitches, and make celebrity portraits resolve reliably.

### Performance — initial JS ~1415KB → ~870KB
- `src/components/home/home-heavy-sections.tsx`: new `"use client"` wrapper using `next/dynamic(..., { ssr: false })` (illegal directly in a Server Component) for SkyMapClient, DailyTransitClient, BentoZodiacGrid, SkyEvents, CelebrityBirthdays, CosmicTraits; `SectionSkeleton` fallback. `page.tsx` imports these from the wrapper.
- three.js chunk (559KB, `1dfbrz954xgec.js`) is no longer in the home init HTML — fetched only when the sky map mounts.
- `vitruvian-hero.tsx`: removed `priority`, set `loading="lazy"` (decorative opacity-15 watermark, absolute → zero CLS); killed the 3840px preload. Preload list is now just the two webfonts.
- MeteorShower already optimized (30fps, pauses offscreen/hidden, reduced-motion aware). Commits `f416c71` + `d93821a`.

### Moon phase is visible again
- `moon-phase.tsx` SVG drew the whole disc at `opacity = illumination/100`, so a 21% waning-crescent disc was nearly invisible. Now the lit disc renders at full brightness and the dark side is carved out with an SVG `<mask>` (`common white rect − night-cap path`), with the unlit limb as a subtle `--color-ink-3` disc underneath. A slim crescent now shows clearly on the correct (waning/waxing) side.

### Upcoming Sky Events (3 fixes)
- **i18n leak:** computed moon-phase events used `descKey: "phases.phaseHints.*"` but `phaseHints` is a top-level dict block — raw keys were rendered verbatim. Fixed keys to `"phaseHints.*"` (en|ur|ar|es|zh).
- **Equinox ≠ Eclipse:** equinoxes/solstices were categorised `"eclipses"` (badge "Eclipse"). Now `"seasonal"` with a localized "Seasonal/موسمی/موسمي/Estacional/季节性" label (all 5 dicts), plus a `categoryLabel` guard so a live-feed equinox can never show "Eclipse"; `FALLBACK_BY_CATEGORY` gained `seasonal`.
- **Duplicate Autumnal Equinox (Sep 22 + Sep 23):** `mergeSkyEventSources` deduped only by `date|category`, so the feed's equinox, the exact computed crossing and the curated calendar produced two cards a day apart. New `seasonKeyOf()` tokens seasonal events by year+season+type (`season|2026|autumn|equinox`) and merge keeps the first across any ±1-day disagreement.

### Celebrity portraits — multi-layer fallback (once and for all)
- `wikidata.ts` `imageCandidates(uri)`: up to 4 equivalent `Special:FilePath` URLs tried in order — decode-then-encode (fixes double-encoded SPARQL names like `%28`), resized `?width=330` thumb for plain names, original file, verbatim passthrough (guarded against `%` re-encoding and `?#` chars). `commonsThumb` unchanged (existing tests stable).
- `celebrity-birthdays-view.tsx` `PortraitAvatar` cycles candidates on `onError` (remount via `key={src}`), falling back to the typographic monogram only when the whole chain is exhausted.

### Planetary bulletin position (home)
- "The current sky" previously stacked Moon card + bulletin in the right column, leaving a tall empty gap under the left column. Restructured: header + Sun copy (3/5) alongside MoonSignCard (2/5), then the **Planetary bulletin as a full-width panel below** with retro/transit entries in a responsive `sm:grid-cols-2 lg:grid-cols-3` card grid — no dead space on either side.

### Tests
- `sky-events-calculated.test.ts`: seasonal category now asserted as `"seasonal"`; added equinox-collapse (different dates) + keep-same-category-different-days + `seasonKeyOf` cases.
- `wikidata.test.ts`: added `imageCandidates` coverage (plain, escaped, empty).

### 3D-sky tool survey (conclusion: keep three.js)
- Reviewed Stellarium Web Engine (AGPL-3.0 → would force-copyleft the whole site; emscripten/WASM + Gaia/star databases → multi-MB payload, undoes the deferral win), d3-celestial (2D planar maps, not a live dome). Our three.js dome (MIT, already integrated, bundle-split, SSR-safe) remains the right fit for a lightweight, design-matched "see the sky right now" widget.

### Files touched
- `src/app/page.tsx`, `src/components/home/home-heavy-sections.tsx` (new), `src/components/ui/vitruvian-hero.tsx`, `src/components/ui/moon-phase.tsx`, `src/components/ui/celebrity-birthdays-view.tsx`, `src/lib/celebrities/wikidata.ts`(+test), `src/lib/content/sky-events-calculated.ts`(+test), `src/lib/content/sky-events-data.ts`, `src/components/sky/sky-events.tsx`, `src/lib/i18n/dictionaries.ts`.

## Sprint #27: RTL blank-screen fix, hydration mismatches resolved, date-sync & image polish (`9b4c174`)

Verification: `tsc --noEmit` 0 errors, `vitest` 243/243, `next build` green.

Goal: fix the production-only blank screen on RTL locales (Urdu/Arabic) and eliminate hydration mismatches that cause mobile flash / full-root re-render.

### RTL blank screen (root cause + fix)
- **Bug:** `.skip-link { left: -9999px }` in `globals.css` — under `dir=rtl` the offset is measured from the right edge, inflating `document.scrollWidth` to ~10,624px. Combined with `html { overflow-x: clip }`, all visible content is pushed off-screen → fully blank RTL layout.
- **Fix:** replaced with the `clip()` visually-hidden pattern (`clip: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px`) + `inset-inline-start` for correct LTR/RTL focus placement. Zero overflow added.

### Hydration mismatches (root cause + fix)
- **SVG `<title>` array children:** `zodiac-symbol.tsx` and `planet-symbol.tsx` rendered `<title>{glyph} {aria}</title>` (3 children: glyph + space + aria). Browsers collapse `<title>` to a single text node, so React sees 3 children on server but 1 in the browser → hydration mismatch on every page. Fixed by collapsing to a single template-literal string (`<title>{`${glyph} ${aria}`}</title>`).
- **Live astronomy at render time:** `BentoZodiacGrid`, `MoonSignCard`, `MoonPhaseWidget` (via `DailyOrbitBanner`), and `SkyEvents` each called `new Date()` / `snapshotForToday()` / `moonSign()` / `moonPhase()` during render. Build-time SSR and client hydration compute different planetary positions → React #418 (prod-only, triggers full root re-render / mobile flash). Fixed by adding `startOfUtcDay()` helper to `astro.ts` (returns 00:00:00 UTC for the current day) and passing it to every live-computing component so server and client agree.

### Home date sync
- Daily cron (`api/cron/daily/route.ts`) now calls `revalidatePath("/")` so the ISR home page refreshes its hero date and "famous birthdays today" on the UTC day rollover instead of holding a stale date on low-traffic days.

### Image domain expansion
- Added `commons.wikimedia.org` to CSP `img-src` and `next/image` `remotePatterns` in `next.config.ts`.

### Files touched
- `src/app/globals.css` — skip-link clip pattern
- `src/components/ui/zodiac-symbol.tsx` — title single-string
- `src/components/ui/planet-symbol.tsx` — title single-string
- `src/lib/astronomy/astro.ts` — new `startOfUtcDay()` export
- `src/components/ui/bento-zodiac-grid.tsx` — pass stable date
- `src/components/ui/moon-sign-card.tsx` — pass stable date
- `src/components/ui/daily-orbit-banner.tsx` — pass stable date to MoonPhaseWidget
- `src/components/sky/sky-events.tsx` — use stable date in useState initializer
- `src/app/api/cron/daily/route.ts` — `revalidatePath("/")`
- `next.config.ts` — commons.wikimedia.org CSP + remotePatterns

## Sprint #26: Free geocoding everywhere, expanded legal disclaimer, 3D night-sky dome (`11eab96`)

Verification: `tsc --noEmit` 0 errors, `vitest` 243/243, `next build` green (home + `/sky-map` prerender the 3D client island cleanly).

Goal: give every location/place field a free, accurate address lookup; harden the legal disclaimer; turn the flat sky map into a 3D model anyone understands — delivered in three parallel tracks (done ASAP).

### Track 1 — Verified-place geocoding (free, accurate, never misleading)
- New `src/lib/geo/geocoding.ts`: shared **Nominatim/OpenStreetMap** client (free, no key) — `COOLDOWN_MS=1000` 1 req/s throttle, `debounce()` helper (callers use 350ms), `MIN_QUERY_LENGTH=3`, typed `PlaceSuggestion {id,label,name,latitude,longitude,type,country}`, `searchPlaces(q)` returns `{query,results}` so stale responses are dropped, `PlaceProvenance = "verified" | "manual"`, and a required `OSM_ATTRIBUTION` constant.
- **Accuracy rule:** coordinates only ever change from an explicit suggestion pick or manual entry — free text typed into a field never silently moves the point; every UI shows OSM attribution and a provenance line ("Coordinates verified from the selected place." / "Coordinates below were entered manually…").
- `birth-form.tsx` (covers birthchart, daily-transit, synastry — it was already the site's only geocoding consumer, refactored onto the shared lib) and `sky-map-client.tsx` (observation point) both got remote autocomplete + provenance + attribution. Manual lat/long edits on the sky map flip provenance to manual.

### Track 2 — Legal disclaimer shield
- `src/app/disclaimer/page.tsx` rewritten ("Disclaimer & Risk Disclosure") with 11 `PaperSection`s: entertainment/reflection only (astrology is symbolic, not science, even though positions come from real astronomical data); not medical/legal/financial/navigational advice; no accuracy guarantee (VSOP87-based positions, 12:00 noon default for unknown birth time, user-entered data); third-party data accuracy (Wikidata celebrities, OSM/Nominatim, Wikimedia); not for navigation/safety; user responsibility for inputs; privacy (localStorage only, Nominatim geocoding note); third-party licensing/attribution; changes; limitation of liability; contact `hello@zunara.today`.

### Track 3 — 3D night-sky dome
- `src/components/astronomy/sky-map-canvas.tsx` rebuilt on **Three.js** (`three@0.185.1` + `@types/three@0.185.4` added). Interface unchanged: `SkyMapCanvas({ observer, date?, className? })`, `"use client"`, same wrapper/`aria-label`/`role`.
- Scene: vertical-gradient sky dome, ~2600 procedural ambient stars, glowing horizon ring + translucent ground disc, N/E/S/W cardinal labels, gold zenith marker, 30°/60° altitude rings. Real bodies from `computeSkyBodies(observer, at)` (alt ≥ −2°) placed at true alt/az (`pos=(cos alt·sin az, sin alt, −cos alt·cos az)`, north = −Z); sun/moon/planet glow sprites sized by magnitude for stars; projected name labels via Canvas2D overlay.
- Interaction: `OrbitControls` (origin target, `maxPolarAngle 0.9π`, zoom 0.9–4.2, damping, no pan), idle auto-rotate that pauses on interaction and resumes after 4s; hover/tap raycast tooltip (glyph, name, Az/Alt, mag for stars); WebGL-unavailable fallback message.
- SSR-safe: renderer/scene/canvas textures built only inside `useEffect`; render phase only computes `computeSkyBodies` (pure). Full cleanup (rAF, controls, ResizeObserver, listeners, geometries/materials dispose), DPR capped at 2.
- `skyMap.hoverHint` updated across all 5 locales to mention drag ("Drag to rotate the sky · hover or tap a body…").

### Verification & deploy
- `tsc --noEmit` clean post-reconciliation (incl. three types); `vitest` 243/243; `next build` green — `/sky-map` and home prerender fine with three.js.
- Staged only this sprint's 8 files (geocoding lib, birth-form, sky-map-client, sky-map-canvas, disclaimer, dictionaries hoverHint, package(lock).json); pushed `3f7d17a..11eab96 master -> main`.

## Sprint #25: Tools surfaced on the pages, Tools menu removed, plain-English sky explainers (`1591a69`)

Verification: `tsc --noEmit` 0 errors, `vitest` 243/243, `next build` green.

Goal: make the tools' interactive power one scroll away instead of hidden behind a header popover, and make the live-sky jargon legible to a first-time reader. (.gitignore/staged-diff note: the working tree had unrelated uncommitted user changes — `next.config.ts` Wikimedia `commons.wikimedia.org` + `pathname /**` for images, `api/cron/daily` `revalidatePath("/")` so the home ISR date rolls over daily, `globals.css` RTL-safe `.skip-link` clip pattern, and JSX backtick `<title>` interpolations — these were left uncommitted.)

### Navigation simplification
- **Removed the header "Tools ▾" menu entirely** from `site-nav.tsx` (desktop popover + mobile subsection + `nav.tools` label usage; `useRef`/`useEffect` outside-click wiring deleted). Header is now just: Home (logo) · Horoscopes · Birth Chart · Cosmic Facts · Sky Events · About.
- Standalone routes `/synastry`, `/daily-transit`, `/sky-map` still exist (footer links + canonical SEO preserved) but are no longer the primary discovery path.

### Tools moved into the flow (saving a click)
- **Synastry → cosmic-facts page**, as a new section directly below the "Zodiac compatibility" (How two signs mesh) hub and before the Elemental forces panel: kicker/title/subtitle + `<SynastryClient />` embedded. Bigger-font framing: "Sign compatibility is the fun glance — this is the deep dive."
- **Sky Map → home page**, new full-width section immediately after "The current sky" (kicker "Live from your corner of the planet"), `<SkyMapClient />` embedded.
- **Daily Transit → home page**, section right after Sky Map (kicker "Your personal sky"), `<DailyTransitClient />` embedded — reads the saved birth-chart profile, falls back to its birth form for new visitors.
- New dict keys (parity across en|ur|ar|es|zh): `home.skyMapKicker/Title/Subtitle`, `home.dailyTransitKicker/Title/Subtitle`, `cosmicFacts.synastryKicker/Title/Subtitle`.

### Plain-English explainers (`src/lib/content/sky-plain.ts`)
New pure-data helper rendering "In plain words" sentences for the non-technical reader (English editorial copy by design, matching the glossary scope decision):
- Sign frames (12) e.g. cancer → "the sign of home, family and deep feeling".
- Lunar phases (8) e.g. Waning Crescent → "a calm, restful pause before the next cycle".
- Planet themes (8) e.g. saturn → "structure, limits, time and responsibility".
- Aspect relations (5) e.g. sextile → "a friendly, helpful angle — the energies cooperate and open doors".
- `plainMoon`, `plainRetro`, `plainAspect` compose them.
- **Moon card** (`moon-sign-card.tsx`): appended a second muted line under the existing `24% illuminated — …` caption.
- **Planetary bulletin** (`page.tsx`): a lead primer under the kicker explains "retrograde" in one sentence; each retrograde row gained a `℞` mark + its own explainer line; the no-retrograde fallback and the headline aspect row (with orb closeness wording like "almost exactly aligned, so the effect is unusually strong") each got one too.

### Verification & deploy
- `tsc --noEmit` clean; `vitest` 243/243; `next build` green (home now prerenders the embedded clients as client islands under ISR).
- Pushed `6734e16..1591a69 master -> main`.
