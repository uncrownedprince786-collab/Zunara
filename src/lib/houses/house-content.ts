export interface HouseData {
  number: number;
  title: string;
  nature: string;
  domains: string[];
  planetRule: string;
  signOrbit: string;
  signOrbitNote: string;
  inChartNote: string;
  keywords: string[];
}

export const HOUSES: readonly HouseData[] = [
  {
    number: 1,
    title: "Self and Direction",
    nature:
      "The first house is the house of self. It covers identity, personal direction and the first impression you make — the mask of the Ascendant and the way you step into a room.",
    domains: [
      "identity",
      "appearance",
      "first impressions",
      "personal direction",
      "self-image",
      "new beginnings",
      "presence",
      "vitality",
    ],
    planetRule: "Mars",
    signOrbit: "Aries",
    signOrbitNote:
      "Aries and its ruler Mars naturally occupy this house, giving it a direct, go-first character.",
    inChartNote:
      "In whole-sign houses, the sign on your Ascendant sets the first house — every other house follows from it in order around the chart.",
    keywords: [
      "first house in astrology",
      "ascendant house",
      "self and identity in birth chart",
      "first house meaning",
      "personality astrology houses",
      "rising sign house",
    ],
  },
  {
    number: 2,
    title: "Money and Values",
    nature:
      "The second house is about money, possessions and a felt sense of personal worth. It tracks what you earn, what you keep and what you think something really costs you.",
    domains: [
      "money",
      "possessions",
      "income",
      "self-worth",
      "resources",
      "values",
      "security",
      "savings",
    ],
    planetRule: "Venus",
    signOrbit: "Taurus",
    signOrbitNote:
      "Taurus and its ruler Venus lend this house its earthy, slow-collecting tone.",
    inChartNote:
      "A planet here usually shows what you spend your resources on, or where your sense of worth likes to be fed — through earnings, talents, or simply what you call your own.",
    keywords: [
      "second house in astrology",
      "money house in birth chart",
      "values and possessions astrology",
      "second house meaning",
      "income and self-worth houses",
      "venus ruled house",
    ],
  },
  {
    number: 3,
    title: "Communication and Daily Exchange",
    nature:
      "The third house covers communication, learning and the small everyday journeys of life — siblings, neighbours, messages and the mental traffic of a typical day.",
    domains: [
      "communication",
      "learning",
      "siblings",
      "neighbours",
      "daily travel",
      "writing",
      "studies",
      "curiosity",
    ],
    planetRule: "Mercury",
    signOrbit: "Gemini",
    signOrbitNote:
      "Gemini and its ruler Mercury give this house its quick, curious and talkative cast.",
    inChartNote:
      "In whole-sign charts the third house is read entirely in one sign, so the way you communicate tends to carry that sign's colour for decades on end.",
    keywords: [
      "third house in astrology",
      "communication house",
      "siblings in birth chart",
      "third house meaning",
      "learning and writing astrology houses",
      "mercury ruled house",
    ],
  },
  {
    number: 4,
    title: "Home and Foundations",
    nature:
      "The fourth house is the house of home, roots and private life. It holds family, childhood, the place you come from — and the inner security underneath everything you build.",
    domains: [
      "home",
      "family",
      "roots",
      "private life",
      "childhood",
      "inheritance",
      "inner security",
      "foundations",
    ],
    planetRule: "Moon",
    signOrbit: "Cancer",
    signOrbitNote:
      "Cancer and its ruler the Moon give this house its caring, memory-rich and sheltering character.",
    inChartNote:
      "The fourth house sits at the very bottom of the chart — the IC side of the wheel — so it is often described as the deepest personal ground you stand on.",
    keywords: [
      "fourth house in astrology",
      "home and family house",
      "roots in birth chart",
      "fourth house meaning",
      "private life astrology houses",
      "moon ruled house",
    ],
  },
  {
    number: 5,
    title: "Creativity and Joy",
    nature:
      "The fifth house is the house of creativity, romance and pleasure. It covers how you play, what you make, how you date and the spontaneous acts of self-expression that make life worth living.",
    domains: [
      "creativity",
      "romance",
      "pleasure",
      "self-expression",
      "children",
      "play",
      "hobbies",
      "performance",
    ],
    planetRule: "Sun",
    signOrbit: "Leo",
    signOrbitNote:
      "Leo and its ruler the Sun give this house its radiant, performative and warm-hearted tone.",
    inChartNote:
      "In whole-sign charts the fifth house falls entirely within one sign, so the style of your joy and creative signature stays remarkably consistent through life.",
    keywords: [
      "fifth house in astrology",
      "creativity house",
      "romance in birth chart",
      "fifth house meaning",
      "pleasure and self-expression astrology",
      "sun ruled house",
    ],
  },
  {
    number: 6,
    title: "Work and Wellbeing",
    nature:
      "The sixth house is the house of daily work and wellbeing. It covers the job, the routine, the habits that keep the body going, and the quiet service that knits a working week together.",
    domains: [
      "daily work",
      "health",
      "routine",
      "service",
      "craft",
      "habits",
      "care of the body",
      "responsibility",
    ],
    planetRule: "Mercury",
    signOrbit: "Virgo",
    signOrbitNote:
      "Virgo and its ruler Mercury give this house its precise, useful and detail-minded character.",
    inChartNote:
      "Where the sixth houses falls in your chart shows the everyday arena in which your habits, health and daily contributions actually play out.",
    keywords: [
      "sixth house in astrology",
      "work and health house",
      "daily routine birth chart",
      "sixth house meaning",
      "wellbeing and service astrology",
      "mercury ruled house",
    ],
  },
  {
    number: 7,
    title: "Partnership",
    nature:
      "The seventh house is the house of partnership. It covers marriage, close one-to-one relationships and the 'other' side of every mirror — the people who complete, challenge and mirror you.",
    domains: [
      "partnership",
      "marriage",
      "one-to-one relationships",
      "open rivals",
      "contracts",
      "balance",
      "cooperation",
      "the other",
    ],
    planetRule: "Venus",
    signOrbit: "Libra",
    signOrbitNote:
      "Libra and its ruler Venus give this house its fair, diplomatic and harmony-seeking tone.",
    inChartNote:
      "Opposite the Ascendant, the seventh house begins at the Descendant point — the natural axis of meeting another person across the chart.",
    keywords: [
      "seventh house in astrology",
      "partnership house",
      "marriage in birth chart",
      "seventh house meaning",
      "descendant house",
      "one-to-one relationships astrology",
    ],
  },
  {
    number: 8,
    title: "Shared Resources and Transformation",
    nature:
      "The eighth house is the house of shared resources and transformation. It covers other people's money, debts, inheritance, intimacy and the crises that strip life back so it can grow again.",
    domains: [
      "shared resources",
      "intimacy",
      "inheritance",
      "debt",
      "transformation",
      "crisis and rebirth",
      "other people's money",
      "deep psychology",
    ],
    planetRule: "Pluto",
    signOrbit: "Scorpio",
    signOrbitNote:
      "Scorpio and its ruler Pluto give this house its intense, hidden and regenerating character.",
    inChartNote:
      "In whole-sign charts the eighth house takes its sign entirely from your Ascendant's sequence — its placement shows where life keeps handing you transformative stakes.",
    keywords: [
      "eighth house in astrology",
      "shared resources house",
      "transformation in birth chart",
      "eighth house meaning",
      "intimacy and inheritance astrology",
      "pluto ruled house",
    ],
  },
  {
    number: 9,
    title: "Philosophy and Horizons",
    nature:
      "The ninth house is the house of philosophy, belief and far horizons. It covers travel, higher learning, publishing, ethics and every idea that asks you to look past the edge of what you already know.",
    domains: [
      "philosophy",
      "belief",
      "travel",
      "higher learning",
      "ethics",
      "publishing",
      "foreign cultures",
      "meaning",
    ],
    planetRule: "Jupiter",
    signOrbit: "Sagittarius",
    signOrbitNote:
      "Sagittarius and its ruler Jupiter give this house its expansive, questing and future-facing tone.",
    inChartNote:
      "In whole-sign charts the ninth house shows the long-term arena where your worldview gets built — the ideas and journeys you keep returning to for meaning.",
    keywords: [
      "ninth house in astrology",
      "philosophy house",
      "travel and learning birth chart",
      "ninth house meaning",
      "belief and higher learning astrology",
      "jupiter ruled house",
    ],
  },
  {
    number: 10,
    title: "Career and Public Role",
    nature:
      "The tenth house is the house of career, reputation and public role. It covers ambition, status, the mark you leave and the headline of your life as others read it.",
    domains: [
      "career",
      "reputation",
      "public role",
      "ambition",
      "status",
      "life direction",
      "legacy",
      "outer achievement",
    ],
    planetRule: "Saturn",
    signOrbit: "Capricorn",
    signOrbitNote:
      "Capricorn and its ruler Saturn give this house its serious, structured and long-game character.",
    inChartNote:
      "The tenth house is crowned by the Midheaven — the point of greatest public visibility in the chart, opposite the deepest private ground of the fourth.",
    keywords: [
      "tenth house in astrology",
      "career house",
      "reputation in birth chart",
      "tenth house meaning",
      "midheaven house",
      "public role astrology houses",
    ],
  },
  {
    number: 11,
    title: "Community and Aspirations",
    nature:
      "The eleventh house is the house of friends, community and aspirations. It covers the groups you choose, the networks you belong to, and the future you are collectively working toward.",
    domains: [
      "friends",
      "community",
      "networks",
      "aspirations",
      "hopes and wishes",
      "groups",
      "future plans",
      "collective causes",
    ],
    planetRule: "Uranus",
    signOrbit: "Aquarius",
    signOrbitNote:
      "Aquarius and its ruler Uranus give this house its unconventional, forward-looking and group-minded character.",
    inChartNote:
      "In whole-sign charts the eleventh house names the kind of people and causes you keep orbiting — and the long-term goals those connections keep alive.",
    keywords: [
      "eleventh house in astrology",
      "friends and community house",
      "aspirations in birth chart",
      "eleventh house meaning",
      "networks and future plans astrology",
      "uranus ruled house",
    ],
  },
  {
    number: 12,
    title: "Solitude and the Subconscious",
    nature:
      "The twelfth house is the house of solitude and the subconscious. It covers rest, dreams, what stays hidden, and the quiet places where life lets go of what no longer serves it.",
    domains: [
      "solitude",
      "rest",
      "the subconscious",
      "dreams",
      "what is hidden",
      "retreat",
      "healing",
      "letting go",
    ],
    planetRule: "Neptune",
    signOrbit: "Pisces",
    signOrbitNote:
      "Pisces and its ruler Neptune give this house its dissolving, imaginal and compassionate character.",
    inChartNote:
      "The twelfth house sits at the very end of the chart — the last station before the Ascendant rises again — which astrology reads as the ground you carry from before the story begins.",
    keywords: [
      "twelfth house in astrology",
      "solitude house",
      "subconscious in birth chart",
      "twelfth house meaning",
      "dreams and retreat astrology",
      "neptune ruled house",
    ],
  },
];

export const HOUSE_BY_NUMBER: ReadonlyMap<number, HouseData> = new Map(
  HOUSES.map((h) => [h.number, h]),
);

export function getHouse(n: number): HouseData | undefined {
  return HOUSE_BY_NUMBER.get(n);
}