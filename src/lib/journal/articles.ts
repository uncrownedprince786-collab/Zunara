import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type JournalArticle = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  canonical: string;
  body: string;
};

function stripQuotes(s: string): string {
  return s.replace(/^"|"$/g, "").trim();
}

function parseFrontmatter(raw: string): { title: string; promisedDescription?: string; tags: string[]; canonical: string; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) return { title: "", tags: [], canonical: "", body: raw };
  const head = m[1];
  const body = m[2].trim();
  const title = stripQuotes(/^title:\s*(.+)$/m.exec(head)?.[1].trim() ?? "");
  const canonical = /^canonical:\s*["']?([^\s"']+)/m.exec(head)?.[1].replace(/["']$/, "") ?? "";
  const tags = [...head.matchAll(/^  - (.+)$/gm)].map((x) => stripQuotes(x[1]));
  const description = /^description:\s*(.+)$/m.exec(head)?.[1].trim();
  return { title, promisedDescription: description ? stripQuotes(description) : undefined, tags, canonical, body };
}

/** Turn the article's markdown body into rendered paragraphs.
 * Supports the small subset used by the journal articles: `**bold**`,
 * `*italic*`, inline `[text](url)`, and paragraphs separated by blank lines.
 */
export function markdownBody(body: string): Array<{ type: "sub" | "p" | "cta"; parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }> }> {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const out: Array<{ type: "sub" | "p" | "cta"; parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }> }> = [];

  for (const para of paragraphs) {
    // Skip the leading `# H1` line (title is rendered from frontmatter).
    if (/^#\s/.test(para)) continue;
    // Sub-heading: a paragraph that is only a bold line.
    const sub = /^\*\*(.+?)\*\*$/.exec(para.trim());
    if (sub) {
      out.push({ type: "sub", parts: [{ text: sub[1], bold: true }] });
      continue;
    }
    // CTA paragraph: a paragraph that is only a markdown link.
    const ctaMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(para.trim());
    if (ctaMatch) {
      out.push({ type: "cta", parts: [{ text: ctaMatch[1], href: ctaMatch[2] }] });
      continue;
    }
    // Cut a leading `*italic*` intro line into its own paragraph.
    const italicIntro = /^\*([^*]+)\*$/.exec(para.trim());
    if (italicIntro) {
      out.push({ type: "p", parts: [{ text: italicIntro[1], italic: true }] });
      continue;
    }
    out.push({ type: "p", parts: parseInline(para) });
  }
  return out;
}

/** Inline markdown renderer for `**bold**`, `*italic*`, `[text](url)`. */
function parseInline(text: string): Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }> {
  const parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }> = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRe = /\*\*([^*]+)\*\*/;
  const italicRe = /\*([^*]+)\*/;

  // First split on links.
  const rest = text;
  let linkMatch: RegExpExecArray | null;
  let segIndex = 0;
  while ((linkMatch = linkRe.exec(rest)) !== null) {
    const before = rest.slice(segIndex, linkMatch.index);
    if (before) pushInlineText(parts, before, boldRe, italicRe);
    parts.push({ text: linkMatch[1], href: linkMatch[2] });
    segIndex = linkMatch.index + linkMatch[0].length;
  }
  const tail = rest.slice(segIndex);
  if (tail) pushInlineText(parts, tail, boldRe, italicRe);
  return parts;
}

function pushInlineText(parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }>, raw: string, boldRe: RegExp, italicRe: RegExp) {
  // Bold
  const boldParts: string[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  const bRe = new RegExp(boldRe.source, "g");
  const iRe = new RegExp(italicRe.source, "g");
  while ((m = bRe.exec(raw)) !== null) {
    if (m.index > cursor) boldParts.push(raw.slice(cursor, m.index));
    boldParts.push(`\u0000${m[1]}\u0000`);
    cursor = m.index + m[0].length;
  }
  if (cursor < raw.length) boldParts.push(raw.slice(cursor));
  for (const part of boldParts) {
    if (part.startsWith("\u0000") && part.endsWith("\u0000")) {
      const inner = part.slice(1, -1);
      // inner may still contain italic + link pieces; push as bold text block
      pushItalic(parts, inner, iRe, true);
    } else {
      pushItalic(parts, part, iRe);
    }
  }
}

function pushItalic(parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }>, raw: string, iRe: RegExp, bold = false) {
  let cursor = 0;
  let m: RegExpExecArray | null;
  iRe.lastIndex = 0;
  while ((m = iRe.exec(raw)) !== null) {
    if (m.index > cursor) parts.push({ text: raw.slice(cursor, m.index), bold: bold || undefined });
    parts.push({ text: m[1], bold: bold || undefined, italic: true });
    cursor = m.index + m[0].length;
  }
  if (cursor < raw.length) parts.push({ text: raw.slice(cursor), bold: bold || undefined });
}

export function getJournalArticles(root: string = process.cwd()): JournalArticle[] {
  const dir = join(root, "scripts", "publish", "articles");
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return [];
  }
  const articles: JournalArticle[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf8");
    const { title, promisedDescription, tags, canonical, body } = parseFrontmatter(raw);
    if (!title) continue;
    const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
    const description =
      promisedDescription ?? (markdownBody(body).find((b) => b.type === "p" && !b.parts.some((p) => p.href))?.parts.map((p) => p.text).join("") ?? title);
    articles.push({ slug, title, description, tags, canonical, body });
  }
  return articles;
}

export function getJournalArticle(slug: string, root?: string): JournalArticle | undefined {
  return getJournalArticles(root).find((a) => a.slug === slug);
}

export const journalArticleSlugs = (root?: string) => getJournalArticles(root).map((a) => a.slug);