/**
 * iCalendar (.ics) export engine.
 *
 * Pure, side-effect free generator that turns a list of transit events into a
 * standards-compliant VCALENDAR document (RFC 5545). The output is compatible
 * with Google Calendar, Apple Calendar, Outlook and most desktop clients on
 * import. Dates are emitted as UTC (DTSTART/DTEND with the Z suffix) so the
 * event lands at the correct instant regardless of the importer's time zone.
 */

export interface IcsEvent {
  /** Human-friendly title, e.g. "Saturn Trine Sun". */
  title: string;
  /** Start instant, local-naive input converted to UTC by the caller. */
  start: Date;
  /** Optional end instant; defaults to start + 2 hours when omitted. */
  end?: Date;
  /** Optional description copied from the transit note. */
  description?: string;
  /** Optional location line. */
  location?: string;
}

export interface IcsOptions {
  /** Calendar product name (defaults to "Zunara"). */
  product?: string;
  /** Calendar display name in APPLY-TO / X-WR-CALNAME. */
  name?: string;
  /** Optional RFC 2445 cal-address for the organizer. */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  calendarId?: string;
}

const CRLF = "\r\n";

/** Escape one line of text per RFC 5545 (backslash, semicolon, comma, newline). */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n/g, "\\n")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\n");
}

/** Fold a property line to the RFC 5545 75-octet limit. */
export function foldLine(line: string): string {
  const encoded = `${line}${CRLF}`;
  const first = encoded.slice(0, 75);
  const rest = encoded.slice(75);
  if (rest.length === 0) return first;
  const chunks: string[] = [first];
  let remaining = rest;
  while (remaining.length > 0) {
    chunks.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  return chunks.join(CRLF);
}

/** Format a Date as a UTC BASIC-DATE-TIME string: YYYYMMDDTHHMMSSZ. */
export function toUtc(d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return (
    `${pad(d.getUTCFullYear(), 4)}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Build a single VEVENT block from one event. */
function buildEvent(event: IcsEvent, index: number): string {
  const start = toUtc(event.start);
  const end = event.end ? toUtc(event.end) : toUtc(new Date(event.start.getTime() + 2 * 3600000));
  const uid = `zunara-${index}-${start}@zunara.app`;
  const stamp = toUtc(new Date());
  const lines = [
    "BEGIN:VEVENT",
    foldLine(`UID:${uid}`),
    foldLine(`DTSTAMP:${stamp}`),
    foldLine(`DTSTART:${start}`),
    foldLine(`DTEND:${end}`),
    foldLine(`SUMMARY:${escapeIcsText(event.title)}`),
  ];
  if (event.description) lines.push(foldLine(`DESCRIPTION:${escapeIcsText(event.description)}`));
  if (event.location) lines.push(foldLine(`LOCATION:${escapeIcsText(event.location)}`));
  lines.push("TRANSP:OPAQUE");
  lines.push("END:VEVENT");
  return lines.join(CRLF);
}

/**
 * Generate a full VCALENDAR string for the given events.
 */
export function generateTransitICS(
  events: IcsEvent[],
  options: IcsOptions = {},
): string {
  const product = options.product ?? "Zunara";
  const name = options.name ?? "Zunara Transits";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zunara//Transit Calendar//EN",
    `X-WR-CALNAME:${escapeIcsText(name)}`,
    `X-WR-PRODID:-//Zunara//${escapeIcsText(product)}//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  events.forEach((ev, i) => lines.push(buildEvent(ev, i)));
  lines.push("END:VCALENDAR");
  return lines.join(CRLF) + CRLF;
}
