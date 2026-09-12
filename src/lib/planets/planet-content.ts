import type { BodyKey } from "@/lib/astronomy/bodies";
import { getCelestialBody } from "@/lib/astronomy/bodies";

export const PLANET_SLUGS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const satisfies readonly BodyKey[];

export type PlanetSlug = (typeof PLANET_SLUGS)[number];

export const SIGN_SLUGS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type SignSlug = (typeof SIGN_SLUGS)[number];

export interface PlanetContent {
  keywords: string[];
  nature: string;
  house: string;
  elementalAffinity: string;
  colours: string[];
  mythologyNote: string;
  glossary: string[];
  inSignMeaning: Record<SignSlug, string>;
}

export const PLANET_CONTENT: Record<PlanetSlug, PlanetContent> = {
  sun: {
    keywords: [
      "sun sign meaning",
      "sun in astrology",
      "core identity zodiac",
      "sun in the houses",
      "vitality and purpose",
      "planetary ruler leo",
    ],
    nature:
      "The Sun is the centre of the chart. It represents core identity, purpose and the vitality behind everyday choices — the sense of self you grow into rather than a finished label. In Zunara's charts it is always the anchor of a reading, the body every other placement is measured against.",
    house:
      "The Sun's house shows where you look for recognition and where your identity naturally commits — the arena you come back to when everything else is noise.",
    elementalAffinity: "Fire — the Sun warms, lights and moves; it is the element of becoming visible.",
    colours: ["gold", "amber", "orange"],
    mythologyNote:
      "From Helios driving his chariot across the sky to Ra sailing through the underworld each night, the Sun has been the clearest symbol of a self that returns, sustains and grows. Its mythic role stays steady: light that reveals, warms and gives life.",
    glossary: ["Sun Sign", "Big Three", "Domicile"],
    inSignMeaning: {
      aries: "Identity is direct and pioneer-minded — you grow by starting things and leading fresh ground.",
      taurus: "Identity is steady, sensual and rooted in what you can build and hold onto.",
      gemini: "Identity lives in ideas, words and exchange — you know yourself by talking things through.",
      cancer: "Identity is tied to home, memory and the people you protect.",
      leo: "Identity glows. Self-expression and warmth are how you come into your own — the Sun's own sign.",
      virgo: "Identity is expressed through useful, careful work and close attention to detail.",
      libra: "Identity forms through relationships, taste and the search for a fair balance.",
      scorpio: "Identity deepens through intensity, honesty and periodic reinvention.",
      sagittarius: "Identity is built on adventure, conviction and wide horizons.",
      capricorn: "Identity is earned through patient, well-structured achievement.",
      aquarius: "Identity is original, future-facing and tied to the wider group.",
      pisces: "Identity is fluid, intuitive and drawn to imagination and compassion.",
    },
  },
  moon: {
    keywords: [
      "moon sign meaning",
      "moon in astrology",
      "emotional nature zodiac",
      "moon in the houses",
      "instincts and habits",
      "lunar cycles astrology",
    ],
    nature:
      "The Moon is the fastest-moving body in the chart. It reflects emotional needs, instincts and the baseline of your inner world — the weather beneath the surface that you don't always name. Its sign and house describe what makes you feel cared-for and safe.",
    house:
      "The Moon's house shows where your emotional needs find their natural habitat — the area of life you retreat to and return to for comfort.",
    elementalAffinity: "Water — the Moon relates to feeling, memory and quiet responsiveness.",
    colours: ["silver", "pearl", "pale blue"],
    mythologyNote:
      "Selene, Luna, Chandra — the Moon has been the quieter twin of every sun myth, a goddess of cycles, tides and the night. Its waxing and waning made it the first calendar, and the first measure of moods.",
    glossary: ["Moon Sign", "Big Three", "Houses"],
    inSignMeaning: {
      aries: "Emotions surface fast and clear, then cool just as quickly.",
      taurus: "Needs are steady and sensual — comfort comes from what you can hold and rely on.",
      gemini: "Feelings move through words; you process emotion by talking it out and tagging it.",
      cancer: "The Moon's own sign — instincts are strong, protective and deeply tuned to home.",
      leo: "Emotional needs are warm and expressive; you heal and feel seen through creating.",
      virgo: "Feelings are examined and tidied; care shows up as quiet, practical help.",
      libra: "Emotional balance is found through relationship, harmony and beauty.",
      scorpio: "Needs run deep; you feel in full colour and transform through what you can't ignore.",
      sagittarius: "Emotion hunts for meaning and space — honesty and room to move soothe you.",
      capricorn: "Feelings are handled with restraint; you value results and reliability over show.",
      aquarius: "Emotions are processed at a distance; you feel most cared-for among chosen people and ideas.",
      pisces: "Needs are soft, boundaryless and imaginal — music, art and solitude restore you.",
    },
  },
  mercury: {
    keywords: [
      "mercury sign meaning",
      "mercury in astrology",
      "communication style zodiac",
      "mercury in the houses",
      "how you think",
      "mercury retrograde",
    ],
    nature:
      "Mercury is the planet of communication and thought. It governs how you take in, process and express information — the style of your curiosity and the way you sort what you learn. That makes it personal, practical and a little restless by nature.",
    house:
      "Mercury's house shows which area of life your conversations and thinking most often orbit — where your mind finds its regular work.",
    elementalAffinity: "Air — Mercury is quick, relational and moved by ideas.",
    colours: ["sky blue", "yellow", "lavender"],
    mythologyNote:
      "Mercury is the winged messenger — Hermes to the Greeks, quick-footed, clever and playful. God of trade, travellers and words, he honoured the fast, adaptable intelligence that lives in language and in the spaces between people.",
    glossary: ["Retrograde", "Domicile", "Element"],
    inSignMeaning: {
      aries: "Direct, quick thinking — you decide fast and speak without a lot of prelude.",
      taurus: "Deliberate thinking that prefers one solid idea at a time, well worked.",
      gemini: "Mercury's own sign — curious, quick, and happiest trading ideas back and forth.",
      cancer: "Thinking is shaped by memory and feeling; you remember what mattered.",
      leo: "Expressive, confident speech that turns ideas into a performance worth watching.",
      virgo: "Precise, analytical thinking drawn to detail, order and solving problems.",
      libra: "Diplomatic thinking that weighs both sides and hunts for a fair word.",
      scorpio: "Penetrating, intense thinking that goes below the surface of every answer.",
      sagittarius: "Big-picture thinking that wants truth, travel and ideas with room to run.",
      capricorn: "Structured, strategic thinking that plans and builds step by step.",
      aquarius: "Unconventional thinking that links ideas into systems and future solutions.",
      pisces: "Imaginal thinking that moves in images and intuition more than bullet points.",
    },
  },
  venus: {
    keywords: [
      "venus sign meaning",
      "venus in astrology",
      "love and values zodiac",
      "venus in the houses",
      "beauty and taste",
      "relationship style astrology",
    ],
    nature:
      "Venus is the planet of love, beauty and value. It shows how you love, what you find beautiful, and how you attract what you care about — the taste behind your choices, not just in romance but in everything you choose to keep.",
    house:
      "Venus's house shows where affection, pleasure and things of value most naturally collect in your life story.",
    elementalAffinity: "Earth — Venus is drawn to the tangible, the lovely and the well-made.",
    colours: ["rose", "mint", "cream"],
    mythologyNote:
      "Venus is Aphrodite, born from the sea foam and carried ashore on a shell. The goddess of love, beauty and desire gave her name to the brightest planet in the evening sky — the morning star carried in myths of both love and war.",
    glossary: ["Domicile", "Element", "Houses"],
    inSignMeaning: {
      aries: "Love is direct and impulsive; you want what you want and ask for it plainly.",
      taurus: "Venus's own sign — affection is loyal, sensual and anchored in what you can feel and keep.",
      gemini: "Love runs through conversation; wit and variety are the real courtship.",
      cancer: "Love is tender, feeding and protective — you care by remembering.",
      leo: "Love is warm, generous and theatrical; you adore, and you want to be adored.",
      virgo: "You show love through useful, precise acts of service and attention.",
      libra: "Venus's own sign — harmony, beauty and partnership are the medium of your affection.",
      scorpio: "Love is total and transformative; you bond deeply or not at all.",
      sagittarius: "Love is adventurous and honest; freedom and shared horizons keep the heat.",
      capricorn: "Love is serious and enduring; you commit like a long-term plan.",
      aquarius: "Love is friendly, unusual and unconventional; you love the person, not the script.",
      pisces: "Love is romantic, boundaryless and imaginative — you give with soft generosity.",
    },
  },
  mars: {
    keywords: [
      "mars sign meaning",
      "mars in astrology",
      "drive and ambition zodiac",
      "mars in the houses",
      "how you act",
      "assertion astrology",
    ],
    nature:
      "Mars is the planet of action, desire and drive. It shows how you assert yourself, what you fight for, and the way your energy moves from intention into motion. In the chart it is the foot on the accelerator — useful, insistent and honest about what you want.",
    house:
      "Mars's house shows where your energy is most active — the arena where you compete, build and push ahead.",
    elementalAffinity: "Fire — Mars is hot, direct and initiated.",
    colours: ["scarlet", "rust", "flame"],
    mythologyNote:
      "Mars borrowed the name of the Roman war god — Ares to the Greeks, hot-blooded and fearless. His red surface made him look like he stood in a field of battle, and astrology kept the charge: courage, assertion and the appetite to act.",
    glossary: ["Element", "Domicile", "Ascendant"],
    inSignMeaning: {
      aries: "Mars's own sign — pure initiative, starting things, and moving before the pause.",
      taurus: "Slow-burning, stubborn drive that goes far when pointed at something worth building.",
      gemini: "Quick, restless action that darts between projects and thrives on debate.",
      cancer: "Action is protective and indirect; you push hard for the people and places you love.",
      leo: "Bold, dramatic assertion that wants applause and plays to win.",
      virgo: "Precise, disciplined action aimed at getting small things exactly right.",
      libra: "Assertion routed through fairness and persuasion; you fight for balance with charm.",
      scorpio: "Mars's deeper home — intense, strategic drive that never forgets a score.",
      sagittarius: "Impulsive, enthusiastic action aimed at horizons, risk and bigger meaning.",
      capricorn: "Ambitious, patient drive that treats every step as part of a long climb.",
      aquarius: "Action for causes and ideas, often thrillingly unconventional and group-minded.",
      pisces: "Diffuse, intuitive drive that flows best with feeling, art and a change of scene.",
    },
  },
  jupiter: {
    keywords: [
      "jupiter sign meaning",
      "jupiter in astrology",
      "growth and fortune zodiac",
      "jupiter in the houses",
      "expansion and philosophy",
      "benefic planet",
    ],
    nature:
      "Jupiter is the planet of expansion and good fortune. It marks where growth, opportunity and optimism feel most available — the area where reach tends to be rewarded and meaning gets bigger. In the chart it is the generous, luck-flavoured guest.",
    house:
      "Jupiter's house shows where life keeps opening doors — the realm of your chart that rewards reach and a cheerful appetite for more.",
    elementalAffinity: "Fire — Jupiter trades in heat, hope and generous horizons.",
    colours: ["royal blue", "purple", "vermillion"],
    mythologyNote:
      "Jupiter is Zeus, king of the gods, the one who threw the thunderbolt and poured the blessings. The largest planet gave the largest deity the brightest claim to sky-royalty and the old idea that bigger, further and more can be a gift.",
    glossary: ["Domicile", "Element", "Transit"],
    inSignMeaning: {
      aries: "Growth comes through starting boldly and trusting first moves.",
      taurus: "Expansion through what you own, taste and slowly build into something lasting.",
      gemini: "Luck runs through learning, words and the people your ideas connect you to.",
      cancer: "Growth through family, food, memory and the home you keep warm.",
      leo: "Fortune favours creative risk, generosity and shining on purpose.",
      virgo: "Expansion through craft, precision and the compounding gains of good habits.",
      libra: "Growth through partnership, fairness and knowing when to say yes to others.",
      scorpio: "Transformation is the growth — depth pays out through reinvention.",
      sagittarius: "Jupiter's own sign — luck favours the traveller; meaning grows with distance and honesty.",
      capricorn: "Expansion through structure, patience and positions built to last.",
      aquarius: "Growth through ideas, networks and causes that outlast any one person.",
      pisces: "Fortune flows through imagination, compassion and what you give away freely.",
    },
  },
  saturn: {
    keywords: [
      "saturn sign meaning",
      "saturn in astrology",
      "discipline and structure zodiac",
      "saturn in the houses",
      "responsibility astrology",
      "saturn return",
    ],
    nature:
      "Saturn is the planet of structure, discipline and time. It shows where limits live, where maturity gets built, and what asks you to do the patient, unglamorous work that compounds. In the chart it is the boundary that gives everything else its shape.",
    house:
      "Saturn's house marks the area where life asks for grown-up effort — the department of the chart that rewards patience and punishes shortcuts.",
    elementalAffinity: "Earth — Saturn is slow, structural and grounded.",
    colours: ["umber", "graphite", "dark green"],
    mythologyNote:
      "Saturn was the Roman god of sowing and time — the Greeks' Kronos, who measured and cut. His rings made him look armoured, and astrology kept the image: boundaries, contracts and the gravity that holds every orbit in place.",
    glossary: ["Saturn Return", "Domicile", "Transit"],
    inSignMeaning: {
      aries: "Self-discipline is the work; patience is built by choosing your fights.",
      taurus: "Structure grows through what you own and maintain; security is the reward.",
      gemini: "Mastery comes from saying things clearly and finishing what you started saying.",
      cancer: "Maturity arrives through home, family duty and learning to feel safe in your own care.",
      leo: "The work is steady self-respect — recognition earned by craft, not show.",
      virgo: "Discipline in the details; mastery through reliable, precise service.",
      libra: "The lesson is fair partnership — commitment that survives the honeymoon.",
      scorpio: "Boundaries deepen you; mastery comes through surviving and transforming.",
      sagittarius: "The work is turning conviction into commitments you keep at every latitude.",
      capricorn: "Saturn's own sign — ambition is the long game; you are built to build.",
      aquarius: "Freedom earns its structures through responsibility to the group.",
      pisces: "The lesson is graceful surrender — patience with the unknown instead of escape.",
    },
  },
  uranus: {
    keywords: [
      "uranus sign meaning",
      "uranus in astrology",
      "change and innovation zodiac",
      "uranus in the houses",
      "originality astrology",
      "freedom and rebellion",
    ],
    nature:
      "Uranus is the planet of change, originality and sudden insight. It shakes up routine, breaks unexpected news, and points to the freedom a person keeps circling back to. In the chart it is the circuit-breaker — disruptive, brilliant and allergic to the status quo.",
    house:
      "Uranus's house shows where change keeps arriving uninvited — the area where the status quo never quite lasts and invention keeps finding a way in.",
    elementalAffinity: "Air — Uranus is electric, volatile and conceptual.",
    colours: ["electric blue", "cyan", "silver"],
    mythologyNote:
      "Uranus is the sky itself in Greek myth — the first god, overthrown by his own children to make way for the next order. Discovered with a telescope, he arrived in astrology as the planet of disruption, awakening and revolution.",
    glossary: ["Transit", "Element", "Retrograde"],
    inSignMeaning: {
      aries: "Change arrives through bold starts; independence is the constant project.",
      taurus: "Tradition gets shaken from the inside — evolution disguised as stubbornness.",
      gemini: "Volatile, brilliant thinking that keeps breaking its own formats.",
      cancer: "Home and family keep revisiting the idea of change; freedom needs a refuge that can move.",
      leo: "Self-expression rebels toward originality; the audience is the future.",
      virgo: "Methods get reinvented; precision turns into innovation at the edges.",
      libra: "Relationships are redesigned — equal, free and built on new terms.",
      scorpio: "Deep change is your habitat; you reinvent by going all the way down.",
      sagittarius: "Truth keeps expanding past old maps; conviction outruns convention.",
      capricorn: "Institutions get reprogrammed from within — ambition turned visionary.",
      aquarius: "Uranus's own sign — innovation is the temperament, freedom the native tongue.",
      pisces: "Imagination goes electric; inspiration arrives in flashes and dissolving frames.",
    },
  },
  neptune: {
    keywords: [
      "neptune sign meaning",
      "neptune in astrology",
      "imagination and intuition zodiac",
      "neptune in the houses",
      "dreams and transcendence",
      "compassion astrology",
    ],
    nature:
      "Neptune is the planet of imagination, intuition and dissolution. It softens boundaries, colours how you dream, and points to where compassion and inspiration flow — or, at its foggiest, where the fine print needs a second read. In the chart it is the oldest, most forgiving water.",
    house:
      "Neptune's house shows where fantasy, inspiration and the unnameable keep whispering — the area that asks for trust, or warns you to check the details twice.",
    elementalAffinity: "Water — Neptune is oceanic, tidal and boundless.",
    colours: ["seafoam", "lavender", "mist"],
    mythologyNote:
      "Neptune is Poseidon, god of the sea — trident in hand, moving between the deep and the shore. Discovered where the mathematics predicted, he kept the symbolism of tides: unseen forces, vast waters and the pull of the unconscious.",
    glossary: ["Element", "Domicile", "Retrograde"],
    inSignMeaning: {
      aries: "Inspiration arrives as impulses; dreams arrive already fighting.",
      taurus: "The ideal world is physical and sensory, dreamt through slow, deep pleasure.",
      gemini: "Language becomes poetry; you hear between the words.",
      cancer: "Intuition is wired to memory and kin; you dream the family you carry.",
      leo: "Creativity is the dream; imagination wears a crown.",
      virgo: "Compassion becomes service; the ideal is a world that works exactly.",
      libra: "Relationships are dreamt ideal; inspiration flows through beauty and harmony.",
      scorpio: "Vision goes below the surface; you intuit what others hide.",
      sagittarius: "Faith runs wide; the dream is a meaning big enough to travel.",
      capricorn: "The vision is institutional — structure dreamt large, power imagined well.",
      aquarius: "The dream is collective; the future is the only horizon that satisfies.",
      pisces: "Neptune's own sign — imagination is native; you feel everything, dream everything and dissolve toward everything.",
    },
  },
  pluto: {
    keywords: [
      "pluto sign meaning",
      "pluto in astrology",
      "transformation and power zodiac",
      "pluto in the houses",
      "regeneration astrology",
      "generational planet",
    ],
    nature:
      "Pluto is the planet of transformation and the deep currents of power. It points to where life insists on change, what must be released so something can be born, and the intensities a person grows through. In the chart it is the slow weight beneath the surface.",
    house:
      "Pluto's house shows the arena where the stakes run highest — where experience strips things back, and where you are rebuilt stronger or freer.",
    elementalAffinity: "Water — Pluto is depth, pressure and the unseen below.",
    colours: ["obsidian", "deep purple", "crimson"],
    mythologyNote:
      "Pluto is Hades, lord of the underworld — the one who rules what is buried, what is hidden and what returns. Discovered in 1930, he carried the myth of endings that are not final and of power that lives below the surface.",
    glossary: ["Transit", "Aspects", "Houses"],
    inSignMeaning: {
      aries: "Transformation through confrontation; renewal comes from fighting for yourself.",
      taurus: "Change works slowly through what you own and refuse to let go of.",
      gemini: "The mind transforms through hard truths and words that cut through.",
      cancer: "The family past is the deep well; healing runs through the root system.",
      leo: "The ego is reshaped; power returns as dignity, not dominance.",
      virgo: "Control systems get detoxed; mastery arrives through surrendering perfection.",
      libra: "Partnerships go to the depths; relating transforms you at the bedrock.",
      scorpio: "Pluto's own sign — transformation is the occupational hazard and the gift.",
      sagittarius: "Belief structures burn and regrow; conviction is deepened by fire.",
      capricorn: "Power turns personal; the ambition gets gutted and rebuilt with soul.",
      aquarius: "The collective is the crucible; the group transforms you.",
      pisces: "Dissolution is the workshop; ego boundaries dissolve and reform more spacious.",
    },
  },
};

export interface ResolvedPlanet {
  slug: PlanetSlug;
  name: string;
  glyph: string;
  content: PlanetContent;
}

export function getPlanet(slug: string): ResolvedPlanet | undefined {
  const key = PLANET_SLUGS.find((k) => k === slug);
  if (!key) return undefined;
  const body = getCelestialBody(key);
  return { slug: key, name: body.name, glyph: body.glyph, content: PLANET_CONTENT[key] };
}