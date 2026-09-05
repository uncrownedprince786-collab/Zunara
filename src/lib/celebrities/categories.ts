/**
 * Dynamic celebrity category taxonomy.
 *
 * Wikidata queries return free-text occupation labels, so each figure is
 * grouped into a stable editorial category by matching its occupations (and,
 * as a fallback, its bio description) against priority-ordered rules. Keeping
 * the mapping here as pure functions makes the grouping deterministic and
 * unit-testable without any network access.
 */

export type CategorySlug =
  | "cinema"
  | "music"
  | "sports"
  | "tech-business"
  | "science"
  | "literature"
  | "world-leaders"
  | "art-design"
  | "content-media"
  | "philosophy"
  | "activism"
  | "other";

export const CELEBRITY_CATEGORIES: CategorySlug[] = [
  "cinema",
  "music",
  "sports",
  "tech-business",
  "science",
  "literature",
  "world-leaders",
  "art-design",
  "content-media",
  "philosophy",
  "activism",
  "other",
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  cinema: "Cinema",
  music: "Music",
  sports: "Sports",
  "tech-business": "Tech & Business",
  science: "Science",
  literature: "Literature",
  "world-leaders": "World Leaders",
  "art-design": "Art & Design",
  "content-media": "Content & Media",
  philosophy: "Philosophy",
  activism: "Activism & Advocacy",
  other: "Other",
};

/** Category slug → Tailwind chip classes (kept light and theme-consistent). */
export const CATEGORY_STYLE: Record<CategorySlug, string> = {
  cinema: "border-gold/25 bg-gold/10 text-gold-deep",
  music: "border-cosmic/30 bg-cosmic/15 text-cosmic",
  sports: "border-fire/30 bg-fire/10 text-fire",
  "tech-business": "border-air/30 bg-air/10 text-air",
  science: "border-white/15 bg-white/[0.05] text-muted",
  literature: "border-earth/30 bg-earth/10 text-earth",
  "world-leaders": "border-gold/30 bg-gold/10 text-gold-deep",
  "art-design": "border-cosmic/25 bg-cosmic/10 text-cosmic",
  "content-media": "border-air/25 bg-air/10 text-air",
  philosophy: "border-white/15 bg-white/[0.04] text-subdued",
  activism: "border-fire/25 bg-fire/10 text-fire",
  other: "border-white/10 bg-white/[0.04] text-subdued",
};

export function categoryName(slug: CategorySlug): string {
  return CATEGORY_LABELS[slug] ?? "Other";
}

interface CategoryRule {
  slug: CategorySlug;
  pattern: RegExp;
}

/**
 * Priority-ordered rules. Earlier rules win, so a "computer scientist" is a
 * Tech & Business figure rather than generic Science, while a pure "physicist"
 * still lands in Science.
 */
const RULES: CategoryRule[] = [
  {
    slug: "tech-business",
    pattern:
      /entrepreneur|business ?(magnate|person|man|woman|executive)|chief executive|ceo|chairman|investor|venture capitalist|industrialist|banker|financier|programmer|software (developer|engineer)|computer scientist|engineer|technolog|startup/i,
  },
  {
    slug: "science",
    pattern:
      /physicist|astronom|chemist|biolog|mathematician|neuroscientist|psychiatrist|psychologist|scientist|physician|surgeon|inventor|anatomist|botanist|zoologist|geneticist|geolog|anthropolog|palaeontologist|naturalist|pharmacolog|virologist|immunolog|astronaut|cosmonaut|engineer|meteorolog|oceanograph/i,
  },
  {
    slug: "music",
    pattern:
      /sing|songwriter|composer|musician|rapper|pianist|guitarist|drummer|violinist|conductor|record producer|music (producer|director|critic)|dj|disc jockey|lyricist|opera/i,
  },
  {
    slug: "cinema",
    pattern:
      /actor|actress|film (director|producer)|filmmaker|cinematographer|television (director|producer|presenter)|tv presenter|screenwriter|model|director|producer|stage actor|voice actor|comedian|performer|entertainer/i,
  },
  {
    slug: "sports",
    pattern:
      /athlet|football|basketball|baseball|tennis|golf|soccer|hockey|cricket|rugby|boxer|wrestler|swimmer|racing driver|motorcycle|cyclist|skater|snowboarder|gymnast|marathon|sprinter|jumper|coach|sportsperson|sportsman|sportswoman|outfielder|cricketer|goalkeeper|defender|midfielder|champion|olympic/i,
  },
  {
    slug: "world-leaders",
    pattern:
      /politician|statesman|stateswoman|president|prime minister|chancellor|monarch|king|queen|emperor|empress|senator|congressman|congresswoman|governor|diplomat|ambassador|regent|royal|minister|mayor|leader|political/i,
  },
  {
    slug: "philosophy",
    pattern:
      /philosopher|theologian|philosophy|religious leader|mystic|spiritual/i,
  },
  {
    slug: "literature",
    pattern:
      /writer|author|novelist|poet|playwright|essayist|literary|critic|editor|historian|translator|journalist/i,
  },
  {
    slug: "activism",
    pattern:
      /activist|civil rights|suffragette|abolitionist|human rights|feminist|environmentalist|protest|organizer|union|advocate/i,
  },
  {
    slug: "art-design",
    pattern:
      /painter|sculptor|architect|designer|illustrator|photographer|graphic artist|printmaker|fashion designer|ceramicist|artist|dancer|choreographer|cartoonist|animator/i,
  },
  {
    slug: "content-media",
    pattern:
      /youtuber|influencer|streamer|gamer|podcast|blogger|video (creator|game)|social media|internet/i,
  },
  // Anything matched but not categorised above is an "other" figure.
  { slug: "other", pattern: /./i },
];

/**
 * Deterministically classify a celebrity. Prefers the combined occupation
 * string and falls back to scanning the bio description for known keywords.
 */
export function categoryFromProfession(
  profession: string,
  extra?: string,
): CategorySlug {
  const haystack = [profession, extra ?? ""]
    .filter((s): s is string => typeof s === "string" && s.length > 0)
    .join(" · ");
  for (const rule of RULES) {
    if (rule.pattern.test(haystack)) return rule.slug;
  }
  return "other";
}