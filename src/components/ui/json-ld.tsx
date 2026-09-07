interface JsonLdProps {
  /** Pre-built structured data (from src/lib/seo/jsonld) — rendered verbatim. */
  data?: Record<string, unknown>;
  type?: string;
  name?: string;
  description?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

/**
 * Render any JSON-LD payload as a single <script type="application/ld+json">.
 * When `data` is provided it is emitted as-is (see the builders in
 * src/lib/seo/jsonld.ts); otherwise a small schema.org object is assembled
 * from the named props.
 */
export function JsonLd({
  data,
  type = "WebSite",
  name,
  description,
  url,
  datePublished,
  dateModified,
  author = "Zunara",
}: JsonLdProps) {
  const payload =
    data ??
    (() => {
      const built: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": type,
        name,
        description,
        url,
      };
      if (datePublished) built.datePublished = datePublished;
      if (dateModified) built.dateModified = dateModified;
      if (author)
        built.author = { "@type": "Organization", name: author };
      return built;
    })();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

/** Minimal raw script emitter for callers that already built the object. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}