import { describe, it, expect } from "vitest";
import {
  generateTransitICS,
  escapeIcsText,
  foldLine,
  toUtc,
  type IcsEvent,
} from "./ics-generator";

const d = (s: string) => new Date(s);

describe("ics calendar export", () => {
  it("produces a well-formed VCALENDAR envelope", () => {
    const events: IcsEvent[] = [
      { title: "Saturn Trine Sun", start: d("2026-05-08T12:00:00Z") },
    ];
    const out = generateTransitICS(events);
    expect(out.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(out.includes("VERSION:2.0")).toBe(true);
    expect(out.includes("BEGIN:VEVENT")).toBe(true);
    expect(out.includes("END:VEVENT")).toBe(true);
    expect(out.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(out.includes("SUMMARY:Saturn Trine Sun")).toBe(true);
  });

  it("emits UTC DTSTART/DTEND with Z suffix", () => {
    const out = generateTransitICS([
      { title: "Venus Square Mars", start: d("2026-06-01T15:30:00Z") },
    ]);
    expect(out).toContain("DTSTART:20260601T153000Z");
    // default end is start + 2h
    expect(out).toContain("DTEND:20260601T173000Z");
  });

  it("uses the supplied end when present", () => {
    const out = generateTransitICS([
      { title: "Mercury Conjunction Jupiter", start: d("2026-07-01T00:00:00Z"), end: d("2026-07-02T00:00:00Z") },
    ]);
    expect(out).toContain("DTSTART:20260701T000000Z");
    expect(out).toContain("DTEND:20260702T000000Z");
  });

  it("escapes special characters in titles and descriptions", () => {
    const out = generateTransitICS([
      { title: "Mars, Trit;e", start: d("2026-08-01T00:00:00Z"), description: "Line one\nsecond" },
    ]);
    expect(out).toContain("SUMMARY:Mars\\, Trit\\;e");
    expect(out).toContain("DESCRIPTION:Line one\\nsecond");
  });

  it("folds lines longer than 75 octets onto continuation lines", () => {
    const long = "X".repeat(200);
    const out = generateTransitICS([
      { title: "Sun", start: d("2026-09-01T00:00:00Z"), description: long },
    ]);
    const desc = out.split("\r\n").find((l) => l.startsWith("DESCRIPTION:"));
    expect(desc).toBeTruthy();
    expect(desc).toHaveLength(75);
  });
});

describe("ics helpers", () => {
  it("formats dates as UTC BASIC-DATE-TIME", () => {
    expect(toUtc(d("2026-05-08T12:00:00Z"))).toBe("20260508T120000Z");
    expect(toUtc(d("2026-01-02T03:04:05Z"))).toBe("20260102T030405Z");
  });

  it("escapes backslash, semicolon, comma and newline", () => {
    expect(escapeIcsText("a\\b;c,d\r\ne\ny")).toBe("a\\\\b\\;c\\,d\\ne\\ny");
  });

  it("folds a long line at the octet limit", () => {
    const folded = foldLine("DESCRIPTION:" + "y".repeat(120));
    const lines = folded.split("\r\n");
    expect(lines[0]).toHaveLength(75);
    expect(lines[1].startsWith(" ")).toBe(true);
  });
});
