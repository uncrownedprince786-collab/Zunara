export type { Locale } from "./meta";
export { LOCALES, LOCALE_COOKIE, DEFAULT_LOCALE, getLocaleDir, isLocale } from "./meta";
export type { Dict } from "./dictionaries-en";
export { en } from "./dictionaries-en";
export { ur } from "./dictionaries-ur";
export { ar } from "./dictionaries-ar";
export { es } from "./dictionaries-es";
export { zh } from "./dictionaries-zh";
export { hi } from "./dictionaries-hi";

import type { Locale } from "./meta";
import type { Dict } from "./dictionaries-en";
import { en } from "./dictionaries-en";
import { ur } from "./dictionaries-ur";
import { ar } from "./dictionaries-ar";
import { es } from "./dictionaries-es";
import { zh } from "./dictionaries-zh";
import { hi } from "./dictionaries-hi";

export const dictionaries: Record<Locale, Dict> = { en, ur, ar, es, zh, hi };
