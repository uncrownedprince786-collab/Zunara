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
- New-route i18n uses inline `t(key, "English fallback")` only — `dictionaries.ts` untouched (language-audit test still green); a future pass can localize new keys across all 5 locales.
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
- #1–#3 new copy still uses inline English + `t()` fallbacks (dictionaries untouched); a later i18n pass can localize `skyMap.*`, `dailyTransit.*` and `skyEvents` export labels across all 5 locales.
