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

- **i18n**: Client-only via `useLocale()` hook + cookie `zunara-locale`. Dictionaries in `src/lib/i18n/dictionaries.ts` (~1900 lines, 5 languages). `Dict = typeof en` enforces structural parity via typecheck.
- **Astro engine**: Pure VSOP87 deterministic — `computeNatalChart(date, coords, options)`. No external API.
- **Birth time**: Local civil time converted to UTC via LMT longitude offset (classic astrological method).
- **Supplemental data**: `celebrity-pool.ts` provides ~540 supplementary figures; `sky-events-data.ts` provides full-year 2026 celestial events baseline.
- **Deploy**: `git push origin master:main`. Live at `https://zunara.vercel.app`.
- **Remote**: `https://github.com/uncrownedprince786-collab/Zunara`. Branch: `master` tracks `origin/main`.
