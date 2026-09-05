import { describe, expect, it } from "vitest";
import {
  categoryFromProfession,
  categoryName,
  CATEGORY_LABELS,
  CELEBRITY_CATEGORIES,
} from "./categories";

describe("celebrity category taxonomy", () => {
  it("ships every category with a label", () => {
    for (const slug of CELEBRITY_CATEGORIES) {
      expect(categoryName(slug)).toBe(CATEGORY_LABELS[slug]);
      expect(CATEGORY_LABELS[slug]).toBeTruthy();
    }
  });

  it("groups known professions into the right category", () => {
    expect(categoryFromProfession("Actor")).toBe("cinema");
    expect(categoryFromProfession("Film director")).toBe("cinema");
    expect(categoryFromProfession("Singer")).toBe("music");
    expect(categoryFromProfession("Songwriter")).toBe("music");
    expect(categoryFromProfession("Racing driver")).toBe("sports");
    expect(categoryFromProfession("Basketball player")).toBe("sports");
    expect(categoryFromProfession("Physicist")).toBe("science");
    expect(categoryFromProfession("Astronomer")).toBe("science");
    expect(categoryFromProfession("Writer")).toBe("literature");
    expect(categoryFromProfession("Poet")).toBe("literature");
    expect(categoryFromProfession("Politician")).toBe("world-leaders");
    expect(categoryFromProfession("Statesman")).toBe("world-leaders");
    expect(categoryFromProfession("Entrepreneur")).toBe("tech-business");
    expect(categoryFromProfession("Painter")).toBe("art-design");
    expect(categoryFromProfession("Philosopher")).toBe("philosophy");
    expect(categoryFromProfession("Civil rights activist")).toBe("activism");
    expect(categoryFromProfession("YouTuber")).toBe("content-media");
  });

  it("prefers the stronger category for ambiguous occupations", () => {
    expect(categoryFromProfession("Computer scientist")).toBe("tech-business");
    expect(categoryFromProfession("Software engineer")).toBe("tech-business");
    expect(categoryFromProfession("Record producer")).toBe("music");
  });

  it("falls back to 'other' for unknown input", () => {
    expect(categoryFromProfession("")).toBe("other");
    expect(categoryFromProfession("zzz-unclassified")).toBe("other");
  });

  it("uses the bio description as a secondary hint", () => {
    expect(categoryFromProfession("n/a", "American actor")).toBe("cinema");
  });
});