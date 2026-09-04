import { describe, expect, it } from "vitest";
import { dictionaries, LOCALES, en, type Locale, type Dict } from "./dictionaries";

function leafKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return prefix ? [prefix] : [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...leafKeys(v, path));
    } else {
      out.push(path);
    }
  }
  return out;
}

describe("i18n language audit (one-by-one completeness)", () => {
  const enKeys = leafKeys(en).sort();
  const localeCodes: Locale[] = LOCALES.map((l) => l.code);

  it("every locale defines the exact same key tree as English (no missing keys)", () => {
    for (const code of localeCodes) {
      const other = dictionaries[code];
      const otherKeys = leafKeys(other).sort();
      const missing = enKeys.filter((k) => !otherKeys.includes(k));
      const extra = otherKeys.filter((k) => !enKeys.includes(k));
      expect(missing, `${code} is missing keys`).toEqual([]);
      expect(extra, `${code} has unexpected keys`).toEqual([]);
      expect(otherKeys).toHaveLength(enKeys.length);
    }
  });

  it("every leaf value across all locales is a non-empty string (no raw fallbacks)", () => {
    for (const code of localeCodes) {
      const dict: Dict = dictionaries[code];
      for (const [k, v] of Object.entries(leafKeys(dict))) {
        const path = v;
        // Walk the path to the leaf value.
        const parts = path.split(".");
        let cur: unknown = dict;
        for (const part of parts) {
          cur = (cur as Record<string, unknown>)[part];
        }
        expect(typeof cur, `${code}.${path} is not a string`).toBe("string");
        expect((cur as string).trim().length, `${code}.${path} is empty`).toBeGreaterThan(0);
        expect(k).toBeDefined();
      }
    }
  });

  it("RTL locales (ur, ar) declare rtl, LTR locales declare ltr", () => {
    for (const l of LOCALES) {
      const expected = l.code === "ur" || l.code === "ar" ? "rtl" : "ltr";
      expect(l.dir, `${l.code} dir`).toBe(expected);
    }
  });

  it("the traits block is present and non-empty in every locale", () => {
    for (const code of localeCodes) {
      const dict: Dict = dictionaries[code];
      expect(dict.traits.kicker.trim().length).toBeGreaterThan(0);
      expect(dict.traits.title.trim().length).toBeGreaterThan(0);
      expect(dict.traits.signs.aries.arch.trim().length).toBeGreaterThan(0);
      expect(dict.traits.signs.aries.career.trim().length).toBeGreaterThan(0);
    }
  });
});
