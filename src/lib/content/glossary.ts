/**
 * Plain-English glossary of astrological terms used across Zunara's content.
 *
 * Every definition is written in clear, hype-free English. `seeAlso` lists the
 * `term` slugs of related entries so tooltips and index pages can cross-link.
 */

export type GlossaryCategory =
  | "planets"
  | "signs"
  | "houses"
  | "aspects"
  | "movement"
  | "technique"
  | "points";

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: GlossaryCategory;
  seeAlso?: string[];
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    term: "Ascendant",
    definition:
      "The zodiac sign rising over the eastern horizon at the exact moment and place of birth. It sets the first house and shapes the outer persona people first meet.",
    category: "points",
    seeAlso: ["Rising Sign", "Houses"],
  },
  {
    term: "Rising Sign",
    definition:
      "Another name for the Ascendant — the sign that was rising on the eastern horizon at birth. It colours how you present yourself and how others first see you.",
    category: "points",
    seeAlso: ["Ascendant"],
  },
  {
    term: "Sun Sign",
    definition:
      "The sign the Sun occupied at your birth. It represents your core identity, purpose and vitality — the most widely known part of your chart.",
    category: "signs",
    seeAlso: ["Big Three"],
  },
  {
    term: "Moon Sign",
    definition:
      "The sign the Moon occupied at your birth. It reflects your emotional baseline, instincts and what makes you feel secure.",
    category: "signs",
    seeAlso: ["Big Three"],
  },
  {
    term: "Big Three",
    definition:
      "Your Sun, Moon and Ascendant signs together. The Sun is your core self, the Moon your inner world, and the Ascendant your outer mask.",
    category: "technique",
    seeAlso: ["Sun Sign", "Moon Sign", "Ascendant"],
  },
  {
    term: "Midheaven (MC)",
    definition:
      "The point where the ecliptic crosses the local meridian at birth, opposite the Imum Coeli. It marks the tenth house and relates to career, reputation and public life.",
    category: "points",
    seeAlso: ["Houses", "Ascendant"],
  },
  {
    term: "Descendant",
    definition:
      "The point opposite the Ascendant, marking the start of the seventh house. It relates to partnerships, marriage and close one-to-one relationships.",
    category: "points",
    seeAlso: ["Ascendant", "Houses"],
  },
  {
    term: "Houses",
    definition:
      "The twelve divisions of the sky around a birth chart. Each whole-sign house covers a different life area, from identity (1st) to rest (12th).",
    category: "houses",
    seeAlso: ["Ascendant"],
  },
  {
    term: "1st House",
    definition: "Self, personal direction, and how you present to the world.",
    category: "houses",
    seeAlso: ["Houses", "Ascendant"],
  },
  {
    term: "2nd House",
    definition: "Money, possessions, and a sense of personal worth.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "3rd House",
    definition: "Communication, learning, siblings, and daily routines.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "4th House",
    definition: "Home, family, roots, and private life.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "5th House",
    definition: "Creativity, romance, pleasure, and self-expression.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "6th House",
    definition: "Work, health, and daily service.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "7th House",
    definition: "Partnerships, marriage, and close one-to-one relationships.",
    category: "houses",
    seeAlso: ["Houses", "Descendant"],
  },
  {
    term: "8th House",
    definition: "Shared resources, intimacy, and transformation through change.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "9th House",
    definition: "Beliefs, travel, higher learning, and broad perspective.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "10th House",
    definition: "Career, reputation, and public standing.",
    category: "houses",
    seeAlso: ["Houses", "Midheaven (MC)"],
  },
  {
    term: "11th House",
    definition: "Friends, groups, networks, and future plans.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "12th House",
    definition: "Rest, solitude, the subconscious, and what is kept private.",
    category: "houses",
    seeAlso: ["Houses"],
  },
  {
    term: "Conjunction",
    definition:
      "Two planets at nearly the same longitude (within about 8 degrees). Their energies merge into a single focused point of contact.",
    category: "aspects",
    seeAlso: ["Aspects"],
  },
  {
    term: "Opposition",
    definition:
      "Two planets about 180 degrees apart. Their energies pull in opposite directions and ask for balance between two life areas.",
    category: "aspects",
    seeAlso: ["Aspects"],
  },
  {
    term: "Trine",
    definition:
      "Two planets about 120 degrees apart. Their energies flow together with little conscious effort, often within the same element.",
    category: "aspects",
    seeAlso: ["Aspects"],
  },
  {
    term: "Square",
    definition:
      "Two planets about 90 degrees apart. Their energies create friction that invites conscious adjustment and growth.",
    category: "aspects",
    seeAlso: ["Aspects"],
  },
  {
    term: "Sextile",
    definition:
      "Two planets about 60 degrees apart. Their energies open a natural lane of cooperation when you actively use it.",
    category: "aspects",
    seeAlso: ["Aspects"],
  },
  {
    term: "Aspects",
    definition:
      "The angular relationships between planets measured in degrees. Major aspects are the conjunction, sextile, square, trine and opposition.",
    category: "aspects",
    seeAlso: ["Conjunction", "Opposition", "Trine", "Square", "Sextile"],
  },
  {
    term: "Retrograde",
    definition:
      "The apparent backward (westward) motion of a planet as seen from Earth. A planet in retrograde is not reversing physically; it only appears to slow, pause and move backward in the sky.",
    category: "movement",
  },
  {
    term: "Lunar Nodes",
    definition:
      "The points where the Moon's orbit crosses the ecliptic. The North Node points toward growth and life direction; the South Node toward comfortable, familiar patterns.",
    category: "points",
    seeAlso: ["North Node", "South Node"],
  },
  {
    term: "North Node",
    definition:
      "The ascending lunar node, indicating the direction of growth this lifetime tends to reward. It is not a physical body but a calculated point.",
    category: "points",
    seeAlso: ["Lunar Nodes"],
  },
  {
    term: "South Node",
    definition:
      "The descending lunar node, reflecting familiar patterns and what comes easily. It points to habits worth loosening rather than doubling down on.",
    category: "points",
    seeAlso: ["Lunar Nodes"],
  },
  {
    term: "Synastry",
    definition:
      "The comparison of two birth charts by cross-referencing each person's planetary placements. It describes how two charts interact across relationship dimensions.",
    category: "technique",
    seeAlso: ["Transit", "Aspects"],
  },
  {
    term: "Transit",
    definition:
      "The current position of a planet against the backdrop of a birth chart. Transits show which life topics a given day or period highlights.",
    category: "technique",
    seeAlso: ["Synastry"],
  },
  {
    term: "Progressed Moon",
    definition:
      "A technique that moves the natal Moon about one zodiac sign per year (after the age of about 27). It tracks slow shifts in emotional needs and life focus.",
    category: "technique",
    seeAlso: ["Transit"],
  },
  {
    term: "Saturn Return",
    definition:
      "The roughly 29-year cycle when transiting Saturn returns to its natal position. It is a time of reassessing structure, responsibility and long-term direction.",
    category: "technique",
    seeAlso: ["Transit"],
  },
  {
    term: "Element",
    definition:
      "One of four qualities — Fire, Earth, Air, Water — that classify the zodiac signs. Each element describes a fundamental style: fire acts, earth builds, air thinks, water feels.",
    category: "signs",
  },
  {
    term: "Domicile",
    definition:
      "The zodiac sign a planet rules and works most naturally in. For example, the Sun is domiciled in Leo and the Moon in Cancer.",
    category: "technique",
    seeAlso: ["Element"],
  },
];

export const GLOSSARY_INDEX: ReadonlyMap<string, GlossaryEntry> = new Map(
  GLOSSARY.map((g) => [g.term, g]),
);

/** Look up a glossary entry by its exact term. */
export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return GLOSSARY_INDEX.get(term);
}

/** All terms grouped by category (order preserved). */
export function glossaryByCategory(): Map<GlossaryCategory, GlossaryEntry[]> {
  const map = new Map<GlossaryCategory, GlossaryEntry[]>();
  for (const entry of GLOSSARY) {
    const list = map.get(entry.category) ?? [];
    list.push(entry);
    map.set(entry.category, list);
  }
  return map;
}
