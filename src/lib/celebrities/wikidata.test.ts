import { describe, expect, it } from "vitest";
import type { Celebrity } from "@/lib/content/celebrities";
import {
  buildBirthdaySparql,
  commonsThumb,
  parseWikidataBindings,
  selectTopByCategory,
} from "./wikidata";

const BINDINGS = {
  head: { vars: ["person", "occupationLabel"] },
  results: {
    bindings: [
      {
        person: { type: "uri", value: "http://www.wikidata.org/entity/Q123" },
        personLabel: { type: "literal", value: "Ada Example" },
        description: { type: "literal", "xml:lang": "en", value: "Pioneer of analytical computing." },
        sitelinks: { type: "literal", value: "98" },
        article: { type: "uri", value: "https://en.wikipedia.org/wiki/Ada_Example" },
        image: { type: "uri", value: "http://commons.wikimedia.org/wiki/Special:FilePath/Ada_Example.jpg" },
        occupationLabel: { type: "literal", value: "Computer scientist" },
      },
      {
        person: { type: "uri", value: "http://www.wikidata.org/entity/Q456" },
        personLabel: { type: "literal", value: "Sample Singer" },
        description: { type: "literal", "xml:lang": "en", value: "Global pop vocalist." },
        sitelinks: { type: "literal", value: "77" },
        article: { type: "uri", value: "https://en.wikipedia.org/wiki/Sample_Singer" },
        image: { type: "uri", value: "http://commons.wikimedia.org/wiki/Special:FilePath/Sample_Singer.png" },
        occupationLabel: { type: "literal", value: "Singer-songwriter" },
      },
    ],
  },
} as unknown;

describe("wikidata birthday pipeline", () => {
  it("builds a SPARQL query that targets the exact month/day", () => {
    const query = buildBirthdaySparql(9, 3, 300);
    expect(query).toContain("MONTH(?birthDate) = 9");
    expect(query).toContain("DAY(?birthDate) = 3");
    expect(query).toContain("LIMIT 300");
    expect(query).toContain("wikibase:sitelinks");
  });

  it("parses bindings into resolved Celebrity profiles", () => {
    const people = parseWikidataBindings(BINDINGS, 9, 3);
    expect(people).toHaveLength(2);

    const ada = people.find((p) => p.name === "Ada Example");
    expect(ada).toBeDefined();
    expect(ada!.month).toBe(9);
    expect(ada!.day).toBe(3);
    expect(ada!.profession).toBe("Computer scientist");
    expect(ada!.category).toBe("tech-business");
    expect(ada!.sitelinks).toBe(98);
    expect(ada!.star).toBe("Pioneer of analytical computing.");
    expect(ada!.url).toBe("https://en.wikipedia.org/wiki/Ada_Example");
    expect(ada!.image).toContain("commons.wikimedia.org/wiki/Special:FilePath/Ada_Example.jpg?width=330");
  });

  it("merges duplicate rows by QID and keeps up to two occupations", () => {
    const baseRows = (BINDINGS as {
      results: { bindings: unknown[] };
    }).results.bindings;
    const withDupes = {
      head: { vars: ["person", "occupationLabel"] },
      results: {
        bindings: [
          ...baseRows,
          {
            person: { type: "uri", value: "http://www.wikidata.org/entity/Q123" },
            personLabel: { type: "literal", value: "Ada Example" },
            sitelinks: { type: "literal", value: "98" },
            occupationLabel: { type: "literal", value: "Mathematician" },
          },
          {
            person: { type: "uri", value: "http://www.wikidata.org/entity/Q123" },
            personLabel: { type: "literal", value: "Ada Example" },
            sitelinks: { type: "literal", value: "98" },
            occupationLabel: { type: "literal", value: "Writer" },
          },
        ],
      },
    };
    const people = parseWikidataBindings(withDupes, 9, 3);
    expect(people.filter((p) => p.name === "Ada Example")).toHaveLength(1);
    const ada = people.find((p) => p.name === "Ada Example")!;
    expect(ada.profession).toContain("Computer scientist");
    expect(ada.profession).toContain("Mathematician");
  });

  it("normalises Commons file URLs into resized thumbnails", () => {
    expect(commonsThumb("http://commons.wikimedia.org/wiki/Special:FilePath/Foo Bar.png"))
      .toBe("https://commons.wikimedia.org/wiki/Special:FilePath/Foo_Bar.png?width=330");
  });

  it("selects the top sitelink-ranked figure per category and caps the total", () => {
    const base = (name: string, category: string, sitelinks: number, url: string): Celebrity => ({
      month: 9,
      day: 3,
      name,
      profession: name,
      region: "Global",
      star: name,
      url,
      image: undefined,
      category,
      sitelinks,
    });
    const people: Celebrity[] = [
      base("Actor A", "cinema", 90, "https://en.wikipedia.org/wiki/Actor_A"),
      base("Actor B", "cinema", 80, "https://en.wikipedia.org/wiki/Actor_B"),
      base("Singer A", "music", 70, "https://en.wikipedia.org/wiki/Singer_A"),
      base("Singer B", "music", 95, "https://en.wikipedia.org/wiki/Singer_B"),
      base("Physicist A", "science", 60, "https://en.wikipedia.org/wiki/Physicist_A"),
      base("Politician A", "world-leaders", 88, "https://en.wikipedia.org/wiki/Politician_A"),
      base("Tech A", "tech-business", 55, "https://en.wikipedia.org/wiki/Tech_A"),
    ];

    const picked = selectTopByCategory(people, 4);
    expect(picked).toHaveLength(4);
    expect(picked.map((p) => p.name)).toEqual([
      "Actor A", // cinema — highest sitelinks in its category
      "Singer B", // music — highest sitelinks in its category
      "Physicist A", // science
      "Tech A", // tech-business (alphabetical category round-robin order)
    ]);
  });
});