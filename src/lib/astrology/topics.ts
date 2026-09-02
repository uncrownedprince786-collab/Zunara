export interface AstrologyTopic {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  related: string[];
  updated?: string;
}

export const ASTROLOGY_TOPICS: readonly AstrologyTopic[] = [
  {
    slug: "birth-chart",
    title: "Birth Chart",
    summary: "How a natal chart maps the sky at the moment of your birth.",
    body: [
      "A birth chart, also called a natal chart, is a map of the heavens at the precise moment and place a person is born. It records the positions of the Sun, Moon and planets against the backdrop of the twelve zodiac signs, and divides the sky into twelve astrological houses.",
      "In Western tropical astrology, the chart begins at 0 degrees Aries, the point of the Vernal Equinox. Every planet's position is described by its zodiac sign, its degree within that sign, and its house placement.",
      "The Sun sign — the sign the Sun occupied at birth — is the centre of identity. The Moon sign reflects the inner emotional nature, while the Ascendant, or rising sign, describes how a person first presents to the world. Together they form the core of a natal reading.",
    ],
    related: ["transits", "aspects", "houses"],
  },
  {
    slug: "transits",
    title: "Transits",
    summary: "How the current positions of planets shape the present moment.",
    body: [
      "A transit occurs when a planet in its current motion forms an aspect to a point in your birth chart. Because the planets are always moving, transits describe the ever-changing 'weather' of the sky in relation to your natal positions.",
      "Fast-moving bodies such as the Moon and Mercury shift the daily texture of experience. The slower planets — Saturn, Uranus, Neptune and Pluto — mark longer chapters, often lasting months or years.",
      "At Zunara, our forecasts are built from the current positions of all ten major bodies. Every transit we reference corresponds to a real, calculated planetary position rather than an invented one.",
    ],
    related: ["aspects", "retrogrades", "birth-chart"],
  },
  {
    slug: "retrogrades",
    title: "Retrogrades",
    summary: "What it means when a planet appears to move backward through the sky.",
    body: [
      "A retrograde is an apparent backward motion of a planet against the background of the stars, caused by the differing orbital speeds of Earth and the planet in question. Planets do not actually reverse direction; they only appear to from our vantage point.",
      "Astrologically, a retrograde period is associated with review, revision and reconsideration. The themes ruled by that planet are often drawn inward, asking for patience and a second look rather than bold new starts.",
      "Our retrograde indicators are computed directly from the daily motion of each planet, so they always reflect the true state of the sky on any given date.",
    ],
    related: ["transits", "aspects"],
  },
  {
    slug: "aspects",
    title: "Aspects",
    summary: "The angular relationships between planets that shape the flow of energy.",
    body: [
      "In astrology, an aspect is a specific angular relationship between two planetary positions, measured in degrees. The five major aspects are the conjunction (0°), sextile (60°), square (90°), trine (120°) and opposition (180°).",
      "Each aspect carries a character. Conjunctions blend and intensify. Trines and sextiles ease and support. Squares and oppositions challenge and mobilise. A small 'orb' of a few degrees is allowed around each exact angle.",
      "At Zunara, aspects are calculated from the true angular separation of the planets, with orbs matching the traditional allowances. They form the backbone of our theme selection for each forecast.",
    ],
    related: ["transits", "birth-chart", "houses"],
  },
  {
    slug: "houses",
    title: "Houses",
    summary: "The twelve life areas mapped across the birth chart.",
    body: [
      "The twelve astrological houses divide the chart into areas of life — identity, money, communication, home, creativity, work, partnership, transformation, philosophy, career, community and the inner world.",
      "While the signs describe how energy expresses, the houses describe where it plays out in daily life. Each house falls entirely within one sign in the whole-sign house system.",
      "The foundation for houses is a precise, calculated Ascendant. Zunara's architecture supports house computation for future personalised natal charts, built on the same astronomical engine used for our public forecasts.",
    ],
    related: ["birth-chart", "aspects"],
  },
  {
    slug: "zodiac-signs",
    title: "Zodiac Signs",
    summary: "An introduction to the twelve signs of the tropical zodiac.",
    body: [
      "The zodiac is a band of the sky divided into twelve equal sections of 30 degrees each, beginning at the Vernal Equinox — 0° Aries. Each sign is associated with an element (Fire, Earth, Air or Water) and a modality (Cardinal, Fixed or Mutable).",
      "A person's Sun sign is the sign occupied by the Sun at their birth, and it is the most widely known element of astrology. But the full chart weaves together the positions of all the planets.",
      "At Zunara, we determine a sign's boundaries by the Sun's calculated longitude crossing each 30° mark, so dates are exact and never approximate.",
    ],
    related: ["birth-chart", "aspects", "transits"],
  },
  {
    slug: "planets",
    title: "The Planets",
    summary: "The roles of the ten celestial bodies in astrological interpretation.",
    body: [
      "Each planet in astrology carries a distinct set of themes. The Sun represents identity and vitality; the Moon, emotion and instinct. Mercury governs communication, Venus love and values, and Mars drive and action.",
      "Jupiter brings growth and fortune, while Saturn brings structure and discipline. The outer planets — Uranus, Neptune and Pluto — act more slowly and are associated with generational and transformative themes.",
      "The positions of all ten bodies are calculated with precision at Zunara. You will see them reflected honestly in our planetary tables on every horoscope page.",
    ],
    related: ["transits", "aspects", "retrogrades"],
  },
];

export const ASTROLOGY_BY_SLUG: ReadonlyMap<string, AstrologyTopic> = new Map(
  ASTROLOGY_TOPICS.map((t) => [t.slug, t]),
);

export function getAstrologyTopic(slug: string): AstrologyTopic | undefined {
  return ASTROLOGY_BY_SLUG.get(slug);
}
