#!/usr/bin/env node
/* Zunara automated article publisher.
 *
 * Posts the articles in scripts/publish/articles/*.md to platforms that expose
 * an official read/write API (Medium, Dev.to) using the platform token supplied
 * via env. Each article is posted exactly once — the frontmatter "published"
 * flag is flipped to true after a successful publish and written back to disk.
 *
 * Env:
 *   MEDIUM_TOKEN  -> Medium integration token (settings -> integration tokens)
 *   DEVTO_API_KEY -> Dev.to API key (settings -> API keys)
 *
 * Exit code 0 even when tokens are missing (so the GitHub Action is not red);
 * prints clear per-article status lines.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, "articles");

/* ---------- minimal frontmatter extraction (only the fields we use) ---------- */

function parseFrontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) return { meta: null, body: raw };
  const meta = {};
  let currentKey = null;
  const listStack = [];
  for (const line of m[1].split("\n")) {
    const listItem = /^  - (.+)$/.exec(line);
    if (listItem) {
      if (listStack.length > 0 && currentKey) {
        listStack[listStack.length - 1].push(listItem[1].replace(/^"|"$/g, ""));
      }
      continue;
    }
    const scalar = /^([a-zA-Z0-9_]+):(?:\s*(.*))?$/.exec(line);
    if (scalar) {
      currentKey = scalar[1];
      meta[currentKey] = (scalar[2] || "").replace(/^"|"$/g, "");
      continue;
    }
    const num = /^(\d+)$/.exec(line.trim());
    if (num && listStack.length > 0 && currentKey) {
      listStack[listStack.length - 1].push(num[1]);
    }
  }
  // extract the tags list and platforms list minimally via regex
  const tagsMatch = /^tags:\n((?:  - .+\n)*)/m.exec(m[1]);
  if (tagsMatch) {
    meta.tags = [...tagsMatch[1].matchAll(/^  - (.+)$/gm)].map((x) => x[1].replace(/^"|"$/g, ""));
  }
  const pubMatch = /^published:\s*(true|false)/m.exec(m[1]);
  meta.published = pubMatch ? pubMatch[1] === "true" : false;
  return { meta, body: m[2].trim() };
}

function readArticles() {
  const out = [];
  for (const file of readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md")).sort()) {
    const raw = readFileSync(join(ARTICLES_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    if (!meta) {
      console.log(`  SKIP ${file}: no frontmatter`);
      continue;
    }
    meta._file = file;
    out.push({ meta, body, raw });
  }
  return out;
}

/* ---------- platform clients (official APIs only) ---------- */

async function postMedium(token, { title, body, tags, canonical }) {
  const me = await fetch("https://api.medium.com/v1/me", {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!me.ok) throw new Error(`Medium /me -> ${me.status}`);
  const { data } = await me.json();
  const res = await fetch(`https://api.medium.com/v1/users/${data.id}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      contentFormat: "markdown",
      content: body,
      tags: tags.slice(0, 5),
      canonicalUrl: canonical,
      publishStatus: "public",
    }),
  });
  if (!res.ok) throw new Error(`Medium /posts -> ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j.data.url;
}

async function postDevto(apiKey, { title, body, tags, canonical, mdRaw }) {
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      article: {
        title,
        body_markdown: mdRaw, // Dev.to ingests its own frontmatter
        published: true,
        tags: tags.slice(0, 4),
        canonical_url: canonical,
      },
    }),
  });
  if (!res.ok) throw new Error(`Dev.to /articles -> ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j.url;
}

/* ---------- main ---------- */

const MEDIUM_TOKEN = process.env.MEDIUM_TOKEN || "";
const DEVTO_API_KEY = process.env.DEVTO_API_KEY || "";

if (!MEDIUM_TOKEN && !DEVTO_API_KEY) {
  console.log("No MEDIUM_TOKEN or DEVTO_API_KEY set — nothing to publish. (Add GitHub secrets to activate.)");
  process.exit(0);
}

const articles = readArticles();
console.log(`Found ${articles.length} article(s).`);
let published = 0;

for (const article of articles) {
  const { meta, body, raw } = article;
  if (meta.published) {
    console.log(`  SKIP ${meta._file}: already published`);
    continue;
  }
  console.log(`  POST ${meta._file}: "${meta.title}"`);
  const urls = [];
  if (MEDIUM_TOKEN) {
    try {
      urls.push(`Medium: ${await postMedium(MEDIUM_TOKEN, { title: meta.title, body, tags: meta.tags || [], canonical: meta.canonical })}`);
    } catch (e) {
      console.log(`    ERROR Medium: ${e.message}`);
    }
  }
  if (DEVTO_API_KEY) {
    try {
      urls.push(`Dev.to: ${await postDevto(DEVTO_API_KEY, { title: meta.title, body, tags: meta.tags || [], canonical: meta.canonical, mdRaw: raw })}`);
    } catch (e) {
      console.log(`    ERROR Dev.to: ${e.message}`);
    }
  }
  if (urls.length > 0) {
    // flip the published flag in-place
    const written = raw.replace(/^published:\s*false/m, "published: true");
    writeFileSync(join(ARTICLES_DIR, meta._file), written);
    published++;
    console.log(`    DONE ${urls.join(", ")}`);
  }
}

console.log(published ? `Published ${published} article(s).` : "No new articles published.");
process.exit(0);