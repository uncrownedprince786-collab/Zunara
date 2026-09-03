/**
 * "Did you know?" cosmic fun facts.
 *
 * Deliberately short, genuinely true and slightly surprising, so each card
 * reads in one breath. Facts are written to delight, never to diagnose —
 * they are purely astronomical so they can never trip the safety validator.
 */

const SIGN_FACTS: Record<string, string> = {
  aries:
    "Did you know? Mars, your ruling planet, is home to Olympus Mons — the largest volcano in the solar system, nearly 3 times taller than Mount Everest!",
  taurus:
    "Did you know? A single day on Venus, your ruling planet, is actually longer than its entire year!",
  gemini:
    "Did you know? Mercury, your ruler, is the fastest planet — it sprints around the Sun in just 88 Earth days.",
  cancer:
    "Did you know? The Moon, your ruler, drifts about 1.5 inches farther from Earth every single year.",
  leo:
    "Did you know? The Sun makes up 99.8% of all the mass in our entire solar system.",
  virgo:
    "Did you know? Mercury has no seasons like ours — a single Mercury day lasts 59 Earth days, yet a year lasts 88.",
  libra:
    "Did you know? Venus spins the 'wrong way' — it rotates backwards, so its Sun rises in the west and sets in the east.",
  scorpio:
    "Did you know? Pluto, your traditional ruler, is smaller than Earth's Moon but bigger than any asteroid discovered so far.",
  sagittarius:
    "Did you know? Jupiter, your ruler, has a storm — the Great Red Spot — that has been raging for at least 350 years.",
  capricorn:
    "Did you know? Saturn, your ruler, is so light it would float on water — its density is less than water's!",
  aquarius:
    "Did you know? Uranus, your ruler, rolls around the Sun on its side, like a ball being pushed — one of the strangest tilts in the solar system.",
  pisces:
    "Did you know? Neptune, your ruler, has the fastest winds in the solar system — blasting at more than 1,200 miles per hour!",
};

const CATEGORY_FACTS: Record<string, string> = {
  "meteor-showers":
    "Did you know? Most shooting stars are no bigger than a single grain of sand burning up as they streak through our atmosphere.",
  "moon-phases":
    "Did you know? The term 'Harvest Moon' comes from farmers using that bright autumn moonlight to keep harvesting late into the night.",
  eclipses:
    "Did you know? A total solar eclipse is one of the few times you can see the Sun's faint outer atmosphere, the corona, with the naked eye.",
  oppositions:
    "Did you know? A planet at opposition rises around sunset and shines all night — it's the very best time of year to view it.",
  conjunctions:
    "Did you know? The next time two bright planets appear to 'kiss' in the sky can be predicted centuries in advance — astronomy is that precise.",
  default:
    "Did you know? The faint stars you see with the naked eye are just the tip of an iceberg — our galaxy alone holds hundreds of billions of them.",
};

export function funFactForSign(slug: string): string {
  return SIGN_FACTS[slug] ?? CATEGORY_FACTS.default;
}

export function funFactForCategory(category: string | undefined): string {
  return CATEGORY_FACTS[category ?? "default"] ?? CATEGORY_FACTS.default;
}
