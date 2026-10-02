---
title: "How We Built a Free Astrology Calculator on Real Planetary Math"
published: false
description: "How the free Zunara calculators work — VSOP87 exact positions, honest interpretation, and no account required."
platforms:
  medium: false
  devto: true
tags:
  - astronomy
  - javascript
  - nextjs
  - opensource
canonical: "https://zunara.vercel.app/tools"
---

# How We Built a Free Astrology Calculator on Real Planetary Math

*VSOP87 theory, honest interpretation, and zero fabricated coordinates.*

A few people on the site built a free astrology toolchain that doesn't invent a single coordinate. Here's the engineering approach, in case it's useful to anyone doing the same.

**The engine**

We compute every position with astronomy-engine (VSOP87 planetary theory), the same class of theory used in published almanacs. Positions are geocentric, apparent, tropical-ecliptic. Solar eclipses, lunar eclipses and oppositions are found by literal search over the theory — `SearchLunarEclipse`, `SearchGlobalSolarEclipse`, `SearchRelativeLongitude` — then verified against known 2026 events.

**The honesty rule**

The site draws a hard line between what the math measures (positions, angles, phases) and what the copy reflects on (meaning, interpretation). That distinction is load-bearing: the numbers must be reproducible to a fraction of a degree; the interpretation is labeled as reflective, not scientific.

**The other hard rule**

No fabricated data. Celebrity birthdates are Wikidata-verified; historical events are sourced; the static astronomical datasets are computed from the engine, not hand-invented. If a number isn't derivable, we don't publish it.

The stack is Next.js, TypeScript, a deterministic computation layer, and zero client-side mystery. Full details live in the open project.

[Try the live calculator set — birth chart, synastry, sky map, ephemeris, all free.](https://zunara.vercel.app/tools)