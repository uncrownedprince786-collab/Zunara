/**
 * Wikidata SPARQL client for "Famous Birthdays Today".
 *
 * Level-2 (live) fallback of the celebrity pipeline. Queries the Wikidata
 * Query Service for the global top-ranked figures born on a given `MM-DD`,
 * groups them by the dynamic category taxonomy and picks the strongest
 * sitelink-ranked profile per category. Pure parsing/selection functions are
 * exported for unit tests; the live `fetch` is isolated so tests never touch
 * the network.
 */
import type { Celebrity } from "@/lib/content/celebrities";
import { categoryFromProfession, type CategorySlug } from "./categories";

export interface WikidataOptions {
  /** Hard cap on honoured SPARQL LIMIT rows (default 300). */
  limit?: number;
  /** Abort the request after this many ms (default 7000). */
  timeoutMs?: number;
}

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

export function buildBirthdaySparql(
  month: number,
  day: number,
  limit: number,
): string {
  return `
SELECT ?person ?personLabel ?description ?sitelinks ?article ?image ?occupationLabel WHERE {
  ?person wdt:P569 ?birthDate .
  ?person wdt:P31 wd:Q5 .
  FILTER((MONTH(?birthDate) = ${month}) && (DAY(?birthDate) = ${day}))
  ?person wikibase:sitelinks ?sitelinks .
  FILTER(?sitelinks > 2)
  OPTIONAL { ?person schema:description ?description . FILTER(LANG(?description) = "en") }
  OPTIONAL { ?article schema:about ?person . ?article schema:isPartOf <https://en.wikipedia.org/> . }
  OPTIONAL { ?person wdt:P18 ?image . }
  OPTIONAL { ?person wdt:P106 ?occupation . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
ORDER BY DESC(?sitelinks)
LIMIT ${limit}
`.trim();
}

function wikidataUrl(month: number, day: number, limit: number): string {
  const query = encodeURIComponent(buildBirthdaySparql(month, day, limit));
  return `${SPARQL_ENDPOINT}?format=json&query=${query}`;
}

function qidFromUri(uri: string): string {
  return uri.split("/").filter(Boolean).pop() ?? uri;
}

function valueOf(binding: Record<string, unknown> | undefined): string {
  if (!binding) return "";
  const value = (binding as { value?: unknown }).value;
  return typeof value === "string" ? value : "";
}

/** Normalise a Commons `Special:FilePath` value into a resized `?width=` URL. */
export function commonsThumb(uri: string): string {
  const filename = uri.split("/").pop() ?? uri;
  const clean = filename.replace(/^File:/i, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(clean)}?width=330`;
}

function articleUrl(qid: string, article: string): string {
  const trimmed = article.trim();
  if (trimmed.length > 0) return trimmed;
  return `https://www.wikidata.org/wiki/${qid}`;
}

interface RawBinding {
  person?: Record<string, unknown>;
  personLabel?: Record<string, unknown>;
  description?: Record<string, unknown>;
  sitelinks?: Record<string, unknown>;
  article?: Record<string, unknown>;
  image?: Record<string, unknown>;
  occupationLabel?: Record<string, unknown>;
}

/**
 * Convert a Wikidata SPARQL JSON result into resolved Celebrity objects.
 * One row per (person, occupation); duplicates are accumulated by QID so a
 * figure with ten occupational labels becomes a single profile.
 */
export function parseWikidataBindings(
  json: unknown,
  month: number,
  day: number,
): Celebrity[] {
  const results = (json as {
    results?: { bindings?: RawBinding[] };
  })?.results?.bindings;
  if (!Array.isArray(results)) return [];

  const byQid = new Map<string, Celebrity & { _occupations: string[] }>();

  for (const row of results) {
    const qid = qidFromUri(valueOf(row.person));
    if (!qid) continue;
    const label = valueOf(row.personLabel).trim();
    if (!label) continue;

    const existing = byQid.get(qid);
    const occupation = valueOf(row.occupationLabel).trim();
    if (!existing) {
      const occupations =
        occupation.length > 0 ? [occupation] : [];
      const sitelinks = Number.parseInt(valueOf(row.sitelinks), 10);
      const profession = occupations.slice(0, 2).join(", ") || "Figure";
      const description = valueOf(row.description).trim();
      const imageUri = valueOf(row.image);
      const star =
        description.length > 0
          ? description.replace(/\s+/g, " ").trim()
          : `${profession}, honoured in ${Number.isNaN(sitelinks) ? "many" : sitelinks} language editions of Wikipedia.`;
      const category: CategorySlug = categoryFromProfession(
        profession,
        description,
      );

      byQid.set(qid, {
        month,
        day,
        name: label,
        profession,
        region: "Global",
        star,
        url: articleUrl(qid, valueOf(row.article)),
        wiki: qid,
        image: imageUri ? commonsThumb(imageUri) : undefined,
        category,
        sitelinks: Number.isNaN(sitelinks) ? undefined : sitelinks,
        _occupations: occupations,
      });
    } else if (occupation.length > 0 && !existing._occupations.includes(occupation)) {
      existing._occupations.push(occupation);
      // Keep the two strongest occupations visible in the profile line.
      existing.profession = existing._occupations.slice(0, 2).join(", ");
    }
  }

  return Array.from(byQid.values()).map(({ _occupations: _drop, ...person }) => person);
}

/**
 * Dynamic category grouping: round-robin picks the top sitelink-ranked figure
 * from each category until `maxTotal` profiles are reached. Deterministic.
 */
export function selectTopByCategory(
  people: Celebrity[],
  maxTotal = 12,
): Celebrity[] {
  const groups = new Map<CategorySlug, Celebrity[]>();
  for (const person of people) {
    const cat = (person.category as CategorySlug) ?? "other";
    const bucket = groups.get(cat) ?? [];
    bucket.push(person);
    groups.set(cat, bucket);
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => (b.sitelinks ?? 0) - (a.sitelinks ?? 0));
  }

  const categories = Array.from(groups.keys()).sort();
  const selected: Celebrity[] = [];
  const usedUrls = new Set<string>();
  let addedThisPass = true;

  while (selected.length < maxTotal && addedThisPass) {
    addedThisPass = false;
    for (const slug of categories) {
      if (selected.length >= maxTotal) break;
      const bucket = groups.get(slug) ?? [];
      const next = bucket.find((p) => !usedUrls.has(p.url));
      if (next) {
        usedUrls.add(next.url);
        selected.push(next);
        addedThisPass = true;
      }
    }
  }
  return selected;
}

/**
 * Live Wikidata fetch (Level 2). Returns up to `maxTotal` profiles or an empty
 * array when the query fails, times out, or finds nobody for the date.
 */
export async function fetchWikidataBirthdayCelebrities(
  month: number,
  day: number,
  opts: WikidataOptions = {},
): Promise<Celebrity[]> {
  const limit = opts.limit ?? 300;
  const timeoutMs = opts.timeoutMs ?? 7000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(wikidataUrl(month, day, limit), {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "Zunara/1.0 (daily-celebrity-cache; contact: zunara.app)",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Wikidata SPARQL responded with HTTP ${response.status}`);
    }
    const json: unknown = await response.json();
    const parsed = parseWikidataBindings(json, month, day);
    return selectTopByCategory(parsed, 12);
  } finally {
    clearTimeout(timer);
  }
}