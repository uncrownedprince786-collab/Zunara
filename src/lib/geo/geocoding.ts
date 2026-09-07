/**
 * OpenStreetMap Nominatim place lookup, shared by every location input on the
 * site (birthplace in the birth form → birth chart, daily transit, synastry;
 * observation point in the night-sky map).
 *
 * Accuracy & trust rules (we never mislead the user):
 * - Coordinates are only ever taken from a suggestion the user explicitly
 *   selected, or from a coordinate the user typed themselves. Free text on its
 *   own never changes coordinates.
 * - Nominatim is rate-limited to 1 request/second and caches in-flight
 *   responses, per the OSM usage policy.
 * - Every UI consuming this must render `OSM_ATTRIBUTION`.
 */

export interface PlaceSuggestion {
  /** Nominatim place_id. */
  id: number;
  /** Full display name shown in the dropdown. */
  label: string;
  /** Shortest useful name (city / town / village). */
  name: string;
  latitude: number;
  longitude: number;
  /** addresstype: city, town, village, administrative, … */
  type: string;
  country?: string;
  /** IANA timezone from Nominatim (e.g. "Europe/London"). Absent when unknown. */
  tz?: string;
}

export const OSM_ATTRIBUTION = "Geocoding data © OpenStreetMap contributors";
export const MIN_QUERY_LENGTH = 3;
const COOLDOWN_MS = 1000;
const REQUEST_TIMEOUT_MS = 8000;

let lastRequestAt = 0;

export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number,
): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const wrapped = (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return wrapped;
}

function mapItem(item: Record<string, unknown>): PlaceSuggestion | null {
  const lat = parseFloat(item.lat as string);
  const lon = parseFloat(item.lon as string);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const tz = typeof item.timezone === "string" ? (item.timezone as string) : undefined;
  return {
    id: Number(item.place_id),
    label: String(item.display_name ?? ""),
    name: String(item.name ?? item.display_name ?? ""),
    latitude: lat,
    longitude: lon,
    type: String(item.addresstype ?? item.type ?? "place"),
    country: (item.address as { country?: string } | undefined)?.country,
    ...(tz ? { tz } : {}),
  };
}

async function rawSearch(
  query: string,
  signal: AbortSignal,
): Promise<PlaceSuggestion[]> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1" +
    `&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json", "Accept-Language": "*" },
  });
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status}).`);
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  return items.map(mapItem).filter((s): s is PlaceSuggestion => s !== null);
}

/**
 * Throttled Nominatim search. Returns `{ query, results }` so the caller can
 * drop stale responses when the user has typed past the query.
 */
export async function searchPlaces(
  query: string,
): Promise<{ query: string; results: PlaceSuggestion[] }> {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return { query: q, results: [] };

  const wait = COOLDOWN_MS - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const results = await rawSearch(q, ctrl.signal);
    return { query: q, results };
  } finally {
    clearTimeout(timer);
  }
}

/** True when coordinates came from a validated source (selected suggestion). */
export type PlaceProvenance = "verified" | "manual";