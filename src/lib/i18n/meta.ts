export type Locale = "en" | "ur" | "ar" | "es" | "zh" | "hi";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl"; htmlLang: string }[] = [
  { code: "en", label: "English", dir: "ltr", htmlLang: "en" },
  { code: "ur", label: "اردو", dir: "rtl", htmlLang: "ur" },
  { code: "ar", label: "العربية", dir: "rtl", htmlLang: "ar" },
  { code: "es", label: "Español", dir: "ltr", htmlLang: "es" },
  { code: "zh", label: "中文", dir: "ltr", htmlLang: "zh" },
  { code: "hi", label: "हिन्दी", dir: "ltr", htmlLang: "hi" },
];

export const LOCALE_COOKIE = "zunara-locale";

export const DEFAULT_LOCALE: Locale = "en";

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ur" || locale === "ar" ? "rtl" : "ltr";
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && LOCALES.some((l) => l.code === value);
}
